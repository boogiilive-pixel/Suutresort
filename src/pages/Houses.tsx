import { motion } from 'motion/react';
import React from 'react';
import { Users, Maximize, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const houses = [
  {
    id: 'villa-1',
    title: 'Цэвэр Модон Хаус',
    description: 'Таны тав тухыг дээд зэргээр хангасан, бүрэн тохижуулсан, цэвэр модон хаус түрээсийн үйлчилгээг санал болгож байна.',
    capacity: '25 хүртэлх хүн',
    size: '175 м.кв /2 давхар/',
    price: '600,000₮ - 800,000₮ / хоног',
    prices: [
      { label: 'Ням-Пүрэв хоногоор', value: '600,000₮' },
      { label: 'Баасан, Бямбад хоногоор', value: '800,000₮' }
    ],
    features: [
      'Шорлогны зуухтай 😋',
      '25 хүний багтаамжтай 🤩',
      '7 ор /double size/',
      'Нэмэлтээр маш тухтай 10 эвхдэг ор, 20 мишок',
      '2 унтлагын өрөөтэй 🛌',
      'Шинэ тавилгуудтай /80’ TV, хөргөгч, дуков/',
      'Караоке, камен зуух, чимэглэлтэй 🎤🎼',
      'Биллиард, даалуу, шатартай 🎱',
      'Халаалттай /шалны & нам даралтын цахилгаан/',
      'Гал тогооны иж бүрэн хэрэгсэлтэй /25 хүний/',
      '2 ариун цэврийн өрөөтэй 🔥',
      'Захиалгаар энгийн, баярын хоол гарна. 👨‍🍳'
    ],
    image: 'https://lh3.googleusercontent.com/d/1bkYndNMWSBofxqecozPc7Y_K-ixIw8yN'
  },
  {
    id: 'villa-2',
    title: 'Цэвэр Агаарт Вилла',
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
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1bkYndNMWSBofxqecozPc7Y_K-ixIw8yN" 
            alt="Houses Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Цэвэр <span className="text-brand-yellow italic">Модон Хаус</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-6 leading-relaxed">
            Таны тав тухыг дээд зэргээр хангасан, бүрэн тохижуулсан, цэвэр модон хаус түрээсийн үйлчилгээг санал болгож байна.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full text-sm font-medium text-brand-yellow border border-brand-yellow/30 shadow-lg">
            <span>📍 УБ-Дархан явах замд, 52-ын даваа уруудаад төв замаас 500м</span>
          </div>
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

                <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-teal/10">
                  <div>
                    <span className="text-xs text-brand-teal/50 block uppercase tracking-wider mb-1">Үнэ</span>
                    {'prices' in house ? (
                      <div className="space-y-1.5 bg-brand-teal/5 p-3 rounded-lg border border-brand-teal/10">
                        {(house as any).prices.map((p: any, idx: number) => (
                          <div key={idx} className="text-xs md:text-sm flex items-center justify-between gap-4">
                            <span className="text-brand-teal/70 font-medium">{p.label}:</span>
                            <span className="font-bold text-brand-red">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-brand-teal">{house.price}</span>
                    )}
                  </div>
                  <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 group self-start sm:self-center">
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
