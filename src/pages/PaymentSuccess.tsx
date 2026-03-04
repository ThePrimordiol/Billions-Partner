// Payment Success Page
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CONTACT } from '@/lib/constants';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your booking has been confirmed.
              </p>

              {reference && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500">Payment Reference</p>
                  <p className="font-mono font-semibold">{reference}</p>
                </div>
              )}

              {bookingId && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-600">Booking ID</p>
                  <p className="font-mono font-semibold text-blue-800">{bookingId}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-yellow-800">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-left text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• You will receive a confirmation call within 24 hours</li>
                  <li>• A service provider will be assigned to your booking</li>
                  <li>• You can track your booking status in your account</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Home className="mr-2 h-4 w-4" />
                    Return Home
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Another Service
                  </Button>
                </Link>
                <a href={`tel:${CONTACT.phoneRaw}`}>
                  <Button variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
