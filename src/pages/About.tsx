import { Link } from 'react-router-dom';
import { 
  Shield, Star, Award, Heart,
  CalendarCheck, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CONTACT, SERVICES } from '@/lib/constants';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'All our providers are thoroughly vetted, verified, and background-checked for your peace of mind.'
    },
    {
      icon: Star,
      title: 'Quality Service',
      description: 'We maintain high standards and only work with skilled professionals who deliver excellent results.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure you are happy with our services.'
    },
    {
      icon: Award,
      title: 'Professionalism',
      description: 'Our providers are trained professionals who respect your time, property, and privacy.'
    }
  ];

  const stats = [
    { value: '5', label: 'Service Categories' },
    { value: '200+', label: 'Verified Providers' },
    { value: '4,800+', label: 'Happy Customers' },
    { value: '36', label: 'States Covered' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Billion's Partner</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Connecting Nigeria with trusted professional service providers
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At Billion's Partner, we believe that finding reliable professional services 
                should be simple and stress-free. Our mission is to bridge the gap between 
                skilled service providers and customers who need their expertise.
              </p>
              <p className="text-gray-600 mb-4">
                Founded in 2024, we have grown to become one of Nigeria's most trusted 
                platforms for connecting homeowners and businesses with verified professionals 
                in electrical, plumbing, painting, AC repairs, and cleaning services.
              </p>
              <p className="text-gray-600">
                We are committed to providing exceptional service quality, ensuring customer 
                satisfaction, and supporting our network of service providers to grow their 
                businesses.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services We Offer</h2>
            <p className="text-gray-600">Professional services available across Nigeria</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Link to={`/services/${service.id === 'ac' ? 'ac-repairs' : service.id}`}>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Quality Service?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers across Nigeria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                <CalendarCheck className="mr-2 h-5 w-5" />
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
