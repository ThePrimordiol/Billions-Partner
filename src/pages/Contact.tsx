import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API } from '@/services/api';
import { CONTACT, SERVICES, COMPANY } from '@/lib/constants';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    serviceType: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.contacts.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        serviceType: formData.serviceType,
        message: formData.message
      });

      setIsSuccess(true);
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        serviceType: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our support team',
      value: CONTACT.phone,
      href: `tel:${CONTACT.phoneRaw}`,
      subtext: 'Available 24/7 for emergencies'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: CONTACT.generalEmail,
      href: `mailto:${CONTACT.generalEmail}`,
      subtext: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Location',
      description: 'Service available nationwide',
      value: CONTACT.location,
      subtext: 'Covering all 36 states + FCT'
    }
  ];

  const departmentContacts = [
    { icon: MessageSquare, title: 'General Inquiries', email: CONTACT.generalEmail },
    { icon: Phone, title: 'Support & Disputes', email: CONTACT.supportEmail },
    { icon: Mail, title: 'Support & Reporting', email: CONTACT.disputeEmail }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-gray-600 mb-8">
                Thank you for contacting {COMPANY.name}. Our team will respond to your 
                inquiry within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Return Home
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Get in touch with our team for service inquiries, support, or partnership opportunities
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 -mt-24 relative z-10">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{method.description}</p>
                  <a 
                    href={method.href}
                    className="text-xl font-bold text-red-600 hover:text-red-700"
                  >
                    {method.value}
                  </a>
                  <p className="text-gray-400 text-xs mt-2">{method.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                  <p className="text-gray-500 mb-6">
                    Fill out the form below and we'll get back to you as soon as possible
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g., 0811 106 2663"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Service Booking Inquiry">Service Booking Inquiry</SelectItem>
                            <SelectItem value="Become a Service Provider">Become a Service Provider</SelectItem>
                            <SelectItem value="Customer Support">Customer Support</SelectItem>
                            <SelectItem value="Partnership Opportunity">Partnership Opportunity</SelectItem>
                            <SelectItem value="Complaint">Complaint</SelectItem>
                            <SelectItem value="Other Inquiry">Other Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="serviceType">Service Type (Optional)</Label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICES.map((service) => (
                              <SelectItem key={service.id} value={service.name}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Office Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday:</span>
                      <span>{CONTACT.officeHours.weekday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday:</span>
                      <span>{CONTACT.officeHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday:</span>
                      <span>{CONTACT.officeHours.sunday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Contacts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Department Contacts</h3>
                  <div className="space-y-4">
                    {departmentContacts.map((dept, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <dept.icon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{dept.title}</p>
                          <a 
                            href={`mailto:${dept.email}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Support */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-800 mb-2">Emergency Support</h3>
                  <p className="text-sm text-red-600 mb-4">
                    For urgent service requests or emergencies:
                  </p>
                  <a 
                    href={`tel:${CONTACT.phoneRaw}`}
                    className="text-2xl font-bold text-red-600 hover:text-red-700"
                  >
                    {CONTACT.phone}
                  </a>
                  <p className="text-xs text-red-500 mt-2">
                    Available 24 hours, 7 days a week
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
