import React from 'react';
import { motion } from 'framer-motion';
import { Folder, ExternalLink, Github, Play, Code } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Rip City Ticket Dispatch",
      category: "Full-Stack Event Platform",
      description: "Portland's premier event ticket aggregation platform with AI-powered deal scoring, real-time price tracking, and multi-channel notifications. Features comprehensive subscription tiers and certified API integrations.",
      technologies: ["React 19", "Node.js", "Express", "MongoDB", "Ticketmaster API", "Eventbrite API", "Digital Ocean"],
      features: [
        "Real-time event aggregation from Ticketmaster & Eventbrite APIs",
        "AI-powered deal scoring and price tracking algorithms", 
        "Multi-channel notifications (SMS, email, webhooks)",
        "Subscription management with Stripe integration",
        "Comprehensive legal documentation for API approvals",
        "Professional responsive design with Portland Trail Blazers theming"
      ],
      liveUrl: "https://ripcityticketdispatch.works",
      githubUrl: "https://github.com/J-mazz/ripcityticketdispatch.works",
      status: "Production",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Veritas-Lens",
      category: "Machine Learning & NLP",
      description: "Political bias detection system using BERT transformers for news article classification. Features active learning, live data aggregation, and comprehensive backend API with Digital Ocean deployment.",
      technologies: ["TensorFlow", "BERT", "Python", "Node.js", "PostgreSQL", "Digital Ocean", "Active Learning"],
      features: [
        "Fine-tuned BERT model for political bias classification",
        "Active learning pipeline for continuous model improvement",
        "RSS feed aggregation and web scraping automation",
        "RESTful API with authentication and role management",
        "Real-time bias prediction with confidence scoring",
        "Production deployment with H100 GPU support"
      ],
      githubUrl: "https://github.com/J-mazz/Veritas-Lens",
      status: "Research Project",
      image: "/api/placeholder/600/400"
    },
    {
      title: "CodeGen Fine-Tuning Pipeline",
      category: "Deep Learning & Code Generation",
      description: "Advanced active learning pipeline for fine-tuning Salesforce CodeGen models on multi-language code datasets. Features phased training, memory optimization, and comprehensive evaluation metrics.",
      technologies: ["PyTorch", "Transformers", "Hugging Face", "Multi-GPU", "Active Learning", "Datasets API"],
      features: [
        "Multi-stage preprocessing for Python, C++, Java, and Rust datasets",
        "Phased active learning with language-specific curricula",
        "Advanced memory optimization for large model training",
        "Comprehensive deduplication and characterization pipeline",
        "Mixed precision training with gradient clipping",
        "Detailed evaluation with entity-level metrics"
      ],
      githubUrl: "https://github.com/J-mazz/codegen-finetune",
      status: "Research Project",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Robust-Cite",
      category: "NER & Citation Processing",
      description: "BERT-based Named Entity Recognition system for academic citation parsing. Achieves 99.97% validation accuracy in extracting bibliographic components with production-ready architecture.",
      technologies: ["TensorFlow", "BERT", "Mixed Precision", "Google Colab", "BIO Tagging", "Citation Processing"],
      features: [
        "High-performance NER model (99.97% validation accuracy)",
        "Comprehensive bibliographic entity extraction (Author, Title, Journal, etc.)",
        "Mixed precision training optimized for A100 GPUs",
        "Robust data preprocessing with XML parsing and tokenization",
        "Production-ready model persistence and evaluation pipeline",
        "Scalable architecture for large-scale citation processing"
      ],
      githubUrl: "https://github.com/J-mazz/robust-cite",
      status: "Production Ready",
      image: "/api/placeholder/600/400"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production':
        return 'bg-green-100 text-green-800';
      case 'Research Project':
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
            Diverse portfolio spanning full-stack web applications, machine learning research, 
            and specialized NLP systems. Each project demonstrates end-to-end development 
            from research and architecture through production deployment.
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
            <h3 className="text-2xl font-bold mb-4">Development Philosophy</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              From Portland event platforms to AI research systems, each project represents 
              a commitment to technical excellence, scalable architecture, and real-world impact. 
              Combining academic rigor with production-ready implementation.
            </p>
            <div className="mt-6">
              <a
                href="https://github.com/J-mazz"
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
