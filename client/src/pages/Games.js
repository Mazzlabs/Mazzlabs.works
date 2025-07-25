import React from 'react';
import { motion } from 'framer-motion';
import { GamepadIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlackjackGame from '../components/games/BlackjackGame';
import RoshamboGame from '../components/games/RoshamboGame';

const Games = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-turquoise hover:text-turquoise-dark transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>
          
          <GamepadIcon className="w-16 h-16 mx-auto mb-6 text-turquoise" />
          <h1 className="text-4xl font-bold text-granite-dark mb-4">
            Interactive Game Demos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Showcasing interactive frontend development with React components, 
            state management, and engaging user experiences. These games demonstrate 
            the migration from vanilla JavaScript to modern React architecture.
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="space-y-16">
          {/* Blackjack Game */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-granite-dark to-granite-medium text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Blackjack</h2>
                <p className="text-gray-300">
                  Classic card game demonstrating complex state management, 
                  game logic, and real-time UI updates.
                </p>
              </div>
              <div className="p-6">
                <BlackjackGame />
              </div>
            </div>
          </motion.section>

          {/* Rock Paper Scissors Game */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-turquoise to-turquoise-light text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Rock Paper Scissors</h2>
                <p className="text-white/90">
                  Interactive game showcasing component-based architecture, 
                  animations, and user interaction patterns.
                </p>
              </div>
              <div className="p-6">
                <RoshamboGame />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Technical Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-granite-dark mb-6 text-center">
            Technical Implementation
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-granite-dark mb-3">Frontend Architecture</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• React functional components with hooks</li>
                <li>• Custom state management for game logic</li>
                <li>• Framer Motion for smooth animations</li>
                <li>• Responsive design with Tailwind CSS</li>
                <li>• Component-based architecture for reusability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-granite-dark mb-3">Development Approach</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Migrated from vanilla JavaScript classes</li>
                <li>• Implemented proper separation of concerns</li>
                <li>• Added error handling and user feedback</li>
                <li>• Optimized for performance and accessibility</li>
                <li>• Integrated with backend API endpoints</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Games;
