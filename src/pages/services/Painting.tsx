import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Paintbrush, Home, Building2, Wallpaper, Palette, Shield, Brush,
  Star, MapPin, Phone, CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceMap from '@/components/ServiceMap';
import { API } from '@/services/api';
import { CONTACT, SERVICES } from '@/lib/constants';
import type { Provider } from '@/types';

export default function Painting() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const service = SERVICES.find(s => s.id === 'painting')!;

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await API.providers.getAll('painting');
        setProviders(data.filter(p => p.status === 'active'));
      } catch (error) {
        console.error('Error loading providers:', error);
      }
    };
    loadProviders();
  }, []);

  const features = [
    { icon: Home, title: 'Interior Painting', price: 'From ₦25,000', desc: 'Living rooms, bedrooms, kitchens, and more' },
    { icon: Building2, title: 'Exterior Painting', price: 'From ₦50,000', desc: 'Building facades, fences, gates' },
    { icon: Wallpaper, title: 'Wallpaper Installation', price: 'From ₦15,000', desc: 'Professional wallpaper fitting and removal' },
    { icon: Palette, title: 'Decorative Painting', price: 'From ₦30,000', desc: 'Textures, patterns, artistic designs' },
    { icon: Shield, title: 'Waterproofing', price: 'From ₦40,000', desc: 'Protective coatings for walls and roofs' },
    { icon: Brush, title: 'Wall Repair & Prep', price: 'From ₦10,000', desc: 'Patching, sanding, priming' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-16 bg-gradient-to-br from-green-500 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Painting Services in Nigeria</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Professional painters for interior, exterior, and decorative painting
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">{providers.length}+</p>
              <p className="text-green-100">Verified Painters</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">Premium</p>
              <p className="text-green-100">Quality Paints</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">From ₦{service.startingPrice.toLocaleString()}</p>
              <p className="text-green-100">Per Room</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Painting Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Painters Near You</h2>
            <p className="text-gray-600">Browse our network of verified painting professionals</p>
          </div>
          <ServiceMap category="painting" height="500px" />
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Painters</h2>
          <div className="space-y-6">
            {providers.slice(0, 3).map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <Paintbrush className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 font-medium">{provider.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{provider.description}</p>
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
                        <Link to={`/booking?category=painting&provider=${provider.id}`}>
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
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Painter?</h2>
          <p className="text-xl text-gray-300 mb-8">Transform your space with professional painting</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking?category=painting">
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
