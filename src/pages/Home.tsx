import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, CheckCircle2, MapPin, Users, Home as HomeIcon, Bed, ChevronLeft, ChevronRight, Quote, Calendar, Copy, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, safeToDate, formatLocaleDate } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

const highlights = [
  {
    title: 'Байгалийн үзэсгэлэн',
    description: 'Хусан ойн бэлд байрлах, нам гүм орчин',
    icon: <MapPin className="text-brand-yellow" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9'
  },
  {
    title: 'Бүрэн тохижуулсан, цэвэр модон хаус',
    description: 'Хүнсээ аваад очиход л бүх хэрэгтэй зүйлс нь бэлэн, бүрэн тохижуулсан хаус таныг хүлээж байна.',
    icon: <HomeIcon className="text-brand-red" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa'
  },
  {
    title: 'Тохилог өрөөнүүд',
    description: 'Олон төрлийн сонголт бүхий тохилог өрөөнүүд нь таны амралтыг илүү тухтай болгоно.',
    icon: <Bed className="text-brand-blue" size={32} />,
    image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa'
  }
];

const testimonials = [
  {
    name: 'Uka Uka',
    text: 'Суут Ресортдоо очих дуртайдаа. Хариуцаж буй хүмүүс нь их сайхан хүмүүс байдаг шүү. Эерэг дулаан энергитэй газардаа. Дандаа хүмүүст санал болгодог. Болгосоор ч байна.',
    rating: 5
  },
  {
    name: 'Nyamaa Narantsetseg',
    text: 'Суут ресорт очиж амарсан маш найрсаг гэр бүлээрээ очиж амрахад агаар гоётой гоё амралт байсан баярлалаа танай хамт олонд. Family-friendly',
    rating: 5
  },
  {
    name: 'Baljka Befu',
    text: 'Үнэхээр таалагдсан шүү. #Suut_Resort-ийн хамт олондоо баярлалаа. Хоол амттай, Орчин тасархай, ажилчидын харилцаа хандлага маш гоё. Баярлалаа 🍀🍀🍀🍀',
    rating: 5
  },
  {
    name: 'Цогтбаяр Мягмарсүрэн',
    text: '2023, 2024 оны ХАМГИЙН САЙХАН ДУРСАМЖИЙГ🥰 минь бүтээсэн газрын минь нэг яах аргагүй «SUUT RESORT» байлаа. Шинэ жилээр ч үйлчлүүлсэн, наадмын амралтаараа ч мөн дахин үйлчлүүллээ. Үнэхээр таалагдлаа 🤩. \n☘️Тохилог, тухтай өрөөтэй.\n☘️ Цэвэр агаартай, модтой🌿\n☘️ Спорт заалтай \n🍀ТАСАРХАЙ АМТТАЙ 🍝 ХООЛТОЙ\n☘️Найрсаг хамт олонд маш их БАЯРЛАЛАА.',
    rating: 5
  },
  {
    name: 'Б. Мухлай',
    text: 'Суут ресортыг сонгоорой. Үнэхээр гоё үйлчилгээ, найрсаг хамт олон. Тусархаг сэтгэлтэй хүмүүстэй газар байсан шүү. Дахиж заавал очих болноо. Баярлалаа суут ресортын хамт олонд.',
    rating: 5
  },
  {
    name: 'Батсайхан Мөнгөн Хүлэг',
    text: 'Үзэсгэлэнтэй байгаль, цэвэр тансаг агаарт... Гэр бүлээрээ заавал зочлоорой... Үнэхээр гайхалтай Амралтын газар.',
    rating: 5
  },
  {
    name: 'Г. Сувд',
    text: 'Үнэхээр тухтай, тасархай хоолтой, үзэсгэлэнтэй байгальтай газар байсан. Маш их баярлалаа "Суут Ресорт" 💛💙💜💚❤',
    rating: 5
  },
  {
    name: 'Kherlenchimeg Tsogtnyam',
    text: 'Suut resort хамт олонд баярлалаа. Хоол амттай байхаас гадна. Гоё байгальтай газар байна. Амжилт хүсье.',
    rating: 5
  },
  {
    name: 'Bat Tulga',
    text: 'Заавал очиж үзээрэй... үйлчилгээ нь үнээсээ давсан газар шүү!',
    rating: 5
  },
  {
    name: 'Doogii Tumurkhuyag',
    text: 'Цэвэрхэн, тухтай, гоё хоолтой, найрсаг үйлчилгээтэй амралт байна. Баярлалаа.☺',
    rating: 5
  },
  {
    name: 'Шагдар Цэрэн-Янжин',
    text: 'Үйлчилгээ сайтай, амттай сайхан хоолтой гоё газар шүү. Ажилд нь амжилт хүсье!',
    rating: 5
  },
  {
    name: 'Булгансайхан Ц\'Г',
    text: 'Одоогоор очиж байсан хамгийн бэст газар. Найрсаг, түргэн шуурхай, цэвэрхэн, хамгийн гол нь ёоо бүр тасарцан хоолтой.',
    rating: 5
  },
  {
    name: 'Chuluunbaatar Bolor',
    text: 'Цэвэр агаарт нам гүм тавтай сайхан амархыг хүсвэл энэ амралтыг сонгоорой, хоол унд сайтай, найрсаг хамт олон байна лээ.',
    rating: 5
  },
  {
    name: 'Badam Lkham',
    text: 'Тав тухтай найрсаг хамт олон.',
    rating: 5
  }
];

