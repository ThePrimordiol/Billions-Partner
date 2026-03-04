import type { 
  Provider, 
  Booking, 
  ProviderApplication, 
  ContactMessage, 
  Payment,
  ChatMessage,
  PlatformStats,
  ActivityLog 
} from '@/types';

// Local storage keys
const LOCAL_KEYS = {
  PROVIDERS: 'billions_providers_v2',
  BOOKINGS: 'billions_bookings',
  APPLICATIONS: 'billions_applications',
  CONTACTS: 'billions_contacts',
  PAYMENTS: 'billions_payments',
  CHAT_MESSAGES: 'billions_chat_messages',
  ACTIVITY_LOG: 'billions_activity_log',
  SETTINGS: 'billions_settings',
  CURRENT_USER: 'billions_current_user'
};

// Helper functions
const getNextId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

const getFromStorage = <T>(key: string, defaultValue: T[] = []): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize sample data
const initSampleData = () => {
  if (!localStorage.getItem(LOCAL_KEYS.PROVIDERS)) {
    const sampleProviders: Provider[] = [
      {
        id: 1,
        category: 'electrical',
        type: 'company',
        name: 'Corustar Technical Services',
        contact: 'Mr. James Uche',
        phone: '0811 106 2663',
        email: 'corustar@example.com',
        areas: ['Lagos', 'Abuja', 'Port Harcourt'],
        rate: 8000,
        rating: 4.9,
        description: 'Licensed electrical contractors with 15+ years experience. Specializing in residential, commercial, and industrial electrical installations.',
        lat: '6.5244',
        lng: '3.3792',
        status: 'active',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        category: 'plumbing',
        type: 'company',
        name: 'Steve Swiss Plumbing',
        contact: 'Mr. Chidi Okoro',
        phone: '0811 106 2664',
        email: 'steveswiss@example.com',
        areas: ['Lagos', 'Ibadan', 'Abuja'],
        rate: 5500,
        rating: 4.8,
        description: 'Full-service plumbing company with 10+ years experience. Licensed plumbers for domestic and industrial needs.',
        lat: '6.5244',
        lng: '3.3792',
        status: 'active',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        category: 'painting',
        type: 'individual',
        name: 'Perfect Painters Nigeria',
        contact: 'Mr. Michael Ade',
        phone: '0811 106 2665',
        email: 'perfectpainters@example.com',
        areas: ['Lagos', 'Abuja', 'Kano'],
        rate: 4500,
        rating: 4.7,
        description: 'Interior and exterior painting, wall paper installation, and decorative painting services.',
        lat: '6.5244',
        lng: '3.3792',
        status: 'active',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        category: 'ac',
        type: 'company',
        name: 'Cool Air Services',
        contact: 'Mr. Emmanuel John',
        phone: '0811 106 2666',
        email: 'coolair@example.com',
        areas: ['Lagos', 'Port Harcourt', 'Abuja'],
        rate: 7000,
        rating: 4.6,
        description: 'AC installation, maintenance, and repair services for all brands. 24/7 emergency service available.',
        lat: '6.5244',
        lng: '3.3792',
        status: 'active',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        category: 'cleaning',
        type: 'company',
        name: 'Sparkle Clean Services',
        contact: 'Mrs. Grace Okafor',
        phone: '0811 106 2667',
        email: 'sparkleclean@example.com',
        areas: ['All Nigeria'],
        rate: 5000,
        rating: 4.8,
        description: 'Residential, commercial, deep cleaning, and specialized cleaning services.',
        lat: '6.5244',
        lng: '3.3792',
        status: 'active',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveToStorage(LOCAL_KEYS.PROVIDERS, sampleProviders);
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  initSampleData();
}

// ==================== PROVIDERS ====================
export const ProviderAPI = {
  getAll: async (category?: string): Promise<Provider[]> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    if (category) {
      return providers.filter(p => p.category === category);
    }
    return providers;
  },

  getById: async (id: number): Promise<Provider | null> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    return providers.find(p => p.id === id) || null;
  },

  create: async (data: Omit<Provider, 'id' | 'dateAdded'>): Promise<Provider> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    const newProvider: Provider = {
      ...data,
      id: getNextId(providers),
      dateAdded: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    providers.push(newProvider);
    saveToStorage(LOCAL_KEYS.PROVIDERS, providers);
    return newProvider;
  },

  update: async (id: number, data: Partial<Provider>): Promise<Provider> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Provider not found');
    
    providers[index] = {
      ...providers[index],
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };
    saveToStorage(LOCAL_KEYS.PROVIDERS, providers);
    return providers[index];
  },

  delete: async (id: number): Promise<void> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    const filtered = providers.filter(p => p.id !== id);
    saveToStorage(LOCAL_KEYS.PROVIDERS, filtered);
  },

  search: async (query: string, category?: string): Promise<Provider[]> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    let filtered = providers.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.contact.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.email.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase()) ||
      p.areas.some(area => area.toLowerCase().includes(query.toLowerCase()))
    );
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    return filtered;
  }
};

