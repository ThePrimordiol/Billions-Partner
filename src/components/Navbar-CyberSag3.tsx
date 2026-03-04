import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Handshake, 
  Zap, 
  Droplets, 
  Paintbrush, 
  Wind, 
  Sparkles,
  CalendarCheck,
  Shield,
  LogIn,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SERVICES, COMPANY } from '@/lib/constants';
import { API } from '@/services/api';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  Sparkles
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status on mount and when location changes
  useEffect(() => {
    const user = API.users.getCurrentUser();
    setCurrentUser(user);
  }, [location]);

  const handleLogout = () => {
    API.users.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Become a Provider', href: '/become-provider' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Handshake className="h-8 w-8 text-blue-400" />
            <span className="text-white font-bold text-xl hidden sm:block">
              {COMPANY.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white bg-white/10' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  location.pathname.startsWith('/services')
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}>
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                {SERVICES.map((service) => {
                  const Icon = iconMap[service.icon] || Zap;
                  return (
                    <DropdownMenuItem key={service.id} asChild>
                      <Link
                        to={`/services/${service.id === 'ac' ? 'ac-repairs' : service.id}`}
                        className="flex items-center cursor-pointer text-gray-200 hover:text-white hover:bg-slate-700"
                      >
                        <Icon className={`mr-2 h-4 w-4 ${service.textColor}`} />
                        {service.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/booking">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </Link>
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">{currentUser.name.split(' ')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                  <DropdownMenuItem className="text-gray-300 cursor-default">
                    <span className="text-sm">Signed in as {currentUser.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="border-gray-500 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            
            <Link to="/admin/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-white bg-white/10' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            
            <div className="px-3 py-2 text-gray-400 text-sm font-medium">
              Services
            </div>
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Zap;
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id === 'ac' ? 'ac-repairs' : service.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block pl-6 pr-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <Icon className={`inline mr-2 h-4 w-4 ${service.textColor}`} />
                  {service.name}
                </Link>
              );
            })}

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 space-y-2">
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </Link>
              
              {currentUser ? (
                <>
                  <div className="px-3 py-2 text-gray-400 text-sm">
                    Signed in as {currentUser.name}
                  </div>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline" 
                    className="w-full border-red-500 text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-gray-500 text-gray-300">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
