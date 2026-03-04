import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Handshake, 
  Zap, 
  Droplets, 
  Paintbrush, 
  Wind, 
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Star,
  Users,
  MapPin,
  CheckCircle,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceMap from '@/components/ServiceMap';
import { API } from '@/services/api';
import { SERVICES, CONTACT } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  Sparkles
};

export default function Home() {
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    totalBookings: 1250,
    activeProviders: 200,
    happyClients: 4800,
    serviceAreas: 37
  });

  useEffect(() => {
    const loadProviderCounts = async () => {
      try {
        const allProviders = await API.providers.getAll();
        const activeProviders = allProviders.filter(p => p.status === 'active');
        
        const counts: Record<string, number> = {};
        SERVICES.forEach(service => {
          counts[service.id] = activeProviders.filter(p => p.category === service.id).length;
        });
        
        setProviderCounts(counts);
        setStats(prev => ({
          ...prev,
          activeProviders: activeProviders.length
        }));
      } catch (error) {
        console.error('Error loading provider counts:', error);
      }
    };

    loadProviderCounts();
  }, []);

  const steps = [
    {
      number: '1',
      title: 'Choose Service',
      description: 'Select the service you need from our list of professional services'
    },
    {
      number: '2',
      title: 'Book Online',
      description: 'Fill our booking form with your details and requirements'
    },
    {
      number: '3',
      title: 'Get Matched',
      description: 'We connect you with the best verified provider near you'
    },
    {
      number: '4',
      title: 'Enjoy Service',
      description: 'Professional service at your location with satisfaction guarantee'
    }
  ];

  const testimonials = [
    {
      name: 'Chinedu Okafor',
      location: 'Lagos',
      service: 'Electrical',
      rating: 5,
      text: 'Excellent service! The electrician arrived on time and fixed all my wiring issues professionally. Highly recommend!'
    },
    {
      name: 'Amina Ibrahim',
      location: 'Abuja',
      service: 'Cleaning',
      rating: 5,
      text: 'The cleaning team did an amazing job. My apartment looks brand new. Will definitely book again!'
    },
    {
      name: 'Emmanuel Johnson',
      location: 'Port Harcourt',
      service: 'Plumbing',
      rating: 5,
      text: 'Fast response and quality work. Fixed my leaking pipes in no time. Great value for money!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm mb-6">
                <Star className="h-4 w-4 mr-2" />
                Trusted by 4,800+ customers across Nigeria
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional Services in{' '}
                <span className="text-blue-400">Nigeria</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Book certified professionals for electrical, plumbing, painting, 
                AC repairs, and cleaning services anywhere in Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                    <CalendarCheck className="mr-2 h-5 w-5" />
                    Book a Service
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    How It Works
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Quick Contact */}
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-400">
                <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  {CONTACT.phone}
                </a>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Nationwide Service
                </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    {SERVICES.map((service) => {
                      const Icon = iconMap[service.icon] || Zap;
                      return (
                        <Link
                          key={service.id}
                          to={`/services/${service.id === 'ac' ? 'ac-repairs' : service.id}`}
                          className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
                        >
                          <Icon className={`h-8 w-8 ${service.textColor} mb-2`} />
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-400">
                            From ₦{service.startingPrice.toLocaleString()}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-slate-900/50 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-blue-400">
                  {stats.totalBookings.toLocaleString()}+
                </p>
                <p className="text-gray-400 mt-1">Services Booked</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-green-400">
                  {stats.activeProviders}+
                </p>
                <p className="text-gray-400 mt-1">Verified Providers</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-yellow-400">
                  {stats.happyClients.toLocaleString()}+
                </p>
                <p className="text-gray-400 mt-1">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-purple-400">
                  {stats.serviceAreas}
                </p>
                <p className="text-gray-400 mt-1">States Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of professional services available across Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Zap;
              const providerCount = providerCounts[service.id] || 0;
              
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {providerCount} Providers
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-semibold">
                        From ₦{service.startingPrice.toLocaleString()}
                      </span>
                      <Link to={`/services/${service.id === 'ac' ? 'ac-repairs' : service.id}`}>
                        <Button variant="outline" size="sm">
                          View Service
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/booking">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <CalendarCheck className="mr-2 h-5 w-5" />
                Book Any Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get professional service in 4 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Service Providers Across Nigeria
            </h2>
            <p className="text-lg text-gray-600">
              Find verified professionals near you
            </p>
          </div>

          <ServiceMap category="all" height="500px" showAll={true} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.location} • {testimonial.service}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a professional service today and experience the Billion's Partner difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <CalendarCheck className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </Link>
            <Link to="/become-provider">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Handshake className="mr-2 h-5 w-5" />
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
