import { Toaster } from 'react-hot-toast';
import './App.css'
import Navbar from './components/Navbar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import AddVehicle from './pages/AddVehicle';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />

             {/* Vehicle Management */}
            <Route path="/add-vehicle" element={<AddVehicle />} />
            {/* <Route path="/vehicles" element={<VehicleList />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-secondary-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-secondary-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
        <button
          onClick={() => window.history.back()}
          className="btn-secondary w-full sm:w-auto"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary w-full sm:w-auto"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default App;
