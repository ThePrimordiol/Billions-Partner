import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Booking from '@/pages/Booking';
import BecomeProvider from '@/pages/BecomeProvider';
import HowItWorks from '@/pages/HowItWorks';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PaymentSuccess from '@/pages/PaymentSuccess';

// Service Pages
import Electrical from '@/pages/services/Electrical';
import Plumbing from '@/pages/services/Plumbing';
import Painting from '@/pages/services/Painting';
import ACRepairs from '@/pages/services/ACRepairs';
import Cleaning from '@/pages/services/Cleaning';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProviders from '@/pages/admin/AdminProviders';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminSettings from '@/pages/admin/AdminSettings';

// Components
import ChatWidget from '@/components/ChatWidget';

// Auth Guard Component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
      const sessionExpiry = localStorage.getItem('adminSessionExpiry');
      
      if (isAuth && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminSessionExpiry');
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          {/* Service Routes */}
          <Route path="/services/electrical" element={<Electrical />} />
          <Route path="/services/plumbing" element={<Plumbing />} />
          <Route path="/services/painting" element={<Painting />} />
          <Route path="/services/ac-repairs" element={<ACRepairs />} />
          <Route path="/services/cleaning" element={<Cleaning />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } />
          <Route path="/admin/providers" element={
            <AdminGuard>
              <AdminProviders />
            </AdminGuard>
          } />
          <Route path="/admin/bookings" element={
            <AdminGuard>
              <AdminBookings />
            </AdminGuard>
          } />
          <Route path="/admin/transactions" element={
            <AdminGuard>
              <AdminTransactions />
            </AdminGuard>
          } />
          <Route path="/admin/settings" element={
            <AdminGuard>
              <AdminSettings />
            </AdminGuard>
          } />
          
          {/* Redirect old admin paths */}
          <Route path="/admin-login.html" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin-dashboard.html" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Chat Widget - Available on all pages */}
        <ChatWidget />
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
