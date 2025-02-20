import { motion } from "framer-motion";
import { Globe, Map, Type, List } from "lucide-react";
import { type Room, type Player } from "@/types/multiplayer";

interface GameModeVotingProps {
  room: Room;
  player: Player;
  onVote: (mode: 'world' | 'us', gameMode: 'multiple' | 'type' | 'map') => void;
}

export function GameModeVoting({ room, player, onVote }: GameModeVotingProps) {
  const getVoteCount = (mode: 'world' | 'us', gameMode: 'multiple' | 'type' | 'map') => {
    if (!room.votingState?.votes) return 0;
    return Object.values(room.votingState.votes).filter(
      vote => vote.mode === mode && vote.gameMode === gameMode
    ).length;
  };

  const hasVoted = room.votingState?.votes?.[player.id] !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Vote for Game Mode</h2>
        <p className="text-muted-foreground">
          Choose the type of game you want to play. The mode with the most votes wins!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* World Flags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Globe className="w-6 h-6" />
            <span>World Flags</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => !hasVoted && onVote('world', 'multiple')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <List className="w-5 h-5" />
                <span>Multiple Choice</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('world', 'multiple')} votes
              </span>
            </button>
            <button
              onClick={() => !hasVoted && onVote('world', 'type')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                <span>Type Answer</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('world', 'type')} votes
              </span>
            </button>
            <button
              onClick={() => !hasVoted && onVote('world', 'map')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                <span>Map Location</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('world', 'map')} votes
              </span>
            </button>
          </div>
        </div>

        {/* US States */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Map className="w-6 h-6" />
            <span>US States</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => !hasVoted && onVote('us', 'multiple')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <List className="w-5 h-5" />
                <span>Multiple Choice</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('us', 'multiple')} votes
              </span>
            </button>
            <button
              onClick={() => !hasVoted && onVote('us', 'type')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                <span>Type Answer</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('us', 'type')} votes
              </span>
            </button>
            <button
              onClick={() => !hasVoted && onVote('us', 'map')}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg flex items-center justify-between ${
                hasVoted
                  ? 'bg-secondary/50'
                  : 'bg-card hover:bg-secondary/20 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                <span>Map Location</span>
              </div>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getVoteCount('us', 'map')} votes
              </span>
            </button>
          </div>
        </div>
      </div>

      {hasVoted && (
        <div className="text-center text-muted-foreground">
          Waiting for other players to vote...
        </div>
      )}
    </motion.div>
  );
} 