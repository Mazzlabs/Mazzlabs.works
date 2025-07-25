import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  TrendingUp, 
  CreditCard,
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
      const response = await api.post('/api/games/blackjack/', { action: 'start' });
      setGameState({
        ...response.data.game_state,
        session_id: response.data.session_id,
        stats: response.data.game_state.stats
      });
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
      const response = await api.post('/api/games/blackjack/', { 
        action: 'hit', 
        session_id: gameState.session_id 
      });
      setGameState({
        ...response.data.game_state,
        session_id: response.data.session_id,
        stats: response.data.game_state.stats
      });
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
      const response = await api.post('/api/games/blackjack/', { 
        action: 'stand', 
        session_id: gameState.session_id 
      });
      setGameState({
        ...response.data.game_state,
        session_id: response.data.session_id,
        stats: response.data.game_state.stats
      });
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
          <CreditCard className="w-8 h-8 text-blue-300" />
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
        return { text: "Blackjack! You win!", color: 'text-green-600' };
      } else if (dealer_hand.is_bust) {
        return { text: "Dealer busts! You win!", color: 'text-green-600' };
      } else {
        return { text: "You win!", color: 'text-green-600' };
      }
    } else {
      if (player_hand.is_bust) {
        return { text: "Bust! You lose!", color: 'text-red-600' };
      } else if (dealer_hand.is_blackjack) {
        return { text: "Dealer has blackjack! You lose!", color: 'text-red-600' };
      } else {
        return { text: "You lose!", color: 'text-red-600' };
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={startNewGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading game...</div>
        </div>
      </div>
    );
  }

  const gameMessage = getGameMessage();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-600" />
          Blackjack
        </h2>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-100 px-3 py-1 rounded-lg text-center">
            <div className="text-green-800 font-semibold">Wins</div>
            <div className="text-2xl font-bold">{gameState.stats?.player_wins || 0}</div>
          </div>
          <div className="bg-red-100 px-3 py-1 rounded-lg text-center">
            <div className="text-red-800 font-semibold">Losses</div>
            <div className="text-2xl font-bold">{gameState.stats?.dealer_wins || 0}</div>
          </div>
          <div className="bg-yellow-100 px-3 py-1 rounded-lg text-center">
            <div className="text-yellow-800 font-semibold">Ties</div>
            <div className="text-2xl font-bold">{gameState.stats?.ties || 0}</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="space-y-8">
        {/* Dealer's Hand */}
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Dealer {gameState.dealer_hand?.value !== null && `(${gameState.dealer_hand.value})`}
          </h3>
          {gameState.dealer_hand?.is_bust && (
            <div className="text-red-600 font-bold mb-2">BUST!</div>
          )}
          {gameState.dealer_hand?.is_blackjack && (
            <div className="text-yellow-600 font-bold mb-2">BLACKJACK!</div>
          )}
          <div className="flex gap-2 flex-wrap">
            {gameState.dealer_hand?.cards?.map((card, index) => 
              renderCard(card, index, !gameState.game_over && index === 1)
            )}
          </div>
        </div>

        {/* Game Message */}
        <AnimatePresence>
          {gameMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4"
            >
              <div className={`text-3xl font-bold ${gameMessage.color}`}>
                {gameMessage.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player's Hand */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Player ({gameState.player_hand?.value})
          </h3>
          {gameState.player_hand?.is_bust && (
            <div className="text-red-600 font-bold mb-2">BUST!</div>
          )}
          {gameState.player_hand?.is_blackjack && (
            <div className="text-yellow-600 font-bold mb-2">BLACKJACK!</div>
          )}
          <div className="flex gap-2 flex-wrap">
            {gameState.player_hand?.cards?.map((card, index) => 
              renderCard(card, index)
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          {!gameState.game_over ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={hit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Hit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stand}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Stand
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewGame}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              New Game
            </motion.button>
          )}
        </div>

        {/* Game Info */}
        <div className="text-center text-sm text-gray-600">
          Cards remaining: {gameState.cards_remaining}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
