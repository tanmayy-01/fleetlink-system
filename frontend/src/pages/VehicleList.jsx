/**
 * Vehicle List Page Component
 * Displays all vehicles with filtering and search capabilities
 */

import React, { useState, useEffect } from 'react';
import { 
  List, 
  Search, 
  Filter, 
  Truck, 
  Edit, 
  Eye, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { vehicleAPI } from '../services/api';
import { 
  formatCapacity, 
  getVehicleType, 
  getStatusBadgeClass, 
  debounce 
} from '../utils/helpers';

const VehicleList = () => {
  // State management
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minCapacity: '',
    maxCapacity: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0,
    hasNext: false,
    hasPrev: false
  });
  const [updating, setUpdating] = useState(false);

  // Fetch vehicles with debounced search
  const fetchVehicles = debounce(async (page = 1, searchFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 12,
        ...(searchFilters.status && { status: searchFilters.status }),
        ...(searchFilters.minCapacity && { minCapacity: parseInt(searchFilters.minCapacity) }),
        ...(searchFilters.maxCapacity && { maxCapacity: parseInt(searchFilters.maxCapacity) })
      };

      const response = await vehicleAPI.getAllVehicles(params);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Filter by search term locally (for name search)
        let filteredVehicles = data.vehicles;
        if (searchFilters.search) {
          filteredVehicles = data.vehicles.filter(vehicle =>
            vehicle.name.toLowerCase().includes(searchFilters.search.toLowerCase())
          );
        }
        
        setVehicles(filteredVehicles);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error.message || 'Failed to fetch vehicles');
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, 500);

  // Load vehicles on component mount and filter changes
  useEffect(() => {
    fetchVehicles(1, filters);
  }, [filters]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchVehicles(page, filters);
    }
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      minCapacity: '',
      maxCapacity: ''
    });
  };

  /**
   * Refresh vehicle list
   */
  const handleRefresh = () => {
    fetchVehicles(pagination.currentPage, filters);
    toast.success('Vehicle list refreshed');
  };

  /**
   * Update vehicle status
   */
  const handleStatusUpdate = async (vehicleId, newStatus) => {
    setUpdating(true);
    
    try {
      const response = await vehicleAPI.updateVehicleStatus(vehicleId, newStatus);
      
      if (response.data.success) {
        // Update vehicle in local state
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === vehicleId 
            ? { ...vehicle, status: newStatus }
            : vehicle
        ));
        
        toast.success(`Vehicle status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast.error('Failed to update vehicle status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <List className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">All Vehicles</h1>
            <p className="text-secondary-600">
              {pagination.totalVehicles > 0 
                ? `Showing ${vehicles.length} of ${pagination.totalVehicles} vehicles`
                : 'No vehicles found'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-secondary-600" />
          <h2 className="text-lg font-medium text-secondary-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by name */}
          <div>
            <label className="form-label">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Vehicle name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          {/* Min capacity */}
          <div>
            <label className="form-label">Min Capacity (kg)</label>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          {/* Max capacity */}
          <div>
            <label className="form-label">Max Capacity (kg)</label>
            <input
              type="number"
              placeholder="e.g., 10000"
              value={filters.maxCapacity}
              onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-3 text-secondary-600">Loading vehicles...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-danger-50 border-danger-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-danger-600" />
            <div>
              <h3 className="font-medium text-danger-800">Error Loading Vehicles</h3>
              <p className="text-danger-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && (
        <>
          {vehicles.length === 0 ? (
            <div className="card text-center py-12">
              <Truck className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-700 mb-2">
                No vehicles found
              </h3>
              <p className="text-secondary-500">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters or search criteria.'
                  : 'Start by adding some vehicles to your fleet.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onStatusUpdate={handleStatusUpdate}
                  updating={updating}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev || loading}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext || loading}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Vehicle Card Component
 */
const VehicleCard = ({ vehicle, onStatusUpdate, updating }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card hover:shadow-medium transition-all duration-200">
      {/* Vehicle Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900 truncate mb-1">
            {vehicle.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`badge ${getStatusBadgeClass(vehicle.status)}`}>
              {vehicle.status}
            </span>
            <span className="text-sm text-secondary-500">
              {getVehicleType(vehicle.capacityKg)}
            </span>
          </div>
        </div>
        <Truck className="h-8 w-8 text-primary-600 flex-shrink-0" />
      </div>

      {/* Vehicle Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Capacity:</span>
          <span className="font-medium text-secondary-900">
            {formatCapacity(vehicle.capacityKg)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Tyres:</span>
          <span className="font-medium text-secondary-900">{vehicle.tyres}</span>
        </div>

        {showDetails && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-600">Created:</span>
              <span className="font-medium text-secondary-900">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-secondary-600">Updated:</span>
              <span className="font-medium text-secondary-900">
                {new Date(vehicle.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full btn-secondary flex items-center justify-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
        </button>

        {/* Status Update Dropdown */}
        <div className="flex space-x-2">
          <select
            value={vehicle.status}
            onChange={(e) => onStatusUpdate(vehicle.id, e.target.value)}
            disabled={updating}
            className="flex-1 text-sm border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          
          <button
            onClick={() => onStatusUpdate(vehicle.id, vehicle.status)}
            disabled={updating}
            className="btn-primary px-3 py-1 text-sm flex items-center space-x-1"
          >
            <Edit className="h-3 w-3" />
            <span>Update</span>
          </button>
        </div>
      </div>

      {/* Vehicle ID for reference */}
      <div className="mt-3 pt-3 border-t border-secondary-200">
        <div className="text-xs text-secondary-500">
          ID: {vehicle.id.slice(-8).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default VehicleList;