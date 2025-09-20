/**
 * Search & Booking Page Component
 * Comprehensive vehicle search and booking system with enhanced features
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Truck, Clock, CheckCircle2, AlertCircle, Loader2, Star, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { vehicleAPI, bookingAPI } from '../services/api';
import { 
  validateForm, 
  formatCapacity, 
  formatDate, 
  getMinBookingDateTime, 
  getVehicleType,
  formatCurrency,
  calculateRideDuration
} from '../utils/helpers';

const SearchBooking = () => {
  // Search form state
  const [searchData, setSearchData] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: getMinBookingDateTime()
  });
  
  // UI state
  const [searchErrors, setSearchErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingVehicleId, setBookingVehicleId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  // Search validation rules
  const searchValidationRules = {
    capacityRequired: {
      required: true,
      type: 'number',
      min: 1,
      max: 50000,
      message: 'Required capacity must be between 1-50,000 kg'
    },
    fromPincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: 'From pincode must be exactly 6 digits'
    },
    toPincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: 'To pincode must be exactly 6 digits'
    },
    startTime: {
      required: true,
      validate: (value) => {
        const selectedDate = new Date(value);
        const minDate = new Date();
        minDate.setHours(minDate.getHours() + 1); // Minimum 1 hour from now
        
        if (selectedDate <= minDate) {
          return 'Start time must be at least 1 hour from now';
        }
        return null;
      }
    }
  };

  // Update estimated duration when pincodes change
  useEffect(() => {
    if (searchData.fromPincode && searchData.toPincode) {
      const duration = calculateRideDuration(searchData.fromPincode, searchData.toPincode);
      setEstimatedDuration(duration);
    }
  }, [searchData.fromPincode, searchData.toPincode]);

  /**
   * Handle search form input changes
   */
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (searchErrors[name]) {
      setSearchErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear results when search criteria changes
    if (hasSearched) {
      setAvailableVehicles([]);
      setHasSearched(false);
    }
    
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Search for available vehicles
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate search form
    const validation = validateForm(searchData, searchValidationRules);
    
    if (!validation.isValid) {
      setSearchErrors(validation.errors);
      toast.error('Please fix the errors in the search form');
      return;
    }
    
    // Additional validation: check if from and to pincodes are different
    if (searchData.fromPincode === searchData.toPincode) {
      setSearchErrors({ toPincode: 'Destination must be different from pickup location' });
      toast.error('Pickup and destination locations must be different');
      return;
    }
    
    setIsSearching(true);
    setSearchErrors({});
    setAvailableVehicles([]);
    
    try {
      const searchParams = {
        capacityRequired: parseInt(searchData.capacityRequired),
        fromPincode: searchData.fromPincode.trim(),
        toPincode: searchData.toPincode.trim(),
        startTime: new Date(searchData.startTime).toISOString()
      };
      
      const response = await vehicleAPI.getAvailableVehicles(searchParams);
      
      if (response.data.success) {
        setAvailableVehicles(response.data.data);
        setHasSearched(true);
        
        if (response.data.data.length === 0) {
          toast.info('No vehicles available for the selected criteria');
        } else {
          toast.success(`Found ${response.data.data.length} available vehicle(s)`);
        }
      }
      
    } catch (error) {
      console.error('Error searching vehicles:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to search vehicles');
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle vehicle selection for booking preview
   */
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  /**
   * Handle vehicle booking
   */
  const handleBookVehicle = async (vehicle) => {
    // Show booking confirmation
    if (!confirm(`Confirm booking for ${vehicle.name}?\n\nRoute: ${searchData.fromPincode} → ${searchData.toPincode}\nDuration: ${vehicle.estimatedRideDurationHours} hours\nEstimated Cost: ${formatCurrency(calculateBookingCost(vehicle))}`)) {
      return;
    }

    setIsBooking(true);
    setBookingVehicleId(vehicle.id);
    
    try {
      // For demo purposes, using a hardcoded customer ID
      // In a real app, this would come from authentication
      const customerId = `CUST${Date.now().toString().slice(-6)}`;
      
      const bookingData = {
        vehicleId: vehicle.id,
        customerId: customerId,
        fromPincode: searchData.fromPincode.trim(),
        toPincode: searchData.toPincode.trim(),
        startTime: new Date(searchData.startTime).toISOString()
      };
      
      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.data.success) {
        toast.success('Booking created successfully!');
        
        // Remove the booked vehicle from available list
        setAvailableVehicles(prev => 
          prev.filter(v => v.id !== vehicle.id)
        );
        
        // Show booking confirmation details
        const booking = response.data.data;
        setTimeout(() => {
          toast.success(
            `Booking confirmed! ID: ${booking.id.slice(-8).toUpperCase()}`,
            { duration: 6000 }
          );
        }, 1000);

        // Reset selection
        setSelectedVehicle(null);
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      
      if (error.response?.status === 409) {
        toast.error('This vehicle is no longer available. Please search again.');
        // Refresh search results
        handleSearch({ preventDefault: () => {} });
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to create booking');
      }
    } finally {
      setIsBooking(false);
      setBookingVehicleId(null);
    }
  };

  /**
   * Calculate estimated booking cost
   */
  const calculateBookingCost = (vehicle) => {
    const baseRate = 500; // Base rate per hour
    const capacityMultiplier = Math.max(1, vehicle.capacityKg / 1000);
    const distance = Math.abs(parseInt(searchData.toPincode) - parseInt(searchData.fromPincode));
    const distanceMultiplier = Math.max(1, distance / 100);
    
    return Math.round(baseRate * vehicle.estimatedRideDurationHours * capacityMultiplier * distanceMultiplier);
  };

  /**
   * Reset search form
   */
  const resetSearch = () => {
    setSearchData({
      capacityRequired: '',
      fromPincode: '',
      toPincode: '',
      startTime: getMinBookingDateTime()
    });
    setSearchErrors({});
    setAvailableVehicles([]);
    setHasSearched(false);
    setSelectedVehicle(null);
    setEstimatedDuration(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Search className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Search & Book Vehicles</h1>
            <p className="text-secondary-600">Find and book available vehicles for your logistics needs</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">Search Criteria</h2>
          <p className="text-secondary-600 mt-1">Enter your requirements to find available vehicles</p>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Required Capacity */}
            <div>
              <label htmlFor="capacityRequired" className="form-label">
                Required Capacity (kg) *
              </label>
              <input
                type="number"
                id="capacityRequired"
                name="capacityRequired"
                value={searchData.capacityRequired}
                onChange={handleSearchInputChange}
                className={`form-input ${searchErrors.capacityRequired ? 'border-danger-500' : ''}`}
                placeholder="e.g., 1000"
                min="1"
                max="50000"
                disabled={isSearching}
              />
              {searchErrors.capacityRequired && (
                <div className="flex items-center space-x-1 form-error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{searchErrors.capacityRequired}</span>
                </div>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                Minimum weight capacity needed
              </p>
            </div>

            {/* From Pincode */}
            <div>
              <label htmlFor="fromPincode" className="form-label">
                <MapPin className="h-4 w-4 inline mr-1" />
                From Pincode *
              </label>
              <input
                type="text"
                id="fromPincode"
                name="fromPincode"
                value={searchData.fromPincode}
                onChange={handleSearchInputChange}
                className={`form-input ${searchErrors.fromPincode ? 'border-danger-500' : ''}`}
                placeholder="e.g., 110001"
                maxLength="6"
                disabled={isSearching}
              />
              {searchErrors.fromPincode && (
                <div className="flex items-center space-x-1 form-error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{searchErrors.fromPincode}</span>
                </div>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                Pickup location pincode
              </p>
            </div>

            {/* To Pincode */}
            <div>
              <label htmlFor="toPincode" className="form-label">
                <MapPin className="h-4 w-4 inline mr-1" />
                To Pincode *
              </label>
              <input
                type="text"
                id="toPincode"
                name="toPincode"
                value={searchData.toPincode}
                onChange={handleSearchInputChange}
                className={`form-input ${searchErrors.toPincode ? 'border-danger-500' : ''}`}
                placeholder="e.g., 400001"
                maxLength="6"
                disabled={isSearching}
              />
              {searchErrors.toPincode && (
                <div className="flex items-center space-x-1 form-error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{searchErrors.toPincode}</span>
                </div>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                Destination pincode
              </p>
            </div>

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="form-label">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={searchData.startTime}
                onChange={handleSearchInputChange}
                className={`form-input ${searchErrors.startTime ? 'border-danger-500' : ''}`}
                min={getMinBookingDateTime()}
                disabled={isSearching}
              />
              {searchErrors.startTime && (
                <div className="flex items-center space-x-1 form-error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{searchErrors.startTime}</span>
                </div>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                When do you need the vehicle?
              </p>
            </div>
          </div>

          {/* Duration Preview */}
          {estimatedDuration > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-primary-800">Estimated Trip Duration</span>
              </div>
              <p className="text-primary-700">
                Based on your route ({searchData.fromPincode} → {searchData.toPincode}), 
                the estimated duration is <strong>{estimatedDuration} hours</strong>.
              </p>
            </div>
          )}

          {/* Search Actions */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search Available Vehicles</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={resetSearch}
              disabled={isSearching}
              className="btn-secondary px-8 py-3"
            >
              Reset Search
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">
                Available Vehicles ({availableVehicles.length})
              </h2>
              {availableVehicles.length > 0 && (
                <div className="text-sm text-secondary-600">
                  Route: {searchData.fromPincode} → {searchData.toPincode}
                </div>
              )}
            </div>
          </div>
          
          {availableVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-700 mb-2">
                No vehicles available
              </h3>
              <p className="text-secondary-500 mb-6">
                Try adjusting your search criteria or selecting a different time slot.
              </p>
              <div className="space-y-2 text-sm text-secondary-600">
                <p>💡 <strong>Tips:</strong></p>
                <ul className="text-left max-w-md mx-auto space-y-1">
                  <li>• Try reducing the required capacity</li>
                  <li>• Select a different time slot</li>
                  <li>• Check if vehicles are available for different routes</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  searchData={searchData}
                  onSelect={() => handleVehicleSelect(vehicle)}
                  onBook={handleBookVehicle}
                  isBooking={isBooking && bookingVehicleId === vehicle.id}
                  disabled={isBooking}
                  isSelected={selectedVehicle?.id === vehicle.id}
                  estimatedCost={calculateBookingCost(vehicle)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <div className="card border-2 border-primary-200 bg-primary-50">
          <div className="card-header border-primary-200">
            <h2 className="text-xl font-semibold text-primary-900">Selected Vehicle Details</h2>
          </div>
          
          <VehicleDetailsPanel 
            vehicle={selectedVehicle}
            searchData={searchData}
            onBook={handleBookVehicle}
            isBooking={isBooking && bookingVehicleId === selectedVehicle.id}
            estimatedCost={calculateBookingCost(selectedVehicle)}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Vehicle Card Component
 */
const VehicleCard = ({ vehicle, searchData, onSelect, onBook, isBooking, disabled, isSelected, estimatedCost }) => {
  const vehicleType = getVehicleType(vehicle.capacityKg);
  const formattedCapacity = formatCapacity(vehicle.capacityKg);

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-medium transition-all duration-200 cursor-pointer
      ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}
      ${disabled ? 'opacity-75' : ''}
    `}>
      {/* Vehicle Header */}
      <div className="flex items-start justify-between mb-4" onClick={onSelect}>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-1">
            {vehicle.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {vehicleType}
            </span>
            {vehicle.capacityKg >= parseInt(searchData.capacityRequired) * 1.5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                <Star className="h-3 w-3 mr-1" />
                High Capacity
              </span>
            )}
          </div>
        </div>
        <Truck className="h-8 w-8 text-primary-600" />
      </div>

      {/* Vehicle Details */}
      <div className="space-y-3 mb-6" onClick={onSelect}>
        <div className="flex justify-between">
          <span className="text-secondary-600">Capacity:</span>
          <span className="font-medium text-secondary-900">{formattedCapacity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Tyres:</span>
          <span className="font-medium text-secondary-900">{vehicle.tyres}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Duration:</span>
          <span className="font-medium text-secondary-900 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {vehicle.estimatedRideDurationHours}h
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Est. Cost:</span>
          <span className="font-semibold text-primary-600">{formatCurrency(estimatedCost)}</span>
        </div>
      </div>

      {/* Route Information */}
      <div className="bg-secondary-50 rounded-lg p-3 mb-6" onClick={onSelect}>
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-secondary-500" />
            <span className="text-secondary-600">Route:</span>
          </div>
          <span className="font-medium">{searchData.fromPincode} → {searchData.toPincode}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-secondary-500" />
          <span className="text-secondary-600">Start:</span>
          <span className="font-medium">{formatDate(searchData.startTime, 'PP p')}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onSelect}
          className={`w-full btn-secondary ${isSelected ? 'bg-primary-100 border-primary-300 text-primary-700' : ''}`}
          disabled={disabled}
        >
          {isSelected ? 'Selected' : 'View Details'}
        </button>
        
        <button
          onClick={() => onBook(vehicle)}
          disabled={disabled}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Booking...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Book Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Vehicle Details Panel Component
 */
const VehicleDetailsPanel = ({ vehicle, searchData, onBook, isBooking, estimatedCost }) => {
  const vehicleType = getVehicleType(vehicle.capacityKg);
  const formattedCapacity = formatCapacity(vehicle.capacityKg);
  const endTime = new Date(new Date(searchData.startTime).getTime() + (vehicle.estimatedRideDurationHours * 60 * 60 * 1000));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Vehicle Information */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Vehicle Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Truck className="h-12 w-12 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-semibold text-secondary-900">{vehicle.name}</h4>
              <p className="text-secondary-600">{vehicleType} Vehicle</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-secondary-600 text-sm mb-1">Capacity</div>
              <div className="font-semibold text-secondary-900">{formattedCapacity}</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-secondary-600 text-sm mb-1">Tyres</div>
              <div className="font-semibold text-secondary-900">{vehicle.tyres}</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-secondary-600 text-sm mb-1">Duration</div>
              <div className="font-semibold text-secondary-900">{vehicle.estimatedRideDurationHours} hours</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-secondary-600 text-sm mb-1">Total Cost</div>
              <div className="font-semibold text-primary-600">{formatCurrency(estimatedCost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-secondary-900 mb-3">Trip Details</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-secondary-500" />
                <div>
                  <div className="text-sm text-secondary-600">Route</div>
                  <div className="font-medium">{searchData.fromPincode} → {searchData.toPincode}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-secondary-500" />
                <div>
                  <div className="text-sm text-secondary-600">Start Time</div>
                  <div className="font-medium">{formatDate(searchData.startTime, 'PPpp')}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-secondary-500" />
                <div>
                  <div className="text-sm text-secondary-600">Expected End Time</div>
                  <div className="font-medium">{formatDate(endTime, 'PPpp')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-secondary-900 mb-3">Cost Breakdown</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Base rate ({vehicle.estimatedRideDurationHours}h):</span>
                <span>₹{500 * vehicle.estimatedRideDurationHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Capacity factor:</span>
                <span>×{Math.max(1, vehicle.capacityKg / 1000).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Distance factor:</span>
                <span>×{Math.max(1, Math.abs(parseInt(searchData.toPincode) - parseInt(searchData.fromPincode)) / 100).toFixed(1)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary-600">{formatCurrency(estimatedCost)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onBook(vehicle)}
            disabled={isBooking}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
          >
            {isBooking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Booking...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirm Booking</span>
              </>
            )}
          </button>
          
          <div className="text-xs text-secondary-500 text-center">
            By clicking "Confirm Booking", you agree to our terms and conditions.
            You will receive a confirmation with booking details.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBooking;