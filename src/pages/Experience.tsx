import { motion } from 'motion/react';
import { Leaf, Wind, Sun, Coffee, Camera, Music, Trophy, PartyPopper, Gamepad2, Users, Check, Gift, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const activities = [
  {
    title: 'Гэр бүлийн амралт',
    description: 'Хүүхэд багачууд болон гэр бүлээрээ амарч, тоглож наадах таатай орчин.',
    icon: <Users className="text-brand-yellow" size={32} />,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Спорт өдөрлөг',
    description: 'Хамт олон, найз нөхдөөрөө спортлог, эрч хүчтэй өдрийг өнгөрүүлэх боломж.',
    icon: <Trophy className="text-brand-green" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/13GA1tn0W7kb1SPGXX5qOFcgsHPh4Astm'
  },
  {
    title: 'Хүлээн авалт',
    description: 'Байгууллага, хамт олны тэмдэглэлт баяр, хүлээн авалтыг дээд зэргийн түвшинд зохион байгуулна.',
    icon: <PartyPopper className="text-brand-blue" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1l9TEnSFVdQuWOSTAaQ0x1H0ulKSHb3ld'
  },
  {
    title: 'Биллиард, Теннис тоглох',
    description: 'Чөлөөт цагаа хөгжилтэй өнгөрүүлэх биллиард, ширээний теннисний өрөө.',
    icon: <Gamepad2 className="text-brand-red" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1weJpTiCTRZwGq5smajOL4tcOQWj2mqjG'
  }
];

export default function Experience() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden pt-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1SP5kKNUIDG7g4pepO_Xr1vK9RyDis7ay" 
            alt="Experience Hero" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Амралтын <span className="text-brand-yellow italic">Мэдрэмж</span>
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Байгаль эхтэйгээ ойрхон, амар амгалан орчинд өөрийгөө олж, эрч хүчээ сэлбээрэй.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-brand-green font-bold tracking-widest uppercase text-sm">Байгаль ба Та</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal leading-tight">
                  Амар амгалангийн <br /> эрэлд
                </h2>
              </div>
              <p className="text-lg text-brand-teal/70 leading-relaxed">
                SUUT RESORT нь хотоос ердөө 56 км зайд байрладаг бөгөөд эргэн тойрондоо уулс, ой модоор хүрээлэгдсэн байдаг. Энэхүү байгалийн үзэсгэлэнт газар нь таныг хотын чимээ шуугианаас холдуулж, жинхэнэ амралтыг мэдрүүлэх болно.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                    <Sun size={24} />
                  </div>
                  <span className="font-medium text-brand-teal">Цэвэр агаар</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                    <Leaf size={24} />
                  </div>
                  <span className="font-medium text-brand-teal">Ой мод</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Wind size={24} />
                  </div>
                  <span className="font-medium text-brand-teal">Амар амгалан</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                    <Coffee size={24} />
                  </div>
                  <span className="font-medium text-brand-teal">Тав тух</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://lh3.googleusercontent.com/d/1kv2V6jZAlweHGZV2f8kc0YWbT_rmgFWn" 
                  alt="Nature" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-yellow rounded-2xl -z-10" />
            </motion.div>
          </div>

          {/* Activities */}
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-brand-red font-bold tracking-widest uppercase text-sm">Үйл ажиллагаа</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Таны хийж болох зүйлс</h2>
              <p className="text-brand-teal/60">Амралтынхаа хугацаанд та дараах үйл ажиллагаануудад оролцож, цагийг зугаатай өнгөрүүлэх боломжтой.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activities.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/90 via-brand-teal/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <div className="min-h-[4rem] flex items-start">
                      <h3 className="text-2xl font-serif font-bold leading-tight">{item.title}</h3>
                    </div>
                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                      <p className="text-sm text-white/70 pt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Information Section */}
      <section className="section-padding bg-brand-teal/5 border-t border-brand-teal/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm">Төлбөр, Үйлчилгээ</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Амралтын үнийн мэдээлэл</h2>
            <p className="text-brand-teal/60">
              Бид танд хамгийн таатай нөхцөл, чанартай үйлчилгээ болон дараах үнийн багцыг санал болгож байна.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Pricing Cards */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl font-serif font-bold text-brand-teal mb-6 flex items-center gap-3">
                <span className="inline-block w-2.5 h-6 bg-brand-yellow rounded-full" />
                Үндсэн өдрийн тариф
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Card 1: Adult */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 bg-white rounded-2xl border border-brand-teal/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-110" />
                  <div className="relative z-10 space-y-4">
                    <span className="px-3 py-1 text-xs font-bold text-brand-yellow bg-brand-teal/10 rounded-full">ТОМ ХҮН</span>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-brand-teal">150,000₮</div>
                      <div className="text-sm text-brand-teal/50">Хоногийн төлбөр</div>
                    </div>
                    <ul className="text-sm text-brand-teal/70 space-y-2 pt-2 border-t border-brand-teal/5">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-brand-green shrink-0" />
                        Ор хоногийн төлбөр
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-brand-green shrink-0" />
                        Өдрийн 3 хоол багтсан
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Card 2: Child */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 bg-white rounded-2xl border border-brand-teal/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-bl-full -z-0 transition-transform duration-300 group-hover:scale-110" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 text-xs font-bold text-brand-blue bg-brand-blue/10 rounded-full">ХҮҮХЭД</span>
                      <span className="text-xs text-brand-teal/60 font-medium">3 - 12 нас</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-brand-teal">120,000₮</div>
                      <div className="text-sm text-brand-teal/50">Хоногийн төлбөр</div>
                    </div>
                    <ul className="text-sm text-brand-teal/70 space-y-2 pt-2 border-t border-brand-teal/5">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-brand-green shrink-0" />
                        Ор хоногийн төлбөр
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-brand-green shrink-0" />
                        Өдрийн 3 хоол багтсан
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Free Child Card & Info */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Free for 0-3 */}
                <div className="p-6 bg-brand-green/5 rounded-2xl border border-brand-green/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mt-0.5 shrink-0">
                    <Gift size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-teal text-base">0-3 насны хүүхэд</h4>
                    <p className="text-sm text-brand-teal/70 mt-1">Үнэгүй бөгөөд амарч, цагийг өнгөрүүлэх боломжтой.</p>
                  </div>
                </div>

                {/* Over 12 & Custom pricing */}
                <div className="p-6 bg-brand-yellow/5 rounded-2xl border border-brand-yellow/15 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow mt-0.5 shrink-0">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-teal text-base">Насны ангилал</h4>
                    <p className="text-sm text-brand-teal/70 mt-1">12-оос дээш насны хүүхэд том хүний үнээр тооцогдоно.</p>
                  </div>
                </div>
              </motion.div>

              {/* Note / Agreement */}
              <div className="p-5 bg-white rounded-2xl border border-brand-teal/10 text-sm text-brand-teal/80 flex items-center gap-3 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse shrink-0" />
                <span>
                  <strong className="text-brand-teal font-semibold">Санамж:</strong> Хүний тооноос хамааран үнийг тохиролцох боломжтой.
                </span>
              </div>

              {/* Booking CTA Button */}
              <div className="pt-2 flex justify-start">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-yellow hover:bg-brand-yellow/90 text-slate-900 rounded-full font-bold text-base transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
                >
                  Захиалга өгөх <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* What is Included (Үнэгүй) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-teal/10 p-8 shadow-sm space-y-6">
              <div className="border-b border-brand-teal/5 pb-6">
                <span className="text-brand-blue font-bold tracking-wider uppercase text-xs">Таны төлбөрт багтсан</span>
                <h3 className="text-2xl font-serif font-bold text-brand-teal mt-1">Дагалдах зүйлс</h3>
                <p className="text-sm text-brand-teal/60 mt-1">Дээрх үндсэн төлбөрт дараах үйлчилгээнүүд бүгд багтсан (ямар нэгэн нэмэлт төлбөр шаардахгүй):</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Ор хоногийн төлбөр" },
                  { title: "Өдрийн 3 хоол", detail: "Өдрийн 1 болон 2-р хоол, оройн хоол, өглөөний цай багтсан" },
                  { title: "Спорт заал", isSpecial: true },
                  { title: "Теннис, биллиард", isSpecial: true },
                  { title: "Ресторан, хурлын заал", isSpecial: true },
                  { title: "Караоке", isSpecial: true },
                  { title: "Гадаа талбай, гадна стадион", isSpecial: true }
                ].map((included, index) => (
                  <div key={index} className="flex items-start justify-between py-2 border-b border-dashed border-brand-teal/5 last:border-0 last:pb-0">
                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mt-0.5 shrink-0">
                        <Check size={12} fill="currentColor" strokeWidth={3} />
                      </div>
                      <div>
                        <span className="font-semibold text-brand-teal text-sm md:text-base">{included.title}</span>
                        {included.detail && (
                          <p className="text-xs text-brand-teal/60 italic mt-0.5">{included.detail}</p>
                        )}
                      </div>
                    </div>
                    {included.isSpecial && (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-brand-green bg-brand-green/10 rounded">
                        ҮНЭГҮЙ
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
