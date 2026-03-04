// Contact Information
export const CONTACT = {
  // Main phone number
  phone: '0811 106 2663',
  phoneRaw: '08111062663',
  
  // Email addresses
  generalEmail: 'partnerbillions@gmail.com',
  supportEmail: 'billionspartners17@gmail.com',
  disputeEmail: 'billionspartners17@gmail.com',
  
  // Location
  location: 'Nigeria',
  address: 'Nigeria',
  
  // Office hours
  officeHours: {
    weekday: '8:00 AM - 6:00 PM',
    saturday: '9:00 AM - 4:00 PM',
    sunday: '10:00 AM - 2:00 PM'
  }
};

// Social Media Handles
export const SOCIAL = {
  // X (Twitter)
  x: {
    handle: '@billions50500',
    url: 'https://x.com/billions50500'
  },
  
  // Instagram
  instagram: {
    handle: 'billions_partner5050',
    url: 'https://instagram.com/billions_partner5050'
  },
  
  // YouTube
  youtube: {
    handle: '@GoodluckOdidi',
    url: 'https://youtube.com/@GoodluckOdidi'
  },
  
  // Facebook
  facebook: {
    handle: 'BillionsPartner',
    url: 'https://facebook.com/BillionsPartner'
  },
  
  // WhatsApp
  whatsapp: {
    number: '08111062663',
    url: 'https://wa.me/2348111062663'
  }
};

// Paystack Configuration
export const PAYSTACK = {
  publicKey: 'pk_live_960c601870ea48b34c4e1be042f35657c02959d8',
  currency: 'NGN'
};

// Service Categories
export const SERVICES = [
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    description: 'Professional electrical wiring, repairs, installations, and maintenance services.',
    startingPrice: 5000,
    features: [
      'Residential Wiring',
      'Commercial Electrical',
      'Emergency Repairs',
      'Inverter & Solar',
      'Electrical Maintenance',
      'Appliance Installation'
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'Droplets',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    description: 'Expert pipe repairs, leak detection, installations, and drainage solutions.',
    startingPrice: 4500,
    features: [
      'Pipe Repairs',
      'Toilet & Bathroom',
      'Kitchen Plumbing',
      'Water Heaters',
      'Water Pumps',
      'Drain Cleaning'
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'Paintbrush',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    description: 'Interior/exterior painting, wall finishing, and decorative painting services.',
    startingPrice: 15000,
    features: [
      'Interior Painting',
      'Exterior Painting',
      'Wallpaper Installation',
      'Decorative Painting',
      'Waterproofing',
      'Wall Repair & Prep'
    ]
  },
  {
    id: 'ac',
    name: 'AC Repairs',
    icon: 'Wind',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    description: 'Installation, maintenance, and repair of air conditioning systems.',
    startingPrice: 8000,
    features: [
      'AC Installation',
      'AC Repair',
      'AC Maintenance',
      'Gas Refilling',
      'Thermostat Repair',
      'Emergency AC Service'
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'Sparkles',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    description: 'Residential, commercial, deep cleaning, and specialized cleaning services.',
    startingPrice: 7000,
    features: [
      'Home Deep Cleaning',
      'Office Cleaning',
      'Post-Construction Cleaning',
      'Carpet Cleaning',
      'Fumigation',
      'Move-in/Move-out Cleaning'
    ]
  }
];

// Nigerian States for Service Areas
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

// Major Cities
export const MAJOR_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Kaduna', 
  'Benin City', 'Enugu', 'Onitsha', 'Aba', 'Owerri', 'Uyo'
];

// Company Info
export const COMPANY = {
  name: "Billion's Partner",
  tagline: 'Professional Services in Nigeria',
  description: 'Connecting Nigeria with trusted professional service providers for all home and business needs.',
  founded: 2024,
  website: 'https://billionspartner.com'
};

// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '#', hasDropdown: true },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Become a Provider', href: '/become-provider' },
  { name: 'Contact', href: '/contact' }
];

// Admin Navigation
export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Manage Providers', href: '/admin/providers', icon: 'Users' },
  { name: 'Bookings', href: '/admin/bookings', icon: 'CalendarCheck' },
  { name: 'Transactions', href: '/admin/transactions', icon: 'CreditCard' },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' }
];

// Chat Responses
export const CHAT_RESPONSES = [
  "Thanks for your message! A service provider will respond shortly.",
  "Would you like me to connect you with an available provider?",
  "I can help you book a service. Which service do you need?",
  "Our providers typically respond within 5-10 minutes.",
  "You can also call our main line at 0811 106 2663",
  "For emergencies, please call our 24/7 hotline directly."
];

// Booking Urgency Options
export const URGENCY_OPTIONS = [
  { value: 'emergency', label: 'Emergency (Within 2 hours)', icon: 'AlertCircle' },
  { value: 'same-day', label: 'Same Day Service', icon: 'Clock' },
  { value: 'next-day', label: 'Next Day Service', icon: 'Calendar' },
  { value: 'scheduled', label: 'Schedule for Later', icon: 'CalendarDays' }
];

// Time Slots
export const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
  { value: 'evening', label: 'Evening (4PM - 8PM)' },
  { value: 'flexible', label: 'Flexible (Provider will call)' }
];

// Property Types
export const PROPERTY_TYPES = [
  'Residential - Apartment',
  'Residential - Duplex',
  'Residential - Bungalow',
  'Commercial - Office',
  'Commercial - Shop',
  'Commercial - Warehouse',
  'Industrial'
];
