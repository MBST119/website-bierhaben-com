'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

export default function InserierenPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('flasche');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 10) {
        alert("Du kannst maximal 10 Bilder hochladen.");
        return;
      }
      setImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Du musst angemeldet sein, um ein Inserat zu erstellen.');
      return;
    }

    if (!title || !description || !category || !price || !unit || !condition) {
      setErrorMsg('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Bitte lade mindestens ein Bild hoch.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Images to Firebase Storage
      const uploadedImageUrls: string[] = [];
      const listingId = uuidv4(); // Generate a temp ID for the storage folder
      
      for (const image of images) {
        const imageRef = ref(storage, `listings/${listingId}/${uuidv4()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedImageUrls.push(downloadUrl);
      }

      // 2. Save Listing to Firestore
      await addDoc(collection(db, 'listings'), {
        title,
        description,
        category,
        beerPrice: parseFloat(price),
        beerUnit: unit,
        condition,
        images: uploadedImageUrls,
        sellerId: user.uid,
        sellerName: user.displayName || "Anonymer User",
        sellerPhotoURL: user.photoURL || null,
        status: "active",
        createdAt: serverTimestamp(),
      });

      setIsUploading(false);
      alert("Inserat erfolgreich veröffentlicht!");
      router.push('/angebote');
      
    } catch (error: any) {
      console.error("Fehler beim Hochladen:", error);
      setErrorMsg('Fehler beim Speichern des Inserats: ' + error.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 px-4 pb-24">
      <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">Inserat erstellen</h1>
      <p className="text-lg text-foreground/80 mb-8">Stelle deinen Gegenstand ein und lege den Bier-Preis fest</p>
      
      <div className="w-full bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Inserat-Details</h2>
          <p className="text-sm text-muted-foreground">Fülle alle Felder aus, um dein Inserat zu veröffentlichen</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
            {errorMsg}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Titel *</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Vintage Sessel in gutem Zustand" 
              className="h-12 text-base" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Beschreibung *</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe deinen Gegenstand im Detail..." 
              className="min-h-[120px] text-base resize-y" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Bilder (max. 10) *</Label>
            
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 10 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-primary/40 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center cursor-pointer"
              >
                <UploadCloud className="w-10 h-10 text-primary mb-3" />
                <p className="text-sm font-medium text-foreground">Klicke hier um Bilder hochzuladen</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">Kategorie *</Label>
            <select 
              id="category" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Wähle eine Kategorie</option>
              <option value="moebel">🪑 Möbel</option>
              <option value="elektronik">📱 Elektronik</option>
              <option value="kleidung">👕 Kleidung</option>
              <option value="fahrzeuge">🚗 Fahrzeuge</option>
              <option value="haushalt">🏠 Haushalt</option>
              <option value="sport">⚽ Sport</option>
              <option value="sonstiges">📦 Sonstiges</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-base font-semibold">Bier-Preis *</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.5" 
                min="0.5" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="z.B. 2.5" 
                className="h-12 text-base" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-base font-semibold">Einheit *</Label>
              <select 
                id="unit" 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="flasche">🍺 Flasche</option>
                <option value="kiste">🍻 Kiste</option>
                <option value="dose">🥫 Dose</option>
                <option value="fass">🛢️ Fass</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-base font-semibold">Zustand *</Label>
            <select 
              id="condition" 
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Wähle den Zustand</option>
              <option value="neu">Neu</option>
              <option value="sehr_gut">Sehr gut</option>
              <option value="gut">Gut</option>
              <option value="akzeptabel">Akzeptabel</option>
            </select>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <Button 
              type="submit" 
              disabled={isUploading}
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Wird veröffentlicht...
                </>
              ) : (
                'Inserat veröffentlichen'
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
