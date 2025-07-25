import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Zap, 
  Target,
  ChevronRight,
  Play
} from 'lucide-react';
import BlackjackGame from '../games/BlackjackGame';
import RoshamboGame from '../games/RoshamboGame';

const GameDemosSection = () => {
  const [activeGame, setActiveGame] = useState('blackjack');

  const games = [
    {
      id: 'blackjack',
      title: 'Blackjack 21',
      description: 'Professional blackjack with advanced card counting detection, betting strategies, and real-time odds calculation.',
      icon: <Target className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      component: <BlackjackGame />
    },
    {
      id: 'roshambo',
      title: 'Rock Paper Scissors',
      description: 'Strategic roshambo with pattern recognition, statistical analysis, and adaptive AI opponent.',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      component: <RoshamboGame />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-8 h-8 text-blue-400 mr-3" />
            <h2 className="text-4xl font-bold text-white">
              Interactive Game Demonstrations
            </h2>
          </motion.div>
          <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
            Fully functional gaming applications showcasing advanced algorithms, real-time state management, 
            and professional-grade user experiences ready for production deployment.
          </motion.p>
        </motion.div>

        {/* Game Selector Tabs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-wrap justify-center mb-12 gap-4"
        >
          {games.map((game) => (
            <motion.button
              key={game.id}
              variants={itemVariants}
              onClick={() => setActiveGame(game.id)}
              className={`
                relative px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm
                transition-all duration-300 flex items-center gap-3 min-w-[200px]
                ${activeGame === game.id 
                  ? `bg-gradient-to-r ${game.color} text-white shadow-lg shadow-blue-500/25` 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {game.icon}
              <div className="text-left">
                <div className="font-semibold">{game.title}</div>
                <div className="text-xs opacity-75 truncate">{game.description.split(',')[0]}</div>
              </div>
              {activeGame === game.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Active Game Display */}
        <motion.div
          key={activeGame}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${games.find(g => g.id === activeGame)?.color}`}>
                {games.find(g => g.id === activeGame)?.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {games.find(g => g.id === activeGame)?.title}
                </h3>
                <p className="text-gray-400">
                  {games.find(g => g.id === activeGame)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Play className="w-4 h-4" />
              <span className="text-sm font-semibold">LIVE DEMO</span>
            </div>
          </div>

          {/* Game Component */}
          <div className="min-h-[500px]">
            {games.find(g => g.id === activeGame)?.component}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mt-16"
        >
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready for Production Deployment
            </h3>
            <p className="text-gray-300 mb-6">
              These games demonstrate advanced state management, real-time interactions, 
              secure random generation, and scalable architecture suitable for high-traffic gaming platforms.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 
                         transition-all duration-300"
            >
              View More Projects
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameDemosSection;