const testimonialSlides = [
  [
    {
      name: 'Uka Uka',
      text: 'Суут Ресортдоо очих дуртайдаа. Хариуцаж буй хүмүүс нь их сайхан хүмүүс байдаг шүү. Эерэг дулаан энергитэй газардаа. Дандаа хүмүүст санал болгодог. Болгосоор ч байна.',
      rating: 5
    },
    {
      name: 'Nyamaa Narantsetseg',
      text: 'Суут ресорт очиж амарсан маш найрсаг гэр бүлээрээ очиж амрахад агаар гоётой гоё амралт байсан баярлалаа танай хамт олонд. Family-friendly',
      rating: 5
    },
    {
      name: 'Baljka Befu',
      text: 'Үнэхээр таалагдсан шүү. #Suut_Resort-ийн хамт олондоо баярлалаа. Хоол амттай, Орчин тасархай, ажилчидын харилцаа хандлага маш гоё. Баярлалаа 🍀🍀🍀🍀',
      rating: 5
    },
    {
      name: 'Badam Lkham',
      text: 'Тав тухтай найрсаг хамт олон.',
      rating: 5
    }
  ],
  [
    {
      name: 'Цогтбаяр Мягмарсүрэн',
      text: '2023, 2024 оны ХАМГИЙН САЙХАН ДУРСАМЖИЙГ🥰 минь бүтээсэн газрын минь нэг яах аргагүй «SUUT RESORT» байлаа. Шинэ жилээр ч үйлчлүүлсэн, наадмын амралтаараа ч мөн дахин үйлчлүүллээ. Үнэхээр таалагдлаа 🤩. \n☘️Тохилог, тухтай өрөөтэй.\n☘️ Цэвэр агаартай, модтой🌿\n☘️ Спорт заалтай \n🍀ТАСАРХАЙ АМТТАЙ 🍝 ХООЛТОЙ\n☘️Найрсаг хамт олонд маш их БАЯРЛАЛАА.',
      rating: 5
    },
    {
      name: 'Б. Мухлай',
      text: 'Суут ресортыг сонгоорой. Үнэхээр гоё үйлчилгээ, найрсаг хамт олон. Тусархаг сэтгэлтэй хүмүүстэй газар байсан шүү. Дахиж заавал очих болноо. Баярлалаа суут ресортын хамт олонд.',
      rating: 5
    },
    {
      name: 'Батсайхан Мөнгөн Хүлэг',
      text: 'Үзэсгэлэнтэй байгаль, цэвэр тансаг агаарт... Гэр бүлээрээ заавал зочлоорой... Үнэхээр гайхалтай Амралтын газар.',
      rating: 5
    }
  ],
  [
    {
      name: 'Г. Сувд',
      text: 'Үнэхээр тухтай, тасархай хоолтой, үзэсгэлэнтэй байгальтай газар байсан. Маш их баярлалаа "Суут Ресорт" 💛💙💜💚❤',
      rating: 5
    },
    {
      name: 'Kherlenchimeg Tsogtnyam',
      text: 'Suut resort хамт олонд баярлалаа. Хоол амттай байхаас гадна. Гоё байгальтай газар байна. Амжилт хүсье.',
      rating: 5
    },
    {
      name: 'Bat Tulga',
      text: 'Заавал очиж үзээрэй... үйлчилгээ нь үнээсээ давсан газар шүү!',
      rating: 5
    },
    {
      name: 'Doogii Tumurkhuyag',
      text: 'Цэвэрхэн, тухтай, гоё хоолтой, найрсаг үйлчилгээтэй амралт байна. Баярлалаа.☺',
      rating: 5
    }
  ],
  [
    {
      name: 'Шагдар Цэрэн-Янжин',
      text: 'Үйлчилгээ сайтай, амттай сайхан хоолтой гоё газар шүү. Ажилд нь амжилт хүсье!',
      rating: 5
    },
    {
      name: 'Булгансайхан Ц\'Г',
      text: 'Одоогоор очиж байсан хамгийн бэст газар. Найрсаг, түргэн шуурхай, цэвэрхэн, хамгийн гол нь ёоо бүр тасарцан хоолтой.',
      rating: 5
    },
    {
      name: 'Chuluunbaatar Bolor',
      text: 'Цэвэр агаарт нам гүм тавтай сайхан амархыг хүсвэл энэ амралтыг сонгоорой, хоол унд сайтай, найрсаг хамт олон байна лээ.',
      rating: 5
    }
  ]
];

