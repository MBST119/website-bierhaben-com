'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, Clock, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  beerPrice: number;
  beerUnit: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhotoURL: string | null;
  createdAt: any;
}

export default function InseratDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'listings', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactSeller = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!listing) return;

    // Don't chat with yourself
    if (user.uid === listing.sellerId) {
      alert("Das ist dein eigenes Inserat!");
      return;
    }

    // Generate a unique chat ID based on the listing and the two users
    // This ensures only 1 chat per listing per buyer-seller pair
    const chatId = `${listing.id}_${user.uid}_${listing.sellerId}`;
    
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      // Create new chat document
      await setDoc(chatRef, {
        listingId: listing.id,
        listingTitle: listing.title,
        participantIds: [user.uid, listing.sellerId],
        participantNames: {
          [user.uid]: user.displayName || user.email,
          [listing.sellerId]: listing.sellerName
        },
        lastMessage: "Chat gestartet",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    // Redirect to chat page
    router.push(`/nachrichten`);
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Inserat nicht gefunden</h1>
        <Link href="/angebote" className={buttonVariants({ variant: "default" })}>
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 px-4 pb-24">
      <Link href="/angebote" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zur Suche
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Left: Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border">
            {listing.images && listing.images.length > 0 ? (
              <img 
                src={listing.images[activeImage]} 
                alt={listing.title} 
                className="w-full h-full object-contain bg-black/5"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Kein Bild verfügbar
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Contact */}
        <div className="flex flex-col space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h1 className="text-3xl font-extrabold text-foreground mb-4 leading-tight">{listing.title}</h1>
            
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-5xl font-black text-primary">{listing.beerPrice}</span>
              <span className="text-xl font-bold text-muted-foreground pb-1">
                {listing.beerUnit === 'flasche' ? 'Flaschen' : listing.beerUnit === 'kiste' ? 'Kisten' : listing.beerUnit === 'dose' ? 'Dosen' : 'Fässer'}
              </span>
            </div>

            <Button 
              onClick={handleContactSeller}
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Verkäufer kontaktieren
            </Button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Über den Verkäufer</h3>
            <div className="flex items-center gap-4">
              {listing.sellerPhotoURL ? (
                <img src={listing.sellerPhotoURL} alt={listing.sellerName} className="w-14 h-14 rounded-full border border-border" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                  {listing.sellerName?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-bold text-foreground text-lg">{listing.sellerName}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Geprüftes Mitglied
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Kategorie</dt>
                <dd className="font-medium text-foreground capitalize">{listing.category}</dd>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Zustand</dt>
                <dd className="font-medium text-foreground capitalize">{listing.condition.replace('_', ' ')}</dd>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">Eingestellt am</dt>
                <dd className="font-medium text-foreground">
                  {listing.createdAt?.toDate().toLocaleDateString('de-DE') || 'Gerade eben'}
                </dd>
              </div>
            </dl>

            <h3 className="font-bold text-lg mt-6 mb-2">Beschreibung</h3>
            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
