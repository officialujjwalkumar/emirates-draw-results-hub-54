
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="https://emiratesdraw.com/images/logo.png" alt="Emirates Draw" className="w-12 h-12 mr-3" />
              <span className="text-xl font-bold dark:text-white">Emirates Draw</span>
            </Link>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  to="/" 
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition relative pb-1 ${
                    isActive('/') ? 'font-semibold text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:bottom-0 after:left-0' : ''
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/mega7" 
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition relative pb-1 ${
                    isActive('/mega7') ? 'font-semibold text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:bottom-0 after:left-0' : ''
                  }`}
                >
                  Mega7
                </Link>
              </li>
              <li>
                <Link 
                  to="/easy6" 
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition relative pb-1 ${
                    isActive('/easy6') ? 'font-semibold text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:bottom-0 after:left-0' : ''
                  }`}
                >
                  Easy6
                </Link>
              </li>
              <li>
                <Link 
                  to="/fast5" 
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition relative pb-1 ${
                    isActive('/fast5') ? 'font-semibold text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:bottom-0 after:left-0' : ''
                  }`}
                >
                  Fast5
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition relative pb-1 ${
                    isActive('/blog') ? 'font-semibold text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:bottom-0 after:left-0' : ''
                  }`}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <button
              className="md:hidden flex flex-col justify-between w-6 h-5 group"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`block w-full h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-gray-700 dark:bg-gray-300 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-60 mt-4' : 'max-h-0'}`}>
          <ul className="flex flex-col space-y-4 pb-4">
            <li>
              <Link 
                to="/" 
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/mega7" 
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/mega7') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
                onClick={closeMobileMenu}
              >
                Mega7
              </Link>
            </li>
            <li>
              <Link 
                to="/easy6" 
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/easy6') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
                onClick={closeMobileMenu}
              >
                Easy6
              </Link>
            </li>
            <li>
              <Link 
                to="/fast5" 
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/fast5') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
                onClick={closeMobileMenu}
              >
                Fast5
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ${isActive('/blog') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
