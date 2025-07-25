import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import TechStackSection from '../components/sections/TechStackSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};

export default Home;
