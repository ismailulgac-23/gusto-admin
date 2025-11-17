"use client";
import axios from '@/axios';
import * as React from 'react';
import { getImage } from '@/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import MemberDetailModal from './MemberDetailModal';

export default function ChatInfo({ chat, onClose }) {
    const [selectedMember, setSelectedMember] = React.useState(null);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR');
    };

    // Status message in Turkish
    const getStatusText = (status) => {
        return status ? 'Çevrimiçi' : 'Çevrimdışı';
    };

    // Handle member click - only for BOT members
    const handleMemberClick = (member) => {
        if (member.user.role === 'BOT') {
            setSelectedMember(member.user);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-6 max-w-[1000px] w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
                        <Icon icon="heroicons:chat-bubble-left-right" className="h-7 w-7 mr-2 text-blue-500" />
                        Sohbet Detayları
                    </h1>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors text-gray-600 dark:text-gray-400"
                        aria-label="Kapat"
                    >
                        <Icon icon="heroicons:x-mark" className="h-6 w-6" />
                    </button>
                </div>

                {/* Sohbet Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Icon icon="heroicons:information-circle" className="h-5 w-5 mr-2 text-blue-500" />
                            Genel Bilgiler
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sohbet ID</span>
                                <span className="text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{chat.id}</span>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Oluşturulma Tarihi</span>
                                <span className="text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{formatDate(chat.createdAt)}</span>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Son Güncelleme</span>
                                <span className="text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{formatDate(chat.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderatör Bilgileri */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Icon icon="heroicons:user-circle" className="h-5 w-5 mr-2 text-blue-500" />
                            Moderatör
                        </h2>
                        
                        {chat.moderator ? (
                            <div className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="relative">
                                    <img
                                        src={getImage(chat.moderator.images[0])}
                                        alt={chat.moderator.name}
                                        className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
                                    />
                                    <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900 ${chat.moderator.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                </div>
                                
                                <div className="ml-4">
                                    <p className="text-base font-medium text-gray-900 dark:text-white">{chat.moderator.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{chat.moderator.credential}</p>
                                    <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${chat.moderator.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                        {getStatusText(chat.moderator.isActive)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                                <Icon icon="heroicons:user-slash" className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">Moderatör atanmamış</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Üyeler */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                        <Icon icon="heroicons:users" className="h-5 w-5 mr-2 text-blue-500" />
                        Sohbet Üyeleri
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium">
                            {chat.members.length}
                        </span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {chat.members.map((member) => (
                            <div 
                                key={member.id} 
                                className={`flex flex-col sm:flex-row items-center sm:items-start p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all ${
                                    member.user.role === 'BOT' 
                                        ? 'cursor-pointer hover:border-blue-500 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20' 
                                        : ''
                                }`}
                                onClick={() => handleMemberClick(member)}
                            >
                                <div className="relative mb-4 sm:mb-0">
                                    <img
                                        src={getImage(member.user.images[0])}
                                        alt={member.user.name}
                                        className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 shrink-0 ${
                                            member.user.role === 'BOT' 
                                                ? 'border-purple-500' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    />
                                    <span className={`absolute bottom-0 right-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-white dark:border-gray-900 ${member.user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                </div>
                                
                                <div className="sm:ml-5 flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-center sm:text-left">
                                        <div>
                                            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{member.user.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{member.user.credential}</p>
                                        </div>
                                        <span className={`mt-2 w-max mx-auto sm:mt-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium ${
                                            member.user.role === 'BOT'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                        }`}>
                                            {member.user.role}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        <div className="flex items-center text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                            <Icon icon="heroicons:currency-dollar" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 truncate">Bakiye: {member.user.balance.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                            <Icon icon="heroicons:map-pin" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 truncate">Konum: {member.user.onboarding.city.charAt(0).toUpperCase() + member.user.onboarding.city.slice(1).toLowerCase()}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                            <Icon icon="heroicons:calendar" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 truncate">Katılım: {formatDate(member.user.createdAt)}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                            <span className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2 flex-shrink-0 ${member.user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <span className="text-gray-700 dark:text-gray-300">{getStatusText(member.user.isActive)}</span>
                                        </div>
                                    </div>
                                    
                                    {member.user.role === 'BOT' && (
                                        <div className="mt-4 text-center sm:text-right">
                                            <button 
                                                className="text-xs font-medium text-purple-600 dark:text-purple-400 flex items-center justify-center sm:justify-end ml-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMemberClick(member);
                                                }}
                                            >
                                                Detayları Görüntüle
                                                <Icon icon="heroicons:arrow-right" className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {selectedMember && (
                <MemberDetailModal 
                    member={selectedMember} 
                    onClose={() => setSelectedMember(null)} 
                />
            )}
        </div>
    );
}
