"use client";
import React, { useEffect, useRef, useState } from 'react';

const CKEditor = ({ initialValue = '', onChange, placeholder = 'İçerik giriniz...' }) => {
  const editorRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editorData, setEditorData] = useState(initialValue);
  
  // This is where we'd normally load CKEditor dynamically
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const loadEditor = async () => {
        try {
          // This would typically load CKEditor from npm
          // For now we'll create a simple fallback editor
          setIsLoaded(true);
        } catch (error) {
          console.error("Failed to load CKEditor", error);
        }
      };
      
      loadEditor();
    }
    
    return () => {
      // Cleanup
    };
  }, []);
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setEditorData(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  if (!isLoaded) {
    return <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800">Yükleniyor...</div>;
  }
  
  // Fallback rich text editor until CKEditor is properly installed
  return (
    <div className="border rounded overflow-hidden dark:border-gray-700">
      <div className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 p-2 flex gap-2">
        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Kalın">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
          </svg>
        </button>
        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="İtalik">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
          </svg>
        </button>
        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Altı Çizili">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
          </svg>
        </button>
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Liste">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        </button>
        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Bağlantı">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
          </svg>
        </button>
      </div>
      <textarea 
        ref={editorRef}
        className="w-full p-4 min-h-[300px] outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        value={editorData}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CKEditor; 