import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center pb-20">
      
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-24 pb-16 px-4">
        
        {/* Placeholder for the big logo */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Der Biermarkt für die DACH-Region</h2>
          <div className="text-6xl font-black text-foreground drop-shadow-sm tracking-tight flex items-center justify-center gap-2">
            <span className="text-primary bg-white px-4 py-2 rounded-2xl shadow-sm border-4 border-primary">bier</span>
            haben<span className="text-primary">.com</span>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-foreground tracking-tight text-center max-w-4xl mb-6">
          Der Biermarkt für die DACH-Region
        </h1>
        
        <p className="text-xl text-foreground/80 text-center max-w-2xl mb-12">
          Alles für eine Kiste Bier. Die Tauschbörse, wo Gegenstände in Bier statt Euro gehandelt werden.
        </p>

        {/* Action Buttons (from screenshot) */}
        <div className="flex items-center gap-4 mb-16">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/30">
            <Search className="w-5 h-5 mr-2" />
            Angebote durchsuchen
          </Button>
          <Button size="lg" variant="secondary" className="bg-foreground hover:bg-foreground/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Inserat erstellen
          </Button>
        </div>

      </section>

      {/* Main Content Area */}
      <section className="w-full max-w-7xl px-4 flex flex-col items-center">
        {/* Search Bar matching the Willhaben style */}
        <div className="w-full max-w-4xl bg-card rounded-full shadow-md p-2 flex items-center border border-border/50">
          <div className="flex-1 flex items-center px-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input 
              type="text" 
              placeholder="Suche nach Titel oder Beschreibung..." 
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-lg px-0 h-12 placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          <div className="w-48 px-2">
            <select className="w-full h-12 bg-transparent border-0 outline-none text-foreground cursor-pointer focus:ring-0">
              <option value="">Alle Kategorien</option>
              <option value="moebel">🪑 Möbel</option>
              <option value="elektronik">📱 Elektronik</option>
              <option value="kleidung">👕 Kleidung</option>
            </select>
          </div>
          <Button className="h-12 px-8 rounded-full bg-foreground text-white hover:bg-foreground/90 font-medium">
            Finden
          </Button>
        </div>
      </section>

    </div>
  );
}
