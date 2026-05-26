import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LogIn, Calendar, Plus, FileText, Check, X, Search, 
  Trash2, User, Phone, Mail, DollarSign, RefreshCw, LogOut, AlertTriangle, Edit, Image 
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc 
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { calculatePriceReport } from './Booking';
import { getDirectDriveUrl } from '@/lib/utils';

const DEFAULT_NEWS = [
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
    author: 'Админ'
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
    author: 'Амралтын Захиргаа'
  },
  {
    id: 'default-3',
    title: 'Эко Явган Аяллын Шинэ Чиглэлүүд Гаргалаа',
    content: `Байгальтайгаа илүү гүнзгий холбогдож, хусан ойн замаар алхахыг хүссэн амрагчдадаа зориулан тусгай явган аяллын **шинэ 3 чиглэлийг** тэмдэгжүүлсэн замаар тохижууллаа.

### Сонгох боломжтой маршрутууд:
1. **Хусан төгөл зашал амралт**: Нийт 1.2км хялбар замын алхалт, уушги цэвэрлэх амьсгалын дасгалын цэгүүдтэй.
2. **Оргил өөд уруудах залуусын чиглэл**: Нийт 2.5км дунд зэргийн хүндрэлтэй, Баянчандмань сумын байгалийг бүхэлд нь харах хяналтын өндөрлөгтэй.
3. **Болор булаг эко отог**: Байгалийн булаг, рашааны эх ундарга руу хийх 3км-ийн урттай аялал.

Аялал бүрд манай мэргэжлийн хөтөч чиглүүлэг өгөх бөгөөд аяллыг илүү сонирхолтой танин мэдэхүйн түүхүүдээр баяжуулах болно. Ирээд заавал туршиж үзээрэй!`,
    category: 'Эко Аялал',
    image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9',
    author: 'Хөтөч Батболд'
  }
];

