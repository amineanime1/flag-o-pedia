import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart, PieChart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { getGameStats, clearGameStats, type GameResult } from '@/utils/statsUtils';
import { ThemeToggle } from "@/components/ThemeToggle";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Stats = () => {
  const [stats, setStats] = useState<GameResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setStats(getGameStats());
  }, []);

  const handleClearStats = () => {
    clearGameStats();
    setStats([]);
    toast({
      title: 'Stats cleared',
      description: 'All game statistics have been reset.',
      duration: 2000,
    });
  };

  const averageScore = stats.length > 0
    ? (stats.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0) / stats.length).toFixed(1)
    : 0;

  const gameModeStats = stats.reduce((acc, curr) => {
    const key = curr.gameMode || 'multiple';
    if (!acc[key]) {
      acc[key] = { 
        total: 0, 
        correct: 0, 
        games: 0,
        avgScore: 0 
      };
    }
    acc[key].games += 1;
    acc[key].total += curr.total;
    acc[key].correct += curr.score;
    acc[key].avgScore = (acc[key].correct / acc[key].total * 100);
    return acc;
  }, {} as Record<string, { total: number; correct: number; games: number; avgScore: number }>);

  const combinedModeStats = stats.reduce((acc, curr) => {
    const mode = curr.mode;
    const gameMode = curr.gameMode || 'multiple';
    const key = `${mode}-${gameMode}`;
    
    if (!acc[key]) {
      acc[key] = { total: 0, correct: 0, games: 0 };
    }
    acc[key].games += 1;
    acc[key].total += curr.total;
    acc[key].correct += curr.score;
    return acc;
  }, {} as Record<string, { total: number; correct: number; games: number }>);

  const barData = Object.entries(combinedModeStats).map(([key, data]) => {
    const [mode, gameMode] = key.split('-');
    return {
      name: `${mode === 'world' ? 'World' : 'US'} (${gameMode === 'multiple' ? 'MC' : 'Type'})`,
      correct: data.correct,
      total: data.total,
      accuracy: ((data.correct / data.total) * 100).toFixed(1)
    };
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <header className="relative text-center space-y-4">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <Link
            to="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Home className="w-6 h-6 text-primary" />
          </Link>
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <BarChart className="w-8 h-8" />
            Statistics
          </h1>
        </header>

        {stats.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No game statistics available yet. Play some games to see your stats!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Total Games</h3>
                <p className="text-3xl font-bold">{stats.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Average Score</h3>
                <p className="text-3xl font-bold">{averageScore}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Best Game Mode</h3>
                <p className="text-3xl font-bold">
                  {Object.entries(gameModeStats)
                    .sort((a, b) => b[1].avgScore - a[1].avgScore)[0][0] === 'multiple' 
                    ? 'Multiple Choice' 
                    : 'Type Answer'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.max(...Object.values(gameModeStats).map(s => s.avgScore)).toFixed(1)}% accuracy
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Last Played</h3>
                <p className="text-3xl font-bold">
                  {new Date(stats[stats.length - 1].date).toLocaleDateString()}
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-primary mb-4">Performance by Game Type</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        content={({ payload, label }) => {
                          if (payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-2 rounded-lg shadow-lg border border-border">
                                <p className="font-semibold">{label}</p>
                                <p className="text-sm">Correct: {data.correct}</p>
                                <p className="text-sm">Total: {data.total}</p>
                                <p className="text-sm">Accuracy: {data.accuracy}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="correct" fill="#0088FE" name="Correct" />
                      <Bar dataKey="total" fill="#00C49F" name="Total Questions" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-lg dark:shadow-none space-y-6"
              >
                <h3 className="text-lg font-semibold text-primary">Game Mode Analysis</h3>
                
                <div className="space-y-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Multiple Choice</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Games Played: {gameModeStats.multiple?.games || 0}</p>
                      <p>Accuracy: {(gameModeStats.multiple?.avgScore || 0).toFixed(1)}%</p>
                      <p>Total Questions: {gameModeStats.multiple?.total || 0}</p>
                      <p>Correct Answers: {gameModeStats.multiple?.correct || 0}</p>
                    </div>
                  </div>

                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Type Answer</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Games Played: {gameModeStats.type?.games || 0}</p>
                      <p>Accuracy: {(gameModeStats.type?.avgScore || 0).toFixed(1)}%</p>
                      <p>Total Questions: {gameModeStats.type?.total || 0}</p>
                      <p>Correct Answers: {gameModeStats.type?.correct || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <button
                onClick={handleClearStats}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Statistics
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Stats;
