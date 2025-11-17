"use client";
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatDate } from '@fullcalendar/core/index.js';
import { getImage } from '@/utils';

const ChatSidebar = ({ 
  chats, 
  currentChats, 
  activeChat, 
  setChat,
  currentPage,
  totalPages,
  setCurrentPage,
  isMobileView,
  setIsMobileView
}) => {
  // Get message preview for different types
  const getMessagePreview = (message) => {
    if (!message) return '';

    switch (message.type) {
      case 'TEXT':
        return message.content.length > 40 ? message.content.substring(0, 40) + '...' : message.content || '';
      case 'IMAGE':
        return '🖼️ Görsel';
      case 'VIDEO':
        return '🎬 Video';
      case 'AUDIO':
        return '🔊 Ses kaydı';
      default:
        return '';
    }
  };

  return (
    <div className={`${isMobileView ? 'hidden' : 'flex'} w-full md:w-80 md:min-w-[320px] md:max-w-[320px] border-r border-gray-200 dark:border-gray-700 flex-col overflow-hidden h-full`}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sohbetler</h2>
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileView(true)}
          >
            <Icon icon="heroicons:x-mark" className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Ara..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          />
          <Icon
            icon="heroicons:magnifying-glass"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {currentChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Henüz sohbet bulunmuyor
          </div>
        ) : (
          currentChats.map((chat) => {
            const member = chat.member;
            return (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  activeChat === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => {
                  setChat(chat);
                  if (window.innerWidth < 768) { // If on mobile
                    setIsMobileView(true);
                  }
                }}
              >
                <div className="relative shrink-0">
                  {member?.user == null ? (
                    <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:user" className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={getImage(member?.user?.images[0])}
                      alt={member?.user?.name || 'Kullanıcı'}
                      className="shrink-0 h-12 w-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                  )}
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    member?.user?.status === 'online' ? 'bg-green-500' :
                    member?.user?.status === 'away' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {member?.user?.name || 'İsimsiz Kullanıcı'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.lastMessage?.createdAt ? formatDate(new Date(chat.lastMessage.createdAt)) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {getMessagePreview(chat.lastMessage)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {chats.length > 10 && (
        <div className="border-t border-gray-200 dark:border-gray-700 w-full p-3">
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sayfa {currentPage} / {totalPages}
            </span>
            <div className="flex items-center justify-between gap-1 w-full">
              {/* First page button */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-2 py-2 rounded-md transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600'
                }`}
                title="İlk Sayfa"
              >
                <Icon icon="heroicons:chevron-double-left" className="h-4 w-4" />
              </button>

              {/* Previous page button */}
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-2 py-2 rounded-md transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600'
                }`}
                title="Önceki Sayfa"
              >
                <Icon icon="heroicons:chevron-left" className="h-4 w-4" />
              </button>

              {/* Page numbers - showing limited pages with ellipsis for better UI */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  // Show current page, first, last, and pages around current
                  const showPageButton =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  // Show ellipsis instead of all page numbers
                  if (!showPageButton) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-2 py-1 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-200 hover:bg-blue-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }).filter(Boolean)}
              </div>

              {/* Current page indicator for mobile */}
              <span className="sm:hidden text-sm font-medium">
                {currentPage} / {totalPages}
              </span>

              {/* Next page button */}
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-2 py-2 rounded-md transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600'
                }`}
                title="Sonraki Sayfa"
              >
                <Icon icon="heroicons:chevron-right" className="h-4 w-4" />
              </button>

              {/* Last page button */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-2 py-2 rounded-md transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600'
                }`}
                title="Son Sayfa"
              >
                <Icon icon="heroicons:chevron-double-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar; 