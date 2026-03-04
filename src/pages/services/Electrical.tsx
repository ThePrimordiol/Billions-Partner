import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Home, 
  Building, 
  AlertTriangle, 
  Sun, 
  Wrench, 
  Plug,
  Star,
  MapPin,
  Phone,
  CalendarCheck,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceMap from '@/components/ServiceMap';
import { API } from '@/services/api';
import { CONTACT, SERVICES } from '@/lib/constants';
import type { Provider } from '@/types';

export default function Electrical() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const service = SERVICES.find(s => s.id === 'electrical')!;

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await API.providers.getAll('electrical');
        setProviders(data.filter(p => p.status === 'active'));
      } catch (error) {
        console.error('Error loading providers:', error);
      }
    };
    loadProviders();
  }, []);

  const features = [
    { icon: Home, title: 'Residential Wiring', price: 'From ₦15,000', desc: 'Complete house wiring, rewiring, socket installations' },
    { icon: Building, title: 'Commercial Electrical', price: 'From ₦50,000', desc: 'Office electrical systems, industrial installations' },
    { icon: AlertTriangle, title: 'Emergency Repairs', price: 'From ₦8,000', desc: '24/7 emergency electrical repairs, fault finding' },
    { icon: Sun, title: 'Inverter & Solar', price: 'From ₦80,000', desc: 'Solar panel installation, inverter setup' },
    { icon: Wrench, title: 'Electrical Maintenance', price: 'From ₦10,000', desc: 'Regular maintenance, safety inspections' },
    { icon: Plug, title: 'Appliance Installation', price: 'From ₦5,000', desc: 'AC installation, water heater setup' }
  ];

  const whyChooseUs = [
    { icon: CheckCircle, title: 'Licensed & Certified', desc: 'All electricians are NEMSA certified' },
    { icon: CheckCircle, title: 'Insured Work', desc: 'Full insurance coverage for all work' },
    { icon: CheckCircle, title: 'On-Time Service', desc: '90% arrive within scheduled window' },
    { icon: CheckCircle, title: 'Guaranteed Quality', desc: '6-month warranty on all work' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Emergency Banner */}
      <div className="pt-16 bg-red-600 text-white text-center py-2">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="h-4 w-4" />
          <span className="font-semibold">24/7 Emergency Electrical Services Available - Call {CONTACT.phone}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Electrical Services in Nigeria
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
              Professional electricians for wiring, repairs, installations, and maintenance
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">{providers.length}+</p>
                <p className="text-amber-100">Verified Electricians</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-amber-100">Emergency Service</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">From ₦{service.startingPrice.toLocaleString()}</p>
                <p className="text-amber-100">Per Service Call</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Electrical Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {feature.price}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Electricians Near You</h2>
            <p className="text-gray-600">
              Browse our network of verified electrical service providers across Nigeria
            </p>
          </div>
          
          <ServiceMap category="electrical" height="500px" />
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Electricians</h2>
          
          <div className="space-y-6">
            {providers.slice(0, 3).map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                        <Zap className="h-10 w-10 text-amber-600" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 font-medium">{provider.rating}</span>
                          <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{provider.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {provider.areas.slice(0, 3).map((area, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {provider.areas.join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-center md:text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ₦{provider.rate.toLocaleString()}/hr
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to={`/booking?category=electrical&provider=${provider.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Book Now
                          </Button>
                        </Link>
                        <a href={`tel:${provider.phone}`}>
                          <Button variant="outline">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {providers.length === 0 && (
            <div className="text-center py-12">
              <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No electricians available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Electricians?</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need an Electrician?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get connected with verified professionals in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking?category=electrical">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                <CalendarCheck className="mr-2 h-5 w-5" />
                Book Online Now
              </Button>
            </Link>
            <a href={`tel:${CONTACT.phoneRaw}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Call {CONTACT.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