// ==================== BOOKINGS ====================
export const BookingAPI = {
  getAll: async (): Promise<Booking[]> => {
    return getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
  },

  getById: async (id: string): Promise<Booking | null> => {
    const bookings = getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
    return bookings.find(b => b.bookingId === id) || null;
  },

  create: async (data: Omit<Booking, 'id'>): Promise<Booking> => {
    const bookings = getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
    const newBooking: Booking = {
      ...data,
      id: getNextId(bookings)
    };
    bookings.push(newBooking);
    saveToStorage(LOCAL_KEYS.BOOKINGS, bookings);
    return newBooking;
  },

  update: async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
    const bookings = getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index] = { ...bookings[index], ...data };
    saveToStorage(LOCAL_KEYS.BOOKINGS, bookings);
    return bookings[index];
  },

  delete: async (bookingId: string): Promise<void> => {
    const bookings = getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
    const filtered = bookings.filter(b => b.bookingId !== bookingId);
    saveToStorage(LOCAL_KEYS.BOOKINGS, filtered);
  }
};

// ==================== APPLICATIONS (Become a Provider) ====================
export const ApplicationAPI = {
  getAll: async (): Promise<ProviderApplication[]> => {
    return getFromStorage<ProviderApplication>(LOCAL_KEYS.APPLICATIONS);
  },

  getById: async (id: number): Promise<ProviderApplication | null> => {
    const applications = getFromStorage<ProviderApplication>(LOCAL_KEYS.APPLICATIONS);
    return applications.find(a => a.id === id) || null;
  },

  create: async (data: Omit<ProviderApplication, 'id' | 'submittedAt' | 'status'>): Promise<ProviderApplication> => {
    const applications = getFromStorage<ProviderApplication>(LOCAL_KEYS.APPLICATIONS);
    const newApplication: ProviderApplication = {
      ...data,
      id: getNextId(applications),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    saveToStorage(LOCAL_KEYS.APPLICATIONS, applications);
    return newApplication;
  },

  update: async (id: number, data: Partial<ProviderApplication>): Promise<ProviderApplication> => {
    const applications = getFromStorage<ProviderApplication>(LOCAL_KEYS.APPLICATIONS);
    const index = applications.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Application not found');
    
    applications[index] = { ...applications[index], ...data };
    saveToStorage(LOCAL_KEYS.APPLICATIONS, applications);
    return applications[index];
  },

  approve: async (id: number, reviewedBy: string): Promise<ProviderApplication> => {
    const application = await ApplicationAPI.update(id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy
    });
    
    // Create provider from application
    await ProviderAPI.create({
      category: application.category as any,
      type: 'individual',
      name: application.fullName,
      contact: application.fullName,
      phone: application.phone,
      email: application.email,
      areas: application.areas,
      rate: application.hourlyRate,
      rating: 4.0,
      description: application.description,
      status: 'active'
    });
    
    return application;
  },

  reject: async (id: number, reviewedBy: string, notes: string): Promise<ProviderApplication> => {
    return ApplicationAPI.update(id, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      notes
    });
  }
};

// ==================== CONTACT MESSAGES ====================
export const ContactAPI = {
  getAll: async (): Promise<ContactMessage[]> => {
    return getFromStorage<ContactMessage>(LOCAL_KEYS.CONTACTS);
  },

  create: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> => {
    const contacts = getFromStorage<ContactMessage>(LOCAL_KEYS.CONTACTS);
    const newContact: ContactMessage = {
      ...data,
      id: getNextId(contacts),
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    contacts.push(newContact);
    saveToStorage(LOCAL_KEYS.CONTACTS, contacts);
    return newContact;
  },

  markAsRead: async (id: number): Promise<void> => {
    const contacts = getFromStorage<ContactMessage>(LOCAL_KEYS.CONTACTS);
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index].status = 'read';
      saveToStorage(LOCAL_KEYS.CONTACTS, contacts);
    }
  }
};

// ==================== PAYMENTS ====================
export const PaymentAPI = {
  getAll: async (): Promise<Payment[]> => {
    return getFromStorage<Payment>(LOCAL_KEYS.PAYMENTS);
  },

  create: async (data: Omit<Payment, 'id'>): Promise<Payment> => {
    const payments = getFromStorage<Payment>(LOCAL_KEYS.PAYMENTS);
    const newPayment: Payment = {
      ...data,
      id: getNextId(payments)
    };
    payments.push(newPayment);
    saveToStorage(LOCAL_KEYS.PAYMENTS, payments);
    return newPayment;
  },

  approve: async (id: number, approvedBy: string): Promise<Payment> => {
    const payments = getFromStorage<Payment>(LOCAL_KEYS.PAYMENTS);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    
    payments[index] = {
      ...payments[index],
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString()
    };
    saveToStorage(LOCAL_KEYS.PAYMENTS, payments);
    return payments[index];
  },

  reject: async (id: number, rejectedBy: string, reason: string): Promise<Payment> => {
    const payments = getFromStorage<Payment>(LOCAL_KEYS.PAYMENTS);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    
    payments[index] = {
      ...payments[index],
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    };
    saveToStorage(LOCAL_KEYS.PAYMENTS, payments);
    return payments[index];
  }
};

