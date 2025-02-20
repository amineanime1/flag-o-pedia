import { WebSocketServer, WebSocket } from 'ws';
import { generateQuestions } from './src/utils/gameUtils';
import type { Room, Player } from './src/types/multiplayer';

const wss = new WebSocketServer({ port: 3001 });
const rooms = new Map<string, Room>();

function broadcast(roomId: string, message: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.players.forEach(player => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  });
}

function updateGameState(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  broadcast(roomId, {
    type: 'game_state',
    payload: {
      room: {
        id: room.id,
        password: room.password,
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          score: p.score,
          isHost: p.isHost,
          hasAnswered: p.hasAnswered
        })),
        gameState: room.gameState,
        votingState: room.votingState,
        gameSettings: room.gameSettings,
        currentQuestion: room.currentQuestion,
        questions: room.questions,
        timeRemaining: room.timeRemaining
      }
    }
  });
}

function startVoting(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.gameState = 'voting';
  room.votingState = {
    votes: {}
  };

  updateGameState(roomId);
}

function checkVotingComplete(roomId: string) {
  const room = rooms.get(roomId);
  if (!room || room.gameState !== 'voting') return;

  const votes = Object.values(room.votingState?.votes || {});
  if (votes.length === room.players.length) {
    // Count votes
    const voteCounts = votes.reduce((acc, vote) => {
      const key = `${vote.mode}-${vote.gameMode}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find winning vote
    const winningVote = Object.entries(voteCounts)
      .reduce((a, b) => (b[1] > a[1] ? b : a))[0]
      .split('-');

    // Start game with winning vote
    startGame(roomId, {
      mode: winningVote[0] as 'world' | 'us',
      gameMode: winningVote[1] as 'multiple' | 'type' | 'map',
      timePerQuestion: 20,
      totalQuestions: 10
    });
  }
}

async function startGame(roomId: string, settings: Room['gameSettings']) {
  const room = rooms.get(roomId);
  if (!room || !settings) return;

  room.gameState = 'playing';
  room.gameSettings = settings;
  room.currentQuestion = 0;
  room.questions = await generateQuestions({
    name: settings.mode === 'world' ? 'World Flags' : 'US States',
    flagCount: settings.totalQuestions,
    modifiers: {
      timeLimit: settings.timePerQuestion * settings.totalQuestions
    }
  });
  room.timeRemaining = settings.timePerQuestion;

  // Reset player states
  room.players.forEach(player => {
    player.score = 0;
    player.hasAnswered = false;
  });

  // Start game timer
  if (room.timer) clearInterval(room.timer);
  room.timer = setInterval(() => {
    if (!room.timeRemaining) return;
    room.timeRemaining--;
    
    if (room.timeRemaining <= 0 || room.players.every(p => p.hasAnswered)) {
      // Move to next question or end game
      if (room.currentQuestion < (room.questions?.length || 0) - 1) {
        room.currentQuestion++;
        room.timeRemaining = settings.timePerQuestion;
        room.players.forEach(p => p.hasAnswered = false);
      } else {
        // Game over
        clearInterval(room.timer);
        room.gameState = 'finished';
      }
    }

    updateGameState(roomId);
  }, 1000);

  updateGameState(roomId);
}

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    try {
      const { type, payload } = JSON.parse(message);

      switch (type) {
        case 'create_room': {
          const { player, password } = payload;
          const roomId = Math.random().toString(36).substring(7);
          const playerId = Math.random().toString(36).substring(7);

          rooms.set(roomId, {
            id: roomId,
            password,
            players: [{
              ...player,
              id: playerId,
              ws,
              score: 0,
              hasAnswered: false,
              isHost: true
            }],
            gameState: 'waiting'
          });

          ws.send(JSON.stringify({
            type: 'game_state',
            payload: {
              room: {
                id: roomId,
                password,
                players: [{
                  id: playerId,
                  name: player.name,
                  score: 0,
                  isHost: true,
                  hasAnswered: false
                }],
                gameState: 'waiting'
              }
            }
          }));
          break;
        }

        case 'join_room': {
          const { player, roomId, password } = payload;
          const room = rooms.get(roomId);

          if (!room) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Room not found' }
            }));
            return;
          }

          if (room.password !== password) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Invalid password' }
            }));
            return;
          }

          const playerId = Math.random().toString(36).substring(7);
          room.players.push({
            ...player,
            id: playerId,
            ws,
            score: 0,
            hasAnswered: false,
            isHost: false
          });

          updateGameState(roomId);
          break;
        }

        case 'leave_room': {
          const { playerId, roomId } = payload;
          const room = rooms.get(roomId);

          if (room) {
            room.players = room.players.filter(p => p.id !== playerId);
            if (room.players.length === 0) {
              if (room.timer) clearInterval(room.timer);
              rooms.delete(roomId);
            } else {
              // If host left, assign new host
              if (!room.players.some(p => p.isHost)) {
                room.players[0].isHost = true;
              }
              updateGameState(roomId);
            }
          }
          break;
        }

        case 'start_game': {
          const { roomId } = payload;
          startVoting(roomId);
          break;
        }

        case 'vote': {
          const { roomId, playerId, mode, gameMode } = payload;
          const room = rooms.get(roomId);

          if (room && room.gameState === 'voting' && room.votingState) {
            room.votingState.votes[playerId] = { mode, gameMode };
            updateGameState(roomId);
            checkVotingComplete(roomId);
          }
          break;
        }

        case 'answer': {
          const { roomId, playerId, answer, timeSpent } = payload;
          const room = rooms.get(roomId);

          if (room && room.gameState === 'playing' && room.questions) {
            const player = room.players.find(p => p.id === playerId);
            if (player && !player.hasAnswered) {
              player.hasAnswered = true;
              if (answer === room.questions[room.currentQuestion].correctAnswer) {
                player.score++;
              }

              // Store answer result
              if (!room.questions[room.currentQuestion].results) {
                room.questions[room.currentQuestion].results = {};
              }
              room.questions[room.currentQuestion].results[playerId] = {
                answer,
                isCorrect: answer === room.questions[room.currentQuestion].correctAnswer,
                timeSpent
              };

              updateGameState(roomId);
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // Remove player from any room they're in
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.ws === ws);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          if (room.timer) clearInterval(room.timer);
          rooms.delete(roomId);
        } else {
          // If host left, assign new host
          if (!room.players.some(p => p.isHost)) {
            room.players[0].isHost = true;
          }
          updateGameState(roomId);
        }
        break;
      }
    }
  });
}); 