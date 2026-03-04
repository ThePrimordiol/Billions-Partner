import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API } from '@/services/api';
import type { Provider } from '@/types';

// Fix for default markers
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Category-specific colors
const categoryColors: Record<string, string> = {
  electrical: '#f59e0b',
  plumbing: '#06b6d4',
  painting: '#22c55e',
  ac: '#3b82f6',
  cleaning: '#a855f7'
};

// Major city coordinates in Nigeria for realistic provider placement
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
  'Ibadan': { lat: 7.3775, lng: 3.9470 },
  'Kano': { lat: 12.0022, lng: 8.5920 },
  'Kaduna': { lat: 10.5105, lng: 7.4165 },
  'Benin City': { lat: 6.3350, lng: 5.6037 },
  'Enugu': { lat: 6.5244, lng: 7.5186 },
  'Onitsha': { lat: 6.1667, lng: 6.7833 },
  'Aba': { lat: 5.1066, lng: 7.3667 },
  'Owerri': { lat: 5.4836, lng: 7.0333 },
  'Uyo': { lat: 5.0510, lng: 7.9333 },
  'Calabar': { lat: 4.9757, lng: 8.3417 },
  'Jos': { lat: 9.8965, lng: 8.8583 },
  'Ilorin': { lat: 8.4966, lng: 4.5421 },
  'Maiduguri': { lat: 11.8464, lng: 13.1603 }
};

// Nigeria center coordinates
const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };

interface ServiceMapProps {
  category: string;
  height?: string;
  showAll?: boolean;
}

// Generate coordinates for a provider based on their service areas
const generateProviderCoordinates = (provider: Provider): { lat: string; lng: string } => {
  // Try to find a matching city from the provider's areas
  for (const area of provider.areas) {
    const cityKey = Object.keys(cityCoordinates).find(city => 
      area.toLowerCase().includes(city.toLowerCase())
    );
    if (cityKey) {
      const coords = cityCoordinates[cityKey];
      // Add small random offset to prevent markers from overlapping
      const offset = 0.05;
      return {
        lat: (coords.lat + (Math.random() - 0.5) * offset).toString(),
        lng: (coords.lng + (Math.random() - 0.5) * offset).toString()
      };
    }
  }
  
  // Default to Nigeria center with random offset
  const offset = 2;
  return {
    lat: (NIGERIA_CENTER.lat + (Math.random() - 0.5) * offset).toString(),
    lng: (NIGERIA_CENTER.lng + (Math.random() - 0.5) * offset).toString()
  };
};

export default function ServiceMap({ category, height = '400px', showAll = false }: ServiceMapProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      setIsLoading(true);
      try {
        const data = showAll 
          ? await API.providers.getAll()
          : await API.providers.getAll(category);
        
        // Filter only active providers
        const activeProviders = data.filter(p => p.status === 'active');
        
        // Generate coordinates for providers that don't have them
        const withCoords = activeProviders.map((p) => {
          if (p.lat && p.lng) {
            return p;
          }
          const coords = generateProviderCoordinates(p);
          return {
            ...p,
            lat: coords.lat,
            lng: coords.lng
          };
        });
        
        setProviders(withCoords);
      } catch (error) {
        console.error('Error loading providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, [category, showAll]);

  if (isLoading) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No providers available for this service yet.</p>
          <p className="text-gray-500 text-sm mt-1">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={[NIGERIA_CENTER.lat, NIGERIA_CENTER.lng]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[parseFloat(provider.lat!), parseFloat(provider.lng!)]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: categoryColors[provider.category] || '#666' }}
                  >
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{provider.name}</h4>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1">{provider.rating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {provider.description || 'Professional service provider'}
                </p>
                
                <div className="space-y-1 text-xs mb-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {provider.areas.slice(0, 2).join(', ')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-3 w-3 mr-1" />
                    {provider.phone}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">
                    ₦{provider.rate.toLocaleString()}/hr
                  </span>
                  <a href={`/booking?category=${provider.category}&provider=${provider.id}`}>
                    <Button size="sm" className="text-xs">
                      Book
                    </Button>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-xs font-semibold mb-2">Service Areas</p>
        <div className="space-y-1">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{cat === 'ac' ? 'AC Repairs' : cat}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Provider Count */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold">
          {providers.length} Provider{providers.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
