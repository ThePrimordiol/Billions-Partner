import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, CreditCard, Settings, LogOut,
  Save, Bell, Shield, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { API } from '@/services/api';
import { CONTACT, SOCIAL, PAYSTACK } from '@/lib/constants';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    phone: CONTACT.phone,
    generalEmail: CONTACT.generalEmail,
    supportEmail: CONTACT.supportEmail,
    xHandle: SOCIAL.x.handle,
    instagramHandle: SOCIAL.instagram.handle,
    youtubeHandle: SOCIAL.youtube.handle,
    paystackKey: PAYSTACK.publicKey
  });

  useEffect(() => {
    API.auth.updateActivity();
  }, []);

  const handleLogout = () => {
    API.auth.adminLogout();
    navigate('/admin/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to a backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
      await API.activity.add('Updated platform settings', 'info');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Providers', icon: Users, href: '/admin/providers' },
    { name: 'Bookings', icon: CalendarCheck, href: '/admin/bookings' },
    { name: 'Transactions', icon: CreditCard, href: '/admin/transactions' },
    { name: 'Settings', icon: Settings, href: '/admin/settings', active: true },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </header>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contact Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Main Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="generalEmail">General Email</Label>
                  <Input
                    id="generalEmail"
                    type="email"
                    value={settings.generalEmail}
                    onChange={(e) => setSettings({ ...settings, generalEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="xHandle">X (Twitter) Handle</Label>
                  <Input
                    id="xHandle"
                    value={settings.xHandle}
                    onChange={(e) => setSettings({ ...settings, xHandle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="instagramHandle">Instagram Handle</Label>
                  <Input
                    id="instagramHandle"
                    value={settings.instagramHandle}
                    onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="youtubeHandle">YouTube Handle</Label>
                  <Input
                    id="youtubeHandle"
                    value={settings.youtubeHandle}
                    onChange={(e) => setSettings({ ...settings, youtubeHandle: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paystackKey">Paystack Public Key</Label>
                  <Input
                    id="paystackKey"
                    value={settings.paystackKey}
                    onChange={(e) => setSettings({ ...settings, paystackKey: e.target.value })}
                    type="password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Live key for production payments
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Username:</strong> BillionsPartner
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    <strong>Password:</strong> 010010
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Contact support to change admin credentials
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
