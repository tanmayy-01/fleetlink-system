# FleetLink Frontend - Logistics Vehicle Booking System

A modern React frontend application for managing logistics vehicle bookings with a responsive design and intuitive user interface.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Vehicle Management**: Add new vehicles with form validation
- **Smart Search**: Search available vehicles with real-time filtering
- **Booking System**: Book vehicles with confirmation and status tracking
- **Real-time Updates**: Live availability updates and notifications
- **Mobile Responsive**: Optimized for all device sizes
- **Error Handling**: User-friendly error messages and recovery
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

- **Framework**: React 18 with Hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router DOM for navigation
- **HTTP Client**: Axios for API communication
- **Notifications**: React Hot Toast for user feedback
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date utilities

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running backend API (see `/backend/README.md`)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleetlink-system/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🌐 Pages & Components

### Main Pages

1. **Home Page (`/`)**
   - Dashboard with overview and quick actions
   - Navigation to all major features

2. **Add Vehicle (`/add-vehicle`)**
   - Form to add new vehicles to the fleet
   - Validation and error handling
   - Success confirmation

3. **Search & Book (`/search-book`)**
   - Vehicle search with filters
   - Real-time availability checking
   - One-click booking functionality

4. **Booking History (`/bookings`)**
   - View all bookings with filtering
   - Booking status management
   - Customer booking history

5. **Vehicle List (`/vehicles`)**
   - Complete fleet overview
   - Vehicle status management
   - Search and filtering

### Key Components

- **Navbar**: Responsive navigation with active state
- **Footer**: Application footer with links
- **ErrorBoundary**: Error catching and recovery
- **VehicleCard**: Reusable vehicle display component
- **LoadingSpinner**: Loading state indicators
- **ToastNotifications**: User feedback system

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ErrorBoundary.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AddVehicle.jsx
│   │   ├── SearchBooking.jsx
│   │   ├── BookingHistory.jsx
│   │   └── VehicleList.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades for main actions and branding
- **Secondary**: Gray shades for text and backgrounds
- **Success**: Green for positive actions and confirmations
- **Warning**: Yellow/Orange for cautions and pending states
- **Danger**: Red for errors and destructive actions

### Typography
- **Font Family**: Inter for clean, modern readability
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Font Sizes**: Responsive scale from text-xs to text-6xl

### Components
- **Buttons**: Consistent styling with hover and focus states
- **Forms**: Standardized input fields with validation styling
- **Cards**: Clean containers with subtle shadows
- **Badges**: Status indicators with semantic colors

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server
- **URL**: http://localhost:5173
- **Hot Reload**: Automatic page refresh on file changes
- **API Proxy**: Requests to `/api/*` proxied to backend

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags (optional)
VITE_ENABLE_DEBUG=true
VITE_SHOW_LOGS=false
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 475px - Extra small devices
- **sm**: 640px - Small devices (phones)
- **md**: 768px - Medium devices (tablets)
- **lg**: 1024px - Large devices (desktops)
- **xl**: 1280px - Extra large devices

### Mobile-First Approach
- Base styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized performance on slower connections

## 🔄 State Management

### Local State (useState)
- Form data and validation states
- UI states (loading, errors, success)
- Component-specific temporary data

### API State Management
- Axios interceptors for global error handling
- Request/response logging in development
- Automatic retry for failed requests
- Loading state management

## 🛡️ Error Handling

### Error Boundary
- Catches JavaScript errors in component tree
- Displays fallback UI with recovery options
- Logs errors for debugging
- Graceful degradation

### API Error Handling
- Network error detection
- HTTP status code handling
- User-friendly error messages
- Automatic toast notifications

### Form Validation
- Real-time input validation
- Custom validation rules
- Error message display
- Accessibility considerations

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utility functions
- Component rendering tests
- User interaction testing
- API integration tests

### E2E Testing (Recommended)
- Full user journey testing
- Cross-browser compatibility
- Mobile device testing
- Performance testing

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

Generates optimized production files in `dist/` directory:
- Minified JavaScript and CSS
- Asset optimization and compression
- Code splitting for better performance
- Source maps for debugging

### Deployment Options

#### Static Hosting (Netlify, Vercel)
```bash
# Build and deploy
npm run build
# Upload dist/ folder
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

#### Apache/Nginx
Configure server to serve static files and handle client-side routing.

## 🎯 Performance Optimization

### Code Splitting
- Dynamic imports for route-based splitting
- Lazy loading for non-critical components
- Vendor bundle separation

### Asset Optimization
- Image optimization and lazy loading
- CSS purging with Tailwind
- JavaScript minification
- Gzip compression

### Caching Strategy
- Browser caching for static assets
- Service worker for offline functionality
- API response caching

## 🔍 Debugging

### Development Tools
- React DevTools for component inspection
- Network tab for API monitoring
- Console logging in development mode
- Error boundary for error catching

### Common Issues

1. **API Connection Error**
   ```
   Error: Network Error
   ```
   Solution: Check backend server status and CORS configuration.

2. **Build Errors**
   ```
   Error: Failed to resolve import
   ```
   Solution: Check import paths and dependencies.

3. **Styling Issues**
   ```
   Tailwind classes not applying
   ```
   Solution: Verify Tailwind configuration and CSS imports.

## 📋 Usage Examples

### Adding a Vehicle
1. Navigate to "Add Vehicle" page
2. Fill in vehicle details (name, capacity, tyres)
3. Click "Add Vehicle" button
4. Receive confirmation message

### Searching and Booking
1. Go to "Search & Book" page
2. Enter search criteria:
   - Required capacity
   - From/To pincodes
   - Start time
3. Click "Search Available Vehicles"
4. Select vehicle from results
5. Click "Book Now" for instant booking

### Managing Bookings
1. Visit "Bookings" page
2. View all bookings with filters
3. Update booking status as needed
4. Cancel bookings if required

## 🎨 Customization

### Theming
Update `tailwind.config.js` to customize:
- Colors and branding
- Typography scales
- Spacing values
- Component styles

### Component Styling
Modify component classes:
- Use Tailwind utility classes
- Create custom CSS classes if needed
- Maintain consistency across components

## 🤝 Contributing

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add PropTypes or TypeScript for type safety

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit PR with clear description

## 📄 API Integration

### Vehicle API Usage
```javascript
// Add vehicle
await vehicleAPI.addVehicle({
  name: "Truck-001",
  capacityKg: 5000,
  tyres: 6
});

// Search available vehicles
await vehicleAPI.getAvailableVehicles({
  capacityRequired: 1000,
  fromPincode: "110001",
  toPincode: "400001",
  startTime: "2024-01-15T10:00:00Z"
});
```

### Booking API Usage
```javascript
// Create booking
await bookingAPI.createBooking({
  vehicleId: "vehicle_id",
  customerId: "CUST001",
  fromPincode: "110001",
  toPincode: "400001",
  startTime: "2024-01-15T10:00:00Z"
});
```

## 🔧 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - see LICENSE file for details.

---

For backend documentation, see `/backend/README.md`