import React from 'react';

const Tab = ({
  items,
  activeTab,
  onTabChange,
  className = '',
  children
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <div className='flex space-x-1'>
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onTabChange(item.value);
              }}
              className={`relative flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out
              ${activeTab === item.value
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-white/50 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-brand-400'
                }`}
            >
              {item.label}
              {activeTab === item.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400" />
              )}
            </button>
          ))}
        </div>

        {children && (
          <div className='mt-2'>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;