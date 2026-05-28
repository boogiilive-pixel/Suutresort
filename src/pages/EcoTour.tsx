import React from 'react';
import { motion } from 'motion/react';
import { Compass, BookOpen, Heart, Smile, Trees, Award, Utensils, CalendarDays, Leaf, LucideIcon, Snowflake, Trophy, Home, Clock, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TourProgram {
  title: string;
  subtitle: string;
  price: string;
  time: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  steps: string[];
}

const tours: TourProgram[] = [
  {
    title: 'НАМРЫН СПАРТАКИАД',
    subtitle: 'Спорт, танин мэдэхүйн өдрийн аялал',
    price: '74,900₮',
    time: '09:00 - 18:00',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    textColor: 'text-amber-600',
    accentColor: 'border-amber-200/50',
    icon: <Trophy className="text-amber-600" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/13GA1tn0W7kb1SPGXX5qOFcgsHPh4Astm',
    description: 'Ой модны зах, хээрийн цэвэр агаарт анги хамт олон, сургуулиудаараа спортын 5 төрөлт уралдаан тэмцээнээр хамтдаа өрсөлдөж, нэг өдрийг эрүүл чийрэг, хөгжилтэй өнгөрүүлэх шилдэг хөтөлбөр.',
    steps: [
      'Сургуулиас хөдлөх',
      'Амралтын газар байрлах',
      'Нээлт',
      'Өдрийн хоол',
      'Намрын спартакиад /5 төрөлт тэмцээн/',
      'Хөгжөөнт тоглоом',
      'Шагнал гардуулах',
      'Байгальд зураг даруулах',
      'Үдийн цай',
      'Сургууль дээр буцаж ирэх'
    ]
  },
  {
    title: 'ЦАСНЫ БАЯР ӨВЛИЙН КЕМП',
    subtitle: 'Өвлийн гайхамшиг, цасан тоглоом бүхий өдрийн аялал',
    price: '74,900₮',
    time: '09:00 - 18:00',
    bgGradient: 'from-sky-500/10 to-blue-500/5',
    textColor: 'text-sky-600',
    accentColor: 'border-sky-200/50',
    icon: <Snowflake className="text-sky-600" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1U1e3LyMhemPBnDOgIS__Q0GGqDW1-CLZ',
    description: 'Мөнх цагаан хучлагатай байгалийн үзэсгэлэн дунд цасны сумо, цасан хүн хийх зэрэг уламжлалт болон орчин үеийн хөгжөөнт цасан тоглоомоор наадаж, өвөрмөц дурсамж бүтээх хөтөлбөр.',
    steps: [
      'Сургуулиас хөдлөх',
      'Амралтын газар байрлах',
      'Нээлт',
      'Өдрийн хоол',
      'Цасны баяр',
      'Хөгжөөнт тоглоом /цасны сумо, цасан хүн хийх гэх мэт/',
      'Шагнал гардуулах',
      'Байгальд зураг даруулах',
      'Үдийн цай',
      'Сургууль дээр буцаж ирэх'
    ]
  },
  {
    title: 'ШИНЭ ТӨЛ - МАЛЧИН АЙЛААР ЗОЧЛОХ',
    subtitle: 'Монгол ахуй, төл малтай танилцах танин мэдэхүйн аялал',
    price: '74,900₮',
    time: '09:00 - 18:00',
    bgGradient: 'from-purple-500/10 to-indigo-500/5',
    textColor: 'text-purple-600',
    accentColor: 'border-purple-200/50',
    icon: <Home className="text-purple-600" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1qqZave8LLe9joFMOXmoWOeZ_ZzV5dSni',
    description: 'Малчин айлын өдөр тутмын ажил, Монголын нүүдэлчин ахуй соёлтой биечлэн танилцуулж, шинээр төрсөн өхөөрдөм хөөрхөн төл малтай тоглуулан, байгалийг хайрлах чин сэтгэл суулгах хүмүүжлийн хөтөлбөр.',
    steps: [
      'Сургуулиас хөдлөх',
      'Амралтын газар байрлах',
      'Нээлт',
      'Өдрийн хоол',
      'Малчин айлд зочлох',
      'Монгол ахуйтай танилцах',
      'Хөгжөөнт тоглоом',
      'Шагнал гардуулах',
      'Төл малтай зураг даруулах',
      'Үдийн цай',
      'Сургууль дээр буцаж ирэх'
    ]
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
            <span className="text-brand-yellow italic">Өдрийн Эко Аялал</span>
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
                src="https://lh3.googleusercontent.com/d/1cyZi2uOXBioL3FnouNH4_WYdClCnNrVj" 
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-teal">Сонголттой Эко Аяллууд</h2>
            <p className="text-brand-teal/60">Сурагчдын сонирхол, насны онцлогт тохирсон өдөрт аяллын хөтөлбөрүүд.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tours.map((tour, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-brand-teal/5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Hero Image & Floating Badges */}
                <div className="h-56 relative overflow-hidden group">
                  <img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-yellow font-bold text-sm text-brand-teal shadow-md">
                    <Tag size={14} />
                    <span>{tour.price}</span>
                  </div>

                  {/* Time Badge */}
                  <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 text-white backdrop-blur-md text-xs font-semibold shadow-md border border-white/10">
                    <Clock size={12} />
                    <span>{tour.time}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 space-y-6 flex-grow">
                  {/* Title & Icon Header */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 shrink-0">
                      {tour.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-brand-green uppercase tracking-wider block">
                        ӨДРИЙН АЯЛАЛ
                      </span>
                      <h3 className="text-xl font-bold font-serif text-brand-teal leading-tight tracking-tight">
                        {tour.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-brand-teal/70 leading-relaxed text-sm">
                    {tour.description}
                  </p>

                  {/* Program Steps (Timeline Itinerary) */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal/60 flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-brand-green" />
                      Аяллын хөтөлбөр дараалал:
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-1.5 text-xs text-brand-teal/85 bg-brand-teal/5 p-4 rounded-2xl border border-brand-teal/5">
                      {tour.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-brand-teal/10 text-brand-teal font-semibold rounded-full flex items-center justify-center text-[10px] shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="font-medium truncate">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-6 pt-0 border-t border-brand-teal/5">
                  <a 
                    href="tel:8801-0011" 
                    className="w-full text-center py-3.5 rounded-2xl font-bold bg-brand-teal text-white hover:bg-brand-teal/95 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 group text-sm"
                  >
                    <span>Холбоо барих</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 px-6 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="CTA Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/60 via-brand-teal/90 to-brand-teal" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Хүүхэд багачууддаа мартагдашгүй нэг өдрийг бэлэглэцгээе</h2>
          <p className="text-white/80 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Сургууль, анги хамт олноороо холбогдон эко аяллаа төлөвлөөрэй. Бид тав тух, аюулгүй байдал, цогц хөтөлбөрийг санал болгож байна.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/booking" className="px-8 py-4 bg-brand-yellow text-brand-teal rounded-full font-bold text-base transition-all hover:bg-white hover:text-brand-teal hover:scale-105 hover:shadow-xl active:scale-95 shadow-md block w-full sm:w-auto">Захиалга өгөх</Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-base transition-all hover:bg-white hover:text-brand-teal hover:scale-105 active:scale-95 block w-full sm:w-auto">Холбоо барих</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
