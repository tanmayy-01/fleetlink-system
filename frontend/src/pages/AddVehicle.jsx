/**
 * Add Vehicle Page Component
 * Form to add new vehicles to the fleet
 */

import React, { useState } from 'react';
import { Plus, Truck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateForm } from '../utils/helpers';
import { vehicleAPI } from '../services/api';


const AddVehicle = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    capacityKg: '',
    tyres: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Vehicle name must be between 2-100 characters'
    },
    capacityKg: {
      required: true,
      type: 'number',
      min: 1,
      max: 50000,
      message: 'Capacity must be between 1-50,000 kg'
    },
    tyres: {
      required: true,
      type: 'number',
      min: 2,
      max: 18,
      message: 'Number of tyres must be between 2-18'
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success state when form is modified
    if (isSuccess) {
      setIsSuccess(false);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validate form and submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateForm(formData, validationRules);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Prepare data for API
      const vehicleData = {
        name: formData.name.trim(),
        capacityKg: parseInt(formData.capacityKg),
        tyres: parseInt(formData.tyres)
      };
      
      // Submit to API
      const response = await vehicleAPI.addVehicle(vehicleData);
      
      if (response.data.success) {
        toast.success('Vehicle added successfully!');
        setIsSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({ name: '', capacityKg: '', tyres: '' });
          setIsSuccess(false);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to add vehicle');
      
      // Set server errors if available
      if (error.response?.data?.error?.details?.validationErrors) {
        const serverErrors = {};
        error.response.data.error.details.validationErrors.forEach(err => {
          serverErrors[err.path] = err.message;
        });
        setErrors(serverErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setFormData({ name: '', capacityKg: '', tyres: '' });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Plus className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Add New Vehicle</h1>
            <p className="text-secondary-600">Add a new vehicle to your fleet</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg animate-bounce-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-success-600" />
            <p className="text-success-700 font-medium">
              Vehicle added successfully! You can add another vehicle or view all vehicles.
            </p>
          </div>
        </div>
      )}

      {/* Add Vehicle Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Name */}
          <div>
            <label htmlFor="name" className="form-label">
              Vehicle Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter vehicle name (e.g., Truck-001, Van-A1)"
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className="flex items-center space-x-1 form-error">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacityKg" className="form-label">
              Capacity (kg) *
            </label>
            <input
              type="number"
              id="capacityKg"
              name="capacityKg"
              value={formData.capacityKg}
              onChange={handleInputChange}
              className={`form-input ${errors.capacityKg ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter capacity in kilograms"
              min="1"
              max="50000"
              disabled={isSubmitting}
            />
            {errors.capacityKg && (
              <div className="flex items-center space-x-1 form-error">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.capacityKg}</span>
              </div>
            )}
            <p className="text-sm text-secondary-500 mt-1">
              Enter the maximum weight capacity of the vehicle
            </p>
          </div>

          {/* Number of Tyres */}
          <div>
            <label htmlFor="tyres" className="form-label">
              Number of Tyres *
            </label>
            <input
              type="number"
              id="tyres"
              name="tyres"
              value={formData.tyres}
              onChange={handleInputChange}
              className={`form-input ${errors.tyres ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter number of tyres"
              min="2"
              max="18"
              disabled={isSubmitting}
            />
            {errors.tyres && (
              <div className="flex items-center space-x-1 form-error">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.tyres}</span>
              </div>
            )}
            <p className="text-sm text-secondary-500 mt-1">
              Typical values: 2-4 (small vehicles), 6 (trucks), 10+ (heavy vehicles)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding Vehicle...</span>
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="btn-secondary flex-1"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for adding vehicles:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use descriptive names that help identify vehicles easily</li>
          <li>• Ensure capacity values are accurate for proper booking calculations</li>
          <li>• Double-check the number of tyres as it affects vehicle classification</li>
          <li>• All fields are required and will be validated</li>
        </ul>
      </div>
    </div>
  );
};

export default AddVehicle;