import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Share2, Copy, Facebook, ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import ReactMarkdown from 'react-markdown';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  author?: string;
  createdAt: any;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'default-1',
    title: 'Зуны Нээлтийн Урамшуулал: Ажлын Өдрүүдэд 20% Хямдарлаа!',
    content: `Урин дулаан цаг ирж, амралт зугаалгын улирал эхэлж байгаатай холбогдуулан **SUUT RESORT** нь зуны улирлын нээлтийн тусгай урамшууллыг зарлаж байна. 

Та Даваагаас Пүрэв гарагт захиалга өгснөөр дараах хөнгөлөлтүүдийг авах боломжтой:
- Цэвэр модон хаусууд болон бүх төрлийн өрөөний захиалга **20% хямдарна**.
- Үүнд өдрийн 3 хоол болон амралтын гаднах стадион ашиглах эрх багтсан болно.
- Гэр бүл бөгөөд найз нөхдөөрөө нам гүм, байгалийн үзэсгэлэнт газарт ая тухтай амрах хамгийн сайн боломж!

### Захиалга баталгаажуулах заавар:
1. Захиалга цэс рүү орж тохирох өдрөө сонгоно.
2. Урьдчилгаа төлбөрөө шилжүүлснээр таны захиалга шууд баталгаажна.
3. Дэлгэрэнгүй мэдээллийг 8801-0011 утсаар аваарай.`,
    category: 'Хямдрал',
    image: 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4',
    author: 'Админ',
    createdAt: { toDate: () => new Date('2026-05-20') }
  },
  {
    id: 'default-2',
    title: 'Шинэ Спортын Талбай Болон Тоглоомын Хэсэг Нээгдлээ',
    content: `Бид амрагч нарынхаа чөлөөт цагийг илүү сонирхолтой, идэвхтэй өнгөрүүлэхэд зориулж олон улсын стандартад нийцсэн шинэ спорт заал, гадна талбайг ашиглалтад орууллаа.

### Спортын цогцолборт багтсан:
- Сагсан бөмбөгийн задгай талбай
- Волейболын зүлгэн талбай
- Хүүхдийн аюулгүй элсний талбай, савлуур
- Ширээний теннис, бильярд

Амрагчид маань ямар нэг нэмэлт төлбөргүйгээр эдгээр хэсгүүдэд тоглож, эрүүл агаарт нэг өдрийг гэр бүлээрээ ид шидийн мэт өнгөрүүлэх боломжтой юм. Манай хамт олон таны тав тухыг хангахаар цаг үргэлж хөдөлмөрлөсөөр байна!`,
    category: 'Мэдээ',
    image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa',
    author: 'Амралтын Захиргаа',
    createdAt: { toDate: () => new Date('2026-05-15') }
  },
  {
    id: 'default-3',
    title: 'Эко Явган Аяллын Шинэ Чиглэлүүд Гаргалаа',
    content: `Байгальтайгаа илүү гүнзгий холбогдож, хусан ойн замаар алхахыг хүссэн амрагчдадаа зориулан тусгай явган аяллын **шинэ 3 чиглэлийг** тэмдэгжүүлсэн замаар тохижууллаа.

### Сонгох боломжтой маршрутууд:
1. **Хусан төгөл засал амралт**: Нийт 1.2км хялбар замын алхалт, уушги цэвэрлэх амьсгалын дасгалын цэгүүдтэй.
2. **Оргил өөд уруудах залуусын чиглэл**: Нийт 2.5км дунд зэргийн хүндрэлтэй, Баянчандмань сумын байгалийг бүхэлд нь харах хяналтын өндөрлөгтэй.
3. **Болор булаг эко отог**: Байгалийн булаг, рашааны эх ундарга руу хийх 3км-ийн урттай аялал.

Аялал бүрд манай мэргэжлийн хөтөч чиглүүлэг өгөх бөгөөд аяллыг илүү сонирхолтой танин мэдэхүйн түүхүүдээр баяжуулах болно. Ирээд заавал туршиж үзээрэй!`,
    category: 'Эко Аялал',
    image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9',
    author: 'Хөтөч Батболд',
    createdAt: { toDate: () => new Date('2026-05-10') }
  }
];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Бүгд');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: NewsItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          image: data.image,
          category: data.category || 'Мэдээ',
          author: data.author || 'Админ',
          createdAt: data.createdAt ? { toDate: () => data.createdAt.toDate() } : { toDate: () => new Date() }
        });
      });
      
      if (items.length > 0) {
        setNews(items);
      }
      setLoading(false);
    }, (err) => {
      console.warn('News listening failed (falling back to default local data):', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync URL search params to auto-open specific shared news posts on load
  useEffect(() => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
    const newsId = urlParams.get('id');
    if (newsId && news.length > 0) {
      const found = news.find(n => n.id === newsId);
      if (found) {
        setSelectedNews(found);
      }
    }
  }, [news]);

  const handleCopyLink = (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/news?id=${item.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleFacebookShare = (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = encodeURIComponent(`${window.location.origin}/#/news?id=${item.id}`);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const filteredNews = activeTab === 'Бүгд' 
    ? news 
    : news.filter(item => item.category === activeTab);

  const categories = ['Бүгд', 'Мэдээ', 'Хямдрал', 'Урамшуулал', 'Эко Аялал'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative h-[65vh] flex items-center justify-center text-white text-center overflow-hidden pt-20">
        {/* Background Image requested by user */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://lh3.googleusercontent.com/d/1EZJq9Y8EuxIs51EVyLnFUYGhIdQzAIjP"
            alt="SUUT Resort News Cover"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-[1.02]"
            referrerPolicy="no-referrer"
          />
          {/* Black overlay and elegant teal gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/70 via-black/20 to-brand-teal/80" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-brand-yellow drop-shadow-md"
          >
            Мэдээ, <span className="italic font-normal">Мэдээлэл</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-medium drop-shadow-sm leading-relaxed">
            SUUT RESORT-ын цаг үеийн мэдээ мэдээлэл, шинээр хийгдсэн бүтээн байгуулалт, урамшууллуудтай танилцаарай.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-wrap gap-2 justify-center">
        {categories.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 pointer-events-auto cursor-pointer ${
              activeTab === tab 
                ? 'bg-brand-teal text-white shadow-md scale-105'
                : 'bg-white text-brand-teal hover:bg-white/80 border border-brand-teal/10 shadow-sm'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
            <p className="text-brand-teal font-medium">Мэдээллийг ачааллаж байна...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-brand-teal/5">
            <p className="text-brand-teal/55 font-bold text-lg">Энэ ангилалд мэдээлэл одоогоор байхгүй байна.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-teal/5 hover:-translate-y-1 flex flex-col h-full cursor-pointer group"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand-yellow text-brand-teal font-bold px-3 py-1 rounded-full text-xs">
                      {item.category}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-4 text-xs text-brand-teal/55 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('sh-MN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {item.author || 'Админ'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-brand-teal line-clamp-2 group-hover:text-brand-yellow/90 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-brand-teal/70 text-sm line-clamp-3 leading-relaxed flex-grow">
                    {item.content.replace(/[#*`_[\]]/g, '')}
                  </p>

                  <div className="pt-4 border-t border-brand-teal/5 flex justify-between items-center">
                    <span className="text-brand-teal font-bold text-sm group-hover:underline inline-flex items-center gap-1">
                      Унших <Eye size={14} />
                    </span>
                    
                    {/* Share utilities */}
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => handleCopyLink(item, e)}
                        className="p-2 hover:bg-slate-100 rounded-full text-brand-teal transition-colors relative"
                        title="Линк хуулах"
                      >
                        <Copy size={16} />
                        {copiedId === item.id && (
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md">
                            Хуллаа!
                          </span>
                        )}
                      </button>
                      <button
                        onClick={e => handleFacebookShare(item, e)}
                        className="p-2 hover:bg-slate-100 rounded-full text-brand-teal transition-colors"
                        title="Фэйсбүүк хуваалцах"
                      >
                        <Facebook size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* News Overlay Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Back Button / Header Toolbar */}
              <div className="p-4 border-b border-brand-teal/5 flex justify-between items-center shrink-0">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="flex items-center gap-2 hover:bg-slate-100 rounded-full py-2 px-4 transition-colors font-bold text-sm text-brand-teal cursor-pointer"
                >
                  <ArrowLeft size={18} /> Буцах
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={e => handleCopyLink(selectedNews, e)}
                    className="flex items-center gap-1.5 hover:bg-slate-100 rounded-full py-2 px-3 transition-colors text-xs font-bold text-brand-teal relative"
                  >
                    <Copy size={15} /> Хуулах
                    {copiedId === selectedNews.id && (
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md">
                        Хууллаа!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={e => handleFacebookShare(selectedNews, e)}
                    className="flex items-center gap-1.5 hover:bg-slate-100 rounded-full py-2 px-3 transition-colors text-xs font-bold text-brand-teal"
                  >
                    <Facebook size={15} /> Хуваалцах
                  </button>
                </div>
              </div>

              {/* Scrollable Content Container */}
              <div className="overflow-y-auto flex-grow">
                {selectedNews.image && (
                  <div className="w-full h-80 relative">
                    <img
                      src={selectedNews.image}
                      alt={selectedNews.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 text-white bg-brand-yellow text-brand-teal font-bold px-3 py-1 rounded-full text-xs">
                      {selectedNews.category}
                    </div>
                  </div>
                )}

                <div className="p-8 space-y-6">
                  {/* Meta */}
                  <div className="flex items-center gap-6 text-xs text-brand-teal/50 font-bold border-b border-brand-teal/5 pb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {selectedNews.createdAt?.toDate ? selectedNews.createdAt.toDate().toLocaleDateString('sh-MN', { year: 'numeric', month: 'long', day: '2-digit' }) : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {selectedNews.author || 'Админ'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-serif font-bold text-brand-teal leading-snug">
                    {selectedNews.title}
                  </h2>

                  {/* Body with Markdown support */}
                  <div className="prose max-w-none text-brand-teal/80 text-sm md:text-base leading-relaxed space-y-4 prose-headings:font-serif prose-headings:text-brand-teal prose-strong:text-brand-teal prose-strong:font-bold prose-a:text-brand-yellow font-medium">
                    <ReactMarkdown>{selectedNews.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-5 border-t border-brand-teal/5 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-brand-teal/40">SUUT RESORT Мэдээлэл</span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-6 py-2 bg-brand-teal text-white hover:bg-brand-teal/90 rounded-full font-bold text-xs shadow transition-all active:scale-95 cursor-pointer"
                >
                  Хаах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
