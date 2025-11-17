"use client";
import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getImage } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MemberDetailModal = ({ member, onClose }) => {
  const modalRef = useRef(null);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
  };

  // Format age from birthDate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Format coordinates to be more readable
  const formatLocation = (locationString) => {
    if (!locationString) return "Belirtilmemiş";
    
    const [lat, lng] = locationString.split(',');
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };

  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          ref={modalRef}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header with profile image */}
          <div className="relative">
            {/* Background gradient */}
            <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl"></div>
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all z-10"
            >
              <Icon icon="heroicons:x-mark" className="h-6 w-6" />
            </button>
            
            {/* Profile image */}
            <div className="absolute -bottom-16 left-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <img
                  src={getImage(member.images[0])}
                  alt={member.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <span className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 ${
                  member.isActive ? 'bg-green-500' : 'bg-gray-500'
                }`}></span>
              </motion.div>
            </div>
            
            {/* Role badge */}
            <div className="absolute -bottom-8 right-8">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-semibold text-sm shadow-md">
                {member.role}
              </span>
            </div>
          </div>
          
          {/* Main content with padding for profile image */}
          <div className="pt-20 px-3 md:px-8 pb-8">
            <div className="mb-6">
              <motion.h1 
                className="text-2xl font-bold text-gray-900 dark:text-white" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {member.name}
              </motion.h1>
              <motion.div 
                className="text-gray-500 dark:text-gray-400 flex items-center mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Icon icon="heroicons:envelope" className="h-4 w-4 mr-2" />
                {member.credential}
              </motion.div>
            </div>
            
            {/* Content tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Personal Info */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Icon icon="heroicons:user-circle" className="h-5 w-5 mr-2 text-blue-500" />
                  Kişisel Bilgiler
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Yaş:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {member.onboarding?.birthDate ? calculateAge(member.onboarding.birthDate) : "Belirtilmemiş"}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Cinsiyet:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.gender || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">İlgilendiği:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.likeGender || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Şehir:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.city || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">İlçe:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.countie || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Burç:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.horoscope || "Belirtilmemiş"}</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Physical Info & Other Details */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Icon icon="heroicons:identification" className="h-5 w-5 mr-2 text-blue-500" />
                  Detaylar
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Boy:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.height || "Belirtilmemiş"} cm</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Kilo:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.weight || "Belirtilmemiş"} kg</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Eğitim:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.onboarding?.educationStatus || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Bakiye:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.balance?.toFixed(2) || "0.00"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Konum:</span>
                    <span className="text-gray-800 dark:text-gray-200">{formatLocation(member.location)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-28">Giriş Tipi:</span>
                    <span className="text-gray-800 dark:text-gray-200">{member.loginType || "Standart"}</span>
                  </div>
                </div>
              </motion.div>
              
              {/* About Section */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Icon icon="heroicons:document-text" className="h-5 w-5 mr-2 text-blue-500" />
                  Hakkında
                </h2>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {member.onboarding?.about || "Hakkında bilgi bulunmuyor."}
                  </p>
                </div>
              </motion.div>
              
              {/* Account Info */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Icon icon="heroicons:cog-6-tooth" className="h-5 w-5 mr-2 text-blue-500" />
                  Hesap Bilgileri
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Oluşturulma Tarihi</span>
                    <span className="text-gray-800 dark:text-gray-200">{formatDate(member.createdAt)}</span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Son Güncelleme</span>
                    <span className="text-gray-800 dark:text-gray-200">{formatDate(member.updatedAt)}</span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Premium Bitiş</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {member.premiumEndDate ? formatDate(member.premiumEndDate) : "Premium değil"}
                    </span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Kullanıcı ID</span>
                    <span className="text-gray-800 dark:text-gray-200 text-xs break-all">{member.id}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Close button at bottom */}
            <div className="mt-8 text-center">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Kapat
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberDetailModal; 