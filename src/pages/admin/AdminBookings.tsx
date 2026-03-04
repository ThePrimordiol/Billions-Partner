import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, CreditCard, Settings, LogOut,
  Search, Eye, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { API } from '@/services/api';
import type { Booking } from '@/types';

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    loadBookings();
    API.auth.updateActivity();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await API.bookings.getAll();
      setBookings(data.reverse());
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const handleLogout = () => {
    API.auth.adminLogout();
    navigate('/admin/login');
  };

  const handleStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    try {
      await API.bookings.update(bookingId, { status });
      toast.success(`Booking status updated to ${status}`);
      await API.activity.add(`Updated booking ${bookingId} status to ${status}`, 'success');
      loadBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Providers', icon: Users, href: '/admin/providers' },
    { name: 'Bookings', icon: CalendarCheck, href: '/admin/bookings', active: true },
    { name: 'Transactions', icon: CreditCard, href: '/admin/transactions' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
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
                  item.active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button onClick={handleLogout} variant="ghost" className="w-full text-gray-300">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          </div>
        </header>

        <div className="p-6">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Booking ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{booking.bookingId}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="capitalize">{booking.serviceCategory}</p>
                          <p className="text-sm text-gray-500">{booking.serviceType}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{new Date(booking.serviceDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{booking.serviceTime}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsDialog(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {booking.status === 'pending' && (
                              <button 
                                onClick={() => handleStatusUpdate(booking.bookingId, 'confirmed')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <button 
                                onClick={() => handleStatusUpdate(booking.bookingId, 'cancelled')}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[selectedBooking.status]}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                {selectedBooking.customerEmail && (
                  <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Service Details</h4>
                <p><strong>Category:</strong> {selectedBooking.serviceCategory}</p>
                <p><strong>Type:</strong> {selectedBooking.serviceType}</p>
                <p><strong>Urgency:</strong> {selectedBooking.urgency}</p>
                <p><strong>Description:</strong> {selectedBooking.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Location & Schedule</h4>
                <p><strong>Area:</strong> {selectedBooking.serviceArea}</p>
                <p><strong>Address:</strong> {selectedBooking.address}</p>
                <p><strong>Date:</strong> {new Date(selectedBooking.serviceDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedBooking.serviceTime}</p>
              </div>

              {selectedBooking.additionalNotes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p>{selectedBooking.additionalNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
