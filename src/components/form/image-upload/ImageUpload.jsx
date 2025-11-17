"use client";
import React, { useState, useRef } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ImageUpload({ 
  onChange, 
  maxSize = 5, // in MB
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  className = ''
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setError('');
    
    if (!file) return;
    
    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`Sadece ${acceptedFileTypes.map(type => type.split('/')[1]).join(', ')} dosya tipleri kabul edilir.`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır.`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Notify parent component
    onChange(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!preview ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary'}
          `}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon 
            icon="heroicons:photo" 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
            <label className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none">
              <span>Dosya yükle</span>
              <input 
                ref={fileInputRef}
                type="file" 
                className="sr-only" 
                accept={acceptedFileTypes.join(',')}
                onChange={handleInputChange}
              />
            </label>
            <p className="pl-1">veya sürükle bırak</p>
          </div>
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400 mt-1">
            PNG, JPG, JPEG (max {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <button 
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
          >
            <Icon icon="heroicons:x-mark" className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 