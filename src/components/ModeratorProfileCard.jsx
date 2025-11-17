"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getImage } from '@/utils';

const ModeratorProfileCard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
  };
  
  // Calculate age from birthdate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "?";
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Format coordinates to be more readable
  const formatLocation = (locationString) => {
    if (!locationString) return "Belirtilmemiş";
    
    const [lat, lng] = locationString.split(',');
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };
  
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };
  
  // Tabs for different sections
  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: 'heroicons:user-circle' },
    { id: 'interests', label: 'İlgi Alanları', icon: 'heroicons:heart' },
    { id: 'account', label: 'Hesap Bilgileri', icon: 'heroicons:cog-6-tooth' }
  ];
  
  if (!user) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with user info */}
      <div className="relative">
        {/* Background gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* User avatar */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={getImage(user.images[0])}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <span className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 ${
              user.isActive ? 'bg-green-500' : 'bg-gray-500'
            }`}></span>
          </div>
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-semibold">
            {user.isModerator ? 'Moderatör' : user.role}
          </span>
        </div>
      </div>
      
      {/* User name and basic info - with margin for avatar */}
      <div className="pt-20 px-8 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <div className="flex items-center mt-1 space-x-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Icon icon="heroicons:envelope" className="h-4 w-4 mr-1" />
            {user.credential}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Icon icon="heroicons:calendar" className="h-4 w-4 mr-1" />
            {calculateAge(user.onboarding?.birthDate)} yaş
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Icon icon="heroicons:map-pin" className="h-4 w-4 mr-1" />
            {user.onboarding?.city}
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-t border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center py-3 px-4 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon icon={tab.icon} className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-6">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* About section */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                <Icon icon="heroicons:document-text" className="h-5 w-5 mr-2 text-blue-500" />
                Hakkında
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {user.onboarding?.about || "Hakkında bilgi bulunmuyor."}
                </p>
              </div>
            </div>
            
            {/* Basic info as a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                  <Icon icon="heroicons:identification" className="h-5 w-5 mr-2 text-blue-500" />
                  Kişisel Detaylar
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cinsiyet:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.gender || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">İlgilendiği:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.likeGender || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Doğum Tarihi:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(user.onboarding?.birthDate)}</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Burç:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.horoscope || "Belirtilmemiş"}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                  <Icon icon="heroicons:map" className="h-5 w-5 mr-2 text-blue-500" />
                  Fiziksel Özellikler ve Konum
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Boy:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.height || "Belirtilmemiş"} cm</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Kilo:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.weight || "Belirtilmemiş"} kg</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Şehir/İlçe:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user.onboarding?.city}{user.onboarding?.countie ? `, ${user.onboarding.countie}` : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Eğitim:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.onboarding?.educationStatus || "Belirtilmemiş"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Interests Tab */}
        {activeTab === 'interests' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Current Interests */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <Icon icon="heroicons:sparkles" className="h-5 w-5 mr-2 text-blue-500" />
                İlgi Alanları
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {user.onboarding?.interests && user.onboarding.interests.length > 0 ? (
                  user.onboarding.interests.map(interest => (
                    <span 
                      key={interest.id}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {interest.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">Belirtilmiş ilgi alanı bulunmuyor</p>
                )}
              </div>
            </div>
            
            {/* Waiting Interests */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <Icon icon="heroicons:clock" className="h-5 w-5 mr-2 text-purple-500" />
                Beklenen İlgi Alanları
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {user.onboarding?.waitInterests && user.onboarding.waitInterests.length > 0 ? (
                  user.onboarding.waitInterests.map(interest => (
                    <span 
                      key={interest.id}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {interest.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">Belirtilmiş beklenen ilgi alanı bulunmuyor</p>
                )}
              </div>
            </div>
            
            {/* Search Properties */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <Icon icon="heroicons:magnifying-glass" className="h-5 w-5 mr-2 text-green-500" />
                Arama Tercihleri
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {user.onboarding?.searchProperties && user.onboarding.searchProperties.length > 0 ? (
                  user.onboarding.searchProperties.map(prop => (
                    <span 
                      key={prop.id}
                      className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {prop.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">Belirtilmiş arama tercihi bulunmuyor</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Account Info Tab */}
        {activeTab === 'account' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Account Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Bakiye</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatMoney(user.balance)}</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Komisyon Oranı</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">%{user.commissionRate}</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Premium</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {user.premiumEndDate ? formatDate(user.premiumEndDate) : 'Yok'}
                </span>
              </div>
            </div>
            
            {/* Account Details */}
            <div className="space-y-3">
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Kullanıcı ID:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-xs truncate">{user.id}</span>
              </div>
              
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Giriş Tipi:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.loginType}</span>
              </div>
              
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Konum (Koordinat):</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatLocation(user.location)}</span>
              </div>
              
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Hesap Oluşturma:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Son Güncelleme:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(user.updatedAt)}</span>
              </div>
              
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Durum:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                }`}>
                  {user.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModeratorProfileCard; 