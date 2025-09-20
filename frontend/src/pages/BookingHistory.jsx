/**
 * Booking History Page Component
 * Displays all bookings with filtering and management capabilities
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User,
  Truck,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services/api';
import { 
  formatDate, 
  formatCapacity, 
  formatCurrency,
  getStatusBadgeClass, 
  debounce 
} from '../utils/helpers';

const BookingHistory = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    fromDate: '',
    toDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false
  });
  const [updating, setUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings with debounced search
  const fetchBookings = debounce(async (page = 1, searchFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 10,
        ...(searchFilters.status && { status: searchFilters.status }),
        ...(searchFilters.fromDate && { fromDate: searchFilters.fromDate }),
        ...(searchFilters.toDate && { toDate: searchFilters.toDate })
      };

      const response = await bookingAPI.getAllBookings(params);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Filter by search term locally (for customer ID search)
        let filteredBookings = data.bookings;
        if (searchFilters.search) {
          filteredBookings = data.bookings.filter(booking =>
            booking.customerId.toLowerCase().includes(searchFilters.search.toLowerCase()) ||
            booking.vehicleId?.name?.toLowerCase().includes(searchFilters.search.toLowerCase())
          );
        }
        
        setBookings(filteredBookings);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to fetch bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, 500);

  // Load bookings on component mount and filter changes
  useEffect(() => {
    fetchBookings(1, filters);
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
      fetchBookings(page, filters);
    }
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      fromDate: '',
      toDate: ''
    });
  };

  /**
   * Refresh booking list
   */
  const handleRefresh = () => {
    fetchBookings(pagination.currentPage, filters);
    toast.success('Booking list refreshed');
  };

  /**
   * Update booking status
   */
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdating(true);
    
    try {
      const response = await bookingAPI.updateBookingStatus(bookingId, newStatus);
      
      if (response.data.success) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ));
        
        toast.success(`Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Cancel booking
   */
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setUpdating(true);
    
    try {
      const response = await bookingAPI.cancelBooking(bookingId);
      
      if (response.data.success) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        
        toast.success('Booking cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to cancel booking');
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
            <Calendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Booking History</h1>
            <p className="text-secondary-600">
              {pagination.totalBookings > 0 
                ? `Showing ${bookings.length} of ${pagination.totalBookings} bookings`
                : 'No bookings found'
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
          {/* Search */}
          <div>
            <label className="form-label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Customer ID or Vehicle..."
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
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* From date */}
          <div>
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* To date */}
          <div>
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
              className="form-input"
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
          <span className="ml-3 text-secondary-600">Loading bookings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-danger-50 border-danger-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-danger-600" />
            <div>
              <h3 className="font-medium text-danger-800">Error Loading Bookings</h3>
              <p className="text-danger-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && (
        <>
          {bookings.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-700 mb-2">
                No bookings found
              </h3>
              <p className="text-secondary-500">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters or search criteria.'
                  : 'No bookings have been made yet.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                  onCancel={handleCancelBooking}
                  onViewDetails={(booking) => setSelectedBooking(booking)}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancelBooking}
          updating={updating}
        />
      )}
    </div>
  );
};

/**
 * Booking Card Component
 */
const BookingCard = ({ booking, onStatusUpdate, onCancel, onViewDetails, updating }) => {
  return (
    <div className="card hover:shadow-medium transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        {/* Booking Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer & Vehicle */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">Customer</span>
            </div>
            <p className="font-medium text-secondary-900">{booking.customerId}</p>
            
            <div className="flex items-center space-x-2 mt-2">
              <Truck className="h-4 w-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">Vehicle</span>
            </div>
            <p className="font-medium text-secondary-900">
              {booking.vehicleId?.name || 'Vehicle not found'}
            </p>
          </div>

          {/* Route & Time */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">Route</span>
            </div>
            <p className="font-medium text-secondary-900">
              {booking.fromPincode} → {booking.toPincode}
            </p>
            
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="h-4 w-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">Duration</span>
            </div>
            <p className="font-medium text-secondary-900">
              {booking.estimatedRideDurationHours}h
            </p>
          </div>

          {/* Status & Cost */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-secondary-600">Status</span>
            </div>
            <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
            
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-secondary-600">Cost</span>
            </div>
            <p className="font-medium text-secondary-900">
              {formatCurrency(booking.totalCost)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 lg:ml-6">
          <button
            onClick={() => onViewDetails(booking)}
            className="btn-secondary text-sm px-4 py-2"
          >
            View Details
          </button>
          
          {booking.status === 'confirmed' && (
            <div className="flex space-x-2">
              <select
                onChange={(e) => onStatusUpdate(booking.id, e.target.value)}
                disabled={updating}
                className="text-xs border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                defaultValue=""
              >
                <option value="" disabled>Change Status</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <button
                onClick={() => onCancel(booking.id)}
                disabled={updating}
                className="btn-danger text-xs px-3 py-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking ID and Date */}
      <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-between items-center text-sm text-secondary-500">
        <span>ID: {booking.id.slice(-8).toUpperCase()}</span>
        <span>Created: {formatDate(booking.createdAt, 'PP')}</span>
      </div>
    </div>
  );
};

/**
 * Booking Details Modal Component
 */
const BookingDetailsModal = ({ booking, onClose, onStatusUpdate, onCancel, updating }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-2xl font-semibold text-secondary-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Booking Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-secondary-900 mb-3">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Booking ID:</span>
                  <span className="font-medium">{booking.id.slice(-12).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Customer ID:</span>
                  <span className="font-medium">{booking.customerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Status:</span>
                  <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(booking.totalCost)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-secondary-900 mb-3">Vehicle Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Vehicle Name:</span>
                  <span className="font-medium">{booking.vehicleId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Capacity:</span>
                  <span className="font-medium">
                    {booking.vehicleId?.capacityKg ? formatCapacity(booking.vehicleId.capacityKg) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tyres:</span>
                  <span className="font-medium">{booking.vehicleId?.tyres || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Vehicle Status:</span>
                  <span className={`badge ${getStatusBadgeClass(booking.vehicleId?.status)}`}>
                    {booking.vehicleId?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div>
            <h3 className="font-medium text-secondary-900 mb-3">Route & Timing</h3>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">Route</span>
                  </div>
                  <p className="font-medium text-secondary-900">
                    {booking.fromPincode} → {booking.toPincode}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">Duration</span>
                  </div>
                  <p className="font-medium text-secondary-900">
                    {booking.estimatedRideDurationHours} hours
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-sm text-secondary-600">Start Time:</span>
                  <p className="font-medium text-secondary-900">
                    {formatDate(booking.startTime, 'PPpp')}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-secondary-600">End Time:</span>
                  <p className="font-medium text-secondary-900">
                    {formatDate(booking.endTime, 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3 className="font-medium text-secondary-900 mb-3">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary-600">Created:</span>
                <p className="font-medium text-secondary-900">
                  {formatDate(booking.createdAt, 'PPpp')}
                </p>
              </div>
              
              <div>
                <span className="text-secondary-600">Last Updated:</span>
                <p className="font-medium text-secondary-900">
                  {formatDate(booking.updatedAt, 'PPpp')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200">
          {booking.status === 'confirmed' && (
            <>
              <select
                onChange={(e) => {
                  onStatusUpdate(booking.id, e.target.value);
                  onClose();
                }}
                disabled={updating}
                className="btn-secondary"
                defaultValue=""
              >
                <option value="" disabled>Update Status</option>
                <option value="in-progress">Mark In Progress</option>
                <option value="completed">Mark Completed</option>
              </select>
              
              <button
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
                disabled={updating}
                className="btn-danger"
              >
                Cancel Booking
              </button>
            </>
          )}
          
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;