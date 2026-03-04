import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, ArrowLeft, CheckCircle, Loader2, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaystackPayment from '@/components/PaystackPayment';
import { API } from '@/services/api';
import { SERVICES, PROPERTY_TYPES, URGENCY_OPTIONS, TIME_SLOTS, NIGERIAN_STATES, CONTACT } from '@/lib/constants';
import type { Provider } from '@/types';

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCategory = searchParams.get('category');
  const preSelectedProvider = searchParams.get('provider');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceCategory: preSelectedCategory || '',
    providerId: preSelectedProvider || '',
    serviceType: '',
    urgency: '',
    serviceDate: '',
    serviceTime: '',
    description: '',
    serviceArea: '',
    address: '',
    propertyType: '',
    additionalNotes: ''
  });

  useEffect(() => {
    if (formData.serviceCategory) {
      loadProviders();
    }
  }, [formData.serviceCategory]);

  const loadProviders = async () => {
    try {
      const data = await API.providers.getAll(formData.serviceCategory);
      setProviders(data.filter(p => p.status === 'active'));
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.serviceCategory || 
        !formData.serviceType || !formData.urgency || !formData.serviceDate || 
        !formData.serviceArea || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBookingId = `BP-${Date.now()}`;
      await API.bookings.create({
        bookingId: newBookingId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        serviceCategory: formData.serviceCategory,
        providerId: formData.providerId ? parseInt(formData.providerId) : null,
        serviceType: formData.serviceType,
        urgency: formData.urgency,
        serviceDate: formData.serviceDate,
        serviceTime: formData.serviceTime,
        description: formData.description,
        serviceArea: formData.serviceArea,
        address: formData.address,
        propertyType: formData.propertyType,
        additionalNotes: formData.additionalNotes,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setBookingId(newBookingId);
      setStep(2);
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServicePrice = () => {
    const service = SERVICES.find(s => s.id === formData.serviceCategory);
    return service?.startingPrice || 5000;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <div className={`w-20 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-center space-x-16 mt-2 text-sm">
              <span>Details</span>
              <span>Payment</span>
              <span>Complete</span>
            </div>
          </div>

          {step === 1 ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <a href="/" className="mr-4">
                    <ArrowLeft className="h-5 w-5" />
                  </a>
                  <h1 className="text-2xl font-bold">Book a Service</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        placeholder="e.g., 0811 106 2663"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email Address</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="Enter your email (optional)"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serviceCategory">Service Category *</Label>
                      <Select
                        value={formData.serviceCategory}
                        onValueChange={(value) => setFormData({ ...formData, serviceCategory: value, providerId: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICES.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="providerId">Preferred Provider (Optional)</Label>
                      <Select
                        value={formData.providerId}
                        onValueChange={(value) => setFormData({ ...formData, providerId: value })}
                        disabled={!formData.serviceCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Let us choose for you" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any available provider</SelectItem>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id.toString()}>
                              {provider.name} - ₦{provider.rate.toLocaleString()}/hr
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Input
                        id="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        placeholder="e.g., AC Installation, Pipe Repair"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency *</Label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {URGENCY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serviceDate">Preferred Date *</Label>
                      <Input
                        id="serviceDate"
                        type="date"
                        value={formData.serviceDate}
                        onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceTime">Preferred Time *</Label>
                      <Select
                        value={formData.serviceTime}
                        onValueChange={(value) => setFormData({ ...formData, serviceTime: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serviceArea">Service Area/State *</Label>
                      <Select
                        value={formData.serviceArea}
                        onValueChange={(value) => setFormData({ ...formData, serviceArea: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your full address including landmarks"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Service Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the service you need..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Any additional information..."
                      rows={2}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="mr-2 h-5 w-5" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : step === 2 ? (
            <PaystackPayment
              amount={getServicePrice()}
              email={formData.customerEmail || `${formData.customerPhone}@placeholder.com`}
              bookingId={bookingId}
              onSuccess={(reference) => {
                API.payments.create({
                  reference,
                  bookingId,
                  customer: formData.customerName,
                  service: `${formData.serviceCategory} - ${formData.serviceType}`,
                  amount: getServicePrice(),
                  method: 'card',
                  status: 'pending_approval',
                  timestamp: new Date().toISOString()
                });
                setStep(3);
              }}
              onCancel={() => {
                toast.info('Payment cancelled. Your booking is saved.');
              }}
            />
          ) : (
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mb-2">
                  Your booking has been successfully created.
                </p>
                <p className="text-lg font-semibold text-blue-600 mb-6">
                  Booking ID: {bookingId}
                </p>
                <div className="space-y-4">
                  <p className="text-gray-500">
                    We will contact you shortly to confirm your appointment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/')} className="bg-blue-600">
                      Return Home
                    </Button>
                    <a href={`tel:${CONTACT.phoneRaw}`}>
                      <Button variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