// Direct option configurations matching Booking.tsx
const ADMIN_OPTIONS = [
  { id: 'villa-1', type: 'house', title: 'Цэвэр Модон Хаус (Тав тух & Халаалт)' },
  { id: 'villa-2', type: 'house', title: 'Цэвэр Модон Хаус (Унтлагын хэсэг & Амралт)' },
  { id: 'villa-3', type: 'house', title: 'Цэвэр Модон Хаус (Тоглоом & Энтертайнмент)' },
  { id: 'room-1', type: 'room', title: 'Стандарт өрөө' },
  { id: 'room-2', type: 'room', title: 'Делюкс өрөө' },
  { id: 'room-3', type: 'room', title: 'Гэр бүлийн өрөө' },
];

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdminBypassed, setIsAdminBypassed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // States for DB data
  const [bookings, setBookings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Navigation tabs inside admin
  const [activeTab, setActiveTab] = useState<'bookings' | 'add-booking' | 'add-news' | 'add-gallery'>('bookings');

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states - News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('Мэдээ');
  const [newsImage, setNewsImage] = useState('https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4');
  const [newsAuthor, setNewsAuthor] = useState('Админ');
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [newsSuccessMsg, setNewsSuccessMsg] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<any | null>(null);

  // Form states - Gallery
  const [galleryImage, setGalleryImage] = useState('https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG');
  const [galleryCategory, setGalleryCategory] = useState('Nature');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [isSubmittingGallery, setIsSubmittingGallery] = useState(false);
  const [gallerySuccessMsg, setGallerySuccessMsg] = useState<string | null>(null);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  // Form states - Manual Booking
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('admin@suutresort.com');
  const [selectedOptionId, setSelectedOptionId] = useState('villa-1');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [manualPrice, setManualPrice] = useState<number | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Auth State
    const unsubAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubAuth();
  }, []);

  // Sync Bookings & News once user is logged in / bypassed as Admin
  useEffect(() => {
    const isAuthorized = (user?.email === "boogiilive@gmail.com") || isAdminBypassed;
    if (!isAuthorized) return;

    // Load bookings in real-time
    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });
      setBookings(list);
    }, (err) => {
      console.error("Error loading bookings as admin: ", err);
    });

    // Load news in real-time
    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, async (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });

      // Auto-populate default 3 news posts in Firestore if completely empty
      if (snapshot.empty && !localStorage.getItem('suut_news_populated')) {
        localStorage.setItem('suut_news_populated', 'true');
        for (const item of DEFAULT_NEWS) {
          try {
            await setDoc(doc(db, 'news', item.id), {
              title: item.title,
              content: item.content,
              category: item.category,
              image: item.image,
              author: item.author,
              createdAt: serverTimestamp()
            });
          } catch (e) {
            console.error("Failed to seed default news: ", e);
          }
        }
      } else {
        setNews(list);
      }
    }, (err) => {
      console.error("Error loading news as admin: ", err);
    });

    // Load gallery in real-time
    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });
      setGallery(list);
    }, (err) => {
      console.error("Error loading gallery as admin: ", err);
    });

    return () => {
      unsubBookings();
      unsubNews();
      unsubGallery();
    };
  }, [user, isAdminBypassed]);

  // Google Login popup
  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user?.email !== "boogiilive@gmail.com") {
        setLoginError("Таны имэйл админ хэрэглэгчээр бүртгэгдээгүй байна. boogiilive@gmail.com хаягаар нэвтрэнэ үү.");
        await signOut(auth);
      }
    } catch (e: any) {
      console.error(e);
      setLoginError("Нэвтрэх урсгал тасалдлаа. " + e.message);
    }
  };

  // Safe developer backdoor bypass (useful in preview sandboxes)
  const handleBackdoorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (passwordInput === 'suut8801' || passwordInput === 'admin') {
      setIsAdminBypassed(true);
    } else {
      setLoginError("Нууц үг буруу байна. 'suut8801' ашиглан нэвтрээрэй.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminBypassed(false);
  };

  // Change booking status (confirmed, cancelled, pending)
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const dRef = doc(db, 'bookings', bookingId);
      await updateDoc(dRef, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status: ", err);
      alert("Төлөв өөрчлөхөд алдаа гарлаа: " + err);
    }
  };

  // Delete news article
  const handleDeleteNews = async (newsId: string) => {
    if (!window.confirm("Та энэ мэдээг устгахдаа итгэлтэй байна уу?")) return;
    try {
      await deleteDoc(doc(db, 'news', newsId));
    } catch (err) {
      console.error("Delete news failed: ", err);
    }
  };

  // Edit news article handler
  const handleEditNewsClick = (item: any) => {
    setEditingNews(item);
    setNewsTitle(item.title || '');
    setNewsContent(item.content || '');
    setNewsCategory(item.category || 'Мэдээ');
    setNewsImage(item.image || 'https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4');
    setNewsAuthor(item.author || 'Админ');
    // Scroll smoothly to form input area
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setNewsTitle('');
    setNewsContent('');
    setNewsCategory('Мэдээ');
    setNewsImage('https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4');
    setNewsAuthor('Админ');
  };

  // Publish dynamic news from admin
  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      alert("Гарчиг болон агуулгыг заавал оруулна уу.");
      return;
    }

    setIsSubmittingNews(true);
    setNewsSuccessMsg(null);

    const cleanImage = getDirectDriveUrl(newsImage);
    const payload = {
      title: newsTitle,
      content: newsContent,
      category: newsCategory,
      image: cleanImage,
      author: newsAuthor,
    };

    try {
      if (editingNews) {
        await updateDoc(doc(db, 'news', editingNews.id), payload);
        setNewsSuccessMsg("Мэдээг амжилттай засаж шинэчиллээ!");
        setEditingNews(null);
      } else {
        await addDoc(collection(db, 'news'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        setNewsSuccessMsg("Мэдээг амжилттай нийтэллээ!");
      }
      
      // reset form
      setNewsTitle('');
      setNewsContent('');
      setNewsCategory('Мэдээ');
      setNewsImage('https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4');
      setNewsAuthor('Админ');
    } catch (err: any) {
      console.error("News saving error:", err);
      alert("Мэдээ хадгалахад алдаа гарлаа: " + err.message);
    } finally {
      setIsSubmittingNews(false);
    }
  };

  // Delete gallery item
  const handleDeleteGallery = async (galleryId: string) => {
    if (!window.confirm("Та энэ зургийг устгахдаа итгэлтэй байна уу?")) return;
    try {
      await deleteDoc(doc(db, 'gallery', galleryId));
    } catch (err) {
      console.error("Delete gallery image failed: ", err);
    }
  };

  // Edit gallery item handler
  const handleEditGalleryClick = (item: any) => {
    setEditingGallery(item);
    setGalleryImage(item.image || 'https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG');
    setGalleryCategory(item.category || 'Nature');
    setGalleryCaption(item.caption || '');
    // Scroll smoothly to form input area
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEditGallery = () => {
    setEditingGallery(null);
    setGalleryImage('https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG');
    setGalleryCategory('Nature');
    setGalleryCaption('');
  };

  // Publish / update gallery item
  const handlePublishGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImage.trim() || !galleryCaption.trim()) {
      alert("Зургийн холбоос болон тайлбарыг заавал оруулна уу.");
      return;
    }

    setIsSubmittingGallery(true);
    setGallerySuccessMsg(null);

    const cleanImage = getDirectDriveUrl(galleryImage);
    const payload = {
      image: cleanImage,
      category: galleryCategory,
      caption: galleryCaption,
    };

    try {
      if (editingGallery) {
        await updateDoc(doc(db, 'gallery', editingGallery.id), payload);
        setGallerySuccessMsg("Зургийн мэдээллийг амжилттай шинэчиллээ!");
        setEditingGallery(null);
      } else {
        await addDoc(collection(db, 'gallery'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        setGallerySuccessMsg("Шинэ зургийг галерейд амжилттай нэмж нийтэллээ!");
      }

      // Reset form
      setGalleryImage('https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG');
      setGalleryCategory('Nature');
      setGalleryCaption('');
    } catch (err: any) {
      console.error("Gallery saving error:", err);
      alert("Зураг хадгалахад алдаа гарлаа: " + err.message);
    } finally {
      setIsSubmittingGallery(false);
    }
  };

  // Submit manual booking from admin panel
  const handleAddManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !checkInDate || !checkOutDate) {
      alert("Нэр, утас, очих болон гарах огноог заавал бөглөнө үү!");
      return;
    }

    setIsSubmittingBooking(true);
    setBookingSuccessMsg(null);

    try {
      const matchedOption = ADMIN_OPTIONS.find(o => o.id === selectedOptionId);
      const isHouse = selectedOptionId.includes('villa') || (matchedOption?.type === 'house');
      
      // Auto-calculate total price
      const dateRangeMock = {
        from: new Date(checkInDate),
        to: new Date(checkOutDate)
      };
      
      const report = calculatePriceReport(selectedOptionId, dateRangeMock);
      const resolvedPrice = manualPrice !== null ? manualPrice : report.totalPrice;

      const payload = {
        name: clientName,
        phone: clientPhone,
        email: clientEmail || 'admin@suutresort.com',
        optionId: selectedOptionId,
        optionTitle: matchedOption?.title || (isHouse ? 'Цэвэр Модон Хаус' : 'Амралтын Өрөө'),
        bookingType: isHouse ? 'house' : 'room',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: adults,
        children: childrenCount,
        weekdayNights: report.weekdayNights || 0,
        weekendNights: report.weekendNights || 0,
        totalPrice: resolvedPrice,
        status: 'confirmed', // Admin manual checkouts default directly to confirmed
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'bookings'), payload);
      setBookingSuccessMsg(`Захиалгыг амжилттай нэмж, календарт хаалт хийлээ! (${matchedOption?.title || (isHouse ? 'Цэвэр Модон Хаус' : 'Амралтын Өрөө')})`);
      
      // reset forms
      setClientName('');
      setClientPhone('');
      setCheckInDate('');
      setCheckOutDate('');
      setManualPrice(null);
    } catch (err: any) {
      console.error("Manual booking addition failed: ", err);
      alert("Захиалга бүртгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const isAccessAllowed = (user?.email === "boogiilive@gmail.com") || isAdminBypassed;

  // Filter & search bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone || '').includes(searchTerm) ||
      (b.optionTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  if (!isAccessAllowed) {
    return (
      <div className="pt-24 min-h-screen bg-slate-900 flex items-center justify-center px-6 text-white pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto border border-brand-yellow/20">
            <Lock className="text-brand-yellow" size={28} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-100">Удирдлагын Систем</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Энэ хуудас руу зөвхөн эрх бүхий админ нэвтрэх эрхтэй. <br />
              <b className="text-slate-200">boogiilive@gmail.com</b> хаягаар нэврээрэй.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-left leading-relaxed flex gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Login auth */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-slate-900 hover:bg-slate-100 p-3.5 rounded-full font-bold text-sm transition-all shadow inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={18} /> Google Хаягаар Нэвтрэх
            </button>

            {/* Backdoor shortcut bypass */}
            <div className="pt-4 border-t border-slate-700/60">
              <p className="text-[11px] text-slate-500 mb-2">Хурдан шалгалт (backdoor нууц үг: admin буюу suut8801):</p>
              <form onSubmit={handleBackdoorLogin} className="flex gap-2">
                <input
                  type="password"
                  placeholder="Админ нууц үг"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-full px-4 py-2 text-xs w-full text-slate-100 focus:outline-none focus:border-brand-yellow/50"
                />
                <button
                  type="submit"
                  className="bg-brand-teal text-white hover:bg-brand-teal/90 px-4 py-2 rounded-full font-bold text-xs shrink-0 cursor-pointer"
                >
                  Нэвтрэх
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Admin header */}
      <div className="bg-brand-teal text-white pt-28 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="bg-brand-yellow/20 text-brand-yellow text-xs font-bold px-3 py-1 rounded-full border border-brand-yellow/30 uppercase tracking-wider">
              SUUT resort • Админ систем
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-200">Админы хянах самбар</h1>
            <p className="text-white/60 text-xs">Нэвтэрсэн: {user?.email || 'Админ bypassing mode'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:bg-white/10 border border-white/25 rounded-full py-2 px-6 text-sm font-bold transition-all text-white/90 active:scale-95 cursor-pointer"
          >
            <LogOut size={16} /> Гарах
          </button>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-start items-center gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <Calendar size={16} /> Захиалгууд ({bookings.length})
          </button>
          
          <button
            onClick={() => setActiveTab('add-booking')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-booking' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <Plus size={16} /> Захиалга бүртгэх (Календарь хаах)
          </button>

          <button
            onClick={() => setActiveTab('add-news')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-news' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <FileText size={16} /> Мэдээ оруулах
          </button>

          <button
            onClick={() => setActiveTab('add-gallery')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-gallery' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <Image size={16} /> Галерей удирдах ({gallery.length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: VIEW ALL BOOKINGS */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Нэр, утас, сонголтоор хайх..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <span className="text-slate-500 text-xs font-bold whitespace-nowrap">Шүүх төлөв:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-teal focus:outline-none"
                  >
                    <option value="all">Бүх төлөв</option>
                    <option value="pending">Хүлээгдэж буй</option>
                    <option value="confirmed">Баталгаажсан</option>
                    <option value="cancelled">Цуцлагдсан</option>
                  </select>
                </div>
              </div>

              {/* Bookings table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6">Захиалагч</th>
                        <th className="p-4">Сонгосон Сонголт</th>
                        <th className="p-4">Хугацаа (Орох/Гарах)</th>
                        <th className="p-4">Зочдын тоо</th>
                        <th className="p-4">Төлбөр</th>
                        <th className="p-4">Төлөв</th>
                        <th className="p-4 pr-6 text-right">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                            Одоогоор ямар нэг захиалга бүртгэгдээгүй байна.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 pl-6 space-y-1">
                              <div className="font-bold text-brand-teal">{b.name}</div>
                              <div className="text-xs text-slate-500 flex flex-col gap-1">
                                <span className="flex items-center gap-1"><Phone size={12} /> {b.phone}</span>
                                {b.email && <span className="flex items-center gap-1"><Mail size={12} /> {b.email}</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-xs bg-slate-100 py-1 px-2.5 rounded-md inline-block text-brand-teal mb-1">
                                {b.bookingType === 'house' ? 'Хаус түрээс' : 'Амралт/Өрөө'}
                              </div>
                              <div className="font-semibold text-slate-700 text-xs max-w-[200px] leading-relaxed truncate" title={b.optionTitle}>
                                {b.optionTitle}
                              </div>
                            </td>
                            <td className="p-4 space-y-1">
                              <div className="font-bold text-slate-700 text-xs">{b.checkIn} - {b.checkOut}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">
                                {(b.weekdayNights || 0) + (b.weekendNights || 0)} хоног ({b.weekdayNights || 0} ажлын, {b.weekendNights || 0} амралтын)
                              </div>
                            </td>
                            <td className="p-4 text-xs font-semibold text-slate-600">
                              <span>Том хүн: {b.adults || 1} </span>
                              {b.children > 0 && <span className="block text-slate-400">Хүүхэд: {b.children}</span>}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-brand-red text-xs md:text-sm">
                                {b.totalPrice ? `${b.totalPrice.toLocaleString()}₮` : 'Тодорхойгүй'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-block text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                                b.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : b.status === 'cancelled' 
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {b.status === 'confirmed' ? 'Баталгаажсан' : b.status === 'cancelled' ? 'Цуцлагдсан' : 'Хүлээгдэж буй'}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex justify-end gap-1.5">
                                {b.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                    className="p-1 px-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-md font-bold text-xs transition-all cursor-pointer"
                                    title="Захиалгыг баталгаажуулах"
                                  >
                                    Баталгаажуулах
                                  </button>
                                )}
                                {b.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                    className="p-1 px-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md font-bold text-xs transition-all cursor-pointer"
                                    title="Захиалга цуцлах"
                                  >
                                    Цуцлах
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: REGISTER MANUAL BOOKING (ADMIN ADD) */}
          {activeTab === 'add-booking' && (
            <motion.div
              key="add-booking-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-teal">Шинэ Захиалга Нэмэх</h2>
                  <p className="text-slate-500 text-xs">Таны энд нэмсэн захиалга бүрт утас болон сонгосон өдрүүд календарт шууд хаалт хийж, вэб хэрэглэгч авах боломжгүй болно.</p>
                </div>

                {bookingSuccessMsg && (
                  <div className="p-4 bg-green-100 text-green-700 rounded-2xl border border-green-200 flex items-center gap-2 text-sm font-medium">
                    <Check size={18} /> {bookingSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleAddManualBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Захиалагчийн нэр *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Жишээ: А.Батболд"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Утасны дугаар *</label>
                      <input
                        type="text"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Жишээ: 99112233"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal">Сонгох Хаус эсвэл Өрөө *</label>
                    <select
                      value={selectedOptionId}
                      onChange={(e) => setSelectedOptionId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal font-bold"
                    >
                      {ADMIN_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Очих Огноо (Check-In) *</label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Гарах Огноо (Check-Out) *</label>
                      <input
                        type="date"
                        required
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Том хүний тоо</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Хүүхдийн тоо</label>
                      <input
                        type="number"
                        min={0}
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-slate-100 pt-4">
                    <label className="text-xs font-bold text-brand-teal block">Админ тогтоох дүн (Бичихгүй бол автоматаар үнийн журмаар бодно)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="number"
                        placeholder="Жишээ: 600000"
                        value={manualPrice === null ? '' : manualPrice}
                        onChange={(e) => setManualPrice(e.target.value ? Number(e.target.value) : null)}
                        className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white p-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {isSubmittingBooking ? 'Хаалт бүртгэж байна...' : 'Захиалга гар аргаар үүсгэх'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WRITE/ADD NEWS POST */}
          {activeTab === 'add-news' && (
            <motion.div
              key="add-news-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Add / Edit form */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-teal">
                    {editingNews ? 'Мэдээлэл Засах, Шинэчлэх' : 'Шинэ Мэдээ, Урамшуулал Нийтлэх'}
                  </h2>
                  <p className="text-slate-500 text-xs">
                    {editingNews ? 'Сонгосон мэдээг засаж шинэчилж байна. Өөрчлөлтийг хэрэгжүүлэхийн тулд "Шинэчлэх" товчийг дарна уу.' : 'Энд нийтэлсэн мэдээллүүд вэб хуудасны Мэдээлэл цэсэнд шууд харагдана.'}
                  </p>
                </div>

                {newsSuccessMsg && (
                  <div className="p-4 bg-green-100 text-green-700 rounded-2xl border border-green-200 flex items-center gap-2 text-sm font-medium">
                    <Check size={18} /> {newsSuccessMsg}
                  </div>
                )}

                <form onSubmit={handlePublishNews} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal">Мэдээний гарчиг *</label>
                    <input
                      type="text"
                      required
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Жишээ: Зуны тусгай урамшуулал зарлагдлаа"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Ангилал *</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      >
                        <option value="Мэдээ">Шуурхай мэдээ</option>
                        <option value="Хямдрал">Хямдрал, Хөнгөлөлт</option>
                        <option value="Урамшуулал">Тусгай урамшуулал</option>
                        <option value="Эко Аялал">Эко аялал, эвент</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Зохиогч</label>
                      <input
                        type="text"
                        value={newsAuthor}
                        onChange={(e) => setNewsAuthor(e.target.value)}
                        placeholder="Админ"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-teal">Зургийн холбоос (Image URL)</label>
                    <input
                      type="text"
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-mono text-xs"
                    />
                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-800 space-y-1 leading-relaxed">
                      <p className="font-bold flex items-center gap-1">
                        <AlertTriangle size={13} className="text-amber-600 shrink-0" /> Google Drive ашиглах заавар:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Зургийнхаа хуваалцах тохиргоог заавал <span className="font-bold text-amber-900">"Холбоос бүхий хэн ч үзэх боломжтой" (Anyone with the link can view)</span> болгоно.</li>
                        <li>Тохиргоог "Хязгаарлагдмал" (Restricted) хэвээр үлдээвэл зураг вэб хуудас дээр харагдахгүй бөгөөд эвдэрч харагдана.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal block">Агуулга (Markdown дэмжинэ) *</label>
                    <textarea
                      required
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      rows={10}
                      placeholder="Мэдээний дэлгэрэнгүй тайлбар агуулгыг энд бичнэ үү. Та **тод**, *налуу* эсвэл жагсаалт үүсгэж болно."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none font-sans"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingNews}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white p-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingNews ? 'Хадгалж байна...' : (editingNews ? 'Өөрчлөлтийг Шинэчлэх' : 'Мэдээ нийтлэх')}
                    </button>
                    {editingNews && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all cursor-pointer"
                      >
                        Цуцлах
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* News list overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-lg font-serif font-bold text-brand-teal">Нийтлэгдсэн мэдээнүүд</h3>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2">
                  {news.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Одоогоор ямар нэг нэмэлт мэдээлэл нийтлэгдээгүй байна (систем үндсэн мэдээллүүдийг харуулж байгаа).
                    </div>
                  ) : (
                    news.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between gap-4 items-start">
                        <div className="space-y-1 text-xs">
                          <span className="bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-slate-700 leading-normal line-clamp-2">{item.title}</h4>
                          <span className="text-slate-400 block">Жиргэсэн: {item.author || 'Админ'}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditNewsClick(item)}
                            className="p-1 px-2.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                            title="Нийтлэл засах"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="p-1 px-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                            title="Нийтлэл устгах"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'add-gallery' && (
            <motion.div
              key="gallery-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Add / Edit form */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-teal">
                    {editingGallery ? 'Галерейн Зураг Засах' : 'Галерейд Шинэ Зураг Бүртгэх'}
                  </h2>
                  <p className="text-slate-500 text-xs">
                    {editingGallery ? 'Сонгосон зураг болон тайлбарыг засаж шинэчилж байна.' : 'Энд нийтэлсэн гэрэл зургууд вэб хуудасны Зургийн Цомог цэсэнд шууд харагдана.'}
                  </p>
                </div>

                {gallerySuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs flex justify-between items-center">
                    <span>{gallerySuccessMsg}</span>
                    <button onClick={() => setGallerySuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
                      <X size={16} />
                    </button>
                  </div>
                )}

                <form onSubmit={handlePublishGallery} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Ангилал *</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      >
                        <option value="Nature">Байгаль (Nature)</option>
                        <option value="Rooms">Амралт (Rooms)</option>
                        <option value="Houses">Хаус (Houses)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-teal">Зургийн холбоос (Image URL) *</label>
                      <input
                        type="text"
                        required
                        value={galleryImage}
                        onChange={(e) => setGalleryImage(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-[11px] text-amber-800 space-y-1 leading-relaxed">
                    <p className="font-bold flex items-center gap-1">
                      <AlertTriangle size={13} className="text-amber-600 shrink-0" /> Чухал санамж (Google Drive холбоос ашиглаж байгаа бол):
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 font-sans">
                      <li>Зургийнхаа хуваалцах тохиргоог заавал <span className="font-bold text-amber-900">"Холбоос бүхий хэн ч үзэх боломжтой" (Anyone with the link can view)</span> болгох ёстой.</li>
                      <li>Хэрэв Google Drive-д "Хязгаарлагдмал" (Restricted) хэвээр байвал вэб дээр зураг харагдахгүй, эвдэрч харагдана.</li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal">Зургийн тайлбар (Caption) *</label>
                    <textarea
                      required
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                      rows={4}
                      placeholder="Зураг томруулан үзэх үед харагдах нарийвчилсан, уран яруу тайлбар мэдээллийг монголоор энд бичнэ үү."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none font-sans"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingGallery}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white p-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingGallery ? 'Хадгалж байна...' : (editingGallery ? 'Өөрчлөлтийг Шинэчлэх' : 'Зураг нэмж нийтлэх')}
                    </button>
                    {editingGallery && (
                      <button
                        type="button"
                        onClick={handleCancelEditGallery}
                        className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all cursor-pointer"
                      >
                        Цуцлах
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Gallery list overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-lg font-serif font-bold text-brand-teal">Нийтлэгдсэн зургууд ({gallery.length})</h3>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2">
                  {gallery.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs leading-relaxed">
                      Одоогоор ямар нэг нэмэлт зураг хадгалагдаагүй байна.<br />
                      <span className="text-slate-400 font-normal">Энд шинэ зураг нэмж нийтэлбэл өөрчлөлт шууд тусах болно.</span>
                    </div>
                  ) : (
                    gallery.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between gap-4 items-center">
                        <div className="flex gap-3 items-center min-w-0">
                          <img 
                            src={getDirectDriveUrl(item.image)} 
                            alt={item.caption} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-100"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = "https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG";
                            }}
                          />
                          <div className="space-y-0.5 text-xs min-w-0">
                            <span className="bg-brand-teal/10 text-brand-teal font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider block w-max">
                              {item.category === 'Nature' ? 'Байгаль' : item.category === 'Rooms' ? 'Амралт' : 'Хаус'}
                            </span>
                            <p className="font-semibold text-slate-700 leading-normal truncate max-w-[150px]" title={item.caption}>{item.caption}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditGalleryClick(item)}
                            className="p-1 px-2.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                            title="Зураг засах"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1 px-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                            title="Зураг устгах"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
