import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Keep splash screen visible for 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const welcomeText = "WELCOME TO AIRNET COMPUTERS";

  // Container variants for letter-by-letter stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 1.0, // Delay until logo animation is mostly done
      }
    }
  };

  // Letter fade-up animation
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 15,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 12, 
        stiffness: 100 
      }
    }
  };

  // Logo spring & glow animation
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      boxShadow: '0 0 0px rgba(30, 144, 255, 0)'
    },
    visible: {
      opacity: 1,
      scale: 1,
      boxShadow: [
        '0 0 15px rgba(30, 144, 255, 0.4)',
        '0 0 30px rgba(30, 144, 255, 0.8)',
        '0 0 15px rgba(30, 144, 255, 0.4)'
      ],
      transition: {
        opacity: { duration: 1.2, ease: 'easeOut' },
        scale: { 
          type: 'spring', 
          damping: 12, 
          stiffness: 90,
          duration: 1.8 // 1.5 - 2 seconds
        },
        boxShadow: {
          delay: 0.5,
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        y: -50, 
        transition: { 
          duration: 0.8, 
          ease: "easeInOut" 
        } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white/95 via-blue-50/80 to-white/95 backdrop-blur-md overflow-hidden select-none"
    >
      <div className="relative z-10 flex flex-col items-center px-6">
        
        {/* Circle Shape Logo */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-100"
        >
          <img 
            src="/Logo.png" 
            alt="Airnet Computers Logo" 
            className="w-full h-full object-cover scale-110 pointer-events-none"
          />
        </motion.div>

        {/* Animated Text */}
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 text-xl sm:text-2xl md:text-3xl font-bold tracking-widest bg-gradient-to-r from-[#032e60] to-[#1e90ff] bg-clip-text text-transparent text-center"
          style={{
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            textShadow: '0 0 20px rgba(30, 144, 255, 0.3)',
          }}
        >
          {welcomeText.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap mr-3">
              {Array.from(word).map((letter, letterIdx) => (
                <motion.span
                  key={letterIdx}
                  variants={letterVariants}
                  className="inline-block drop-shadow-md"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>
      </div>
    </motion.div>
  );
}
