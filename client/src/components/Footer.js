import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-12 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Ramadan Kareem
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your complete companion for a blessed Ramadan. Track prayers, read Quran, make dua, and enhance your worship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/prayer-times" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Prayer Times
                </Link>
              </li>
              <li>
                <Link to="/quran" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Holy Quran
                </Link>
              </li>
              <li>
                <Link to="/dua" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Duas
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Learn Islam
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  About Ramadan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Fasting Rules
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Zakat Calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-2xl">
                <FaGithub />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-2xl">
                <FaFacebook />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Made with <FaHeart className="inline text-red-500" /> for the Ummah by Suhana & Mahek.
            </p>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} Ramadan Kareem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
