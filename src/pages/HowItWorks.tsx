import { Link } from 'react-router-dom';
import { 
  Search, Calendar, Users, CheckCircle, Phone, MessageSquare, Star,
  Shield, Clock, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CONTACT } from '@/lib/constants';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Choose Your Service',
      description: 'Browse our range of professional services including electrical, plumbing, painting, AC repairs, and cleaning. Select the service that matches your needs.',
      color: 'bg-blue-500'
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Book Online or Call',
      description: 'Fill out our simple booking form with your details, preferred date, and service requirements. Or call us directly for immediate assistance.',
      color: 'bg-green-500'
    },
    {
      number: '03',
      icon: Users,
      title: 'Get Matched',
      description: 'Our system matches you with the best available verified provider in your area. You can also choose a specific provider if you have a preference.',
      color: 'bg-purple-500'
    },
    {
      number: '04',
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Pay securely online using our integrated payment system. Your payment is held safely until the service is completed to your satisfaction.',
      color: 'bg-yellow-500'
    },
    {
      number: '05',
      icon: CheckCircle,
      title: 'Service Delivery',
      description: 'The provider arrives at your location and completes the service professionally. Track progress and communicate directly if needed.',
      color: 'bg-red-500'
    },
    {
      number: '06',
      icon: Star,
      title: 'Rate & Review',
      description: 'After service completion, rate your experience and leave a review. Your feedback helps us maintain quality and improve our services.',
      color: 'bg-orange-500'
    }
  ];

  const features = [
    { icon: Shield, title: 'Verified Providers', desc: 'All providers are background-checked and verified' },
    { icon: Clock, title: 'On-Time Service', desc: 'Providers arrive within the scheduled time window' },
    { icon: CreditCard, title: 'Secure Payments', desc: 'Your payments are protected and secure' },
    { icon: MessageSquare, title: 'Direct Communication', desc: 'Chat directly with your service provider' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Getting professional services has never been easier
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`absolute top-0 left-0 w-full h-2 ${step.color}`} />
                <CardContent className="p-6 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${step.color} rounded-full flex items-center justify-center`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-gray-200">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Billion's Partner?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your first service today and experience the difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                Book a Service
              </Button>
            </Link>
            <a href={`tel:${CONTACT.phoneRaw}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
