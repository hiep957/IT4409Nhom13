import React, { useState } from 'react';
import SignOutButton from './SignOutButton';
import * as ApiClient from '../Api/ApiClient';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [showOptions, setShowOptions] = useState(false);

  const { data: user } = useQuery("viewInfo", ApiClient.viewInfo);
  const toggleMenu = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative">
      <div
        onClick={toggleMenu}
        className="flex items-center justify-between w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
      >
        Hi, {user?.firstName}
        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </div>
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-gray-700">
          <Link
            to="/setting/your-info"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
          >
            Setting
          </Link>
          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