const partners = [
  { name: 'МАЧ' },
  { name: 'JCS ОУБ' },
  { name: 'АДРА ОУБ' },
  { name: 'АМОС ТББ' },
  { name: 'Богд банк' },
  { name: 'Мобиком корпораци' },
  { name: 'Боловсролын Үнэлгээний Төв' },
  { name: 'Төв аймгийн Газар зохион байгуулалт, геодизи, зурагзүйн газар' },
  { name: 'Баянчандмань сумын ЗДТГ' },
  { name: 'Баянчандмань сумын Иргэдийн нийтийн хурал' },
  { name: 'Баянчандмань сумын МСҮТ' },
  { name: 'Улаанбаатар Төмөр зам' },
  { name: 'МҮОНРТ' },
  { name: 'ШШБЕГ' },
  { name: 'GIZ' },
  { name: 'Зүрхний гүнд ТББ' },
  { name: 'Мөрөөдөл зуслан' },
  { name: 'Монгол туургатан ХХК' },
  { name: '"Байгаль эх" лицей МУИС' },
  { name: '"Шилдэг" сургууль' },
  { name: '139-р сургууль' },
  { name: '105-р сургууль' },
  { name: '34-р сургууль' },
  { name: 'Улаанбаатар лицей' },
  { name: '14-р сургууль' },
  { name: 'Тусгал сургууль' },
  { name: '17-р сургууль' },
  { name: '11-р сургууль' },
  { name: 'Сүүн ундарга хоршоо' },
  { name: 'Нарийны хоршоо' },
  { name: 'Шар хадны хоршоо' },
  { name: 'Сүүн зам хоршоо' },
  { name: 'Саммит Электроникс ХХК' },
  { name: 'Алтан тариа ХХК' },
  { name: 'PC Maлл' },
  { name: 'Апу ХХК' },
  { name: 'Оюу толгой ХХК' },
  { name: 'Таван толгой ХХК' },
  { name: 'Дашваанжил ХХК' },
  { name: 'Масс трэйвел' },
  { name: 'Хурд фото студио' },
  { name: 'Оюу тур' },
  { name: 'Мөрөөдөл зуслан' },
  { name: 'Мэргэн трэйвел' },
  { name: 'Be боловсролын төв' },
  { name: 'Юнител ХХК' },
  { name: 'Мобиком ХХК' },
  { name: 'Боловсрол ТВ' },
  { name: 'Хэмнэл 91.7 радио' },
  { name: 'Гэр бүлийн радио 104.5' },
  { name: 'Хаан банк' },
  { name: 'Агуу захирамж' },
  { name: 'Ваарчны гэр' }
];

