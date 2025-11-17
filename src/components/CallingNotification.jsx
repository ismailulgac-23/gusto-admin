"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getImage } from '@/utils';

const CallingNotification = ({ caller, onAccept, onDecline, autoDeclineAfter = 30 }) => {
  // Default show value is true
  const [show, setShow] = useState(true);
  const [countdown, setCountdown] = useState(autoDeclineAfter);
  
  // Auto decline after certain seconds
  useEffect(() => {
    if (!show) return;
    
    if (countdown <= 0) {
      handleDecline();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, show]);
  
  const handleAccept = () => {
    setShow(false);
    if (onAccept) onAccept();
  };
  
  const handleDecline = () => {
    setShow(false);
    if (onDecline) onDecline();
  };
  
  if (!caller || !show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100000] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Calling animation at top */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center relative overflow-hidden">
              {/* Ripple effect */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                <div className="w-24 h-24 rounded-full bg-white/15 animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="w-32 h-32 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2.5s' }}></div>
              </div>
              
              {/* User avatar */}
              <div className="relative inline-block mb-3">
                <motion.div
                  className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white relative z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <img 
                    src={getImage(caller.avatar)}
                    alt={caller.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              
              {/* Caller name */}
              <h2 className="text-xl font-bold text-white mb-1 relative z-10">{caller.name}</h2>
              
              {/* Calling text with animation */}
              <div className="flex items-center justify-center space-x-1 text-white/90 text-sm relative z-10">
                <span>Sizi arıyor</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex space-x-0.5"
                >
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </motion.span>
              </div>
              
              {/* Countdown */}
              <div className="mt-3 text-white/80 text-xs relative z-10">
                Otomatik reddedilecek: {countdown} saniye
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-1 p-1">
              <motion.button
                className="p-4 bg-red-500 text-white rounded-xl flex flex-col items-center justify-center"
                onClick={handleDecline}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="heroicons:phone-x-mark" className="h-8 w-8 mb-1" />
                <span className="text-sm font-medium">Reddet</span>
              </motion.button>
              
              <motion.button
                className="p-4 bg-green-500 text-white rounded-xl flex flex-col items-center justify-center"
                onClick={handleAccept}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="heroicons:phone-arrow-up-right" className="h-8 w-8 mb-1" />
                <span className="text-sm font-medium">Kabul Et</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallingNotification; 