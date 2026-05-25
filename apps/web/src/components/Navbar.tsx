'use client';

import Link from 'next/link';
import { MessageSquare, User, LogIn, LogOut } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <nav className="w-full h-20 px-8 flex items-center justify-between bg-transparent relative z-10">
      {/* Logo Area */}
      <Link href="/" className="flex items-center">
        <div className="relative w-32 h-12">
          {/* We will need to place the actual logo in public/logo.png later */}
          <div className="font-extrabold text-2xl text-foreground flex items-center">
            <span className="text-primary mr-1">bier</span>haben<span className="text-primary text-sm ml-1 mt-2">.com</span>
          </div>
        </div>
      </Link>

      {/* Main Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-foreground font-medium hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/angebote" className="text-foreground font-medium hover:text-primary transition-colors">
          Angebote durchsuchen
        </Link>
        {user && (
          <Link href="/inserieren" className={buttonVariants({ variant: "secondary", className: "bg-primary/10 text-primary hover:bg-primary/20 border-none" })}>
            Inserat erstellen
          </Link>
        )}
      </div>

      {/* User / Actions */}
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link href="/nachrichten" className="flex items-center text-foreground font-medium hover:text-primary transition-colors">
              <MessageSquare className="w-5 h-5 mr-2" />
              Nachrichten
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profil" className="flex items-center text-foreground font-medium hover:text-primary transition-colors">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <User className="w-5 h-5 mr-2" />
                )}
                {user.displayName?.split(' ')[0] || 'Profil'}
              </Link>
              <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <Link href="/login" className={buttonVariants({ variant: "default", className: "bg-foreground text-background hover:bg-foreground/90 rounded-full px-6" })}>
            <LogIn className="w-4 h-4 mr-2" />
            Anmelden
          </Link>
        )}
      </div>
    </nav>
  );
}
