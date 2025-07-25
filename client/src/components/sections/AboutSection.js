import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, Lightbulb, Rocket } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "Project Management",
      description: "From primitive concepts to production-ready applications, demonstrating full project lifecycle management and strategic technical decision-making."
    },
    {
      icon: Lightbulb,
      title: "Technical Innovation",
      description: "Implementing modern architectural patterns, performance optimization, and scalable solutions that evolve with business requirements."
    },
    {
      icon: Rocket,
      title: "Production Excellence",
      description: "Delivering robust, maintainable code with proper testing, deployment pipelines, and monitoring for real-world applications."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <User className="w-12 h-12 mx-auto mb-6 text-turquoise" />
          <h2 className="text-4xl font-bold text-granite-dark mb-6">
            About This Portfolio
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              This portfolio represents more than just a showcase of technical skills—it's a 
              <span className="text-turquoise font-semibold"> living demonstration</span> of modern 
              software development practices, from initial concept through production deployment.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Originally built with a traditional Flask/JavaScript stack, this site has been 
              <span className="text-turquoise font-semibold"> architected and migrated</span> to 
              showcase modern full-stack development using React, Django REST Framework, and MongoDB, 
              demonstrating both technical proficiency and strategic project evolution.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-6 text-turquoise" />
              <h3 className="text-xl font-bold text-granite-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-turquoise to-turquoise-light p-8 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Development Philosophy</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              "Every project is an opportunity to demonstrate growth, technical excellence, 
              and the ability to deliver value through thoughtful architecture and clean, 
              maintainable code."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
