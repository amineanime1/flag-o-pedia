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

  const difficultyStats = stats.reduce((acc, curr) => {
    acc[curr.difficulty] = (acc[curr.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(difficultyStats).map(([name, value]) => ({
    name,
    value
  }));

  const modeStats = stats.reduce((acc, curr) => {
    if (!acc[curr.mode]) {
      acc[curr.mode] = { total: 0, correct: 0 };
    }
    acc[curr.mode].total += curr.total;
    acc[curr.mode].correct += curr.score;
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const barData = Object.entries(modeStats).map(([mode, data]) => ({
    name: mode === 'world' ? 'World Flags' : 'US States',
    correct: data.correct,
    total: data.total,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <header className="relative text-center space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Games Played</h3>
                <p className="text-3xl font-bold">{stats.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">Average Score</h3>
                <p className="text-3xl font-bold">{averageScore}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg"
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
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary mb-4">Score Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
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
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary mb-4">Difficulty Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
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
