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

interface ServiceMapProps {
  category: string;
  height?: string;
  showAll?: boolean;
}

// Nigeria center coordinates
const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };

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
        
        // Filter only active providers with coordinates
        const activeWithCoords = data.filter(
          p => p.status === 'active' && p.lat && p.lng
        );
        
        // If no coordinates, generate some around Nigeria
        const withCoords = activeWithCoords.map((p) => ({
          ...p,
          lat: p.lat || (NIGERIA_CENTER.lat + (Math.random() - 0.5) * 4).toString(),
          lng: p.lng || (NIGERIA_CENTER.lng + (Math.random() - 0.5) * 4).toString()
        }));
        
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
          <p className="text-gray-600">No providers with location data available.</p>
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
