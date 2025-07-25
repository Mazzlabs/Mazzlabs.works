import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  TrendingUp, 
  Cards,
  Trophy,
  Target
} from 'lucide-react';
import api from '../../services/api';

const BlackjackGame = () => {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/games/blackjack/start/');
      setGameState(response.data);
    } catch (err) {
      setError('Failed to start game. Please try again.');
      console.error('Game start error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hit = async () => {
    if (!gameState || gameState.game_over) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('/api/games/blackjack/hit/');
      setGameState(response.data);
    } catch (err) {
      setError('Failed to hit. Please try again.');
      console.error('Hit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stand = async () => {
    if (!gameState || gameState.game_over) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('/api/games/blackjack/stand/');
      setGameState(response.data);
    } catch (err) {
      setError('Failed to stand. Please try again.');
      console.error('Stand error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCard = (card, index, isHidden = false) => {
    if (isHidden || card.hidden) {
      return (
        <motion.div
          key={`hidden-${index}`}
          initial={{ rotateY: 180, scale: 0.8 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-16 h-24 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-lg flex items-center justify-center border-2 border-blue-600"
        >
          <Cards className="w-8 h-8 text-blue-300" />
        </motion.div>
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    
    return (
      <motion.div
        key={`${card.suit}-${card.rank}-${index}`}
        initial={{ rotateY: 180, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`w-16 h-24 bg-white rounded-lg shadow-lg border-2 ${
          isRed ? 'border-red-300' : 'border-gray-700'
        } flex flex-col items-center justify-between p-2`}
      >
        <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
          {card.rank}
        </div>
        <div className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
          {card.suit}
        </div>
        <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'} rotate-180`}>
          {card.rank}
        </div>
      </motion.div>
    );
  };

  const getGameMessage = () => {
    if (!gameState || !gameState.game_over) return null;
    
    const { winner, player_hand, dealer_hand } = gameState;
    
    if (winner === 'tie') {
      return { text: "It's a tie!", color: 'text-yellow-600' };
    } else if (winner === 'player') {
      if (player_hand.is_blackjack) {
        return { text: 'Blackjack! You win!', color: 'text-green-600' };
      } else if (dealer_hand.is_bust) {
        return { text: 'Dealer busts! You win!', color: 'text-green-600' };
      } else {
        return { text: 'You win!', color: 'text-green-600' };
      }
    } else {
      if (player_hand.is_bust) {
        return { text: 'Bust! You lose.', color: 'text-red-600' };
      } else if (dealer_hand.is_blackjack) {
        return { text: 'Dealer has blackjack! You lose.', color: 'text-red-600' };
      } else {
        return { text: 'Dealer wins!', color: 'text-red-600' };
      }
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={startNewGame}
          className="bg-turquoise text-white px-6 py-2 rounded-lg hover:bg-turquoise-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise mx-auto mb-4"></div>
        <div className="text-gray-600">Loading game...</div>
      </div>
    );
  }

  const gameMessage = getGameMessage();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameState.stats.player_wins}</div>
          <div className="text-sm opacity-90">Wins</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg text-center">
          <Target className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameState.stats.dealer_wins}</div>
          <div className="text-sm opacity-90">Losses</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{gameState.stats.ties}</div>
          <div className="text-sm opacity-90">Ties</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-8 text-white shadow-xl">
        {/* Dealer Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Dealer {gameState.dealer_hand.value !== null && `(${gameState.dealer_hand.value})`}
            </h3>
            {gameState.dealer_hand.is_bust && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">BUST</span>
            )}
            {gameState.dealer_hand.is_blackjack && (
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">BLACKJACK</span>
            )}
          </div>
          <div className="flex space-x-2 justify-center">
            {gameState.dealer_hand.cards.map((card, index) => 
              renderCard(card, index, card.hidden)
            )}
          </div>
        </div>

        {/* Game Message */}
        <AnimatePresence>
          {gameMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-6"
            >
              <div className={`text-2xl font-bold ${gameMessage.color} bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 inline-block`}>
                {gameMessage.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Player ({gameState.player_hand.value})
            </h3>
            {gameState.player_hand.is_bust && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">BUST</span>
            )}
            {gameState.player_hand.is_blackjack && (
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">BLACKJACK</span>
            )}
          </div>
          <div className="flex space-x-2 justify-center mb-6">
            {gameState.player_hand.cards.map((card, index) => 
              renderCard(card, index)
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4">
          {!gameState.game_over ? (
            <>
              <button
                onClick={hit}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Hit
              </button>
              <button
                onClick={stand}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
              >
                <Target className="w-5 h-5 mr-2" />
                Stand
              </button>
            </>
          ) : (
            <button
              onClick={startNewGame}
              disabled={isLoading}
              className="bg-turquoise hover:bg-turquoise-dark disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Game
            </button>
          )}
        </div>

        {/* Cards Remaining */}
        <div className="text-center mt-6 text-sm opacity-75">
          Cards remaining: {gameState.cards_remaining}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
