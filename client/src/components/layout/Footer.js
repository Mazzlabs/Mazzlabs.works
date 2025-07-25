import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Github, ExternalLink, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-granite-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <Code2 className="w-8 h-8 text-turquoise mr-3" />
              <div>
                <h3 className="text-xl font-bold text-turquoise">MazzLabs</h3>
                <p className="text-gray-400 text-sm">Joseph Mazzini</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Full-stack developer demonstrating modern web development practices 
              from concept to production deployment.
            </p>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4 text-turquoise">Technology Stack</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <div>Frontend:</div>
              <div>React 18</div>
              <div>Styling:</div>
              <div>Tailwind CSS</div>
              <div>Backend:</div>
              <div>Django REST</div>
              <div>Database:</div>
              <div>MongoDB</div>
              <div>Deployment:</div>
              <div>Digital Ocean</div>
              <div>Animation:</div>
              <div>Framer Motion</div>
            </div>
          </motion.div>

          {/* Contact & Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4 text-turquoise">Connect</h4>
            <div className="space-y-3">
              <a
                href="mailto:joseph@mazzlabs.works"
                className="flex items-center text-gray-400 hover:text-turquoise transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                joseph@mazzlabs.works
              </a>
              <a
                href="https://github.com/Mazzlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-turquoise transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub Portfolio
              </a>
              <a
                href="https://linkedin.com/in/joseph-mazzini"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-turquoise transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                LinkedIn Profile
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-granite-medium pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} MazzLabs. Built with passion for clean code and modern architecture.
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />
              <span>and lots of coffee</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>
              This portfolio demonstrates full-stack development capabilities through 
              progressive enhancement from legacy to modern architecture.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
