import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn, getDirectDriveUrl } from '@/lib/utils';
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';

const DEFAULT_GALLERY = [
  { id: 'g-1', category: 'Nature', caption: 'Суут Резортын үзэсгэлэнт байгаль, уудам уулсын дүр төрх', image: 'https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG' },
  { id: 'g-2', category: 'Nature', caption: 'Хусан ойн нам гүм, цэнгэг агаарт алхан биеэ журамшуулах замын агшин', image: 'https://lh3.googleusercontent.com/d/1VPMeteBUV7gEU-Ay-GqdoINLS-gUJW7H' },
  { id: 'g-3', category: 'Nature', caption: 'Ногоон зүлэг, өвөрмөц тохижилт бүхий задгай талбайн хэсэг', image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9' },
  { id: 'g-4', category: 'Rooms', caption: 'Ая тухтай, орчин үеийн гэр бүлийн дотоод засал чимэглэл бүхий стандарт өрөө', image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa' },
  { id: 'g-5', category: 'Rooms', caption: 'Тав тухыг дээд зэргээр хангасан, толигор өрөөний дулаахан унтлагын хэсэг', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
  { id: 'g-6', category: 'Houses', caption: 'Байгальд орших цэвэр модон тансаг зэрэглэлийн хаусны гаднах болон орчны харагдах байдал', image: 'https://lh3.googleusercontent.com/d/1IoAQw8BDVtkB4dL3ZC6ek7U6SfKdh_gu' },
  { id: 'g-7', category: 'Houses', caption: 'Хүүхдийн тоглоомын хэсэг болон амрах талбай бүхий гэр бүлд зориулагдсан модон хаус', image: 'https://lh3.googleusercontent.com/d/1cQEYwq-79GPLXX6QmOyDrrQ_bwX51Z8T' },
  { id: 'g-8', category: 'Houses', caption: 'Хус модны төгөлд байрласан тухлаг, уламжлалт хэв маягийг шингээсэн зуслангийн гэр', image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa' },
  { id: 'g-9', category: 'Houses', caption: 'Харуулц хангасан тагттай, цэлгэр цонхтой байгалийн үзэмжит хаусны дүр зураг', image: 'https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__' },
  { id: 'g-10', category: 'Houses', caption: 'Үдшийн гэрэлтүүлэгтэй маш тохилог, намуухан амралтын модон сууцнууд', image: 'https://lh3.googleusercontent.com/d/1weJpTiCTRZwGq5smajOL4tcOQWj2mqjG' },
];

const categories = ['Бүгд', 'Байгаль', 'Амралт', 'Хаус'];

export default function Gallery() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>(
    (location.state as any)?.category || 'Бүгд'
  );
  const [galleryList, setGalleryList] = useState<any[]>(DEFAULT_GALLERY);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Read gallery data from firestore in real-time with LocalStorage fallback
  useEffect(() => {
    const loadMerged = (firestoreItems: any[] = []) => {
      const localCustom = JSON.parse(localStorage.getItem('suut_custom_gallery') || '[]');
      
      // If a Firestore item is also in local storage (i.e. edited locally), prioritize the local storage version
      const combined = firestoreItems.map(fItem => {
        const localMatch = localCustom.find((lItem: any) => lItem.id === fItem.id);
        return localMatch ? { ...fItem, ...localMatch } : fItem;
      });

      localCustom.forEach((localItem: any) => {
        const exists = combined.some(item => item.id === localItem.id || item.image === localItem.image);
        if (!exists) {
          combined.push(localItem);
        }
      });

      // Merge custom items with DEFAULT_GALLERY
      const merged = [
        ...combined,
        ...DEFAULT_GALLERY.filter(def => !combined.some(cust => cust.image === def.image))
      ];
      setGalleryList(merged);
    };

    // Load instantly from localStorage first
    loadMerged([]);

    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));

    const parseSnapshot = (snapshot: any) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          image: data.image || '',
          category: data.category || 'Nature',
          caption: data.caption || '',
          createdAt: data.createdAt
        });
      });
      return items;
    };

    // 1. One-shot fetch fallback for fast, reliable load on Edge and mobile browsers where WebSocket/long-polling is blocked
    getDocs(q).then((snapshot) => {
      const items = parseSnapshot(snapshot);
      if (items.length > 0) {
        loadMerged(items);
      }
    }).catch((err) => {
      console.warn('Gallery pre-fetching via getDocs failed (will rely on onSnapshot):', err);
    });

    // 2. Real-time snapshot listening
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = parseSnapshot(snapshot);
      loadMerged(items);
    }, (err) => {
      console.warn("Gallery listening failed (will preserve fetched fallback):", err);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = galleryList.filter(item => {
    if (activeCategory === 'Бүгд') return true;
    if (activeCategory === 'Байгаль') return item.category === 'Nature';
    if (activeCategory === 'Амралт') return item.category === 'Rooms';
    if (activeCategory === 'Хаус') return item.category === 'Houses';
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
            alt="Gallery Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-4"
          >
            Зургийн <span className="text-brand-yellow italic">Цомог</span>
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            SUUT RESORT-ын үзэсгэлэнт төрх, тав тухтай орчинг гэрэл зургаас сонирхоорой.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-8 py-2 rounded-full font-medium transition-all",
                  activeCategory === category 
                    ? "bg-brand-teal text-white shadow-lg" 
                    : "bg-brand-teal/5 text-brand-teal hover:bg-brand-teal/10"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
                onClick={() => setSelectedItem(item)}
              >
                <img 
                  src={getDirectDriveUrl(item.image)} 
                  alt={item.caption || `Gallery ${item.id}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Dark gradient overlay at the bottom always visible, containing custom stylized caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse" />
                    <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider">
                      {item.category === 'Nature' ? 'Байгаль' : item.category === 'Rooms' ? 'Амралт' : 'Хаус'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-serif line-clamp-2 text-slate-100 font-medium leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                {/* Overlaid zoom/maximize indicator appearing on hover */}
                <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/95 text-brand-teal rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 cursor-pointer"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-brand-yellow hover:scale-110 transition-all bg-white/10 p-2.5 rounded-full cursor-pointer z-50 hover:bg-white/20"
            onClick={() => setSelectedItem(null)}
          >
            <X size={28} />
          </button>
          
          <div 
            className="max-w-4xl w-full flex flex-col items-center justify-center gap-6 relative" 
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[70vh] bg-neutral-900 flex items-center justify-center"
            >
              <img 
                src={getDirectDriveUrl(selectedItem.image)} 
                alt={selectedItem.caption || "Gallery"} 
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {selectedItem.caption && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl text-center shadow-2xl border border-white/10"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse" />
                  <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest">
                    {selectedItem.category === 'Nature' ? 'Байгаль' : selectedItem.category === 'Rooms' ? 'Амралт' : 'Хаус'}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse" />
                </div>
                <p className="font-serif text-sm md:text-base leading-relaxed tracking-wide text-slate-100">
                  {selectedItem.caption}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