// ==================== CHAT ====================
export const ChatAPI = {
  getMessages: async (): Promise<ChatMessage[]> => {
    return getFromStorage<ChatMessage>(LOCAL_KEYS.CHAT_MESSAGES);
  },

  sendMessage: async (message: string, sender: 'user' | 'provider' | 'system', senderName?: string): Promise<ChatMessage> => {
    const messages = getFromStorage<ChatMessage>(LOCAL_KEYS.CHAT_MESSAGES);
    const newMessage: ChatMessage = {
      id: getNextId(messages),
      sender,
      message,
      timestamp: new Date().toISOString(),
      senderName
    };
    messages.push(newMessage);
    saveToStorage(LOCAL_KEYS.CHAT_MESSAGES, messages);
    return newMessage;
  },

  clear: async (): Promise<void> => {
    localStorage.removeItem(LOCAL_KEYS.CHAT_MESSAGES);
  }
};

// ==================== STATS ====================
export const StatsAPI = {
  getStats: async (): Promise<PlatformStats> => {
    const providers = getFromStorage<Provider>(LOCAL_KEYS.PROVIDERS);
    const bookings = getFromStorage<Booking>(LOCAL_KEYS.BOOKINGS);
    const payments = getFromStorage<Payment>(LOCAL_KEYS.PAYMENTS);
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.createdAt?.startsWith(today)).length;
    
    const totalRevenue = payments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingApprovals = payments.filter(p => p.status === 'pending_approval').length;
    
    return {
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.status === 'active').length,
      totalCategories: 5,
      totalBookings: bookings.length,
      totalRevenue,
      pendingApprovals,
      todayBookings
    };
  }
};

// ==================== ACTIVITY LOG ====================
export const ActivityAPI = {
  getAll: async (): Promise<ActivityLog[]> => {
    return getFromStorage<ActivityLog>(LOCAL_KEYS.ACTIVITY_LOG);
  },

  add: async (message: string, type: ActivityLog['type'] = 'info', user?: string): Promise<ActivityLog> => {
    const logs = getFromStorage<ActivityLog>(LOCAL_KEYS.ACTIVITY_LOG);
    const newLog: ActivityLog = {
      id: getNextId(logs),
      message,
      type,
      timestamp: new Date().toISOString(),
      user
    };
    logs.push(newLog);
    saveToStorage(LOCAL_KEYS.ACTIVITY_LOG, logs);
    return newLog;
  }
};

// ==================== AUTH ====================
export const AuthAPI = {
  adminLogin: async (username: string, password: string): Promise<boolean> => {
    // Only you can access admin - hardcoded credentials
    if (username === 'BillionsPartner' && password === '010010') {
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminSessionExpiry', sessionExpiry.toString());
      localStorage.setItem('adminLastActivity', Date.now().toString());
      return true;
    }
    return false;
  },

  adminLogout: (): void => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminSessionExpiry');
    localStorage.removeItem('adminLastActivity');
  },

  checkSession: (): boolean => {
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    const expiry = localStorage.getItem('adminSessionExpiry');
    
    if (!isAuth || !expiry || Date.now() > parseInt(expiry)) {
      AuthAPI.adminLogout();
      return false;
    }
    
    // Update last activity
    localStorage.setItem('adminLastActivity', Date.now().toString());
    return true;
  },

  updateActivity: (): void => {
    localStorage.setItem('adminLastActivity', Date.now().toString());
  }
};

// ==================== SETTINGS ====================
export const SettingsAPI = {
  get: async (): Promise<Record<string, any>> => {
    const settings = localStorage.getItem(LOCAL_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  },

  update: async (data: Record<string, any>): Promise<void> => {
    const current = await SettingsAPI.get();
    localStorage.setItem(LOCAL_KEYS.SETTINGS, JSON.stringify({ ...current, ...data }));
  }
};

// Export all APIs
export const API = {
  providers: ProviderAPI,
  bookings: BookingAPI,
  applications: ApplicationAPI,
  contacts: ContactAPI,
  payments: PaymentAPI,
  chat: ChatAPI,
  stats: StatsAPI,
  activity: ActivityAPI,
  auth: AuthAPI,
  settings: SettingsAPI
};

export default API;
