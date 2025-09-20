/**
 * Frontend Utility Functions
 * Helper functions used throughout the frontend application
 */

import { format, parseISO, isValid, addHours, isFuture } from 'date-fns';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatPattern - Format pattern (default: 'PPpp')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatPattern = 'PPpp') => {
  try {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return 'Invalid Date';
    
    return format(dateObj, formatPattern);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for input field (ISO format)
 * @param {string|Date} date - Date to format
 * @returns {string} ISO formatted date string
 */
export const formatDateForInput = (date) => {
  try {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Get current date time for input (minimum booking time is 1 hour from now)
 * @returns {string} ISO formatted date string
 */
export const getMinBookingDateTime = () => {
  const oneHourFromNow = addHours(new Date(), 1);
  return formatDateForInput(oneHourFromNow);
};

/**
 * Validate pincode format
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid
 */
export const isValidPincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.trim());
};

/**
 * Validate if date is in future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is in future
 */
export const isDateInFuture = (date) => {
  try {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && isFuture(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * Format capacity with units
 * @param {number} capacity - Capacity in kg
 * @returns {string} Formatted capacity string
 */
export const formatCapacity = (capacity) => {
  if (!capacity || isNaN(capacity)) return 'N/A';
  
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(1)} tons`;
  }
  return `${capacity} kg`;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount || isNaN(amount)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate estimated ride duration (matching backend logic)
 * @param {string} fromPincode - Starting pincode
 * @param {string} toPincode - Destination pincode
 * @returns {number} Duration in hours
 */
export const calculateRideDuration = (fromPincode, toPincode) => {
  try {
    const from = parseInt(fromPincode);
    const to = parseInt(toPincode);
    
    if (isNaN(from) || isNaN(to)) return 2;
    
    const duration = Math.abs(from - to) % 24;
    return Math.max(duration, 1);
  } catch (error) {
    return 2; // Default 2 hours
  }
};

/**
 * Get status badge color class
 * @param {string} status - Status value
 * @returns {string} CSS class for status badge
 */
export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'confirmed':
    case 'completed':
      return 'badge-success';
    case 'in-progress':
      return 'badge-warning';
    case 'maintenance':
    case 'cancelled':
      return 'badge-danger';
    case 'retired':
      return 'badge-secondary';
    default:
      return 'badge-secondary';
  }
};

/**
 * Get vehicle type based on capacity
 * @param {number} capacity - Vehicle capacity in kg
 * @returns {string} Vehicle type
 */
export const getVehicleType = (capacity) => {
  if (!capacity || isNaN(capacity)) return 'Unknown';
  
  if (capacity <= 1000) return 'Small';
  if (capacity <= 5000) return 'Medium';
  if (capacity <= 15000) return 'Large';
  return 'Heavy Duty';
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];
    
    // Required field validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return;
    
    // Minimum length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      return;
    }
    
    // Maximum length validation
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] = `${field} cannot exceed ${rule.maxLength} characters`;
      return;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      errors[field] = rule.message || `${field} format is invalid`;
      return;
    }
    
    // Number validation
    if (rule.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        errors[field] = `${field} must be a valid number`;
        return;
      }
      
      if (rule.min !== undefined && num < rule.min) {
        errors[field] = `${field} must be at least ${rule.min}`;
        return;
      }
      
      if (rule.max !== undefined && num > rule.max) {
        errors[field] = `${field} cannot exceed ${rule.max}`;
        return;
      }
    }
    
    // Custom validation function
    if (rule.validate && typeof rule.validate === 'function') {
      const customError = rule.validate(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if user is on mobile device
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset in pixels
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};