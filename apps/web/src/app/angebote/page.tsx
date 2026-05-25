'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { Search, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  beerPrice: number;
  beerUnit: string;
  images: string[];
  sellerName: string;
  sellerPhotoURL: string | null;
  createdAt: any;
}

export default function AngebotePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, 'listings'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const fetchedListings: Listing[] = [];
        querySnapshot.forEach((doc) => {
          fetchedListings.push({ id: doc.id, ...doc.data() } as Listing);
        });
        setListings(fetchedListings);
      } catch (error) {
        console.error("Fehler beim Laden der Inserate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Small Search Header */}
      <div className="w-full bg-card border-b border-border py-6 px-4 flex justify-center">
        <div className="w-full max-w-5xl bg-background rounded-full shadow-sm p-1.5 flex items-center border border-border">
          <div className="flex-1 flex items-center px-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input 
              type="text" 
              placeholder="Was suchst du?" 
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base px-0 h-10"
            />
          </div>
          <Button className="h-10 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-medium">
            Finden
          </Button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto pt-8 px-4 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Neueste Angebote</h1>
          <p className="text-muted-foreground">{listings.length} Ergebnisse</p>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="w-full text-center py-20 bg-card rounded-xl border border-border">
            <p className="text-lg text-muted-foreground">Keine Inserate gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link href={`/angebote/${listing.id}`} key={listing.id}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer flex flex-col h-full">
                  
                  {/* Image Container */}
                  <div className="w-full h-48 bg-muted relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Kein Bild
                      </div>
                    )}
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-border flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{listing.beerPrice}</span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {listing.beerUnit === 'flasche' ? '🍺' : listing.beerUnit === 'kiste' ? '🍻' : listing.beerUnit === 'dose' ? '🥫' : '🛢️'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {listing.sellerPhotoURL ? (
                          <img src={listing.sellerPhotoURL} alt={listing.sellerName} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {listing.sellerName?.charAt(0) || '?'}
                          </div>
                        )}
                        <span className="truncate max-w-[100px]">{listing.sellerName?.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Neu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
