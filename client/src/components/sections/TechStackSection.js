import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  Globe, 
  Layers, 
  GitBranch, 
  Cloud,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const TechStackSection = () => {
  const currentStack = [
    {
      category: "Frontend",
      icon: Globe,
      technologies: ["React 18", "Tailwind CSS", "Framer Motion", "Axios"],
      color: "from-blue-500 to-blue-600"
    },
    {
      category: "Backend",
      icon: Server,
      technologies: ["Django 4.2", "REST Framework", "Python 3.11", "Gunicorn"],
      color: "from-green-500 to-green-600"
    },
    {
      category: "Database",
      icon: Database,
      technologies: ["MongoDB", "MongoEngine ODM", "Atlas Cloud"],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      category: "DevOps",
      icon: Cloud,
      technologies: ["Digital Ocean", "Docker", "GitHub Actions", "Nginx"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const migrationSteps = [
    {
      phase: "Legacy Stack",
      description: "Flask + Vanilla JS + Static Files",
      status: "completed"
    },
    {
      phase: "Backend Migration",
      description: "Django REST API + MongoDB Integration",
      status: "completed"
    },
    {
      phase: "Frontend Modernization",
      description: "React Components + State Management",
      status: "current"
    },
    {
      phase: "Production Deployment",
      description: "Digital Ocean + CI/CD Pipeline",
      status: "upcoming"
    }
  ];

  return (
    <section id="tech-stack" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Layers className="w-12 h-12 mx-auto mb-6 text-turquoise" />
          <h2 className="text-4xl font-bold text-granite-dark mb-6">
            Modern Technology Stack
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive demonstration of full-stack development using industry-standard 
            technologies, showcasing both technical depth and architectural decision-making.
          </p>
        </motion.div>

        {/* Current Tech Stack */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {currentStack.map((stack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stack.color} p-6 text-white`}>
                <stack.icon className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold">{stack.category}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <li key={techIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-turquoise mr-2 flex-shrink-0" />
                      <span className="text-sm">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-granite-dark text-center mb-8">
            System Architecture
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Frontend */}
              <div className="text-center">
                <div className="bg-blue-500 text-white p-6 rounded-xl mb-4">
                  <Globe className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold">React Frontend</h4>
                  <p className="text-sm opacity-90">SPA with routing</p>
                </div>
                <p className="text-sm text-gray-600">User Interface Layer</p>
              </div>

              <ArrowRight className="w-6 h-6 text-turquoise rotate-90 lg:rotate-0" />

              {/* API */}
              <div className="text-center">
                <div className="bg-green-500 text-white p-6 rounded-xl mb-4">
                  <Server className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold">Django REST API</h4>
                  <p className="text-sm opacity-90">RESTful endpoints</p>
                </div>
                <p className="text-sm text-gray-600">Business Logic Layer</p>
              </div>

              <ArrowRight className="w-6 h-6 text-turquoise rotate-90 lg:rotate-0" />

              {/* Database */}
              <div className="text-center">
                <div className="bg-emerald-500 text-white p-6 rounded-xl mb-4">
                  <Database className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold">MongoDB</h4>
                  <p className="text-sm opacity-90">Document storage</p>
                </div>
                <p className="text-sm text-gray-600">Data Persistence Layer</p>
              </div>

              <ArrowRight className="w-6 h-6 text-turquoise rotate-90 lg:rotate-0" />

              {/* Deployment */}
              <div className="text-center">
                <div className="bg-purple-500 text-white p-6 rounded-xl mb-4">
                  <Cloud className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold">Digital Ocean</h4>
                  <p className="text-sm opacity-90">Cloud deployment</p>
                </div>
                <p className="text-sm text-gray-600">Infrastructure Layer</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Migration Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-granite-dark text-center mb-8">
            Development & Migration Timeline
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {migrationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className={`p-6 rounded-xl border-2 transition-all ${
                    step.status === 'completed' 
                      ? 'border-green-500 bg-green-50' 
                      : step.status === 'current'
                      ? 'border-turquoise bg-turquoise-light bg-opacity-10'
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="flex items-center mb-3">
                      {step.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      )}
                      {step.status === 'current' && (
                        <GitBranch className="w-5 h-5 text-turquoise mr-2" />
                      )}
                      {step.status === 'upcoming' && (
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full mr-2"></div>
                      )}
                      <span className="text-sm font-semibold text-granite-dark">
                        Phase {index + 1}
                      </span>
                    </div>
                    <h4 className="font-bold text-granite-dark mb-2">{step.phase}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index < migrationSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 text-turquoise" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
