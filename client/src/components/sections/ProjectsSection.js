import React from 'react';
import { motion } from 'framer-motion';
import { Folder, ExternalLink, Github, Play, Code } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Portfolio Evolution",
      category: "Full-Stack Development",
      description: "Complete migration from Flask/Vanilla JS to React/Django stack, demonstrating modern development practices and architectural decision-making.",
      technologies: ["React", "Django", "MongoDB", "Docker", "Digital Ocean"],
      features: [
        "Responsive React components with Tailwind CSS",
        "RESTful API with Django REST Framework",
        "MongoDB integration with MongoEngine ODM",
        "Interactive game demonstrations",
        "Production-ready deployment pipeline"
      ],
      liveUrl: "https://mazzlabs.works",
      githubUrl: "https://github.com/Mazzlabs/Mazzlabs.works",
      status: "In Development",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Interactive Game Suite",
      category: "Frontend Development",
      description: "Browser-based games (Blackjack, Rock-Paper-Scissors) showcasing vanilla JavaScript to React component migration and state management.",
      technologies: ["React Hooks", "Framer Motion", "Game Logic", "State Management"],
      features: [
        "Real-time game state management",
        "Smooth animations and transitions",
        "Responsive design for all devices",
        "Score tracking and statistics",
        "Modular component architecture"
      ],
      demoUrl: "/games",
      githubUrl: "https://github.com/Mazzlabs/Mazzlabs.works/tree/main/client/src/components/games",
      status: "Active",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Contact & Resume System",
      category: "Backend Integration",
      description: "Professional contact form with email integration and resume download tracking, demonstrating API design and data persistence.",
      technologies: ["Django REST", "SMTP Integration", "File Handling", "Analytics"],
      features: [
        "Secure contact form processing",
        "Email notifications and confirmations",
        "Resume download tracking and analytics",
        "Rate limiting and validation",
        "Professional email templates"
      ],
      status: "Production Ready",
      image: "/api/placeholder/600/400"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'In Development':
        return 'bg-turquoise-light bg-opacity-20 text-turquoise-dark';
      case 'Production Ready':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Folder className="w-12 h-12 mx-auto mb-6 text-turquoise" />
          <h2 className="text-4xl font-bold text-granite-dark mb-6">
            Project Showcase
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each project demonstrates specific aspects of modern web development, 
            from initial concept through production deployment, showcasing both 
            technical implementation and project management capabilities.
          </p>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="lg:flex">
                <div className="lg:w-2/3 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-turquoise font-semibold uppercase tracking-wide">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-granite-dark mt-1">
                        {project.title}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-granite-dark mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                          <Code className="w-4 h-4 text-turquoise mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-granite-dark mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-turquoise-light bg-opacity-20 text-turquoise-dark rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-turquoise hover:bg-turquoise-dark text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Site
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border-2 border-granite-dark text-granite-dark hover:bg-granite-dark hover:text-white rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/3 bg-gradient-to-br from-turquoise-light to-turquoise p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Folder className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold opacity-90">
                      {project.category}
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                      Demonstrating {project.technologies.length} key technologies
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-granite-dark to-granite-medium p-8 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Development Approach</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              Each project follows industry best practices: thorough planning, iterative development, 
              comprehensive testing, and thoughtful deployment strategies. This portfolio itself 
              serves as a case study in modern web development project management.
            </p>
            <div className="mt-6">
              <a
                href="https://github.com/Mazzlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-turquoise hover:bg-turquoise-dark transition-colors rounded-lg font-semibold"
              >
                <Github className="w-5 h-5 mr-2" />
                View All Projects
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
