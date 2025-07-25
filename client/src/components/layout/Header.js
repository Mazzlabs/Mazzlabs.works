import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Code2, ExternalLink, Github } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'About', href: '/#about' },
    { name: 'Tech Stack', href: '/#tech-stack' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Games', href: '/games' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('/#')) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-granite-dark/95 backdrop-blur-sm shadow-lg' 
        : 'bg-gradient-to-r from-granite-dark to-granite-medium'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center">
              <Code2 className="w-8 h-8 text-turquoise mr-2 group-hover:rotate-12 transition-transform" />
              <div>
                <h1 className="text-2xl font-bold text-turquoise group-hover:text-turquoise-light transition-colors">
                  MazzLabs
                </h1>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Joseph Mazzini
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                {item.href.startsWith('/') ? (
                  <Link
                    to={item.href}
                    className={`text-white hover:text-turquoise transition-colors font-medium ${
                      location.pathname === item.href ? 'text-turquoise' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (location.pathname === '/') {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                    }}
                    className="text-white hover:text-turquoise transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social Links & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Social Links */}
            <div className="hidden sm:flex items-center space-x-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Mazzlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-turquoise transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com/in/joseph-mazzini"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-turquoise transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-turquoise transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 border-t border-granite-light mt-4">
            <div className="space-y-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.href.startsWith('/') ? (
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-white hover:text-turquoise transition-colors font-medium ${
                        location.pathname === item.href ? 'text-turquoise' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (location.pathname === '/') {
                          e.preventDefault();
                          handleNavClick(item.href);
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                      className="block text-white hover:text-turquoise transition-colors font-medium"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Social Links */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-granite-light">
              <a
                href="https://github.com/Mazzlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-turquoise transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/joseph-mazzini"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-turquoise transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
