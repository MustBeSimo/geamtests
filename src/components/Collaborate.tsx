'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export default function Collaborate() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="collab" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Collaborate with Gigi
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Virtual Brand Campaigns That Convert
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Gigi offers branded content creation, AI-hosted fashion shows, and
            interactive customer support avatars that elevate your brand's
            digital presence.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4"
          ></motion.div>
        </motion.div>

        <div className="md:flex items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="bg-gray-50 p-8 rounded-xl">
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Why Partner with Gigi?
              </motion.h3>
              <div className="space-y-6">
                {[
                  {
                    icon: 'chart-line',
                    color: 'pink',
                    title: 'Proven Engagement',
                    description:
                      'Gigi has helped boost engagement rates by over 35% for brands.',
                  },
                  {
                    icon: 'users',
                    color: 'purple',
                    title: 'Authentic Connection',
                    description:
                      'Reach Gen Z and Millennial audiences through authentic AI-powered interactions.',
                  },
                  {
                    icon: 'lightbulb',
                    color: 'blue',
                    title: 'Innovative Solutions',
                    description:
                      'From digital takeovers to metaverse fashion shows, Gigi brings fresh ideas.',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div
                      className={`bg-${feature.color}-100 p-3 rounded-full mr-4`}
                    >
                      <i
                        className={`fas fa-${feature.icon} text-${feature.color}-500`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Ready to innovate with the leading ethical AI influencer?
              </motion.h3>
              <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Collaboration Request
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
