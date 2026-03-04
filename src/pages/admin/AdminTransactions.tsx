import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, CreditCard, Settings, LogOut,
  Search, CheckCircle, XCircle, DollarSign, Calendar
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { API } from '@/services/api';
import type { Payment } from '@/types';

export default function AdminTransactions() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPayments();
    API.auth.updateActivity();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await API.payments.getAll();
      setPayments(data.reverse());
    } catch (error) {
      toast.error('Failed to load payments');
    }
  };

  const handleLogout = () => {
    API.auth.adminLogout();
    navigate('/admin/login');
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    
    try {
      await API.payments.approve(selectedPayment.id!, 'Administrator');
      toast.success('Payment approved successfully');
      await API.activity.add(`Approved payment ${selectedPayment.reference}`, 'payment');
      setShowApproveDialog(false);
      setSelectedPayment(null);
      loadPayments();
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectionReason.trim()) return;
    
    try {
      await API.payments.reject(selectedPayment.id!, 'Administrator', rejectionReason);
      toast.success('Payment rejected');
      await API.activity.add(`Rejected payment ${selectedPayment.reference}`, 'warning');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedPayment(null);
      loadPayments();
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending_approval')
    .reduce((sum, p) => sum + p.amount, 0);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Providers', icon: Users, href: '/admin/providers' },
    { name: 'Bookings', icon: CalendarCheck, href: '/admin/bookings' },
    { name: 'Transactions', icon: CreditCard, href: '/admin/transactions', active: true },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const statusColors: Record<string, string> = {
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700'
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
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Approval</p>
                    <p className="text-3xl font-bold text-yellow-600">₦{pendingAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-3xl font-bold">{payments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search transactions..."
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
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reference</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Booking</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{payment.reference}</td>
                        <td className="px-4 py-3">{payment.bookingId}</td>
                        <td className="px-4 py-3">{payment.customer}</td>
                        <td className="px-4 py-3 font-semibold">₦{payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${statusColors[payment.status]}`}>
                            {payment.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {payment.status === 'pending_approval' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowApproveDialog(true);
                                }}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowRejectDialog(true);
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this payment of ₦{selectedPayment?.amount.toLocaleString()}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              <XCircle className="h-4 w-4 mr-2" />
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
