import { motion } from 'motion/react';
import React from 'react';
import { Users, Maximize, CheckCircle2, ArrowRight, Facebook, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const houses = [
  {
    id: 'villa-1',
    title: 'Цэвэр Модон Хаус - Тав тух, Халаалт',
    description: 'Таны тав тухыг дээд зэргээр хангах үүднээс шалны болон нам даралтын халаалттай, шинэ тавилга, том дэлгэцтэй телевизор гэх мэт хэрэгцээт бүх зүйлээр бүрэн тохижуулсан цэвэр модон хаус.',
    capacity: '25 хүртэлх хүн',
    size: '175 м.кв /2 давхар/',
    price: '600,000₮ - 800,000₮ / хоног',
    prices: [
      { label: 'Ням-Пүрэв хоногоор', value: '600,000₮' },
      { label: 'Баасан, Бямбад хоногоор', value: '800,000₮' }
    ],
    features: [
      '25 хүний багтаамжтай 🤩',
      'Халаалттай /шалны & нам даралтын цахилгаан/',
      'Шинэ тавилгуудтай /80’ TV, хөргөгч, дуков/',
      '2 ариун цэврийн өрөөтэй 🔥'
    ],
    image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa'
  },
  {
    id: 'villa-2',
    title: 'Цэвэр Модон Хаус - Унтлагын хэсэг & Амралт',
    description: 'Маш тохилог 2 унтлагын өрөө болон гэр бүл, найз нөхдөөрөө хангалттай унтаж амрах ор, зөөлөн мишок зэрэг унтлагын иж бүрдэлтэй.',
    capacity: '25 хүртэлх хүн',
    size: '175 м.кв /2 давхар/',
    price: '600,000₮ - 800,000₮ / хоног',
    prices: [
      { label: 'Ням-Пүрэв хоногоор', value: '600,000₮' },
      { label: 'Баасан, Бямбад хоногоор', value: '800,000₮' }
    ],
    features: [
      '2 унтлагын өрөөтэй 🛌',
      '7 ор /double size/',
      'Нэмэлтээр маш тухтай 10 эвхдэг ор, 20 мишок',
      'Гал тогооны иж бүрэн хэрэгсэлтэй /25 хүний/'
    ],
    image: 'https://lh3.googleusercontent.com/d/1IoAQw8BDVtkB4dL3ZC6ek7U6SfKdh_gu'
  },
  {
    id: 'villa-3',
    title: 'Цэвэр Модон Хаус - Тоглоом & Энтертайнмент',
    description: 'Амралтын өдрөө улам сонирхолтой болгох караоке, биллиардтай бөгөөд гадаа талбайд ширээний теннис, шорлогны зуух, ил гал түлэх хэсэгтэй. Захиалгаар амтлаг хоолоор үйлчлүүлэх боломжтой.',
    capacity: '25 хүртэлх хүн',
    size: '175 м.кв /2 давхар/',
    price: '600,000₮ - 800,000₮ / хоног',
    prices: [
      { label: 'Ням-Пүрэв хоногоор', value: '600,000₮' },
      { label: 'Баасан, Бямбад хоногоор', value: '800,000₮' }
    ],
    features: [
      'Караоке, камен зуух, чимэглэлтэй 🎤🎼',
      'Биллиард, даалуу, шатартай 🎱',
      'Шорлогны зуухтай 😋',
      'Захиалгаар энгийн, баярын хоол гарна. 👨‍🍳'
    ],
    image: 'https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__'
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
                    {('prices' in house) ? (
                      <div className="space-y-1.5 bg-brand-teal/5 p-3 rounded-lg border border-brand-teal/10">
                        {(house as any).prices.map((p: any, idx: number) => (
                          <div key={idx} className="text-xs md:text-sm flex items-center justify-between gap-4">
                            <span className="text-brand-teal/70 font-medium">{p.label}:</span>
                            <span className="font-bold text-brand-red">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-brand-teal">{(house as any).price}</span>
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

      {/* Dynamic Links Section Above Footer */}
      <section className="pb-24 pt-4 bg-white border-t border-brand-teal/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/gallery"
              state={{ category: "Хаус" }}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-teal text-white hover:bg-brand-teal/90 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-md w-full sm:w-auto"
            >
              <Image size={22} className="text-brand-yellow" />
              ХАУС бусад зураг үзэх
            </Link>
            
            <a
              href="https://www.facebook.com/profile.php?id=61584518352323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1877F2]/10 text-[#1877F2] border-2 border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-md w-full sm:w-auto"
            >
              <Facebook size={22} />
              Хаусын Facebook хуудас
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
