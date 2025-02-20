import { type Room, type Player } from "@/types/multiplayer";

type MessageType = 
  | 'join_room'
  | 'create_room'
  | 'leave_room'
  | 'start_game'
  | 'vote'
  | 'answer'
  | 'game_state'
  | 'error';

interface WebSocketMessage {
  type: MessageType;
  payload: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<MessageType, ((payload: any) => void)[]> = new Map();

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          const handlers = this.messageHandlers.get(message.type) || [];
          handlers.forEach(handler => handler(message.payload));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.ws = null;
      };
    });
  }

  on(type: MessageType, handler: (payload: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  off(type: MessageType, handler: (payload: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.messageHandlers.set(type, handlers);
    }
  }

  send(type: MessageType, payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(JSON.stringify({ type, payload }));
  }

  // Room-specific methods
  createRoom(player: Omit<Player, 'id'>, password: string) {
    this.send('create_room', { player, password });
  }

  joinRoom(player: Omit<Player, 'id'>, roomId: string, password: string) {
    this.send('join_room', { player, roomId, password });
  }

  leaveRoom(playerId: string, roomId: string) {
    this.send('leave_room', { playerId, roomId });
  }

  startGame(roomId: string) {
    this.send('start_game', { roomId });
  }

  vote(roomId: string, playerId: string, mode: 'world' | 'us', gameMode: 'multiple' | 'type' | 'map') {
    this.send('vote', { roomId, playerId, mode, gameMode });
  }

  submitAnswer(roomId: string, playerId: string, answer: string, timeSpent: number) {
    this.send('answer', { roomId, playerId, answer, timeSpent });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
} 