const LOCAL_DEFAULT_NEWS = [
  {
    id: 'default-1',
    title: 'Зуны Нээлтийн Урамшуулал: Ажлын Өдрүүдэд 20% Хямдарлаа!',
    excerpt: 'Урин дулаан цаг ирж амралт зугаалгын улирал эхэлж байгаатай холбогдуулан SUUT RESORT... ажлын өдрүүдэд 20% хөнгөлөлт зарлалаа.',
    category: 'Хямдрал',
    image: 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4',
    date: '2026-05-20'
  },
  {
    id: 'default-2',
    title: 'Шинэ Спортын Талбай Болон Тоглоомын Хэсэг Нээгдлээ',
    excerpt: 'Бид амрагч нарынхаа чөлөөт цагийг илүү сонирхолтой, идэвхтэй өнгөрүүлэхэд зориулж шинэ спорт заал, задгай талбай ашиглалтанд орууллаа.',
    category: 'Мэдээ',
    image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa',
    date: '2026-05-15'
  },
  {
    id: 'default-3',
    title: 'Эко Явган Аяллын Шинэ Чиглэлүүд Гаргалаа',
    excerpt: 'Байгальтайгаа илүү гынзгий холбогдож, хусан ойн замаар алхахыг хүссэн амрагчдадаа зориулан тусгай явган аяллын шинэ 3 чиглэлийг тохижууллаа.',
    category: 'Эко Аялал',
    image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9',
    date: '2026-05-10'
  }
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [latestNews, setLatestNews] = useState<any[]>(() => {
    try {
      const localCustom = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
      const deletedDefaults = JSON.parse(localStorage.getItem('suut_deleted_default_news_ids') || '[]');
      const parsedLocal = localCustom.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        excerpt: item.content ? (item.content.replace(/[#*`_[\]]/g, '').slice(0, 120) + '...') : '',
        category: item.category || 'Мэдээ',
        image: item.image || 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4',
        date: formatLocaleDate(item.createdAt, { year: 'numeric', month: '2-digit', day: '2-digit' })
      }));
      const activeDefaults = LOCAL_DEFAULT_NEWS.filter(def => !deletedDefaults.includes(def.id));
      const combined = [
        ...parsedLocal,
        ...activeDefaults.filter(def => !parsedLocal.some(cust => cust.title === def.title || cust.id === def.id))
      ];
      return combined.length > 0 ? combined.slice(0, 3) : activeDefaults.slice(0, 3);
    } catch (e) {
      return LOCAL_DEFAULT_NEWS;
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadMergedNews = (firestoreItems: any[] = []) => {
      const localCustom = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
      const deletedDefaults = JSON.parse(localStorage.getItem('suut_deleted_default_news_ids') || '[]');
      const parsedLocal = localCustom.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        excerpt: item.content ? (item.content.replace(/[#*`_[\]]/g, '').slice(0, 120) + '...') : '',
        category: item.category || 'Мэдээ',
        image: item.image || 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4',
        createdAt: item.createdAt,
        date: formatLocaleDate(item.createdAt, { year: 'numeric', month: '2-digit', day: '2-digit' })
      }));

      const combined = firestoreItems.map(fItem => {
        const localMatch = parsedLocal.find(lItem => lItem.id === fItem.id);
        return localMatch ? { ...fItem, ...localMatch } : fItem;
      });

      parsedLocal.forEach((localItem: any) => {
        const exists = combined.some(item => item.id === localItem.id || item.title === localItem.title);
        if (!exists) {
          combined.push(localItem);
        }
      });

      const activeDefaults = LOCAL_DEFAULT_NEWS.filter(def => !deletedDefaults.includes(def.id));
      const merged = [
        ...combined,
        ...activeDefaults.filter(def => !combined.some(cust => cust.title === def.title || cust.id === def.id))
      ];

      // Robust in-memory sorting
      const sortedNews = merged.sort((a, b) => {
        const timeA = safeToDate(a.createdAt || a.date).getTime();
        const timeB = safeToDate(b.createdAt || b.date).getTime();
        return timeB - timeA;
      });

      setLatestNews(sortedNews.slice(0, 3));
    };

    // Load instantly from localStorage first
    loadMergedNews([]);

    const newsCol = collection(db, 'news');

    const parseSnapshot = (snapshot: any) => {
      const items: any[] = [];
      snapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          excerpt: data.content ? (data.content.replace(/[#*`_[\]]/g, '').slice(0, 120) + '...') : '',
          category: data.category || 'Мэдээ',
          image: data.image || 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4',
          createdAt: data.createdAt,
          date: formatLocaleDate(data.createdAt, { year: 'numeric', month: '2-digit', day: '2-digit' })
        });
      });
      return items;
    };

    // 1. One-shot fetch fallback for fast, reliable load on Edge and mobile browsers where WebSocket/long-polling is blocked
    getDocs(newsCol).then((snapshot) => {
      const items = parseSnapshot(snapshot);
      if (items.length > 0) {
        loadMergedNews(items);
      }
    }).catch((err) => {
      console.warn('Home news pre-fetching via getDocs failed (will rely on onSnapshot):', err);
    });

    // 2. Real-time snapshot listening
    const unsubscribe = onSnapshot(newsCol, (snapshot) => {
      const items = parseSnapshot(snapshot);
      loadMergedNews(items);
    }, (err) => {
      console.warn("Home news query failed, falling back safely:", err);
      loadMergedNews([]);
    });

    return () => unsubscribe();
  }, []);

  const handleCopyLink = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/news?id=${itemId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleFacebookShare = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = encodeURIComponent(`${window.location.origin}/#/news?id=${itemId}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonialSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end justify-center text-white overflow-hidden pb-24 md:pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4" 
            alt="Resort Hero" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
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
            Тав тухтай орчин, амт чанартай хоол, найрсаг хамт олон таныг хүлээж байна.
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
            <Link to="/experience" className="px-8 py-3 border-2 border-brand-yellow text-brand-yellow rounded-full font-bold transition-all hover:bg-brand-yellow hover:text-brand-teal active:scale-95 shadow-md">
              Дэлгэрэнгүй үзэх
            </Link>
          </motion.div>
        </div>



        {/* Partners Carousel Overlay */}
        <div className="absolute bottom-0 left-0 w-full py-8 bg-gradient-to-t from-black/60 to-transparent overflow-hidden">
          <div className="relative flex overflow-hidden">
            <motion.div 
              animate={{ x: ['0%', '-50%'] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 150,
                  ease: "linear",
                },
              }}
              className="flex gap-16 items-center whitespace-nowrap"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex items-center justify-center min-w-[150px] px-4">
                  <span className="text-base md:text-lg font-serif font-medium text-white/45 hover:text-white/90 transition-colors cursor-default select-none">
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
                    src="https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa" 
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
                  <h3 className="text-2xl font-bold text-brand-teal mb-1">Бүрэн тохижуулсан, цэвэр модон хаус</h3>
                  <p className="text-sm text-gray-500 font-medium">Анги хамт олон, гэр бүлээрээ амрах таатай орчин</p>
                </div>
                
                <div className="h-px bg-gray-100 w-full" />
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1 col-span-1">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Үнэ</div>
                    <div className="text-xl font-bold text-brand-teal leading-none">600,000₮ - 800,000₮ <span className="block text-xs font-normal text-gray-400 mt-0.5">/ Өдрөөс хамаарна</span></div>
                  </div>
                  <div className="space-y-1 text-right col-span-1 shrink-0">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Багтаамж</div>
                    <div className="text-xl font-bold text-brand-teal">25 хүртэлх <span className="text-xs font-normal text-gray-400">хүн</span></div>
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
                    Мэргэн сонголт
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
                    <div className="text-xl font-bold text-brand-teal leading-none">150,000₮ <span className="block text-xs font-normal text-gray-400 mt-0.5">/ өдрийн 3 хоол багтсан</span></div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Төлбөр</div>
                    <div className="text-xl font-bold text-brand-teal">1 <span className="text-xs font-normal text-gray-400">хоногийн төлбөр</span></div>
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
              Суут амралт нь 2017 оноос хойш жилийн дөрвөн улирлын турш үйл ажиллагаагаа явуулсаар ирсэн бөгөөд хусан ойн бэлд байгалийн сайханд байрладаг, тав тухтай, орчин үеийн амралтын газруудын нэг юм. Бид зочдынхоо тав тухыг дээд зэргээр хангаж, байгалийн үзэсгэлэнг мэдрүүлэхийг зорьдог.
            </p>
            <ul className="space-y-4">
              {[
                'Спорт заал, гадна задгай стадион',
                'Дотроо 00, душтэй өрөөнүүд',
                'Мэргэжлийн тогоочийн бэлтгэсэн амт, чанартай хоол',
                'Гэр бүл, найз нөхөд, хамт олноороо амрахад тохиромжтой',
                'Байгалийн үзэсгэлэнт газар'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-brand-teal font-medium">
                  <CheckCircle2 className="text-brand-green shrink-0" size={20} />
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Яагаад биднийг сонгох ёстой вэ?</h2>
            <p className="text-brand-teal/60">Бид танд чанартай үйлчилгээг боломжийн үнээр санал болгож байна.</p>
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
              'https://lh3.googleusercontent.com/d/1IoAQw8BDVtkB4dL3ZC6ek7U6SfKdh_gu',
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

      {/* Latest News & Promotions Section */}
      <section className="section-padding bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-brand-yellow bg-brand-teal text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Мэдээлэл</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-teal">Сүүлийн үеийн мэдээ, урамшуулал</h2>
            <p className="text-brand-teal/65">SUUT RESORT-ын эргэн тойронд болж буй шинэ мэдээ болон тусгай хямдралуудтай танилцаарай.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-teal/5 flex flex-col group"
              >
                {/* Cover Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand-yellow text-brand-teal font-bold px-3 py-1 rounded-full text-[10px] uppercase">
                    {item.category}
                  </div>
                </div>

                {/* Card details */}
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <span className="text-xs text-brand-teal/50 font-bold flex items-center gap-1.5">
                    <Calendar size={13} /> {item.date}
                  </span>
                  
                  <h3 className="font-serif font-bold text-lg text-brand-teal line-clamp-2 leading-snug group-hover:text-brand-yellow/90 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-brand-teal/65 text-xs md:text-sm line-clamp-3 leading-relaxed flex-grow">
                    {item.excerpt}
                  </p>

                  <div className="pt-4 border-t border-brand-teal/5 flex justify-between items-center bg-transparent">
                    <Link
                      to={`/news?id=${item.id}`}
                      className="text-brand-teal font-bold text-xs group-hover:underline inline-flex items-center gap-1.5"
                    >
                      Дэлгэрэнгүй унших <ArrowRight size={14} />
                    </Link>

                    {/* Quick Share utilities requested by user */}
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleCopyLink(item.id, e)}
                        className="p-1 px-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-lg text-brand-teal transition-all relative text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Линк хуулах"
                      >
                        <Copy size={12} />
                        {copiedId === item.id ? 'Хуулагдлаа!' : 'Хуулах'}
                      </button>
                      <button
                        onClick={(e) => handleFacebookShare(item.id, e)}
                        className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-brand-teal transition-colors cursor-pointer"
                        title="Фэйсбүүк хуваалцах"
                      >
                        <Facebook size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
            >
              БҮХ МЭДЭЭЛЛИЙГ ҮЗЭХ <ArrowRight size={16} />
            </Link>
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

            <div 
              className="relative flex flex-col justify-between min-h-[480px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides Container */}
              <div className="relative overflow-hidden flex-1 flex flex-col justify-center min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {testimonialSlides[activeSlide].map((item, idx) => {
                      const cardKey = `${activeSlide}-${idx}`;
                      const isExpanded = !!expandedItems[cardKey];
                      const isLong = item.text.length > 120;
                      const showText = isLong && !isExpanded 
                        ? item.text.slice(0, 110) + '...'
                        : item.text;

                      return (
                        <div
                          key={idx}
                          className="p-6 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 flex flex-col justify-between min-h-[220px] h-full relative hover:bg-brand-teal/[0.08] transition-all duration-300 shadow-sm"
                        >
                          <Quote className="absolute top-4 right-4 text-brand-teal/10 w-8 h-8 pointer-events-none" />
                          <div>
                            <div className="flex text-brand-yellow mb-3">
                              {[...Array(item.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" />
                              ))}
                            </div>
                            <p className="text-brand-teal/80 text-sm italic mb-4 whitespace-pre-line leading-relaxed">
                              "{showText}"
                            </p>
                            {isLong && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedItems(prev => ({
                                    ...prev,
                                    [cardKey]: !prev[cardKey]
                                  }));
                                }}
                                className="text-xs font-bold text-brand-teal hover:text-brand-teal/70 pb-3 transition-colors underline decoration-dotted underline-offset-4 cursor-pointer block"
                              >
                                {isExpanded ? 'Хураах' : 'Дэлгэрэнгүй'}
                              </button>
                            )}
                          </div>
                          <div className="font-bold text-sm text-brand-teal mt-auto pt-2 border-t border-brand-teal/10">
                            — {item.name}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-teal/10">
                <div className="flex gap-2">
                  {testimonialSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer",
                        activeSlide === i ? "w-8 bg-brand-teal" : "w-2.5 bg-brand-teal/20 hover:bg-brand-teal/40"
                      )}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev - 1 + testimonialSlides.length) % testimonialSlides.length)}
                    className="p-2 border border-brand-teal/15 rounded-full text-brand-teal hover:bg-brand-teal/5 transition-colors focus:outline-none pointer-events-auto cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % testimonialSlides.length)}
                    className="p-2 border border-brand-teal/15 rounded-full text-brand-teal hover:bg-brand-teal/5 transition-colors focus:outline-none pointer-events-auto cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
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
            <Link to="/booking" className="px-12 py-4 bg-white text-brand-teal hover:bg-brand-yellow rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-md block w-full sm:w-auto text-center">Захиалах</Link>
            <div className="flex items-center gap-4 text-lg font-medium">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Users size={24} />
              </div>
              <span>+976 8801-0011, 8800-7338</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
