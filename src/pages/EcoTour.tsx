import React from 'react';
import { motion } from 'motion/react';
import { Compass, BookOpen, Heart, Smile, Trees, Award, Utensils, CalendarDays, Leaf, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<LucideIcon>;
  colorClass: string;
}

const programs: ProgramCardProps[] = [
  {
    title: 'Танин мэдэхүйн уралдаан',
    description: 'Байгаль эх, ургамал моддыг танин мэдэх сонирхолтой асуулт хариулт болон хөгжөөнт тэмцээнүүд.',
    icon: <BookOpen className="text-brand-yellow" size={32} />,
    colorClass: 'bg-brand-yellow/10 border-brand-yellow/20'
  },
  {
    title: 'Байгаль орчны танин мэдэхүй',
    description: 'Ой модны экосистем, ургамал амьтдыг хамгаалах чиглэлээр практик болон танин мэдэхүйн зааварчилгаа.',
    icon: <Trees className="text-brand-green" size={32} />,
    colorClass: 'bg-brand-green/10 border-brand-green/20'
  },
  {
    title: 'Хөгжөөнт тоглоомууд',
    description: 'Нөхөрсөг уур амьсгал бүрдүүлж, багаар ажиллах чадвар суулгах хөгжөөнт тоглоом, дасгалууд.',
    icon: <Smile className="text-brand-blue" size={32} />,
    colorClass: 'bg-brand-blue/10 border-brand-blue/20'
  },
  {
    title: 'Амтат өдрийн хоол',
    description: 'Хүүхэд бүрт тохирсон амтлаг бөгөөд эрүүл ахуйн шаардлага хангасан өдрийн хоол, амттан.',
    icon: <Utensils className="text-brand-red" size={32} />,
    colorClass: 'bg-brand-red/10 border-brand-red/20'
  }
];

export default function EcoTour() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden pt-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1600" 
            alt="Eco Tour Hero" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm font-bold mb-6 backdrop-blur-sm"
          >
            <Compass size={16} className="animate-spin-slow" />
            Эко Аялал Хөтөлбөр
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight"
          >
            Сурагчдад зориулсан <br />
            <span className="text-brand-yellow italic">Эко өдрийн аялал</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed mb-6"
          >
            Эрхэм сурагчдад зориулж, олон төрлийн сонирхолтой хөтөлбөр бүхий, дурсамж дүүрэн өдрийн Эко аяллыг санал болгож байна.
          </motion.p>
        </div>
      </section>

      {/* Intro and Mission */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-brand-green font-bold tracking-widest uppercase text-sm font-sans">СУРГАЛТ БА АЯЛАЛ</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-teal leading-tight">
                  Байгаль дэлхийтэй танилцаж, нэг өдрийг мартагдашгүй өнгөрүүлцгээе!
                </h2>
              </div>
              <p className="text-lg text-brand-teal/70 leading-relaxed">
                Бид хүүхэд багачууд, сурагчдад байгаль орчныг хайрлах, зөв зохистой харилцах ухамсарыг суулгах зорилготой олон талт, хөгжөөнт аяллын хөтөлбөрүүдийг тав тухтай, аюулгүй орчинд мэргэжлийн түвшинд зохион байгуулж байна.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-teal/5 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-teal">Мэргэжлийн хөтөч</h4>
                    <p className="text-sm text-brand-teal/60">Аюулгүй байдал, дүрмийг чанд сахина</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-green/5 rounded-full flex items-center justify-center text-brand-green shrink-0">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-teal">Экологийн боловсрол</h4>
                    <p className="text-sm text-brand-teal/60">Бодит дадлага, тоглоомын аргаар суралцана</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Students in Nature" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-teal/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="bg-brand-teal/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-brand-green font-bold tracking-widest uppercase text-sm block">ХӨТӨЛБӨРИЙН СОНГОЛТУУД</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-teal">Аяллын сонирхолтой үйл ажиллагаанууд</h2>
            <p className="text-brand-teal/60">Сурагчдын сонирхол, насны онцлогт тохирсон өдөрт аяллын хөтөлбөрүүд.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-brand-teal/5 shadow-lg flex flex-col md:flex-row items-start gap-6 hover:shadow-xl transition-all"
              >
                <div className={`p-4 rounded-2xl shrink-0 flex items-center justify-center ${program.colorClass}`}>
                  {program.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-brand-teal">{program.title}</h3>
                  <p className="text-brand-teal/70 leading-relaxed text-sm md:text-base">{program.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 px-6 text-white overflow-hidden bg-brand-teal text-center">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Хүүхэд багачууддаа мартагдашгүй нэг өдрийг бэлэглэцгээе</h2>
          <p className="text-white/80 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Сургууль, анги хамт олноороо холбогдон эко аяллаа төлөвлөөрэй. Бид тав тух, аюулгүй байдал, цогц хөтөлбөрийг санал болгож байна.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/booking" className="btn-primary py-4 px-8 text-base">Захиалга өгөх</Link>
            <Link to="/contact" className="btn-outline border-white/40 text-white hover:bg-white hover:text-brand-teal py-4 px-8 text-base">Холбоо барих</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
