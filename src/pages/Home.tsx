import { motion } from 'motion/react';
import { ArrowRight, Star, CheckCircle2, MapPin, Users, Home as HomeIcon, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const highlights = [
  {
    title: 'Байгалийн үзэсгэлэн',
    description: 'Уулс, ус, ой мод хосолсон Тэрэлж байгалийн цогцолбор газарт байрлах тав тухтай амралтын газар.',
    icon: <MapPin className="text-brand-yellow" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9'
  },
  {
    title: 'Тав тухтай байшин',
    description: 'Орчин үеийн шийдэл бүхий тав тухтай вилла болон байшингууд таныг хүлээж байна.',
    icon: <HomeIcon className="text-brand-red" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/15Bp6lMsOa5kELfVPEmG2xtgv0AwlaNJN'
  },
  {
    title: 'Тав тухтай өрөөнүүд',
    description: 'Стандарт, Делюкс, Гэр бүлийн өрөөнүүд нь таны амралтыг илүү тухтай болгоно.',
    icon: <Bed className="text-brand-blue" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa'
  }
];

const testimonials = [
  {
    name: 'Б. Тэмүүлэн',
    text: 'Маш гоё орчинтой, үйлчилгээ нь үнэхээр сайн байсан. Гэр бүлээрээ ирэхэд хамгийн тохиромжтой газар.',
    rating: 5
  },
  {
    name: 'Г. Ану',
    text: 'Байшингууд нь маш цэвэрхэн, дулаахан. Хоол нь ч бас амттай байлаа. Дахин ирэх болно.',
    rating: 5
  },
  {
    name: 'С. Бат',
    text: 'Байгалийн сайханд, амар амгалан орчинд амрахыг хүсвэл SUUT RESORT-ыг санал болгож байна.',
    rating: 4
  }
];

const partners = [
  { name: 'Unitel', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' }, // Placeholder for Unitel
  { name: 'Mobicom', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'Khan Bank', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'Golomt Bank', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'MCS', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'APU', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'Tavan Bogd', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' },
  { name: 'TDB', logo: 'https://lh3.googleusercontent.com/d/1_6YI8v6_v_v_v_v_v_v_v_v_v_v_v_v' }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end justify-center text-white overflow-hidden pb-12 md:pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4" 
            alt="Resort Hero" 
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 bg-brand-yellow/20 backdrop-blur-md border border-brand-yellow/30 rounded-full text-brand-yellow font-medium text-sm mb-6"
          >
            Тавтай морилно уу
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight"
          >
            Байгалийн сайханд <br /> <span className="text-brand-yellow italic">SUUT RESORT</span>-д амраарай
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Тав тухтай үйлчилгээ, найрсаг орчин, байгалийн үзэсгэлэн таныг хүлээж байна.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/booking" className="btn-primary flex items-center gap-2 group">
              Одоо захиалах <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/experience" className="btn-outline border-white text-white hover:bg-white hover:text-brand-teal">
              Дэлгэрэнгүй үзэх
            </Link>
          </motion.div>
        </div>



        {/* Partners Carousel Overlay */}
        <div className="absolute bottom-0 left-0 w-full py-8 bg-gradient-to-t from-black/50 to-transparent overflow-hidden">
          <div className="relative flex overflow-hidden">
            <motion.div 
              animate={{ x: [0, -1920] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 50,
                  ease: "linear",
                },
              }}
              className="flex gap-24 items-center whitespace-nowrap pr-24"
            >
              {[...partners, ...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex items-center justify-center min-w-[150px]">
                  <span className="text-xl font-serif font-bold text-white/30 hover:text-white/80 transition-colors cursor-default">
                    {partner.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selection Sections */}
      <section className="section-padding bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* House Rental Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl overflow-hidden relative group">
                  <img 
                    src="https://lh3.googleusercontent.com/d/15Bp6lMsOa5kELfVPEmG2xtgv0AwlaNJN" 
                    alt="House Rental" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                    Боломжтой
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6 pt-2 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-brand-teal mb-1">ХАУС ТҮРЭЭС</h3>
                  <p className="text-sm text-gray-500 font-medium">Бүрэн тохижуулсан орчин үеийн хаус</p>
                </div>
                
                <div className="h-px bg-gray-100 w-full" />
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Үнэ</div>
                    <div className="text-xl font-bold text-brand-teal">450,000₮ <span className="text-xs font-normal text-gray-400">/ хоног</span></div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Багтаамж</div>
                    <div className="text-xl font-bold text-brand-teal">6-12 <span className="text-xs font-normal text-gray-400">хүн</span></div>
                  </div>
                </div>

                <Link 
                  to="/booking" 
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                >
                  Захиалах <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Resort Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl overflow-hidden relative group">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1kv2V6jZAlweHGZV2f8kc0YWbT_rmgFWn" 
                    alt="Resort" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                    Чанартай сонголт
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6 pt-2 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-brand-teal mb-1">РЕСОРТ</h3>
                  <p className="text-sm text-gray-500 font-medium">Тав тухтай тохилог өрөөнүүд</p>
                </div>
                
                <div className="h-px bg-gray-100 w-full" />
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Үнэ</div>
                    <div className="text-xl font-bold text-brand-teal">250,000₮ <span className="text-xs font-normal text-gray-400">/ хоног</span></div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Төрөл</div>
                    <div className="text-xl font-bold text-brand-teal">8 <span className="text-xs font-normal text-gray-400">сонголт</span></div>
                  </div>
                </div>

                <Link 
                  to="/booking" 
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                >
                  Захиалах <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9" 
                alt="About Resort" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-green rounded-2xl -z-10 hidden md:block" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-yellow rounded-full -z-10 opacity-50 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-brand-green font-bold tracking-widest uppercase text-sm">Бидний тухай</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal leading-tight">
                Байгаль эхтэйгээ <br /> ойрхон амралт
              </h2>
            </div>
            <p className="text-lg text-brand-teal/70 leading-relaxed">
              SUUT RESORT нь 2018 оноос хойш үйл ажиллагаагаа явуулж байгаа бөгөөд Тэрэлж байгалийн цогцолбор газарт хамгийн тав тухтай, орчин үеийн амралтын газруудын нэг юм. Бид зочдынхоо тав тухыг дээд зэргээр хангаж, байгалийн үзэсгэлэнг мэдрүүлэхийг зорьдог.
            </p>
            <ul className="space-y-4">
              {['Тав тухтай вилла болон өрөөнүүд', 'Мэргэжлийн тогоочийн бэлтгэсэн амтлаг хоол', 'Гэр бүл, найз нөхдөөрөө амрахад тохиромжтой', 'Байгалийн үзэсгэлэнт газар'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-brand-teal font-medium">
                  <CheckCircle2 className="text-brand-green" size={20} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/experience" className="btn-primary inline-block">Дэлгэрэнгүй</Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-brand-teal/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm">Давуу талууд</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Яагаад биднийг сонгох вэ?</h2>
            <p className="text-brand-teal/60">Бид танд хамгийн сайн үйлчилгээ, тав тухтай орчинг санал болгож байна.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-brand-teal/5 rounded-2xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-teal">{item.title}</h3>
                  <p className="text-brand-teal/60 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-padding bg-brand-teal/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-brand-green font-bold tracking-widest uppercase text-sm">Галерей</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Бидний орчин</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG',
              'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa',
              'https://lh3.googleusercontent.com/d/1OWnzvTHAaMOfQ3l0IsMxayzXi6bhNkfd',
              'https://lh3.googleusercontent.com/d/1VPMeteBUV7gEU-Ay-GqdoINLS-gUJW7H'
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg",
                  i === 0 && "md:col-span-2 md:row-span-2 md:aspect-auto"
                )}
              >
                <img 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
            
            {/* View All Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg bg-brand-teal"
            >
              <Link to="/gallery" className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 text-white">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <ArrowRight size={32} />
                </div>
                <span className="font-bold text-lg">Бүх зургийг үзэх</span>
              </Link>
              <div className="absolute inset-0 bg-brand-teal/40 group-hover:bg-brand-teal/60 transition-colors" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Сэтгэгдэл</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Зочдын маань <br /> сэтгэгдэл</h2>
              </div>
              <p className="text-lg text-brand-teal/70 leading-relaxed">
                Манай амралтын газарт амарсан зочдын сэтгэгдлээс сонирхоорой. Бид таны сэтгэл ханамжийг нэгт тавьдаг.
              </p>
              <div className="flex gap-4">
                <div className="p-6 bg-brand-teal text-white rounded-2xl space-y-2">
                  <div className="text-4xl font-bold">4.9</div>
                  <div className="flex text-brand-yellow">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <div className="text-sm opacity-70">Дундаж үнэлгээ</div>
                </div>
                <div className="p-6 bg-brand-yellow text-brand-teal rounded-2xl space-y-2">
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-sm font-medium">Сэтгэл ханамжтай зочид</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {testimonials.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-8 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 relative"
                >
                  <div className="flex text-brand-yellow mb-4">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-brand-teal/80 italic mb-6">"{item.text}"</p>
                  <div className="font-bold text-brand-teal">— {item.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="CTA Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/60 via-brand-teal/90 to-brand-teal" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-8 pb-24">
          <h2 className="text-4xl md:text-6xl font-serif font-bold">Таны амралт <br /> эндээс эхэлнэ</h2>
          <p className="text-xl text-white/80">Одоо захиалгаа өгөөд байгалийн сайханд амарч, эрч хүчээ сэлбээрэй.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/booking" className="btn-primary bg-brand-yellow text-brand-teal hover:bg-white px-12 py-4 text-lg border-none">Захиалах</Link>
            <div className="flex items-center gap-4 text-lg font-medium">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Users size={24} />
              </div>
              <span>+976 8800-7338, 8801-0011</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
