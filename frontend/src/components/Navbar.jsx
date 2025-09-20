/**
 * Navbar Component
 * Navigation bar with responsive design and active link highlighting
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Truck, 
  Menu, 
  X, 
  Plus, 
  Search, 
  Calendar, 
  List 
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: Truck },
    { path: '/add-vehicle', label: 'Add Vehicle', icon: Plus },
    { path: '/search-book', label: 'Search & Book', icon: Search },
    { path: '/bookings', label: 'Bookings', icon: Calendar },
    { path: '/vehicles', label: 'All Vehicles', icon: List },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-medium border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors duration-200"
            onClick={closeMenu}
          >
            <Truck className="h-8 w-8" />
            <span className="text-xl font-bold">FleetLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 animate-slide-up">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600' 
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;