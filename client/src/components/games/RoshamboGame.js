import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Trophy, 
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import api from '../../services/api';

const RoshamboGame = () => {
  const [gameStats, setGameStats] = useState({
    player_wins: 0,
    computer_wins: 0,
    ties: 0,
    total_games: 0,
    win_percentage: 0
  });
  const [lastRound, setLastRound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const choices = [
    { 
      value: 'rock', 
      emoji: '🗿', 
      label: 'Rock',
      color: 'from-gray-500 to-gray-600'
    },
    { 
      value: 'paper', 
      emoji: '📄', 
      label: 'Paper',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      value: 'scissors', 
      emoji: '✂️', 
      label: 'Scissors',
      color: 'from-red-500 to-red-600'
    }
  ];

  const playRound = async (playerChoice) => {
    setIsPlaying(true);
    setSelectedChoice(playerChoice);

    try {
      const response = await api.post('/api/games/roshambo/play/', {
        choice: playerChoice
      });
      
      // Add delay for suspense
      setTimeout(() => {
        setLastRound(response.data.round);
        setGameStats(response.data.stats);
        setIsPlaying(false);
        setSelectedChoice(null);
      }, 1500);
      
    } catch (error) {
      console.error('Game play error:', error);
      setIsPlaying(false);
      setSelectedChoice(null);
    }
  };

  const resetGame = async () => {
    try {
      const response = await api.post('/api/games/roshambo/reset/');
      setGameStats(response.data.stats);
      setLastRound(null);
    } catch (error) {
      console.error('Game reset error:', error);
    }
  };

  const getResultMessage = (winner) => {
    switch (winner) {
      case 'player':
        return { text: 'You Win!', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'computer':
        return { text: 'Computer Wins!', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'tie':
        return { text: "It's a Tie!", color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      default:
        return { text: '', color: '', bgColor: '' };
    }
  };

  const getChoiceByValue = (value) => {
    return choices.find(choice => choice.value === value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameStats.player_wins}</div>
          <div className="text-sm opacity-90">Wins</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg text-center">
          <Target className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameStats.computer_wins}</div>
          <div className="text-sm opacity-90">Losses</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameStats.ties}</div>
          <div className="text-sm opacity-90">Ties</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
          <Zap className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameStats.win_percentage}%</div>
          <div className="text-sm opacity-90">Win Rate</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Last Round Result */}
        <AnimatePresence mode="wait">
          {lastRound && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-8 mb-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">{getChoiceByValue(lastRound.player_choice)?.emoji}</div>
                  <div className="font-semibold text-granite-dark">You</div>
                  <div className="text-sm text-gray-600 capitalize">{lastRound.player_choice}</div>
                </div>
                
                <div className="text-4xl text-granite-medium">VS</div>
                
                <div className="text-center">
                  <div className="text-6xl mb-2">{getChoiceByValue(lastRound.computer_choice)?.emoji}</div>
                  <div className="font-semibold text-granite-dark">Computer</div>
                  <div className="text-sm text-gray-600 capitalize">{lastRound.computer_choice}</div>
                </div>
              </div>
              
              <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${getResultMessage(lastRound.winner).bgColor} ${getResultMessage(lastRound.winner).color}`}>
                {getResultMessage(lastRound.winner).text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Status */}
        <div className="text-center mb-8">
          {isPlaying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-xl font-semibold text-granite-dark">
                You chose: {getChoiceByValue(selectedChoice)?.emoji} {getChoiceByValue(selectedChoice)?.label}
              </div>
              <div className="text-lg text-gray-600">Computer is choosing...</div>
              <div className="flex justify-center space-x-2">
                {choices.map((choice, index) => (
                  <motion.div
                    key={choice.value}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: Infinity,
                      delay: index * 0.1
                    }}
                    className="text-4xl"
                  >
                    {choice.emoji}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-xl font-semibold text-granite-dark">
              Choose your move:
            </div>
          )}
        </div>

        {/* Choice Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {choices.map((choice) => (
            <motion.button
              key={choice.value}
              onClick={() => playRound(choice.value)}
              disabled={isPlaying}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${choice.color} hover:opacity-90 disabled:opacity-50 text-white p-6 rounded-xl transition-all duration-200 flex flex-col items-center space-y-3`}
            >
              <div className="text-6xl">{choice.emoji}</div>
              <div className="text-xl font-bold">{choice.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Reset Button */}
        {gameStats.total_games > 0 && (
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-granite-dark hover:bg-granite-medium text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center mx-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Game
            </button>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-granite-dark mb-4 text-center">
            Game Rules
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🗿 ✂️</div>
              <div>Rock crushes Scissors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📄 🗿</div>
              <div>Paper covers Rock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✂️ 📄</div>
              <div>Scissors cuts Paper</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoshamboGame;
