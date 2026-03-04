import { useState } from 'react';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PAYSTACK } from '@/lib/constants';
import { toast } from 'sonner';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  bookingId: string;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

// Load Paystack script dynamically
const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default function PaystackPayment({ 
  amount, 
  email, 
  bookingId, 
  onSuccess, 
  onCancel 
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(email);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const initializePayment = async () => {
    if (!customerEmail || !customerName || !customerPhone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key: PAYSTACK.publicKey,
        email: customerEmail,
        amount: amount * 100, // Paystack expects amount in kobo
        currency: PAYSTACK.currency,
        ref: `BP-${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: customerName
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone_number',
              value: customerPhone
            },
            {
              display_name: 'Booking ID',
              variable_name: 'booking_id',
              value: bookingId
            }
          ]
        },
        callback: (response: { reference: string }) => {
          setIsLoading(false);
          toast.success('Payment successful!');
          onSuccess(response.reference);
        },
        onClose: () => {
          setIsLoading(false);
          toast.info('Payment cancelled');
          onCancel?.();
        }
      });

      handler.openIframe();
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to initialize payment. Please try again.');
      console.error('Paystack error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Secure Payment
          </h3>
          <p className="text-sm text-gray-500">Complete your booking payment</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            ₦{amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Booking: {bookingId}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g., 0811 106 2663"
            disabled={isLoading}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700">
                Your payment is secured by Paystack. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={initializePayment}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ₦{amount.toLocaleString()}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          By clicking Pay, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
