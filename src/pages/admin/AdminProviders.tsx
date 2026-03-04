import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, CreditCard, Settings, LogOut,
  Search, CheckCircle, XCircle, Eye, Edit, Trash2, Phone, Mail
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

import type { Provider, ProviderApplication } from '@/types';

export default function AdminProviders() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'providers' | 'applications'>('providers');
  const [selectedApplication, setSelectedApplication] = useState<ProviderApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    loadData();
    API.auth.updateActivity();
  }, []);

  const loadData = async () => {
    try {
      const [providersData, applicationsData] = await Promise.all([
        API.providers.getAll(),
        API.applications.getAll()
      ]);
      setProviders(providersData);
      setApplications(applicationsData);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleLogout = () => {
    API.auth.adminLogout();
    navigate('/admin/login');
  };

  const handleApprove = async (application: ProviderApplication) => {
    try {
      await API.applications.approve(application.id!, 'Administrator');
      toast.success(`Application from ${application.fullName} approved!`);
      await API.activity.add(
        `Approved provider application: ${application.fullName}`,
        'approval',
        'Administrator'
      );
      loadData();
    } catch (error) {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) return;
    
    try {
      await API.applications.reject(selectedApplication.id!, 'Administrator', rejectionReason);
      toast.success(`Application from ${selectedApplication.fullName} rejected`);
      await API.activity.add(
        `Rejected provider application: ${selectedApplication.fullName}`,
        'warning',
        'Administrator'
      );
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedApplication(null);
      loadData();
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  const handleDeleteProvider = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    
    try {
      await API.providers.delete(id);
      toast.success('Provider deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete provider');
    }
  };

  const filteredProviders = providers.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.areas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const pendingApplications = applications.filter(a => a.status === 'pending');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Providers', icon: Users, href: '/admin/providers', active: true },
    { name: 'Bookings', icon: CalendarCheck, href: '/admin/bookings' },
    { name: 'Transactions', icon: CreditCard, href: '/admin/transactions' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const categoryColors: Record<string, string> = {
    electrical: 'bg-yellow-100 text-yellow-700',
    plumbing: 'bg-cyan-100 text-cyan-700',
    painting: 'bg-green-100 text-green-700',
    ac: 'bg-blue-100 text-blue-700',
    cleaning: 'bg-purple-100 text-purple-700'
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Providers</h1>
            <Button onClick={handleLogout} variant="ghost" className="lg:hidden">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'providers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Providers ({providers.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending Applications ({pendingApplications.length})
            </button>
          </div>

          {activeTab === 'providers' ? (
            <>
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="painting">Painting</option>
                  <option value="ac">AC Repairs</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>

              {/* Providers Table */}
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Provider</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Areas</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rate</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredProviders.map((provider) => (
                          <tr key={provider.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{provider.name}</p>
                                  <p className="text-sm text-gray-500">{provider.contact}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs capitalize ${categoryColors[provider.category] || 'bg-gray-100'}`}>
                                {provider.category === 'ac' ? 'AC Repairs' : provider.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm">
                                <p className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {provider.phone}
                                </p>
                                <p className="flex items-center text-gray-500">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {provider.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {provider.areas.slice(0, 2).map((area, i) => (
                                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-green-600">
                                ₦{provider.rate.toLocaleString()}/hr
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                provider.status === 'active' ? 'bg-green-100 text-green-700' :
                                provider.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {provider.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProvider(provider.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredProviders.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No providers found</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Applications */
            <div className="grid md:grid-cols-2 gap-6">
              {pendingApplications.map((app) => (
                <Card key={app.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{app.fullName}</h3>
                        <p className="text-gray-500 capitalize">{app.category} Service</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <p><strong>Phone:</strong> {app.phone}</p>
                      <p><strong>Email:</strong> {app.email}</p>
                      <p><strong>Experience:</strong> {app.experience}</p>
                      <p><strong>Hourly Rate:</strong> ₦{app.hourlyRate.toLocaleString()}</p>
                      <p><strong>Areas:</strong> {app.areas.join(', ')}</p>
                      {app.description && (
                        <p><strong>Description:</strong> {app.description}</p>
                      )}
                      <p className="text-gray-400 text-xs">
                        Applied on {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleApprove(app)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowRejectDialog(true);
                        }}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingApplications.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending applications</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedApplication?.fullName}'s application.
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
            <Button 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
