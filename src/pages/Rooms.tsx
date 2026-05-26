import { motion } from 'motion/react';
import { Users, Bed, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const rooms = [
  {
    id: 'room-1',
    title: 'Стандарт өрөө',
    description: 'Хоёр хүний тав тухтай амрахад зориулсан стандарт өрөө.',
    capacity: '2 хүн',
    bed: '2 ор',
    price: '180,000₮ / хоног',
    amenities: ['Wi-Fi', 'ТВ', 'Мини бар', 'Ариун цэврийн өрөө'],
    image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU'
  },
  {
    id: 'room-2',
    title: 'Хосын өрөө',
    description: 'Хосуудад зориулсан тав тухтай, орчин үеийн тохижилт бүхий өрөө.',
    capacity: '2 хүн',
    bed: '1 хаан ор',
    price: '250,000₮ / хоног',
    amenities: ['Wi-Fi', 'ТВ', 'Мини бар', 'Ариун цэврийн өрөө', 'Террас'],
    image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa'
  },
  {
    id: 'room-3',
    title: 'Хаус',
    description: 'Гэр бүл, найз нөхдөөрөө амрахад зориулсан, тусдаа байрлах хаус.',
    capacity: '4-6 хүн',
    bed: '2 том ор',
    price: '320,000₮ / хоног',
    amenities: ['Wi-Fi', 'ТВ', 'Мини бар', 'Ариун цэврийн өрөө', 'Гал тогооны хэсэг'],
    image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU'
  }
];

export default function Rooms() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__" 
            alt="Rooms Hero" 
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
            Тав тухтай <span className="text-brand-yellow italic">Өрөөнүүд</span>
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Таны амралтыг илүү тухтай болгох орчин үеийн шийдэл бүхий өрөөнүүд.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-brand-teal/5"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={room.image} 
                    alt={room.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-brand-teal font-bold text-sm">
                    {room.price}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-brand-teal">{room.title}</h3>
                    <p className="text-sm text-brand-teal/60 leading-relaxed">{room.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-brand-teal/70">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-brand-yellow" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-brand-green" />
                      <span>{room.bed}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-teal/40">Тохижилт:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-brand-teal/5 rounded-full text-xs text-brand-teal/70 font-medium">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to="/booking" className="btn-primary w-full flex items-center justify-center gap-2 group">
                    Захиалах <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
