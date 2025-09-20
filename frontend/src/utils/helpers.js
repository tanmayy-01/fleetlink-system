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