/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:1234/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and log requests
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    
   
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
  
    
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`HTTP ${status}:`, data);
      
      // Customize error messages based on status code
      switch (status) {
        case 400:
          error.message = data.error?.message || 'Invalid request data';
          break;
        case 401:
          error.message = 'Authentication required';
          break;
        case 403:
          error.message = 'Access denied';
          break;
        case 404:
          error.message = 'Resource not found';
          break;
        case 409:
          error.message = data.error?.message || 'Conflict occurred';
          break;
        case 422:
          error.message = 'Validation failed';
          break;
        case 429:
          error.message = 'Too many requests. Please try again later';
          break;
        case 500:
          error.message = 'Internal server error';
          break;
        default:
          error.message = data.error?.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your internet connection';
    } else {
      // Other error
      error.message = 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Vehicle API methods
 */
export const vehicleAPI = {
  /**
   * Add a new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise} API response
   */
  addVehicle: (vehicleData) => {
    return api.post('/vehicles', vehicleData);
  },
  
  /**
   * Get available vehicles
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} API response
   */
  getAvailableVehicles: (searchParams) => {
    return api.get('/vehicles/available', { params: searchParams });
  },
  
  /**
   * Get all vehicles
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAllVehicles: (params = {}) => {
    return api.get('/vehicles', { params });
  },
  
  /**
   * Get vehicle by ID
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} API response
   */
  getVehicleById: (vehicleId) => {
    return api.get(`/vehicles/${vehicleId}`);
  },
  
  /**
   * Update vehicle status
   * @param {string} vehicleId - Vehicle ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  updateVehicleStatus: (vehicleId, status) => {
    return api.patch(`/vehicles/${vehicleId}/status`, { status });
  },
};

/**
 * Booking API methods
 */
export const bookingAPI = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} API response
   */
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData);
  },
  
  /**
   * Get all bookings
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAllBookings: (params = {}) => {
    return api.get('/bookings', { params });
  },
  
  /**
   * Get booking by ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise} API response
   */
  getBookingById: (bookingId) => {
    return api.get(`/bookings/${bookingId}`);
  },
  
  /**
   * Get customer bookings
   * @param {string} customerId - Customer ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getCustomerBookings: (customerId, params = {}) => {
    return api.get(`/bookings/customer/${customerId}`, { params });
  },
  
  /**
   * Update booking status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  updateBookingStatus: (bookingId, status) => {
    return api.patch(`/bookings/${bookingId}/status`, { status });
  },
  
  /**
   * Cancel booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise} API response
   */
  cancelBooking: (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
  },
};

/**
 * Utility function to handle API errors
 * @param {Error} error - API error
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Utility function to check if response is successful
 * @param {Object} response - API response
 * @returns {boolean} Whether response is successful
 */
export const isSuccessResponse = (response) => {
  return response.data && response.data.success === true;
};

export default api;