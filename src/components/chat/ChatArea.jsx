"use client";
import React, { useEffect, useRef, useState } from 'react';
import Lottie from "lottie-react";

import { Icon } from '@iconify/react/dist/iconify.js';
import { getImage } from '@/utils';

const ChatArea = ({
  activeChat,
  activeContact,
  messages,
  setIsVideoError,
  messageText,
  setMessageText,
  sendTextMessage,
  handleImageClick,
  handleVideoClick,
  imageInputRef,
  videoInputRef,
  startRecording,
  stopRecording,
  cancelRecording,
  isRecording,
  recordingTime,
  formatTime,
  showMediaOptions,
  setShowMediaOptions,
  audioRefs,
  setActiveVideo,
  activeAudio,
  audioProgress,
  handleProgressChange,
  formatAudioTime,
  toggleAudioPlayback,
  activeVideo,
  setActiveAudio,
  isVideoError,
  handleVideoPlay,
  messagesEndRef,
  showCallPopup,
  setShowCallPopup,
  showChooseModerator,
  setShowChooseModerator,
  showChatInfo,
  setShowChatInfo,
  userStore,
  isMobileView,
  setIsMobileView
}) => {
  // Status message in Turkish
  const getStatusText = (status) => {
    switch (status) {
      case true: return 'Çevrimiçi';
      case false: return 'Çevrimdışı';
      default: return status;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
      {/* Chat Header */}
      {activeChat && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center">
            {isMobileView && (
              <button
                onClick={() => setIsMobileView(false)}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              >
                <Icon icon="heroicons:chevron-left" className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <div className="relative">
              <img
                src={getImage(activeContact?.user?.images[0])}
                alt={activeContact?.user?.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
              />
              <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 ${activeContact?.user?.isActive ? 'bg-green-500' : 'bg-gray-500'
                }`}></span>
            </div>
            <div className="ml-3">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">{activeContact?.user?.name || "User"}</h3>
              <p className="text-xs text-gray-500">{getStatusText(activeContact?.user?.isActive)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setShowCallPopup(true)
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Icon icon="heroicons:video-camera" className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            {!userStore.user?.isModerator && (
              <>
                <button
                  onClick={() => setShowChooseModerator(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Icon icon="heroicons:plus" className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowChatInfo(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Icon icon="heroicons:information-circle" className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4">
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          {messages.map((message) => {
            const isMe = message.userId === "moderator";
            return (
              <MessageItem
                key={message.id}
                message={message}
                isMe={isMe}
                activeAudio={activeAudio}
                audioProgress={audioProgress}
                setActiveAudio={setActiveAudio}
                setActiveVideo={setActiveVideo}
                isVideoError={isVideoError}
                handleVideoPlay={handleVideoPlay}
                audioRefs={audioRefs}
                handleProgressChange={handleProgressChange}
                formatAudioTime={formatAudioTime}
                toggleAudioPlayback={toggleAudioPlayback}
                activeVideo={activeVideo}
                setIsVideoError={setIsVideoError}
              />
            );
          })}
        </React.Suspense>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      {activeChat && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-4 flex-shrink-0">
          {isRecording ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full p-2 sm:p-3">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse mr-2 sm:mr-3"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Kaydediliyor... {formatTime(recordingTime)}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-1.5 sm:p-2 bg-red-100 text-red-500 rounded-full"
                  onClick={cancelRecording}
                >
                  <Icon icon="heroicons:trash" className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-full"
                  onClick={stopRecording}
                >
                  <Icon icon="heroicons:paper-airplane" className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="p-1.5 sm:p-2 mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                >
                  <Icon icon="heroicons:plus-circle" className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                {showMediaOptions && (
                  <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col space-y-1 border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                      onClick={handleImageClick}
                    >
                      <Icon icon="heroicons:photo" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>Resim</span>
                    </button>
                    <button
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                      onClick={handleVideoClick}
                    >
                      <Icon icon="heroicons:video-camera" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>Video</span>
                    </button>
                  </div>
                )}
                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  capture="camcorder"
                />
              </div>
              <input
                type="text"
                placeholder="Mesaj yazın"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendTextMessage();
                  }
                }}
                className="flex-1 h-10 sm:h-12 px-3 sm:px-4 rounded-l-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <button
                className="p-2 sm:p-3 rounded-r-full bg-gray-100 dark:bg-gray-700 border-t border-r border-b border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                onClick={startRecording}
              >
                <Icon icon="heroicons:microphone" className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                className="p-2 sm:p-3 ml-2 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                onClick={sendTextMessage}
                disabled={!messageText.trim()}
              >
                <Icon icon="heroicons:paper-airplane" className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MessageItem = ({
  message,
  isMe,
  activeAudio,
  audioProgress,
  setActiveAudio,
  setActiveVideo,
  isVideoError,
  handleVideoPlay,
  audioRefs,
  handleProgressChange,
  formatAudioTime,
  toggleAudioPlayback,
  activeVideo,
  setIsVideoError
}) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (message.type === 'GIFT' && !animationData) {
      fetch(getImage(message.gift?.animation))
        .then((res) => res.json())
        .then(setAnimationData)
        .catch((err) => console.error("Lottie fetch error:", err));
    }
  }, [message.type]);

  return (
    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="mr-2 flex-shrink-0">
          <img
            src={getImage(message.user?.images?.[0])}
            alt=""
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            width={40}
            height={40}
          />
        </div>
      )}
      <div className={`max-w-[80%] sm:max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
        {!isMe && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {message.user?.name}, {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        )}
        {message.content && message.type === 'TEXT' && (
          <div className={`rounded-lg p-2 sm:p-3 ${isMe
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
            }`}>
            {message.content}
          </div>
        )}
        {message.type === 'GIFT' && (
          <div className={`rounded-lg p-2 sm:p-3 ${isMe
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
            }`}>
            {animationData && (
              <Lottie animationData={animationData} width={100} loop autoplay />
            )}
          </div>
        )}
        {message.image && message.type === 'IMAGE' && (
          <div className={`rounded-lg overflow-hidden ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}>
            <img
              src={getImage(message.image)}
              alt="Paylaşılan resim"
              className="max-w-full h-auto"
            />
          </div>
        )}
        {message.audio && message.type === 'AUDIO' && (
          <div className={`rounded-lg p-2 sm:p-3 ${isMe
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
            }`}>
            <div className="flex items-center flex-col w-full gap-2">
              <div className="flex items-center w-full">
                <button
                  onClick={() => toggleAudioPlayback(message.id)}
                  className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${isMe
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-500 text-white'
                    }`}
                >
                  <Icon
                    icon={activeAudio === message.id ? "heroicons:pause" : "heroicons:play"}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                </button>
                <div className="ml-2 mr-2 flex-1 range-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioProgress[message.id] || 0}
                    onChange={(e) => handleProgressChange(e, message.id)}
                    className={`w-full h-2 rounded-lg appearance-none slider-thumb cursor-pointer ${isMe
                      ? 'slider-thumb-white range-white bg-white/30'
                      : 'slider-thumb-blue range-blue bg-blue-200 dark:bg-blue-900/30'
                      }`}
                  />
                </div>
                <span className="text-xs ml-1">
                  {formatAudioTime(audioRefs.current[message.id]?.duration)}
                </span>
              </div>
              <audio
                ref={el => audioRefs.current[message.id] = el}
                src={getImage(message.audio)}
                preload="metadata"
                className="hidden"
                onEnded={() => setActiveAudio(null)}
              />
            </div>
          </div>
        )}
        {message.video && message.type === 'VIDEO' && (
          <div className={`rounded-lg overflow-hidden ${isMe ? 'rounded-br-none' : 'rounded-bl-none'
            } video-container`}>
            <div className="relative">
              <video
                id={`video-${message.id}`}
                className="max-w-full h-auto rounded-lg"
                poster="/images/user/video-placeholder.jpg"
                onClick={() => handleVideoPlay(message.id)}
                onPlay={() => setActiveVideo(message.id)}
                onPause={() => setActiveVideo(null)}
                onEnded={() => setActiveVideo(null)}
                onError={() => setIsVideoError(prev => ({ ...prev, [message.id]: true }))}
                controls={activeVideo === message.id}
                preload="metadata"
              >
                <source src={getImage(message.video)} type="video/mp4" />
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
              {(activeVideo !== message.id && !isVideoError[message.id]) && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-20 rounded-lg"
                  onClick={() => handleVideoPlay(message.id)}
                >
                  <div className="rounded-full bg-black bg-opacity-50 p-3">
                    <Icon icon="heroicons:play" className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              )}
              {isVideoError[message.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <div className="text-center p-4">
                    <Icon icon="heroicons:exclamation-triangle" className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Video yüklenemedi</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {isMe && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
};

export default ChatArea; 