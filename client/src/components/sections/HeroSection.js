import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ExternalLink, Github } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-granite-dark via-granite-medium to-granite-light text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-turquoise rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-turquoise-light rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2s"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-turquoise-medium rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4s"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Code2 className="w-16 h-16 mx-auto mb-6 text-turquoise" />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-turquoise to-turquoise-light bg-clip-text text-transparent">
              MazzLabs
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-6">
              Joseph Mazzini
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              Full-Stack Developer & Project Manager
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Demonstrating modern web development from <span className="text-turquoise font-semibold">concept to production</span> 
              {' '}through this portfolio - a living showcase of technical evolution, project management, 
              and scalable architecture implementation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <a
              href="#projects"
              className="inline-flex items-center px-8 py-3 bg-turquoise hover:bg-turquoise-dark transition-colors rounded-lg font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Projects
            </a>
            <a
              href="https://github.com/Mazzlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-colors rounded-lg font-semibold"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub Portfolio
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm text-gray-500"
          >
            <p>Built with React 18 • Django REST Framework • MongoDB • Digital Ocean</p>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-turquoise rounded-full flex justify-center">
          <div className="w-1 h-3 bg-turquoise rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
