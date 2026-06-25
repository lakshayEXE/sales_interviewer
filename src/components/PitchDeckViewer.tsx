import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { motion, AnimatePresence } from 'framer-motion';

interface PitchDeckViewerProps {
  prepTimeMinutes: number;
  onSlideChange: (index: number, title: string) => void;
  onPrepComplete: () => void;
  onStartPitch?: () => void;
}

const slides = [
  {
    title: 'The Revenue Gap',
    content: (
      <div className="flex flex-col h-full w-full relative overflow-hidden bg-[#0A0F1C] text-white">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              The Revenue Gap
            </h2>
            
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-3xl p-8 mb-10 max-w-2xl shadow-[0_0_40px_rgba(239,68,68,0.1)]">
              <p className="text-2xl text-red-400 font-bold mb-3">
                70% of potential buyers abandon checkout.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Businesses lose thousands in revenue daily because they lack flexible, intelligent payment paths tailored to the buyer's financial context.
              </p>
            </div>
            
            <div className="space-y-5 max-w-xl">
              {[
                "Buyers demand flexibility, not rigid pay-in-full requirements.",
                "In-house payment plans carry massive risk and collection overhead.",
                "Traditional lenders reject a huge portion of buyers."
              ].map((text, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: 'The Credee Revenue Builder',
    content: (
      <div className="flex flex-col h-full w-full relative overflow-hidden bg-[#0A0F1C] text-white">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/4 translate-y-1/3" />
        
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h2 className="text-5xl font-black tracking-tight text-white">
              The Credee Revenue Builder
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-colors rounded-3xl p-8 backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Smart Match Technology</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our intelligent engine automatically matches your customers with the best payment options for their budget. Zero manual underwriting required.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-colors rounded-3xl p-8 backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Auto-Optimized Routing</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                CRB automatically adjusts payment options for each individual customer, maximizing conversion rates and securing the deal.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-l-4 border-blue-500 p-8 rounded-r-3xl max-w-4xl"
          >
            <p className="text-blue-400 font-bold text-xl mb-2 uppercase tracking-wider text-sm">Crucial Distinction</p>
            <p className="text-white text-xl font-medium leading-relaxed">
              We are built as a <span className="text-blue-400 font-bold">Software Platform</span> — Not a Financial Institution. We provide the secure infrastructure for businesses to offer their own payment plans effortlessly.
            </p>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: 'Automated Engagement',
    content: (
      <div className="flex flex-col h-full w-full relative overflow-hidden bg-[#0A0F1C] text-white">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-white mb-4">Beyond the Checkout</h2>
            <p className="text-2xl text-emerald-400 font-medium">Automate customer engagement and retention.</p>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
                title: "Reputation Builder",
                desc: "Trigger 5-star review requests via SMS the moment a positive transaction clears.",
                border: "hover:border-emerald-500/40",
                bg: "from-emerald-500/10"
              },
              {
                icon: <Zap className="w-8 h-8 text-purple-400" />,
                title: "Smart Reminders",
                desc: "Keep recurring revenue on track with gentle, automated SMS and email reminders.",
                border: "hover:border-purple-500/40",
                bg: "from-purple-500/10"
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-sky-400" />,
                title: "Ethical Collections",
                desc: "Recover past-due accounts automatically, preserving revenue without damaging relationships.",
                border: "hover:border-sky-500/40",
                bg: "from-sky-500/10"
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.15) }}
                className={`bg-white/[0.02] border border-white/10 ${card.border} transition-all duration-300 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-xl group hover:-translate-y-2`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.bg} to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  }
];

export const PitchDeckViewer: React.FC<PitchDeckViewerProps> = ({ prepTimeMinutes, onSlideChange, onPrepComplete, onStartPitch }) => {
  const currentSlideIndex = useInterviewStore(state => state.currentSlideIndex);
  const setCurrentSlideIndex = useInterviewStore(state => state.setCurrentSlideIndex);
  
  const [timeLeft, setTimeLeft] = useState(prepTimeMinutes * 60);
  const [isPrepMode, setIsPrepMode] = useState(prepTimeMinutes > 0);

  useEffect(() => {
    if (!isPrepMode) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleStartPitch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPrepMode]);

  const handleStartPitch = () => {
    setIsPrepMode(false);
    onPrepComplete();
    if (onStartPitch) onStartPitch();
    setCurrentSlideIndex(0);
    onSlideChange(0, slides[0].title);
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      if (!isPrepMode) onSlideChange(newIndex, slides[newIndex].title);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      if (!isPrepMode) onSlideChange(newIndex, slides[newIndex].title);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0F1C] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
      
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/10 backdrop-blur-xl shrink-0 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-xl leading-none">C</span>
          </div>
          <span className="text-white font-bold tracking-wide">Credee Pitch Deck</span>
        </div>
        
        {isPrepMode ? (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border ${timeLeft < 30 ? 'border-red-500/50 text-red-400' : 'border-amber-500/30 text-amber-400'}`}>
              <Clock size={16} className={timeLeft < 30 ? 'animate-pulse' : ''} />
              Prep Time: {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <button 
              onClick={handleStartPitch}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Play size={16} fill="currentColor" />
              Start Pitch Now
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Presentation
          </div>
        )}
      </div>

      {/* Slide Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-[#0A0F1C]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {slides[currentSlideIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 backdrop-blur-xl flex items-center justify-center shrink-0 z-20 relative">
        <div className="absolute left-6 flex items-center gap-2">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlideIndex 
                  ? 'w-8 bg-blue-500' 
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};
