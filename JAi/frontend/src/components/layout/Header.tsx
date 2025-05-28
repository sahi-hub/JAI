import React from 'react';
import Link from 'next/link';
import { FiMenu, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import useStore from '../../utils/store';

const Header: React.FC = () => {
  const { toggleSidebar, darkMode, toggleDarkMode, isAuthenticated, logout } = useStore();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm h-16 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">JAi</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <FiSun className="h-5 w-5 text-yellow-400" />
            ) : (
              <FiMoon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Logout"
            >
              <FiLogOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
