/**
 * Home Page Component
 * Landing page with overview and quick actions
 */

import { Link } from 'react-router-dom';
import { 
  Truck, 
  Plus, 
  Search, 
  Calendar, 
  BarChart3, 
  Clock, 
  MapPin,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-primary-50 to-blue-100 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600 p-4 rounded-2xl">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Welcome to FleetLink
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive logistics vehicle booking system. Manage your fleet, 
            check availability, and book vehicles with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search-book" className="btn-primary px-8 py-3 text-lg">
              <Search className="h-5 w-5 mr-2" />
              Search & Book Vehicles
            </Link>
            <Link to="/add-vehicle" className="btn-secondary px-8 py-3 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add New Vehicle
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Plus className="h-8 w-8" />}
          title="Add Vehicles"
          description="Easily add new vehicles to your fleet with comprehensive details and validation."
          link="/add-vehicle"
          linkText="Add Vehicle"
          color="bg-success-100 text-success-600"
        />
        
        <FeatureCard
          icon={<Search className="h-8 w-8" />}
          title="Smart Search"
          description="Find available vehicles based on capacity, route, and time requirements."
          link="/search-book"
          linkText="Search Now"
          color="bg-primary-100 text-primary-600"
        />
        
        <FeatureCard
          icon={<Calendar className="h-8 w-8" />}
          title="Manage Bookings"
          description="View, track, and manage all your vehicle bookings in one place."
          link="/bookings"
          linkText="View Bookings"
          color="bg-warning-100 text-warning-600"
        />
      </div>

      {/* Key Features Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-semibold text-secondary-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-primary-600" />
            Key Features
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KeyFeature
            icon={<Clock className="h-5 w-5" />}
            title="Real-time Availability"
            description="Check vehicle availability with accurate time overlap detection"
          />
          
          <KeyFeature
            icon={<MapPin className="h-5 w-5" />}
            title="Route-based Booking"
            description="Book vehicles based on pickup and destination locations"
          />
          
          <KeyFeature
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Instant Confirmation"
            description="Get immediate booking confirmations with detailed information"
          />
          
          <KeyFeature
            icon={<Truck className="h-5 w-5" />}
            title="Fleet Management"
            description="Comprehensive vehicle management with status tracking"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-semibold text-secondary-900">
            How It Works
          </h2>
        </div>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Add Your Vehicles"
            description="Start by adding your fleet vehicles with capacity, type, and other details."
            icon={<Plus className="h-5 w-5" />}
          />
          
          <StepCard
            step={2}
            title="Search Available Options"
            description="Enter your requirements - capacity, route, and timing to find suitable vehicles."
            icon={<Search className="h-5 w-5" />}
          />
          
          <StepCard
            step={3}
            title="Book Instantly"
            description="Select your preferred vehicle and create a booking with instant confirmation."
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Quick Stats Section (Optional - for demonstration) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Fleet Vehicles"
          value="24"
          subtitle="Active vehicles"
          color="bg-primary-50 text-primary-600"
        />
        
        <StatCard
          title="Total Bookings"
          value="156"
          subtitle="Successful bookings"
          color="bg-success-50 text-success-600"
        />
        
        <StatCard
          title="Avg. Duration"
          value="4.5h"
          subtitle="Per booking"
          color="bg-warning-50 text-warning-600"
        />
      </div>
    </div>
  );
};

/**
 * Feature Card Component
 */
const FeatureCard = ({ icon, title, description, link, linkText, color }) => (
  <div className="card hover:shadow-medium transition-shadow duration-200">
    <div className={`inline-flex p-3 rounded-lg ${color} mb-4`}>
      {icon}
    </div>
    
    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
      {title}
    </h3>
    
    <p className="text-secondary-600 mb-4">
      {description}
    </p>
    
    <Link to={link} className="btn-primary w-full">
      {linkText}
    </Link>
  </div>
);

/**
 * Key Feature Component
 */
const KeyFeature = ({ icon, title, description }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-primary-100 p-2 rounded-lg text-primary-600 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-secondary-900 mb-1">{title}</h4>
      <p className="text-secondary-600 text-sm">{description}</p>
    </div>
  </div>
);

/**
 * Step Card Component
 */
const StepCard = ({ step, title, description, icon }) => (
  <div className="flex items-start space-x-4">
    <div className="flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full font-semibold flex-shrink-0">
      {step}
    </div>
    
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-2">
        <div className="text-primary-600">
          {icon}
        </div>
        <h4 className="font-semibold text-secondary-900">{title}</h4>
      </div>
      <p className="text-secondary-600">{description}</p>
    </div>
  </div>
);

/**
 * Stat Card Component
 */
const StatCard = ({ title, value, subtitle, color }) => (
  <div className="card text-center">
    <div className={`inline-flex p-3 rounded-lg ${color} mb-3`}>
      <BarChart3 className="h-6 w-6" />
    </div>
    <h3 className="text-2xl font-bold text-secondary-900 mb-1">{value}</h3>
    <p className="text-secondary-600 text-sm font-medium">{title}</p>
    <p className="text-secondary-500 text-xs">{subtitle}</p>
  </div>
);

export default Home;