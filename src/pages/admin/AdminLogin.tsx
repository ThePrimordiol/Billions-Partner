import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { API } from '@/services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Check if already logged in
  useEffect(() => {
    if (API.auth.checkSession()) {
      navigate('/admin/dashboard');
    }
    
    // Check lock status
    const lockData = localStorage.getItem('adminLockData');
    if (lockData) {
      const { lockUntil } = JSON.parse(lockData);
      if (lockUntil > Date.now()) {
        setIsLocked(true);
        setLockTime(Math.ceil((lockUntil - Date.now()) / 60000));
      } else {
        localStorage.removeItem('adminLockData');
      }
    }
  }, [navigate]);

  // Countdown timer for lock
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('adminLockData');
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error(`Account locked. Please try again in ${lockTime} minutes.`);
      return;
    }

    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await API.auth.adminLogin(username, password);
      
      if (success) {
        toast.success('Login successful!');
        localStorage.removeItem('adminLockData');
        navigate('/admin/dashboard');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          const lockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
          localStorage.setItem('adminLockData', JSON.stringify({ 
            attempts: newAttempts, 
            lockUntil 
          }));
          setIsLocked(true);
          setLockTime(15);
          toast.error('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          toast.error(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <a 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homepage
        </a>

        <Card className="bg-white shadow-2xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-500">Billion's Partner Admin Portal</p>
            </div>

            {isLocked ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">Account Locked</h2>
                <p className="text-gray-600 mb-4">
                  Too many failed login attempts.
                </p>
                <p className="text-gray-500">
                  Please try again in <span className="font-bold">{lockTime}</span> minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="pl-10"
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {attempts > 0 && attempts < 5 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      <AlertTriangle className="inline h-4 w-4 mr-1" />
                      {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Restricted Access • Authorized Personnel Only
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-sm mt-6">
          &copy; {new Date().getFullYear()} Billion's Partner. All rights reserved.
        </p>
      </div>
    </div>
  );
}
