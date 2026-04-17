import { motion } from 'motion/react';
import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const galleryItems = [
  // Nature
  { id: 1, category: 'Nature', image: 'https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG' },
  { id: 2, category: 'Nature', image: 'https://lh3.googleusercontent.com/d/1VPMeteBUV7gEU-Ay-GqdoINLS-gUJW7H' },
  { id: 3, category: 'Nature', image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9' },
  // Rooms
  { id: 4, category: 'Rooms', image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa' },
  { id: 5, category: 'Rooms', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
  // Houses
  { id: 6, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/1OWnzvTHAaMOfQ3l0IsMxayzXi6bhNkfd' },
  { id: 7, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/1cQEYwq-79GPLXX6QmOyDrrQ_bwX51Z8T' },
  { id: 8, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/15Bp6lMsOa5kELfVPEmG2xtgv0AwlaNJN' },
  { id: 9, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/1tiyuEYQ8eHZlLsFng6zYfMCytWSmJha2' },
  { id: 10, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/1weJpTiCTRZwGq5smajOL4tcOQWj2mqjG' },
  { id: 11, category: 'Houses', image: 'https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__' },
];

const categories = ['Бүгд', 'Байгаль', 'Өрөө', 'Байшин'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Бүгд');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = galleryItems.filter(item => {
    if (activeCategory === 'Бүгд') return true;
    if (activeCategory === 'Байгаль') return item.category === 'Nature';
    if (activeCategory === 'Өрөө') return item.category === 'Rooms';
    if (activeCategory === 'Байшин') return item.category === 'Houses';
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
                onClick={() => setSelectedImage(item.image)}
              >
                <img 
                  src={item.image} 
                  alt={`Gallery ${item.id}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-teal">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 md:p-12"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-brand-yellow transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={selectedImage} 
            alt="Selected" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
