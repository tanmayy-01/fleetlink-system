/**
 * Footer Component
 * Application footer with links and information
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-100 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <Truck className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold text-white">FleetLink</span>
            </Link>
            
            <p className="text-secondary-300 mb-6 max-w-md">
              Your comprehensive logistics vehicle booking system. 
              Streamline your fleet management with real-time availability, 
              smart booking, and efficient route planning.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-secondary-300">
                <Mail className="h-4 w-4" />
                <span>support@fleetlink.com</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-300">
                <MapPin className="h-4 w-4" />
                <span>123 Logistics Ave, Transport City, TC 12345</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/add-vehicle" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Add Vehicle
                </Link>
              </li>
              <li>
                <Link 
                  to="/search-book" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Search & Book
                </Link>
              </li>
              <li>
                <Link 
                  to="/bookings" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Bookings
                </Link>
              </li>
              <li>
                <Link 
                  to="/vehicles" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                >
                  All Vehicles
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-secondary-300">Real-time Availability</li>
              <li className="text-secondary-300">Fleet Management</li>
              <li className="text-secondary-300">Route Optimization</li>
              <li className="text-secondary-300">Booking Tracking</li>
              <li className="text-secondary-300">Cost Calculation</li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm">
              © {currentYear} FleetLink. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <button className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </button>
              <button className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;