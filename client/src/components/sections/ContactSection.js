import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/api/contact/', formData);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again or contact me directly.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeDownload = async () => {
    try {
      const response = await api.get('/api/resume/download/', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Joseph_Mazzini_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download resume. Please try again.');
      console.error('Resume download error:', error);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Mail className="w-12 h-12 mx-auto mb-6 text-turquoise" />
          <h2 className="text-4xl font-bold text-granite-dark mb-6">
            Let's Collaborate
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Interested in discussing projects, opportunities, or technical insights? 
            I'm always open to meaningful conversations about development, project management, 
            and innovative solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-granite-dark mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-granite-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-granite-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-granite-dark mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent transition-colors resize-none"
                  placeholder="Tell me about your project, opportunity, or question..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-turquoise hover:bg-turquoise-dark disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-granite-dark mb-6">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-turquoise mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-granite-dark">Email</h4>
                    <p className="text-gray-600">joseph@mazzlabs.works</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Professional inquiries and collaboration opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ExternalLink className="w-6 h-6 text-turquoise mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-granite-dark">LinkedIn</h4>
                    <a 
                      href="https://linkedin.com/in/joseph-mazzini" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-turquoise hover:text-turquoise-dark transition-colors"
                    >
                      linkedin.com/in/joseph-mazzini
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Professional network and career updates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Download */}
            <div className="bg-gradient-to-br from-turquoise-light to-turquoise p-6 rounded-xl text-white">
              <h4 className="text-xl font-bold mb-3">Professional Resume</h4>
              <p className="text-sm opacity-90 mb-4">
                Download my complete professional background, including technical skills, 
                project management experience, and career progression.
              </p>
              <button
                onClick={handleResumeDownload}
                className="bg-white text-turquoise hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg font-semibold flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </button>
            </div>

            {/* Response Time */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h4 className="font-semibold text-granite-dark">Response Commitment</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                I typically respond to professional inquiries within 24-48 hours. 
                For urgent matters or time-sensitive opportunities, please mention 
                the timeline in your message.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-granite-dark to-granite-medium p-8 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Something Great?</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for a developer, project manager, or technical consultant, 
              I'm passionate about creating solutions that drive real business value.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
