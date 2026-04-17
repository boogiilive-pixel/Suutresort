import { motion } from 'motion/react';
import { Leaf, Wind, Sun, Coffee, Camera, Music, Trophy, PartyPopper, Gamepad2, Users } from 'lucide-react';

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
    image: 'https://lh3.googleusercontent.com/d/1e5XADe-T1Uwkj6wLEgpHOXIHXQ_0rTSL'
  },
  {
    title: 'Бильярд, Теннис тоглох',
    description: 'Чөлөөт цагаа хөгжилтэй өнгөрүүлэх бильярд, ширээний теннисний өрөө.',
    icon: <Gamepad2 className="text-brand-red" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1weJpTiCTRZwGq5smajOL4tcOQWj2mqjG'
  }
];

export default function Experience() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center text-white overflow-hidden pt-20 md:pt-0">
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
    </div>
  );
}
