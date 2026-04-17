import { motion } from 'motion/react';
import React from 'react';
import { Users, Maximize, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const houses = [
  {
    id: 'villa-1',
    title: 'Тав тухтай Вилла',
    description: 'Гэр бүл, найз нөхдөөрөө амрахад хамгийн тохиромжтой, орчин үеийн шийдэл бүхий тав тухтай вилла.',
    capacity: '6-8 хүн',
    size: '120 м.кв',
    price: '450,000₮ / хоног',
    features: ['3 унтлагын өрөө', '2 ариун цэврийн өрөө', 'Гал тогоо', 'Зочны өрөө', 'Террас'],
    image: 'https://lh3.googleusercontent.com/d/15Bp6lMsOa5kELfVPEmG2xtgv0AwlaNJN'
  },
  {
    id: 'villa-2',
    title: 'Ой модны Вилла',
    description: 'Ой модны захад байрлах, байгальтайгаа хамгийн ойрхон мэдрэмжийг төрүүлэх вилла.',
    capacity: '4-6 хүн',
    size: '90 м.кв',
    price: '350,000₮ / хоног',
    features: ['2 унтлагын өрөө', '1 ариун цэврийн өрөө', 'Гал тогоо', 'Зочны өрөө', 'Террас'],
    image: 'https://lh3.googleusercontent.com/d/1OWnzvTHAaMOfQ3l0IsMxayzXi6bhNkfd'
  },
  {
    id: 'villa-3',
    title: 'Гэр бүлийн Вилла',
    description: 'Бага насны хүүхэдтэй гэр бүлд зориулсан, аюулгүй, тав тухтай орчинтой вилла.',
    capacity: '4 хүн',
    size: '75 м.кв',
    price: '280,000₮ / хоног',
    features: ['2 унтлагын өрөө', '1 ариун цэврийн өрөө', 'Гал тогоо', 'Зочны өрөө', 'Террас'],
    image: 'https://lh3.googleusercontent.com/d/1tiyuEYQ8eHZlLsFng6zYfMCytWSmJha2'
  }
];

export default function Houses() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center text-white overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1CS7XHvUWir3_JHVNnSFKQ9bCrhAzN-Dx" 
            alt="Houses Hero" 
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
            Тав тухтай <span className="text-brand-yellow italic">Вилла</span>
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Таны тав тухыг дээд зэргээр хангасан, байгалийн үзэсгэлэнт газарт байрлах байшингууд.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          {houses.map((house, i) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "flex flex-col lg:flex-row gap-12 items-center",
                i % 2 !== 0 && "lg:flex-row-reverse"
              )}
            >
              <div className="w-full lg:w-1/2">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group">
                  <img 
                    src={house.image} 
                    alt={house.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-bold text-brand-teal">{house.title}</h2>
                  <p className="text-lg text-brand-teal/70 leading-relaxed">{house.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 text-brand-teal">
                    <Users className="text-brand-yellow" size={20} />
                    <span className="font-medium">{house.capacity}</span>
                  </div>
                  <div className="flex items-center gap-3 text-brand-teal">
                    <Maximize className="text-brand-green" size={20} />
                    <span className="font-medium">{house.size}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-brand-teal">Давуу талууд:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {house.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-brand-teal/80">
                        <CheckCircle2 className="text-brand-green" size={16} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-brand-teal/10">
                  <div>
                    <span className="text-sm text-brand-teal/50 block">Үнэ</span>
                    <span className="text-2xl font-bold text-brand-teal">{house.price}</span>
                  </div>
                  <Link to="/booking" className="btn-primary flex items-center gap-2 group">
                    Захиалах <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
