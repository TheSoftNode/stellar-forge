'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Leaf, BarChart3 } from 'lucide-react';
import { Logo } from './ui/logo';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Price Tracking',
      description: 'Monitor Stellar asset prices with live updates and detailed analytics'
    },
    {
      icon: Leaf,
      title: 'Smart Farming Analytics',
      description: 'Optimize your farming strategies with AI-powered insights'
    },
    {
      icon: BarChart3,
      title: 'Advanced Metrics',
      description: 'Comprehensive charts and performance indicators'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white">
              Next-Gen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500">
                Analytics
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
              Revolutionize your Stellar ecosystem experience with real-time insights, 
              smart farming analytics, and comprehensive market data.
            </p>
            
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white"
            >
              Powerful Features
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Transform Your Analytics?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Join the future of Stellar ecosystem analytics and farming optimization.
            </p>
            
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg"
            >
              Launch Dashboard
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-200/20 dark:bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-2xl"></div>
        </div>
      </main>
    </div>
  );
}