// Provider Types
export interface Provider {
  id: number;
  category: 'electrical' | 'plumbing' | 'painting' | 'ac' | 'cleaning';
  type: 'individual' | 'company' | 'agency';
  name: string;
  contact: string;
  phone: string;
  email: string;
  areas: string[];
  rate: number;
  rating: number;
  description?: string;
  lat?: string;
  lng?: string;
  status: 'active' | 'inactive' | 'busy' | 'pending';
  dateAdded: string;
  updatedAt?: string;
}

// Booking Types
export interface Booking {
  id?: number;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceCategory: string;
  providerId?: number | null;
  serviceType: string;
  urgency: string;
  serviceDate: string;
  serviceTime: string;
  description: string;
  serviceArea: string;
  address: string;
  propertyType: string;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  amount?: number;
}

// Application Types (Become a Provider)
export interface ProviderApplication {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  experience: string;
  areas: string[];
  hourlyRate: number;
  description?: string;
  certifications?: string;
  references?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// Contact Form Types
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  serviceType?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

// Payment Types
export interface Payment {
  id?: number;
  reference: string;
  bookingId: string;
  customer: string;
  service: string;
  amount: number;
  method: 'bank' | 'card' | 'mobile';
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
  timestamp: string;
  date?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// Chat Types
export interface ChatMessage {
  id: number;
  sender: 'user' | 'provider' | 'system';
  message: string;
  timestamp: string;
  senderName?: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'provider' | 'admin';
  createdAt: string;
}

// Stats Types
export interface PlatformStats {
  totalProviders: number;
  activeProviders: number;
  totalCategories: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  todayBookings: number;
}

// Activity Log Types
export interface ActivityLog {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'approval' | 'payment';
  timestamp: string;
  user?: string;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  startingPrice: number;
  providerCount: number;
}
