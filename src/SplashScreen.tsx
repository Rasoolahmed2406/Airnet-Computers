import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Keep splash screen visible for 3.8 seconds before triggering the exit transition
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Welcome Text
  const welcomeText = "WELCOME TO AIRNET COMPUTERS";

  // Framer Motion variants for the letter-by-letter typing animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, // Elegant delay per letter
        delayChildren: 0.8,    // Start typing when the logo is mostly scaled up
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 12,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 12, 
        stiffness: 120 
      }
    }
  };

  // Logo spring & pulse-glow variants for a circular container
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
        '0 0 15px rgba(30, 144, 255, 0.25)',
        '0 0 35px rgba(30, 144, 255, 0.6)',
        '0 0 20px rgba(30, 144, 255, 0.3)'
      ],
      transition: {
        opacity: { duration: 0.7, ease: 'easeOut' },
        scale: { 
          type: 'spring', 
          damping: 14, 
          stiffness: 80,
          duration: 1.6 
        },
        boxShadow: {
          delay: 0.6,
          duration: 1.8,
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
        y: -40, 
        transition: { 
          duration: 0.75, 
          ease: [0.4, 0, 0.2, 1] 
        } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white/95 via-blue-50/50 to-white/95 backdrop-blur-xl overflow-hidden select-none"
    >
      {/* Premium background decorative glowing blobs for high-fidelity active design */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1], 
            x: [0, 40, 0], 
            y: [0, -30, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-300/10 to-indigo-400/5 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            x: [0, -30, 0], 
            y: [0, 40, 0] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -bottom-[15%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-300/10 to-blue-400/5 blur-3xl"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6">
        
        {/* Premium Circular Logo Container */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white border border-blue-100/80 flex items-center justify-center p-7 relative overflow-hidden shadow-xl"
        >
          {/* Subtle internal ring for dynamic high-fidelity depth */}
          <div className="absolute inset-2.5 rounded-full border border-dashed border-blue-200/50 pointer-events-none z-0" />
          <img 
            src="/logo-new.png" 
            alt="Airnet Computers Logo" 
            className="w-full h-full object-contain pointer-events-none z-10 relative"
          />
        </motion.div>

        {/* Welcome Text Stagger Container */}
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-[#032e60] to-[#1e90ff] bg-clip-text text-transparent text-center"
          style={{
            fontFamily: "'Poppins', 'Montserrat', sans-serif",
            textShadow: '0 0 15px rgba(30, 144, 255, 0.25)',
          }}
        >
          {welcomeText.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap mr-2 sm:mr-3">
              {Array.from(word).map((letter, letterIdx) => (
                <motion.span
                  key={letterIdx}
                  variants={letterVariants}
                  className="inline-block"
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
