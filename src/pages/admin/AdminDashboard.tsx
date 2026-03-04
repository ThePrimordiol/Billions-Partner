import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Settings, 
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API } from '@/services/api';
import { toast } from 'sonner';
import type { PlatformStats, ActivityLog, Booking, ProviderApplication } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats>({
    totalProviders: 0,
    activeProviders: 0,
    totalCategories: 5,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    todayBookings: 0
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingApplications, setPendingApplications] = useState<ProviderApplication[]>([]);

  useEffect(() => {
    loadDashboardData();
    // Update activity every minute
    const interval = setInterval(() => {
      API.auth.updateActivity();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsData = await API.stats.getStats();
      setStats(statsData);

      // Load activities
      const activitiesData = await API.activity.getAll();
      setActivities(activitiesData.slice(-10).reverse());

      // Load recent bookings
      const bookingsData = await API.bookings.getAll();
      setRecentBookings(bookingsData.slice(-5).reverse());

      // Load pending applications
      const applicationsData = await API.applications.getAll();
      setPendingApplications(applicationsData.filter(a => a.status === 'pending').slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    API.auth.adminLogout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', active: true },
    { name: 'Providers', icon: Users, href: '/admin/providers', active: false },
    { name: 'Bookings', icon: CalendarCheck, href: '/admin/bookings', active: false },
    { name: 'Transactions', icon: CreditCard, href: '/admin/transactions', active: false },
    { name: 'Settings', icon: Settings, href: '/admin/settings', active: false },
  ];

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg">Admin Portal</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-gray-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
                {stats.pendingApprovals > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingApprovals}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <span className="hidden md:block font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Providers</p>
                    <p className="text-3xl font-bold">{stats.totalProviders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <UserCheck className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{stats.activeProviders} active</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{stats.todayBookings} today</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Approvals</p>
                    <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">Needs attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Bookings</span>
                  <a href="/admin/bookings" className="text-sm text-blue-600 hover:underline">
                    View All
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {booking.serviceCategory} • {booking.serviceType}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentBookings.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No recent bookings</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No recent activity</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Provider Applications</span>
                  <a href="/admin/providers" className="text-sm text-blue-600 hover:underline">
                    Review All
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="font-medium">{app.fullName}</p>
                      <p className="text-sm text-gray-600 capitalize">{app.category}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                      <a href="/admin/providers">
                        <Button size="sm" className="mt-3 w-full">
                          Review Application
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
