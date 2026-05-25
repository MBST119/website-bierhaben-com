'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';

interface Chat {
  id: string;
  listingId: string;
  listingTitle: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  updatedAt: any;
}

export default function NachrichtenPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      // Real-time listener for user's chats
      const q = query(
        collection(db, 'chats'),
        where('participantIds', 'array-contains', user.uid),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedChats: Chat[] = [];
        snapshot.forEach((doc) => {
          fetchedChats.push({ id: doc.id, ...doc.data() } as Chat);
        });
        setChats(fetchedChats);
        setChatsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, loading, router]);

  if (loading || chatsLoading) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pt-8 px-4 pb-24 flex flex-col h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-extrabold text-foreground mb-6">Meine Nachrichten</h1>
      
      <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {chats.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-xl font-medium text-foreground mb-2">Noch keine Nachrichten</p>
            <p className="max-w-md">Wenn du jemanden wegen eines Inserats anschreibst oder jemand deines kommentiert, tauchen die Chats hier auf.</p>
          </div>
        ) : (
          <div className="divide-y divide-border overflow-y-auto">
            {chats.map((chat) => {
              // Find the other user's name
              const otherUserId = chat.participantIds.find(id => id !== user?.uid);
              const otherUserName = otherUserId ? chat.participantNames[otherUserId] : 'Unbekannt';

              return (
                <Link href={`/nachrichten/${chat.id}`} key={chat.id}>
                  <div className="w-full p-4 hover:bg-muted/50 transition-colors flex items-start gap-4 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                      {otherUserName.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-foreground truncate pr-4">{otherUserName}</h3>
                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{chat.updatedAt?.toDate().toLocaleDateString() || 'Gerade eben'}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs font-semibold text-primary mb-1 truncate">
                        Inserat: {chat.listingTitle}
                      </p>
                      
                      <p className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
