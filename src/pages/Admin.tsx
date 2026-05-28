import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LogIn, Calendar, Plus, FileText, Check, X, Search, 
  Trash2, User, Phone, Mail, DollarSign, RefreshCw, LogOut, AlertTriangle, Edit, Image, HelpCircle,
  BarChart3, TrendingUp, TrendingDown, Download, Award
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc 
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { calculatePriceReport } from './Booking';
import { getDirectDriveUrl, safeToDate } from '@/lib/utils';

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
  { id: 'room-1', type: 'room', title: 'Стандарт' },
  { id: 'room-2', type: 'room', title: 'Делюкс' },
  { id: 'room-3', type: 'room', title: 'Гэр бүлийн' },
];

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'Байрлах хугацаанд ямар ямар хоол багтсан бэ?',
    answer: 'Манай урьдчилсан захиалга бүрт өглөө, өдөр, оройн 3 хоол багтсан байдаг байгаа.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'Урьдчилгаа төлбөр хэдэн хувь байдаг вэ?',
    answer: 'Захиалга баталгаажуулахад нийт үнийн дүнгийн 30 хувийн урьдчилгаа төлбөр шилжүүлэх шаардлагатай. Төлбөрийн мэдээлэл захиалга илгээсний дараа харагдах болно.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Гэрийн тэжээвэр амьтан авч очиж болох уу?',
    answer: 'Тийм ээ, манай амралтын газарт гэрийн тэжээвэр амьтан авч очих боломжтой. Гэхдээ бусад амрагчдын ая тухтай байдлыг хангах үүднээс соёлтой оролцоно уу.',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'Бид хүүхдүүдтэйгээ очих гэж байгаа юм, суут ресортод тоглоомын талбай бий юу?',
    answer: 'Тийм ээ, хүүхдийн аюулгүй гадна тоглоомын талбай болон элсэн талбай спортын талбайнууд шийдэгдсэн.',
    order: 4
  }
];

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdminBypassed, setIsAdminBypassed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Master Admin Password custom configuration states
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('suut_admin_password') || 'suut8801');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [isChangingPasswordSubmitting, setIsChangingPasswordSubmitting] = useState(false);

  // States for testing FormSubmit booking email notifications
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestMessage, setEmailTestMessage] = useState<string | null>(null);
  const [emailTestError, setEmailTestError] = useState<string | null>(null);

  // States for DB data
  const [bookings, setBookings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Raw Firestore items (for merging)
  const firestoreBookingsRef = useRef<any[]>([]);
  const firestoreNewsRef = useRef<any[]>([]);
  const firestoreGalleryRef = useRef<any[]>([]);
  const firestoreFaqsRef = useRef<any[]>([]);
  const apiNewsRef = useRef<any[]>([]);
  const apiGalleryRef = useRef<any[]>([]);
  const isSubmittingBookingsRef = useRef(false);

  // Robust sync functions merging local cache and firestore streams
  const syncBookings = () => {
    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('suut_custom_bookings') || '[]');
    } catch (e) {
      console.error("Local storage error in syncBookings:", e);
    }
    
    // Start with Firestore bookings, merging any client-side overrides (especially status modifications!)
    const combined = firestoreBookingsRef.current.map((fItem: any) => {
      const localMatch = local.find((lItem: any) => 
        lItem.id === fItem.id ||
        (lItem.name === fItem.name && 
         lItem.phone === fItem.phone && 
         lItem.checkIn === fItem.checkIn && 
         lItem.checkOut === fItem.checkOut && 
         lItem.optionId === fItem.optionId)
      );
      if (localMatch) {
        return {
          ...fItem,
          ...localMatch,
          status: localMatch.status || fItem.status
        };
      }
      return fItem;
    });

    // Merge in any other local bookings, deduplicating both by ID and by exact details
    local.forEach((lItem: any) => {
      const exists = combined.some((item: any) => 
        item.id === lItem.id ||
        (item.name === lItem.name && 
         item.phone === lItem.phone && 
         item.checkIn === lItem.checkIn && 
         item.checkOut === lItem.checkOut && 
         item.optionId === lItem.optionId)
      );
      if (!exists) {
        combined.push(lItem);
      }
    });

    // Safely sort the combined bookings list in-memory descending by createdAt
    combined.sort((a: any, b: any) => {
      const getMs = (val: any) => {
        if (!val) return 0;
        if (typeof val.toDate === 'function') {
          return val.toDate().getTime();
        }
        if (val.seconds) {
          return val.seconds * 1000;
        }
        const parsed = Date.parse(val);
        return isNaN(parsed) ? 0 : parsed;
      };
      return getMs(b.createdAt) - getMs(a.createdAt);
    });

    setBookings(combined);
  };

  const syncNews = () => {
    const local = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
    const deletedDefaults = JSON.parse(localStorage.getItem('suut_deleted_default_news_ids') || '[]');
    
    // Combine Firestore ref and API ref first
    const allFetched = [...firestoreNewsRef.current];
    if (Array.isArray(apiNewsRef.current)) {
      apiNewsRef.current.forEach((apiItem: any) => {
        const exists = allFetched.some(item => item.id === apiItem.id || item.title === apiItem.title);
        if (!exists) {
          allFetched.push(apiItem);
        }
      });
    }

    // Map combined with local edits if present
    const combined = allFetched.map((fItem: any) => {
      const localMatch = local.find((lItem: any) => lItem.id === fItem.id);
      return localMatch ? { ...fItem, ...localMatch } : fItem;
    });
    
    // Add local custom news not present in database
    local.forEach((lItem: any) => {
      const exists = combined.some(item => item.id === lItem.id);
      if (!exists) combined.push(lItem);
    });

    // Merge default news if they aren't deleted and not already mapped
    DEFAULT_NEWS.forEach((defItem: any) => {
      if (deletedDefaults.includes(defItem.id)) return;
      
      const exists = combined.some(item => item.id === defItem.id || item.title === defItem.title);
      if (!exists) {
        combined.push({
          ...defItem,
          createdAt: { toDate: () => new Date('2026-05-15') } // Wrap in expected format
        });
      }
    });

    setNews(combined);
  };

  const syncGallery = () => {
    const local = JSON.parse(localStorage.getItem('suut_custom_gallery') || '[]');
    
    // Combine Firestore ref and API ref
    const allFetched = [...firestoreGalleryRef.current];
    if (Array.isArray(apiGalleryRef.current)) {
      apiGalleryRef.current.forEach((apiItem: any) => {
        const exists = allFetched.some(item => item.id === apiItem.id || item.image === apiItem.image);
        if (!exists) {
          allFetched.push(apiItem);
        }
      });
    }

    const combined = allFetched.map((fItem: any) => {
      const localMatch = local.find((lItem: any) => lItem.id === fItem.id);
      return localMatch ? { ...fItem, ...localMatch } : fItem;
    });
    local.forEach((lItem: any) => {
      const exists = combined.some(item => item.id === lItem.id);
      if (!exists) combined.push(lItem);
    });
    setGallery(combined);
  };

  const syncFaqs = () => {
    let local: any[] = [];
    let deletedDefaults: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('suut_custom_faqs') || '[]');
      deletedDefaults = JSON.parse(localStorage.getItem('suut_deleted_default_faq_ids') || '[]');
    } catch {
      // safe fallback
    }

    const allFetched = [...firestoreFaqsRef.current];
    const combined = allFetched.map((fItem: any) => {
      const localMatch = local.find((lItem: any) => lItem.id === fItem.id);
      return localMatch ? { ...fItem, ...localMatch } : fItem;
    });

    local.forEach((lItem: any) => {
      const exists = combined.some(item => item.id === lItem.id);
      if (!exists) combined.push(lItem);
    });

    DEFAULT_FAQS.forEach((defItem: any) => {
      if (deletedDefaults.includes(defItem.id)) return;
      const exists = combined.some(item => item.id === defItem.id || item.question === defItem.question);
      if (!exists) {
        combined.push(defItem);
      }
    });

    // Sort by order asc
    combined.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    setFaqs(combined);
  };

  // Navigation tabs inside admin
  const [activeTab, setActiveTab] = useState<'bookings' | 'stats' | 'add-booking' | 'add-news' | 'add-gallery' | 'manage-faqs'>('bookings');

  // FAQ management states
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqOrder, setFaqOrder] = useState<number>(5);
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);
  const [faqSuccessMsg, setFaqSuccessMsg] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

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
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);
  const [confirmingBooking, setConfirmingBooking] = useState<any | null>(null);

  useEffect(() => {
    // Listen to Auth State
    const unsubAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubAuth();
  }, []);

  // Sync Bookings & News once user is logged in / bypassed as Admin
  useEffect(() => {
    const isAuthorized = (user?.email === "boogiilive@gmail.com" || user?.email === "boonoogod@gmail.com") || isAdminBypassed;
    if (!isAuthorized) return;

    // Load instantly from local storage first (zero latency)
    syncBookings();
    syncNews();
    syncGallery();
    syncFaqs();

    const loadAllFromApi = async () => {
      try {
        const [newsRes, galleryRes, bookingsRes] = await Promise.all([
          fetch('/api/news').catch(() => null),
          fetch('/api/gallery').catch(() => null),
          fetch('/api/bookings').catch(() => null)
        ]);

        if (newsRes && newsRes.ok) {
          const apiNews = await newsRes.json();
          if (apiNews && apiNews.length > 0) {
            apiNewsRef.current = apiNews;
            syncNews();
          }
        }
        if (galleryRes && galleryRes.ok) {
          const apiGallery = await galleryRes.json();
          if (apiGallery && apiGallery.length > 0) {
            apiGalleryRef.current = apiGallery;
            syncGallery();
          }
        }
        if (bookingsRes && bookingsRes.ok) {
          const apiBookings = await bookingsRes.json();
          if (apiBookings && apiBookings.length > 0) {
            firestoreBookingsRef.current = apiBookings;
            syncBookings();
          }
        }
      } catch (err) {
        console.warn("Failed to load admin lists from local server API:", err);
      }
    };

    // Run local API data sync instantly
    loadAllFromApi();

    // Load bookings in real-time as background fallback
    const qBookings = collection(db, 'bookings');
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });
      if (list.length > 0) {
        firestoreBookingsRef.current = list;
        syncBookings();
      }
    }, (err) => {
      console.error("Error loading bookings as admin: ", err);
      syncBookings();
    });

    // Load news in real-time as background fallback
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
              createdAt: new Date()
            });
          } catch (e) {
            console.error("Failed to seed default news: ", e);
          }
        }
      } else {
        // Sync custom news stored locally in Chrome which are missing in Cloud DB
        try {
          const localCustom = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
          const missingInFirestore = localCustom.filter((lItem: any) => {
            return !list.some((fItem) => fItem.id === lItem.id || fItem.title === lItem.title);
          });

          for (const item of missingInFirestore) {
            try {
              await setDoc(doc(db, 'news', item.id), {
                title: item.title,
                content: item.content,
                category: item.category,
                image: item.image || '',
                author: item.author || 'Админ',
                createdAt: safeToDate(item.createdAt)
              });
              console.log(`Successfully synced missing custom news article to Firestore: ${item.title}`);
            } catch (err) {
              console.warn(`Sync failed for news article: ${item.title}`, err);
            }
          }
        } catch (err) {
          console.warn("Error checking/uploading missing custom news items:", err);
        }
      }

      firestoreNewsRef.current = list;
      syncNews();
    }, (err) => {
      console.error("Error loading news as admin: ", err);
      syncNews();
    });

    // Load gallery in real-time
    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubGallery = onSnapshot(qGallery, async (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });

      // Sync custom gallery stored locally in Chrome which are missing in Cloud DB
      try {
        const localCustom = JSON.parse(localStorage.getItem('suut_custom_gallery') || '[]');
        const missingInFirestore = localCustom.filter((lItem: any) => {
          return !list.some((fItem) => fItem.id === lItem.id || fItem.image === lItem.image);
        });

        for (const item of missingInFirestore) {
          try {
            await setDoc(doc(db, 'gallery', item.id), {
              image: item.image,
              category: item.category,
              caption: item.caption,
              createdAt: safeToDate(item.createdAt)
            });
            console.log(`Successfully synced missing custom gallery image to Firestore: ${item.caption}`);
          } catch (err) {
            console.warn(`Sync failed for gallery image: ${item.caption}`, err);
          }
        }
      } catch (err) {
        console.warn("Error checking/uploading missing custom gallery items:", err);
      }

      firestoreGalleryRef.current = list;
      syncGallery();
    }, (err) => {
      console.error("Error loading gallery as admin: ", err);
      syncGallery();
    });

    // Load faqs in real-time
    const qFaqs = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const unsubFaqs = onSnapshot(qFaqs, async (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...snap.data() });
      });

      // Auto-populate default FAQs in Firestore if completely empty
      if (snapshot.empty && !localStorage.getItem('suut_faqs_populated')) {
        localStorage.setItem('suut_faqs_populated', 'true');
        for (const item of DEFAULT_FAQS) {
          try {
            await setDoc(doc(db, 'faqs', item.id), {
              question: item.question,
              answer: item.answer,
              order: item.order,
              createdAt: new Date()
            });
          } catch (e) {
            console.error("Failed to seed default faq: ", e);
          }
        }
      } else {
        // Sync custom faqs stored locally in Chrome which are missing in Cloud DB
        try {
          const localCustom = JSON.parse(localStorage.getItem('suut_custom_faqs') || '[]');
          const missingInFirestore = localCustom.filter((lItem: any) => {
            return !list.some((fItem) => fItem.id === lItem.id || fItem.question === lItem.question);
          });

          for (const item of missingInFirestore) {
            try {
              await setDoc(doc(db, 'faqs', item.id), {
                question: item.question,
                answer: item.answer,
                order: item.order || 5,
                createdAt: safeToDate(item.createdAt || new Date())
              });
              console.log(`Successfully synced missing custom FAQ to Firestore: ${item.question}`);
            } catch (err) {
              console.warn(`Sync failed for FAQ: ${item.question}`, err);
            }
          }
        } catch (err) {
          console.warn("Error checking/uploading missing custom FAQ items:", err);
        }
      }

      firestoreFaqsRef.current = list;
      syncFaqs();
    }, (err) => {
      console.error("Error loading faqs as admin: ", err);
      syncFaqs();
    });

    // Load custom admin password settings from Firestore in real-time
    const qSettings = doc(db, 'settings', 'admin_password');
    const unsubSettings = onSnapshot(qSettings, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.password) {
          setAdminPassword(data.password);
          localStorage.setItem('suut_admin_password', data.password);
        }
      }
    }, (err) => {
      console.warn("Could not read custom admin password setting from Firestore:", err);
    });

    return () => {
      unsubBookings();
      unsubNews();
      unsubGallery();
      unsubFaqs();
      unsubSettings();
    };
  }, [user, isAdminBypassed]);

  // Unified Email/Password login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError("Имэйл болон нууц үгээ оруулна уу.");
      return;
    }

    const lowerInputEmail = emailInput.trim().toLowerCase();
    const isMasterPasswordMatch = passwordInput === 'suut8801' || passwordInput === 'admin' || passwordInput === adminPassword;

    if (isMasterPasswordMatch) {
      if (lowerInputEmail === 'boogiilive@gmail.com' || lowerInputEmail === 'boonoogod@gmail.com') {
        setAdminUserEmail(lowerInputEmail);
        setIsAdminBypassed(true);
      } else {
        setLoginError("Танд системд нэвтрэх эрх байхгүй байна. (Зөвхөн boogiilive@gmail.com болон boonoogod@gmail.com)");
      }
    } else {
      setLoginError("Нэвтрэх имэйл эсвэл нууц үг буруу байна.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth).catch(() => {});
    setIsAdminBypassed(false);
    setAdminUserEmail(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // Change booking status (confirmed, cancelled, pending)
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);

      // 1. Instantly update local React state and reference refs for instantaneous UI feedback (0ms)
      setBookings((prev) =>
        prev.map((item: any) => {
          if (item.id === bookingId) return { ...item, status: newStatus };
          return item;
        })
      );

      firestoreBookingsRef.current = firestoreBookingsRef.current.map((item: any) => {
        if (item.id === bookingId) return { ...item, status: newStatus };
        return item;
      });

      // 2. Backup status change to localStorage
      const local = JSON.parse(localStorage.getItem('suut_custom_bookings') || '[]');
      const existsInLocal = local.some((item: any) => item.id === bookingId);
      let updatedLocal = [];
      if (existsInLocal) {
        updatedLocal = local.map((item: any) => {
          if (item.id === bookingId) return { ...item, status: newStatus };
          return item;
        });
      } else {
        // Find existing booking in current state to back it up with updated status
        const originalBooking = bookings.find((b: any) => b.id === bookingId);
        updatedLocal = [...local];
        if (originalBooking) {
          updatedLocal.push({ ...originalBooking, status: newStatus });
        } else {
          updatedLocal.push({ id: bookingId, status: newStatus });
        }
      }
      localStorage.setItem('suut_custom_bookings', JSON.stringify(updatedLocal));

      // Trigger synchrony sync directly
      syncBookings();

      // 3. Try Server API and fallback to Firestore write in background without blocking UI
      fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).then((res) => {
        if (res.ok) console.log(`Backend API booking ${bookingId} successfully updated to ${newStatus}`);
      }).catch((err) => {
        console.warn("Backend API booking update failed:", err);
      });

      const dRef = doc(db, 'bookings', bookingId);
      updateDoc(dRef, { status: newStatus })
        .then(() => {
          console.log(`Firestore booking ${bookingId} successfully updated to ${newStatus}`);
        })
        .catch((err) => {
          console.warn("Firestore updateDoc skipped or failed (offline/sandbox backup handles this):", err);
        });

    } catch (err: any) {
      console.error("Failed to update status: ", err);
      alert("Төлөв өөрчлөхөд алдаа гарлаа: " + err.message);
    }
  };

  // Delete booking permanently
  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Та энэ захиалгыг бүрмөсөн устгахдаа итгэлтэй байна уу? Устгасны дараа сэргээх боломжгүй бөгөөд сонгосон өдрүүд хэрэглэгчдэд чөлөөлөгдөнө.")) return;
    try {
      // 1. Instantly update React state and ref for immediate UI updates
      setBookings((prev) => prev.filter((item: any) => item.id !== bookingId));
      firestoreBookingsRef.current = firestoreBookingsRef.current.filter((item: any) => item.id !== bookingId);

      // 2. Remove from local storage backups
      const local = JSON.parse(localStorage.getItem('suut_custom_bookings') || '[]');
      const updatedLocal = local.filter((item: any) => item.id !== bookingId);
      localStorage.setItem('suut_custom_bookings', JSON.stringify(updatedLocal));

      // Trigger sync logic
      syncBookings();

      // 3. Delete via backend API in background
      await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' }).catch((e) => console.warn("API booking deletion warning:", e));

      // 4. Delete via Firestore in background
      deleteDoc(doc(db, 'bookings', bookingId))
        .then(() => {
          console.log(`Firestore booking ${bookingId} successfully deleted`);
        })
        .catch((err) => {
          console.warn("Firestore deleteDoc skipped or failed:", err);
        });

    } catch (err: any) {
      console.error("Failed to delete booking: ", err);
      alert("Захиалга устгахад алдаа гарлаа: " + err.message);
    }
  };

  // Send test email to boonoogod@gmail.com to trigger/validate FormSubmit activation
  const handleSendTestEmail = async () => {
    setIsTestingEmail(true);
    setEmailTestMessage(null);
    setEmailTestError(null);

    const testPayload = {
      _subject: "🔔 СУУТ АМРАЛТ: ИДЭВХЖҮҮЛЭХ ТЕСТ ИМЭЙЛ",
      _template: "table",
      "Мэдээлэл": "Энэ бол захиалгын системээс илгээсэн тест имэйл юм.",
      "Тайлбар": "Хэрэв та анх удаа энэ имэйлийг авч байгаа бол FormSubmit-ээс ирсэн идэвхжүүлэх имэйлийг баталгаажуулна уу.",
      "Илгээсэн хугацаа": new Date().toLocaleString(),
      "Шалгалт": "Хэвийн ажиллаж байна."
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/boonoogod@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });
      const data = await response.json();
      if (response.ok || data.success === "true" || data.success === true) {
        setEmailTestMessage("Тест имэйлийг амжилттай тавьлаа! Та boonoogod@gmail.com имэйл хаяг болон спам (Spam/Junk) хавтсаа сайн шалгана уу. Тэнд FormSubmit-ээс ирсэн нэг удаагийн 'Activate Form' идэвхжүүлэх товчийг заавал дарах ёстой шүү!");
      } else {
        throw new Error(data.message || "Илгээхэд алдаа гарлаа.");
      }
    } catch (err: any) {
      console.error("Test email dispatch failed:", err);
      setEmailTestError("Тест имэйл илгээхэд алдаа гарлаа: " + (err.message || err));
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Delete news article
  const handleDeleteNews = async (newsId: string) => {
    if (!window.confirm("Та энэ мэдээг устгахдаа итгэлтэй байна уу?")) return;
    try {
      // Delete on Backend Server API instantly
      await fetch(`/api/news/${newsId}`, { method: 'DELETE' }).catch((e) => console.warn(e));

      // Asynchronous background firestore deletion
      deleteDoc(doc(db, 'news', newsId)).catch(() => {});
      
      // Update local storage backup
      const local = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
      const updated = local.filter((item: any) => item.id !== newsId);
      localStorage.setItem('suut_custom_news', JSON.stringify(updated));

      // If it's a default news item, register it as deleted
      if (newsId.startsWith('default-')) {
        const deletedDefaults = JSON.parse(localStorage.getItem('suut_deleted_default_news_ids') || '[]');
        if (!deletedDefaults.includes(newsId)) {
          deletedDefaults.push(newsId);
          localStorage.setItem('suut_deleted_default_news_ids', JSON.stringify(deletedDefaults));
        }
      }

      syncNews();
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
      const local = JSON.parse(localStorage.getItem('suut_custom_news') || '[]');
      if (editingNews) {
        // Save to our Backend API first
        try {
          await fetch(`/api/news/${editingNews.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn("Backend API edit failed, continuing to local backup...", err);
        }

        // Firestore update fallback with promise reporting
        await updateDoc(doc(db, 'news', editingNews.id), payload)
          .then(() => {
            console.log("Firestore news successfully updated:", editingNews.id);
          })
          .catch((fErr) => {
            console.error("Firestore news update failed:", fErr);
            alert("Үүлэн датабааз (Firestore) дээр мэдээ засахад алдаа гарлаа: " + fErr.message);
          });

        // Update local storage backup
        let updated = local.map((item: any) => {
          if (item.id === editingNews.id) return { ...item, ...payload };
          return item;
        });
        const exists = local.some((item: any) => item.id === editingNews.id);
        if (!exists) {
          updated.push({
            id: editingNews.id,
            ...payload,
            createdAt: new Date().toISOString()
          });
        }
        localStorage.setItem('suut_custom_news', JSON.stringify(updated));

        setNewsSuccessMsg("Мэдээг амжилттай засаж шинэчиллээ!");
        setEditingNews(null);
      } else {
        const generatedId = `news-${Date.now()}`;
        let finalId = generatedId;
        
        // Save to our Backend API first
        try {
          const apiRes = await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: generatedId, ...payload })
          });
          if (apiRes.ok) {
            const apiResult = await apiRes.json();
            if (apiResult && apiResult.id) finalId = apiResult.id;
          }
        } catch (err) {
          console.warn("Backend API create failed, using local generated ID...", err);
        }

        // Firestore creation with promise reporting!
        await setDoc(doc(db, 'news', finalId), {
          ...payload,
          createdAt: new Date()
        })
          .then(() => {
            console.log("Firestore news successfully created:", finalId);
          })
          .catch((fErr) => {
            console.error("Firestore news creation failed:", fErr);
            alert("Үүлэн датабааз (Firestore) дээр мэдээ хадгалахад алдаа гарлаа: " + fErr.message);
          });

        // Add to local storage backup with the exact ID
        const newItem = {
          id: finalId,
          ...payload,
          createdAt: new Date().toISOString()
        };
        local.unshift(newItem);
        localStorage.setItem('suut_custom_news', JSON.stringify(local));

        setNewsSuccessMsg("Мэдээг амжилттай нийтэллээ!");
      }
      
      // Sync UI instantly
      syncNews();

      // reset form
      setNewsTitle('');
      setNewsContent('');
      setNewsCategory('Мэдээ');
      setNewsImage('https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4');
      setNewsAuthor('Админ');
    } catch (err: any) {
      console.error("News saving error:", err);
      alert("Мэдээ хадгалахад алдаа гарлаа (Базанд хадгалагдаагүй тул бусад хөтөч засах боломжгүй): " + err.message);
    } finally {
      setIsSubmittingNews(false);
    }
  };

  // Delete gallery item
  const handleDeleteGallery = async (galleryId: string) => {
    if (!window.confirm("Та энэ зургийг устгахдаа итгэлтэй байна уу?")) return;
    try {
      // 1. Delete on Backend Server API instantly
      await fetch(`/api/gallery/${galleryId}`, { method: 'DELETE' }).catch((e) => console.warn(e));

      // 2. Background Firestore fallback deletion
      deleteDoc(doc(db, 'gallery', galleryId)).catch(() => {});

      // Update local storage backup
      const local = JSON.parse(localStorage.getItem('suut_custom_gallery') || '[]');
      const updated = local.filter((item: any) => item.id !== galleryId);
      localStorage.setItem('suut_custom_gallery', JSON.stringify(updated));
      syncGallery();
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
      const local = JSON.parse(localStorage.getItem('suut_custom_gallery') || '[]');
      if (editingGallery) {
        // Save to our Backend API first
        try {
          // Note: our simple mockup backend doesn't have a direct gallery PUT, but we can delete + post, or just POST.
          // Let's make it simple: since we want to edit, we can delete the old one and post-insert.
          // Or we can just call our backend (or falls back to local storage).
          // Let's modify local storage backup + server state.
          await fetch(`/api/gallery/${editingGallery.id}`, { method: 'DELETE' }).catch(() => {});
          await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingGallery.id, ...payload })
          });
        } catch (err) {
          console.warn("Backend edit gallery API call failed:", err);
        }

        // Fallback Firestore update with promise reporting
        await updateDoc(doc(db, 'gallery', editingGallery.id), payload)
          .then(() => {
            console.log("Firestore gallery successfully updated:", editingGallery.id);
          })
          .catch((fErr) => {
            console.error("Firestore gallery update failed:", fErr);
            alert("Үүлэн датабааз (Firestore) дээр зургийн мэдээлэл засахад алдаа гарлаа: " + fErr.message);
          });

        // Update local storage backup
        const updated = local.map((item: any) => {
          if (item.id === editingGallery.id) return { ...item, ...payload };
          return item;
        });
        localStorage.setItem('suut_custom_gallery', JSON.stringify(updated));

        setGallerySuccessMsg("Зургийн мэдээллийг амжилттай шинэчиллээ!");
        setEditingGallery(null);
      } else {
        const generatedId = `g-${Date.now()}`;
        let finalId = generatedId;

        // Save to our Backend API first
        try {
          const apiRes = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: generatedId, ...payload })
          });
          if (apiRes.ok) {
            const apiResult = await apiRes.json();
            if (apiResult && apiResult.id) finalId = apiResult.id;
          }
        } catch (err) {
          console.warn("Backend Gallery create API call failed:", err);
        }

        // Firestore creation with promise reporting!
        await setDoc(doc(db, 'gallery', finalId), {
          ...payload,
          createdAt: new Date()
        })
          .then(() => {
            console.log("Firestore gallery successfully created:", finalId);
          })
          .catch((fErr) => {
            console.error("Firestore gallery creation failed:", fErr);
            alert("Үүлэн датабааз (Firestore) дээр зураг хадгалахад алдаа гарлаа: " + fErr.message);
          });

        // Add to local storage backup with the exact ID
        const newItem = {
          id: finalId,
          ...payload,
          createdAt: new Date().toISOString()
        };
        local.unshift(newItem);
        localStorage.setItem('suut_custom_gallery', JSON.stringify(local));

        setGallerySuccessMsg("Шинэ зургийг галерейд амжилттай нэмж нийтэллээ!");
      }

      // Sync UI instantly
      syncGallery();

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

  // Delete FAQ handler
  const handleDeleteFaq = async (faqId: string) => {
    if (!window.confirm("Та энэ асуултыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      // 1. Delete on Firestore
      await deleteDoc(doc(db, 'faqs', faqId)).catch(() => {});

      // 2. If it's a default FAQ, track it as deleted
      if (faqId.startsWith('faq-')) {
        const deletedFaqIds = JSON.parse(localStorage.getItem('suut_deleted_default_faq_ids') || '[]');
        if (!deletedFaqIds.includes(faqId)) {
          deletedFaqIds.push(faqId);
          localStorage.setItem('suut_deleted_default_faq_ids', JSON.stringify(deletedFaqIds));
        }
      }

      // 3. Update local storage backups
      const local = JSON.parse(localStorage.getItem('suut_custom_faqs') || '[]');
      const updated = local.filter((item: any) => item.id !== faqId);
      localStorage.setItem('suut_custom_faqs', JSON.stringify(updated));
      syncFaqs();
    } catch (err) {
      console.error("Delete FAQ failed: ", err);
    }
  };

  // Edit FAQ click handler
  const handleEditFaqClick = (item: any) => {
    setEditingFaq(item);
    setFaqQuestion(item.question || '');
    setFaqAnswer(item.answer || '');
    setFaqOrder(item.order || 5);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Cancel edit FAQ
  const handleCancelEditFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqOrder(5);
  };

  // Publish / Update FAQ handler
  const handlePublishFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert("Асуулт болон хариултыг заавал оруулна уу.");
      return;
    }

    setIsSubmittingFaq(true);
    setFaqSuccessMsg(null);

    const payload = {
      question: faqQuestion,
      answer: faqAnswer,
      order: Number(faqOrder) || 5,
    };

    try {
      const local = JSON.parse(localStorage.getItem('suut_custom_faqs') || '[]');

      if (editingFaq) {
        // Save to Firestore
        await setDoc(doc(db, 'faqs', editingFaq.id), {
          ...payload,
          createdAt: editingFaq.createdAt || new Date()
        }, { merge: true }).catch((err) => {
          console.error("Firestore FAQ edit failed: ", err);
        });

        // Save to Local storage
        const updated = local.map((item: any) => {
          if (item.id === editingFaq.id) return { ...item, ...payload };
          return item;
        });
        
        // Also ensure if we edited a default FAQ, it is saved in local custom so it doesn't get overwritten
        const exists = updated.some((item: any) => item.id === editingFaq.id);
        if (!exists) {
          updated.push({ id: editingFaq.id, ...payload });
        }

        localStorage.setItem('suut_custom_faqs', JSON.stringify(updated));

        // Sync again
        syncFaqs();
        setFaqSuccessMsg("Асуулт хариултыг амжилттай шинэчиллээ!");
        handleCancelEditFaq();
      } else {
        const generatedId = `faq-${Date.now()}`;
        
        // Save to Firestore
        await setDoc(doc(db, 'faqs', generatedId), { 
          ...payload, 
          createdAt: new Date() 
        }).catch((err) => {
          console.error("Firestore FAQ save failed: ", err);
        });

        // Save to Local storage backup
        local.push({ id: generatedId, ...payload, createdAt: new Date() });
        localStorage.setItem('suut_custom_faqs', JSON.stringify(local));

        syncFaqs();
        setFaqSuccessMsg("Шинэ асуулт хариултыг амжилттай нэмж нийтэллээ!");
        handleCancelEditFaq();
      }
    } catch (err: any) {
      console.error("Publish FAQ failed: ", err);
      alert("Асуулт хариулт хадгалахад алдаа гарлаа: " + err.message);
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  // Change password form controller
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(null);
    setPasswordChangeError(null);

    const val = newPasswordInput.trim();
    const conf = newPasswordConfirm.trim();

    if (!val) {
      setPasswordChangeError("Шинэ нууц үгээ оруулна уу.");
      return;
    }

    if (val.length < 4) {
      setPasswordChangeError("Нууц үг хамгийн багадаа 4 тэмдэгттэй байх ёстой.");
      return;
    }

    if (val !== conf) {
      setPasswordChangeError("Нууц үгүүд хоорондоо тохирохгүй байна.");
      return;
    }

    setIsChangingPasswordSubmitting(true);

    try {
      // 1. Save to Firestore database securely
      await setDoc(doc(db, 'settings', 'admin_password'), {
        password: val,
        updatedAt: new Date()
      }).catch((err) => {
        console.warn("Firestore database save failed (falling back to local cache):", err);
      });

      // 2. Backup to local cache & instantly apply to state
      localStorage.setItem('suut_admin_password', val);
      setAdminPassword(val);

      setPasswordChangeSuccess("Админы цахим нууц үгийг амжилттай шинэчиллээ!");
      setNewPasswordInput('');
      setNewPasswordConfirm('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordChangeSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error("Changing password error: ", err);
      setPasswordChangeError("Алдаа гарлаа: " + err.message);
    } finally {
      setIsChangingPasswordSubmitting(false);
    }
  };

  // Submit manual booking from admin panel
  const handleAddManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingBookingsRef.current) return;
    if (!clientName.trim() || !clientPhone.trim() || !checkInDate || !checkOutDate) {
      alert("Нэр, утас, очих болон гарах огноог заавал бөглөнө үү!");
      return;
    }

    isSubmittingBookingsRef.current = true;
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

      // Generate a solid temporary ID immediately to avoid duplicate-omitting and support instant storage
      const tempId = 'manual-fb-' + Date.now();

      const payload = {
        name: clientName,
        phone: clientPhone,
        email: clientEmail || 'admin@suutresort.com',
        optionId: selectedOptionId,
        optionTitle: matchedOption?.title || (isHouse ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт'),
        bookingType: isHouse ? 'house' : 'room',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: adults,
        children: childrenCount,
        weekdayNights: report.weekdayNights || 0,
        weekendNights: report.weekendNights || 0,
        totalPrice: resolvedPrice,
        advancePayment: advancePayment || 0,
        remainingBalance: Math.max(0, resolvedPrice - (advancePayment || 0)),
        status: 'confirmed', // Admin manual checkouts default directly to confirmed
        createdAt: new Date()
      };

      // 1. Instantly backup to localStorage first to guarantee it is NEVER lost
      const local = JSON.parse(localStorage.getItem('suut_custom_bookings') || '[]');
      local.push({
        id: tempId,
        ...payload,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('suut_custom_bookings', JSON.stringify(local));
      
      // 2. Refresh local state instantly to render the new booking on the screen
      syncBookings();

      // 3. Reset submitting states immediately (no waiting for database network transitions!)
      isSubmittingBookingsRef.current = false;
      setIsSubmittingBooking(false);

      setBookingSuccessMsg(`Захиалга амжилттай бүртгэгдлээ! (${matchedOption?.title || (isHouse ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт')})`);
      
      // 4. Reset form inputs immediately to allow adding more bookings right away
      setClientName('');
      setClientPhone('');
      setClientEmail('admin@suutresort.com');
      setCheckInDate('');
      setCheckOutDate('');
      setManualPrice(null);
      setAdvancePayment(0);
      setAdults(1);
      setChildrenCount(0);

      // 5. Fire Firestore write completely in the background without blocking the UI
      addDoc(collection(db, 'bookings'), payload)
        .then((docRef) => {
          console.log("Manual booking backed up to Firestore: ", docRef.id);
          // Asynchronously update the local storage cache entry with the cloud doc ID
          try {
            const currentLocal = JSON.parse(localStorage.getItem('suut_custom_bookings') || '[]');
            const updatedLocal = currentLocal.map((item: any) => {
              if (item.id === tempId) {
                return { ...item, id: docRef.id };
              }
              return item;
            });
            localStorage.setItem('suut_custom_bookings', JSON.stringify(updatedLocal));
            syncBookings();
          } catch (storageErr) {
            console.error("Failed to map tempId to Firestore docRef.id in local storage:", storageErr);
          }
        })
        .catch((firestoreErr) => {
          console.error("Booking Firestore update failed (safely relying on local storage backup):", firestoreErr);
        });

      // Show success alert asynchronously
      setTimeout(() => {
        alert("Захиалга амжилттай бүртгэгдлээ!");
      }, 80);
    } catch (err: any) {
      console.error("Manual booking addition failed: ", err);
      alert("Захиалга бүртгэхэд алдаа гарлаа: " + err.message);
      isSubmittingBookingsRef.current = false;
      setIsSubmittingBooking(false);
    }
  };

  const isAccessAllowed = (user?.email === "boogiilive@gmail.com" || user?.email === "boonoogod@gmail.com") || isAdminBypassed;

  // Statistics calculation engine
  const stats = React.useMemo(() => {
    let totalRevenue = 0;
    let totalBookingsCount = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    // Monthly data map
    const monthlyMap: { [key: string]: { revenue: number; count: number } } = {};
    // Yearly data map
    const yearlyMap: { [key: string]: { revenue: number; count: number } } = {};
    // Type data map
    const typeMap: { [key: string]: { revenue: number; count: number } } = {
      house: { revenue: 0, count: 0 },
      resort: { revenue: 0, count: 0 }
    };

    bookings.forEach((b) => {
      const price = Number(b.totalPrice) || 0;
      
      totalBookingsCount++;
      if (b.status === 'confirmed') {
        confirmedCount++;
        totalRevenue += price;
      } else if (b.status === 'pending') {
        pendingCount++;
      } else if (b.status === 'cancelled') {
        cancelledCount++;
      }

      // Grouping by date (CheckIn: "2026-05-28")
      if (b.checkIn && b.checkIn.length >= 7) {
        const year = b.checkIn.substring(0, 4);
        const month = b.checkIn.substring(0, 7); // "YYYY-MM"

        if (b.status === 'confirmed') {
          // Monthly
          if (!monthlyMap[month]) {
            monthlyMap[month] = { revenue: 0, count: 0 };
          }
          monthlyMap[month].revenue += price;
          monthlyMap[month].count += 1;

          // Yearly
          if (!yearlyMap[year]) {
            yearlyMap[year] = { revenue: 0, count: 0 };
          }
          yearlyMap[year].revenue += price;
          yearlyMap[year].count += 1;

          // Type
          const typeKey = b.bookingType === 'house' ? 'house' : 'resort';
          typeMap[typeKey].revenue += price;
          typeMap[typeKey].count += 1;
        }
      }
    });

    // Format monthly data for sorting & charting
    const monthlyList = Object.keys(monthlyMap).map((m) => ({
      month: m, // "2026-05"
      label: m.substring(5, 7) + " сар",
      year: m.substring(0, 4) + " он",
      revenue: monthlyMap[m].revenue,
      count: monthlyMap[m].count
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Format yearly data
    const yearlyList = Object.keys(yearlyMap).map((y) => ({
      year: y,
      label: y + " он",
      revenue: yearlyMap[y].revenue,
      count: yearlyMap[y].count
    })).sort((a, b) => a.year.localeCompare(b.year));

    return {
      totalRevenue,
      totalBookingsCount,
      confirmedCount,
      pendingCount,
      cancelledCount,
      monthlyList,
      yearlyList,
      typeMap,
      averageRevenue: confirmedCount > 0 ? Math.round(totalRevenue / confirmedCount) : 0
    };
  }, [bookings]);

  // Dynamic price calculation for the manual booking form
  const dynamicBookingReport = React.useMemo(() => {
    if (!checkInDate || !checkOutDate || !selectedOptionId) {
      return null;
    }
    try {
      const from = new Date(checkInDate);
      const to = new Date(checkOutDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
      return calculatePriceReport(selectedOptionId, { from, to });
    } catch {
      return null;
    }
  }, [checkInDate, checkOutDate, selectedOptionId]);

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
              Системд нэвтрэх имэйл болон нууц үгээ оруулна уу.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-left leading-relaxed flex gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Хэрэглэгчийн имэйл</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  placeholder="Имэйл хаягаа оруулна уу"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm w-full text-slate-100 focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Нууц үг</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  placeholder="Нууц үгээ оруулна уу"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm w-full text-slate-100 focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-slate-900 font-bold text-sm py-3.5 px-6 rounded-full transition-all shadow-lg active:scale-[0.98] mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={16} /> Системд нэвтрэх
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-16 print:hidden">
      {/* Admin header */}
      <div className="bg-brand-teal text-white pt-28 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="bg-brand-yellow/20 text-brand-yellow text-xs font-bold px-3 py-1 rounded-full border border-brand-yellow/30 uppercase tracking-wider">
              SUUT resort • Админ систем
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-200">Админы хянах самбар</h1>
            <p className="text-white/60 text-xs">Нэвтэрсэн: {adminUserEmail || user?.email || 'Админ хэрэглэгч'}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-1.5 hover:bg-white/10 border border-white/25 rounded-full py-2 px-5 text-sm font-bold transition-all text-white/90 active:scale-95 cursor-pointer bg-white/5"
            >
              <Lock size={15} /> Нууц үг солих
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 hover:bg-white/10 border border-white/25 rounded-full py-2 px-6 text-sm font-bold transition-all text-white/90 active:scale-95 cursor-pointer"
            >
              <LogOut size={16} /> Гарах
            </button>
          </div>
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
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'stats' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <BarChart3 size={16} /> Статистик & Тайлан
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

          <button
            onClick={() => setActiveTab('manage-faqs')}
            className={`py-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'manage-faqs' 
                ? 'border-brand-teal text-brand-teal' 
                : 'border-transparent text-slate-500 hover:text-brand-teal'
            }`}
          >
            <HelpCircle size={16} /> Асуулт, хариулт ({faqs.length})
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
                                {b.bookingType === 'house' ? 'Хаус түрээс' : 'Амралт/Ресорт'}
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
                              <span className="font-bold text-brand-red text-xs md:text-sm block">
                                {b.totalPrice ? `${b.totalPrice.toLocaleString()}₮` : 'Тодорхойгүй'}
                              </span>
                              {Number(b.advancePayment) > 0 && (
                                <div className="mt-1 space-y-1">
                                  <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                                    Урьдчилгаа: {Number(b.advancePayment).toLocaleString()}₮
                                  </div>
                                  <div className="text-[10px] text-amber-900 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block w-max">
                                    Үлдэгдэл: {Math.max(0, (Number(b.totalPrice) || 0) - (Number(b.advancePayment) || 0)).toLocaleString()}₮
                                  </div>
                                </div>
                              )}
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
                                    onClick={() => setConfirmingBooking(b)}
                                    className="p-1 px-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-md font-bold text-xs transition-all cursor-pointer"
                                    title="Захиалгыг баталгаажуулах"
                                  >
                                    Баталгаажуулах
                                  </button>
                                )}
                                {b.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`${b.name}-ийн захиалгыг цуцлахдаа итгэлтэй байна уу? Сонгосон өдрүүд календарт чөлөөлөгдөнө.`)) {
                                        handleUpdateStatus(b.id, 'cancelled');
                                      }
                                    }}
                                    className="p-1 px-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md font-bold text-xs transition-all cursor-pointer"
                                    title="Захиалга цуцлах"
                                  >
                                    Цуцлах
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-100 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0"
                                  title="Устгах"
                                >
                                  <Trash2 size={13} />
                                </button>
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

          {/* TAB 1.5: STATISTICS & ANALYTICS DASHBOARD */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Stats Header Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-800">Борлуулалт & Статистик мэдээлэл</h2>
                  <p className="text-slate-500 text-xs mt-1">Нийт захиалгын мэдээлэл болон санхүүгийн үзүүлэлтүүдийг хянах хэсэг</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow active:scale-95 cursor-pointer text-xs shrink-0"
                >
                  <Download size={14} /> Захиалгын тайлан (PDF) татах
                </button>
              </div>

              {/* KPI Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* KPI Item 1: Total Revenue */}
                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-3xl border border-emerald-100 shadow-xs relative overflow-hidden group">
                  <div className="absolute right-3 top-3 p-2 bg-emerald-100/60 rounded-xl text-emerald-800 transition-transform group-hover:scale-110">
                    <DollarSign size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Нийт баталгаажсан орлого</span>
                  <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight block mt-2 text-emerald-950 font-serif">
                    {stats.totalRevenue.toLocaleString()}₮
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-2">
                    <TrendingUp size={12} /> Баталгаажсан захиалгуудын дүн
                  </div>
                </div>

                {/* KPI Item 2: Average Ticket Size */}
                <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-3xl border border-teal-100 shadow-xs relative overflow-hidden group">
                  <div className="absolute right-3 top-3 p-2 bg-teal-100/60 rounded-xl text-brand-teal transition-transform group-hover:scale-110">
                    <Award size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Дундаж захиалгын дүн</span>
                  <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight block mt-2 text-teal-950 font-serif">
                    {stats.averageRevenue.toLocaleString()}₮
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-brand-teal font-bold mt-2">
                    Нэгж захиалгын дундаж үнэлгээ
                  </div>
                </div>

                {/* KPI Item 3: Total Count Breakdown */}
                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-3xl border border-amber-100 shadow-xs relative overflow-hidden group">
                  <div className="absolute right-3 top-3 p-2 bg-amber-100/60 rounded-xl text-amber-700 transition-transform group-hover:scale-110">
                    <Calendar size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Захиалгуудын төлөв</span>
                  <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight block mt-2 text-amber-950 font-serif">
                    {stats.confirmedCount} <span className="text-xs text-slate-400 font-sans font-normal">батлагдсан</span>
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mt-2">
                    <span className="text-amber-600">● {stats.pendingCount} хүлээгдэж буй</span>
                    <span className="text-red-500">● {stats.cancelledCount} цуцалсан</span>
                  </div>
                </div>

                {/* KPI Item 4: Total Bookings count */}
                <div className="bg-gradient-to-br from-slate-50/70 to-white p-6 rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden group">
                  <div className="absolute right-3 top-3 p-2 bg-slate-100 rounded-xl text-slate-600 transition-transform group-hover:scale-110">
                    <BarChart3 size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Нийт захиалгын тоо</span>
                  <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight block mt-2 font-serif">
                    {stats.totalBookingsCount} <span className="text-xs text-slate-400 font-sans font-normal">утга</span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mt-2">
                    Систем дэх нийт захиалгын мөрүүд
                  </div>
                </div>
              </div>

              {/* Statistical Visualizations Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column 1: Monthly Revenue Bar Chart (SVG) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-8 flex flex-col space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-slate-800 text-sm">Сарын борлуулалт, ашиг орлогын тренд</h3>
                    <span className="text-[10px] font-bold bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full uppercase">Баталгаажсан</span>
                  </div>

                  {stats.monthlyList.length === 0 ? (
                    <div className="h-[240px] flex items-center justify-center text-slate-400 font-semibold text-xs text-center">
                      Баталгаажсан захиалга байхгүй тул график харуулах боломжгүй байна.
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto select-none pt-4">
                      {/* Responsive Width SVG Container */}
                      <svg 
                        viewBox={`0 0 ${Math.max(450, 60 + stats.monthlyList.length * 75)} 250`} 
                        className="w-full h-[240px] font-sans"
                      >
                        {/* Define Gradients */}
                        <defs>
                          <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#0d9488" />
                          </linearGradient>
                        </defs>

                        {/* Chart Grid Lines */}
                        <line x1="50" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="130" x2="600" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="50" y1="180" x2="600" y2="180" stroke="#e2e8f0" strokeWidth="1" />

                        {/* Render Bar Columns */}
                        {(() => {
                          const maxRevenueVal = Math.max(...stats.monthlyList.map(m => m.revenue), 1000000);
                          return stats.monthlyList.map((item, idx) => {
                            const barHeight = (item.revenue / maxRevenueVal) * 140;
                            const x = 70 + idx * 75;
                            const y = 180 - barHeight;

                            return (
                              <g key={item.month} className="group cursor-pointer">
                                <rect
                                  x={x}
                                  y={y}
                                  width="34"
                                  height={Math.max(barHeight, 2)}
                                  rx="5"
                                  fill="url(#barTeal)"
                                  className="transition-all duration-300 hover:opacity-85"
                                />
                                <text
                                  x={x + 17}
                                  y="198"
                                  textAnchor="middle"
                                  className="fill-slate-600 font-extrabold text-[10px]"
                                >
                                  {item.label}
                                </text>
                                <text
                                  x={x + 17}
                                  y="212"
                                  textAnchor="middle"
                                  className="fill-slate-400 text-[8px]"
                                >
                                  {item.year}
                                </text>
                                <text
                                  x={x + 17}
                                  y={y - 8}
                                  textAnchor="middle"
                                  className="fill-slate-700 font-black text-[9px] opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {`${Math.round(item.revenue / 1000).toLocaleString()}к`}
                                </text>
                                <text
                                  x={x + 17}
                                  y={Math.max(y + 16, 175)}
                                  textAnchor="middle"
                                  className="fill-white font-bold text-[8px]"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {item.count}
                                </text>
                              </g>
                            );
                          });
                        })()}
                        {/* Y-axis annotations */}
                        <text x="40" y="34" textAnchor="end" className="fill-slate-400 text-[9px] font-bold">Их</text>
                        <text x="40" y="105" textAnchor="end" className="fill-slate-400 text-[9px] font-medium">Дундаж</text>
                        <text x="40" y="184" textAnchor="end" className="fill-slate-400 text-[9px] font-bold">0₮</text>
                      </svg>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 italic mt-auto pt-2 border-t border-slate-50">
                    * Багануудын орой дээр харагдаж буй тоо нь тухайн сард баталгаажсан нийт захиалгын тоо болно. Дээгүүр нь хулганаа чирэхэд нийт үнийн дүн дэлгэрэнгүй харагдана.
                  </p>
                </div>

                {/* Column 2: Booking Type proportions (House vs Resort Room) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-4 flex flex-col space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-slate-800 text-sm">Байршлын төрлөөр авах эрэлт</h3>
                    <p className="text-slate-400 text-[10px] mt-1">Түрээслэгдсэн хаус болон амралтын өрөөний хэмжээ</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    {/* Proportion calculation */}
                    {(() => {
                      const houseRev = stats.typeMap.house?.revenue || 0;
                      const resortRev = stats.typeMap.resort?.revenue || 0;
                      const totalTypeRev = houseRev + resortRev || 1;
                      
                      const housePct = Math.round((houseRev / totalTypeRev) * 100);
                      const resortPct = Math.round((resortRev / totalTypeRev) * 100);

                      const houseCount = stats.typeMap.house?.count || 0;
                      const resortCount = stats.typeMap.resort?.count || 0;

                      return (
                        <>
                          {/* Visual Progress Pie-bar Layout */}
                          <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                            <div 
                              style={{ width: `${housePct === 0 && resortPct === 0 ? 50 : housePct}%` }}
                              className="bg-brand-teal h-full transition-all duration-500 relative group flex items-center justify-center font-bold text-white text-[10px]"
                              title={`Хаус түрээс: ${housePct}%`}
                            >
                              {housePct > 15 && `${housePct}%`}
                            </div>
                            <div 
                              style={{ width: `${housePct === 0 && resortPct === 0 ? 50 : resortPct}%` }}
                              className="bg-amber-500 h-full transition-all duration-500 relative group flex items-center justify-center font-bold text-white text-[10px]"
                              title={`Амралт/Ресорт: ${resortPct}%`}
                            >
                              {resortPct > 15 && `${resortPct}%`}
                            </div>
                          </div>

                          {/* Legend / Info Cards */}
                          <div className="space-y-4">
                            {/* Proportions Card 1: House */}
                            <div className="flex justify-between items-center p-3 bg-teal-50/40 rounded-2xl border border-teal-100/50">
                              <div className="flex items-center gap-2.5">
                                <span className="w-3 h-3 rounded-full bg-brand-teal shrink-0"></span>
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-800 text-xs block">Цэвэр модон хаусууд</span>
                                  <span className="text-[10px] text-slate-400 block">{houseCount} захиалга батлагдсан</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-800 text-xs">
                                {houseRev.toLocaleString()}₮
                              </span>
                            </div>

                            {/* Proportions Card 2: Resort */}
                            <div className="flex justify-between items-center p-3 bg-amber-50/40 rounded-2xl border border-amber-100/50">
                              <div className="flex items-center gap-2.5">
                                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-800 text-xs block">Амралт / Ресорт өрөө хамрах</span>
                                  <span className="text-[10px] text-slate-400 block">{resortCount} захиалга батлагдсан</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-800 text-xs">
                                {resortRev.toLocaleString()}₮
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Monthly breakdown table */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-slate-800 text-sm">Сараар ангилсан орлогын нарийвчилсан бүртгэл</h3>
                  <p className="text-slate-400 text-[10px] mt-1">Огнооны дарааллаар баталгаажсан захиалгын нийлбэр дүн</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6">Баталгаажсан он, сар</th>
                        <th className="p-4 text-center">Захиалгын хэмжээ</th>
                        <th className="p-4 text-emerald-800">Борлуулалтын нийт төлбөр</th>
                        <th className="p-4 text-slate-400">Дундаж захиалгын үнэ</th>
                        <th className="p-4 text-right pr-6">Байдал</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {stats.monthlyList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                            Баталгаажсан захиалга байхгүй тул орлогын түүх харуулах боломжгүй.
                          </td>
                        </tr>
                      ) : (
                        stats.monthlyList.map((m) => (
                          <tr key={m.month} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 pl-6 font-bold text-slate-800">
                              {m.year} • {m.label}
                            </td>
                            <td className="p-4 text-center font-bold text-slate-700">
                              {m.count} ш захиалга
                            </td>
                            <td className="p-4 font-black text-emerald-700 text-sm">
                              {m.revenue.toLocaleString()}₮
                            </td>
                            <td className="p-4 font-bold text-slate-500">
                              {(m.count > 0 ? Math.round(m.revenue / m.count) : 0).toLocaleString()}₮
                            </td>
                            <td className="p-4 text-right pr-6">
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-100">
                                <Check size={11} /> Идэвхтэй байна
                              </span>
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
                    <label className="text-xs font-bold text-brand-teal">Сонгох Хаус эсвэл Амралт/Ресорт *</label>
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

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal block">Урьдчилгаа төлсөн эсэх (Урьдчилгаа төлбөр)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="number"
                        placeholder="Жишээ: 100000 (Төлөөгүй бол 0 эсвэл хоосон орхино)"
                        value={advancePayment || ''}
                        onChange={(e) => setAdvancePayment(e.target.value ? Number(e.target.value) : 0)}
                        className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {advancePayment > 0 && (
                    <div className="p-4 bg-teal-50 border border-teal-100/50 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Нийт төлөх дүн:</span>
                        <span className="font-bold">
                          {(manualPrice !== null ? manualPrice : (dynamicBookingReport?.totalPrice || 0)).toLocaleString()}₮
                        </span>
                      </div>
                      <div className="flex justify-between text-brand-teal">
                        <span>Үүнээс төлсөн урьдчилгаа:</span>
                        <span className="font-bold">-{advancePayment.toLocaleString()}₮</span>
                      </div>
                      <div className="flex justify-between border-t border-teal-200/30 pt-2 font-bold text-slate-950 mt-1">
                        <span className="text-amber-800">Үйлчлүүлэгчээс авах үлдэгдэл төлбөр:</span>
                        <span className="text-amber-800 text-sm font-black underline decoration-double">
                          {Math.max(0, (manualPrice !== null ? manualPrice : (dynamicBookingReport?.totalPrice || 0)) - advancePayment).toLocaleString()}₮
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white p-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {isSubmittingBooking ? 'Захиалга бүртгэж байна...' : 'Захиалга гар аргаар үүсгэх'}
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

          {/* TAB 5: MANAGE FAQS */}
          {activeTab === 'manage-faqs' && (
            <motion.div
              key="faqs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Add / Edit Form */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-teal">
                    {editingFaq ? 'Асуулт Хариулт Засах' : 'Шинэ Асуулт Хариулт Нийтлэх'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    {editingFaq ? 'Сонгосон асуулт хариултыг засаж шинэчилж байна.' : 'Энд нийтэлсэн асуулт хариултууд вэб талбарын Нүүр Хуудас дээр FAQ хэсэгт заасан дарааллаар харагдана.'}
                  </p>
                </div>

                {faqSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs flex justify-between items-center">
                    <span>{faqSuccessMsg}</span>
                    <button onClick={() => setFaqSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
                      <X size={16} />
                    </button>
                  </div>
                )}

                <form onSubmit={handlePublishFaq} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Асуултын гарчиг (Question) *</label>
                      <input
                        type="text"
                        required
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        placeholder="Жишээ: Амралтын газарт гэрийн тэжээвэр амьтан авчирч болох уу?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-teal">Харагдах эрэмбэ (Order) </label>
                      <input
                        type="number"
                        min={1}
                        value={faqOrder}
                        onChange={(e) => setFaqOrder(Number(e.target.value) || 1)}
                        placeholder="5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-teal">Хариултын дэлгэрэнгүй (Answer) *</label>
                    <textarea
                      required
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      rows={6}
                      placeholder="Асуултанд өгөх тодорхой, дэлгэрэнгүй хариултыг энд бичнэ. Шаардлагатай бол шинэ мөр гаргаж болно."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none font-sans"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingFaq}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white p-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingFaq ? 'Хадгалж байна...' : (editingFaq ? 'Асуултыг Шинэчлэх' : 'Асуулт нэмж нийтлэх')}
                    </button>
                    {editingFaq && (
                      <button
                        type="button"
                        onClick={handleCancelEditFaq}
                        className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all cursor-pointer"
                      >
                        Цуцлах
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* FAQs List Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-serif font-bold text-brand-teal">Асуултууд ({faqs.length})</h3>
                  <span className="text-xs text-brand-teal font-mono bg-brand-teal/5 px-2.5 py-1 rounded-full border border-brand-teal/10 font-bold">Эрэмбэлэгдсэн</span>
                </div>
                
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2 space-y-2">
                  {faqs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs leading-relaxed">
                      Одоогоор ямар нэг нэмэлт асуулт оруулаагүй байна.<br />
                    </div>
                  ) : (
                    faqs.map((item, index) => (
                      <div key={item.id || index} className="py-4 space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                Эрэмбэ: {item.order || 5}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-800 leading-snug">{item.question}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-line">{item.answer}</p>
                          </div>
                          
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleEditFaqClick(item)}
                              className="p-1 px-2 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                              title="Засах"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(item.id)}
                              className="p-1 px-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                              title="Устгах"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
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

      {confirmingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden w-full max-w-lg"
          >
            {/* Modal Header */}
            <div className="bg-brand-teal text-white px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="text-white shrink-0 animate-pulse" size={20} />
                <h3 className="text-base font-bold tracking-tight">Захиалгын дэлгэрэнгүй мэдээлэл</h3>
              </div>
              <button 
                onClick={() => setConfirmingBooking(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
              
              {/* Profile Card */}
              <div className="bg-slate-50 border border-slate-100/75 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Үйлчлүүлэгч</div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-extrabold text-sm shrink-0">
                    {confirmingBooking.name ? confirmingBooking.name.charAt(0).toUpperCase() : 'У'}
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-brand-teal text-base leading-tight">{confirmingBooking.name}</div>
                    <div className="text-slate-500 font-semibold text-xs flex items-center gap-1 mt-0.5">
                      <Phone size={12} className="text-slate-400" /> {confirmingBooking.phone}
                    </div>
                    {confirmingBooking.email && (
                      <div className="text-slate-500 font-semibold text-xs flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" /> {confirmingBooking.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Option Info */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-3.5">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Сонгосон төрөл</div>
                  <span className="bg-brand-teal/10 text-brand-teal font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                    {confirmingBooking.bookingType === 'house' ? 'Модон Хаус түрээс' : 'Амралт/Ресорт'}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Гарчиг</div>
                  <div className="font-bold text-slate-800 text-xs md:text-sm leading-relaxed">
                    {confirmingBooking.optionTitle}
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Хугацаа (Орох / Гарах)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-semibold">Орох (Check-In)</div>
                    <div className="font-extrabold text-slate-800 text-sm mt-1">{confirmingBooking.checkIn}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 font-bold">14:00-оос хойш</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-semibold">Гарах (Check-Out)</div>
                    <div className="font-extrabold text-slate-800 text-sm mt-1">{confirmingBooking.checkOut}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 font-bold">12:00-оос өмнө</div>
                  </div>
                </div>
                <div className="text-xs text-brand-teal font-extrabold bg-brand-teal/5 py-2 px-3 rounded-xl text-center">
                  Хугацаа: {(confirmingBooking.weekdayNights || 0) + (confirmingBooking.weekendNights || 0)} хоног ({confirmingBooking.weekdayNights || 0} ажлын, {confirmingBooking.weekendNights || 0} амралтын)
                </div>
              </div>

              {/* Guest numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Том хүний тоо</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{confirmingBooking.adults || 1} хүн</div>
                </div>
                <div className="border border-slate-100 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Хүүхдийн тоо</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{confirmingBooking.children || 0} хүүхэд</div>
                </div>
              </div>

              {/* Total Price & Payment */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold block">Нийт бодогдсон үнэ:</span>
                  <span className="text-lg font-serif font-extrabold text-brand-red">
                    {confirmingBooking.totalPrice ? `${confirmingBooking.totalPrice.toLocaleString()}₮` : 'Тодорхойгүй'}
                  </span>
                </div>
                {Number(confirmingBooking.advancePayment) > 0 && (
                  <>
                    <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2 text-emerald-800">
                      <span className="font-semibold font-sans">Төлсөн урьдчилгаа:</span>
                      <span className="font-extrabold font-serif">
                        -{Number(confirmingBooking.advancePayment).toLocaleString()}₮
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2 text-amber-900 font-bold">
                      <span className="font-sans">Үйлчлүүлэгчээс авах үлдэгдэл төлбөр:</span>
                      <span className="font-serif font-black text-sm underline decoration-double">
                        {Math.max(0, (Number(confirmingBooking.totalPrice) || 0) - (Number(confirmingBooking.advancePayment) || 0)).toLocaleString()}₮
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmingBooking(null)}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Хаах
              </button>
              <button
                onClick={async () => {
                  await handleUpdateStatus(confirmingBooking.id, 'confirmed');
                  setConfirmingBooking(null);
                  alert("Захиалга амжилттай баталгаажлаа!");
                }}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-green-100 cursor-pointer"
              >
                <Check size={14} /> Захиалгыг Баталгаажуулах
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden w-full max-w-md"
          >
            {/* Modal Header */}
            <div className="bg-brand-teal text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="text-white shrink-0 animate-pulse" size={18} />
                <h3 className="text-sm font-bold tracking-tight">Админы нууц үг шинэчлэх</h3>
              </div>
              <button 
                onClick={() => setIsChangingPassword(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-500 mb-2 leading-relaxed">
                Шинэ нууц үгээ оруулан хадгалснаар системд нэвтрэх үндсэн нууц үг шинэчлэгдэх болно. Мөн өмнөх default нууц үг дагаж ажиллах болно.
              </p>

              {passwordChangeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-medium">
                  {passwordChangeSuccess}
                </div>
              )}

              {passwordChangeError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 font-medium">
                  {passwordChangeError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-teal">Шинэ нууц үг *</label>
                <input
                  type="password"
                  required
                  placeholder="Шинэ нууц үг оруулна уу"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-teal">Шинэ нууц үг баталгаажуулах *</label>
                <input
                  type="password"
                  required
                  placeholder="Шинэ нууц үгийг давтан оруулна уу"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={isChangingPasswordSubmitting}
                  className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-bold transition-colors shadow-md shadow-slate-100 cursor-pointer disabled:opacity-50"
                >
                  {isChangingPasswordSubmitting ? 'Шинэчилж байна...' : 'Нууц үг хадгалах'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>

    {/* PDF Printable Report Element - ONLY rendered on print */}
    <div className="hidden print:block bg-white p-12 text-slate-900 font-sans min-h-screen text-xs select-none">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4 portrait; margin: 1.5cm; }
        }
      `}</style>
      
      {/* Report Header Logo & Branding */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-xl font-serif font-black tracking-tight text-slate-900 uppercase">СУУТ АМРАЛТ • RESORT</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">БАЙГАЛИЙН ҮЗЭСГЭЛЭНТ ЦОГЦОЛБОР • ХЯНАЛТЫН ТАЙЛАН</p>
          <p className="text-[9px] text-slate-400 mt-1">Утас: 8080-XXXX, Вэб: suut.mn, Имэйл: info@suut.mn</p>
        </div>
        <div className="text-right">
          <span className="bg-slate-900 text-white font-black px-4 py-2 text-xs rounded-sm tracking-widest inline-block uppercase">ТАЙЛАН</span>
          <p className="text-[10px] text-slate-500 font-bold mt-2">Огноо: {new Date().toLocaleDateString('mn-MN')} {new Date().toLocaleTimeString('mn-MN')}</p>
        </div>
      </div>

      {/* Executive Report Title */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">ЗАХИАЛГА, БОРЛУУЛАЛТЫН НЭГДСЭН СУУРЬ ТАЙЛАН</h2>
        <div className="w-16 h-1 bg-slate-900 mx-auto mt-2"></div>
      </div>

      {/* Stats KPI Overview Blocks */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-slate-300 p-4 rounded-md bg-slate-50/50">
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">Нийт баталгаажсан орлого</span>
          <span className="text-base font-black text-slate-900 block mt-1 font-serif">
            {stats.totalRevenue.toLocaleString()}₮
          </span>
          <p className="text-[8px] text-emerald-700 font-bold mt-1">Баталгаажсан {stats.confirmedCount} захиалга</p>
        </div>

        <div className="border border-slate-300 p-4 rounded-md bg-slate-50/50">
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">Нийт захиалгын хэмжээ</span>
          <span className="text-base font-black text-slate-900 block mt-1">
            {stats.totalBookingsCount} ш
          </span>
          <p className="text-[8px] text-slate-500 font-bold mt-1">Бүх системд бүртгэлтэй захиалга</p>
        </div>

        <div className="border border-slate-300 p-4 rounded-md bg-slate-50/50">
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">Дундаж захиалгын үнэ</span>
          <span className="text-base font-black text-slate-900 block mt-1 font-serif">
            {stats.averageRevenue.toLocaleString()}₮
          </span>
          <p className="text-[8px] text-slate-400 font-bold mt-1">Нэг захиалгын ашгийн үзүүлэлт</p>
        </div>
      </div>

      {/* Sub-breakdown details by category */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Monthly analysis column */}
        <div className="border border-slate-200 rounded-md p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wide border-b border-slate-200 pb-1.5">Сарын орлогын үзүүлэлт</h3>
          <ul className="divide-y divide-slate-100 text-[9px]">
            {stats.monthlyList.length === 0 ? (
              <li className="py-2 text-slate-400">Өгөгдөл байхгүй байна.</li>
            ) : (
              stats.monthlyList.map((m) => (
                <li key={m.month} className="py-2 flex justify-between">
                  <span className="font-bold text-slate-700">{m.year} • {m.label}</span>
                  <div className="space-x-3 text-right">
                    <span className="text-slate-400">{m.count} ш захиалга</span>
                    <span className="font-black text-slate-900">{m.revenue.toLocaleString()}₮</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Category analysis column */}
        <div className="border border-slate-200 rounded-md p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wide border-b border-slate-200 pb-1.5">Байршлын төрлөөр авах эрэлт</h3>
          <ul className="divide-y divide-slate-100 text-[9px]">
            <li className="py-2.5 flex justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                <span className="font-bold text-slate-700">Модон хаус түрээс</span>
              </div>
              <div className="space-x-3 text-right">
                <span className="text-slate-400">{(stats.typeMap.house?.count || 0)} ш</span>
                <span className="font-black text-slate-900">{(stats.typeMap.house?.revenue || 0).toLocaleString()}₮</span>
              </div>
            </li>
            <li className="py-2.5 flex justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="font-bold text-slate-700">Амралт/Ресорт өрөө</span>
              </div>
              <div className="space-x-3 text-right">
                <span className="text-slate-400">{(stats.typeMap.resort?.count || 0)} ш</span>
                <span className="font-black text-slate-900">{(stats.typeMap.resort?.revenue || 0).toLocaleString()}₮</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Main detailed table list of bookings */}
      <div className="space-y-3 mb-10">
        <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wide border-b border-slate-200 pb-1.5">Хэрэглэгчийн бүртгэлтэй захиалгуудын жагсаалт</h3>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-widest border-b border-slate-300">
              <th className="p-2 border border-slate-300">Захиалагч</th>
              <th className="p-2 border border-slate-300">Төрөл / Сонголт</th>
              <th className="p-2 border border-slate-300">Орох/Гарах огноо</th>
              <th className="p-2 border border-slate-300">Төлбөр</th>
              <th className="p-2 border border-slate-300 text-center">Төлөв</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[9px]">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 font-bold">Бүртгэлтэй захиалга олдсонгүй.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="p-2 border border-slate-200">
                    <div className="font-bold text-slate-800">{b.name}</div>
                    <div className="text-[8px] text-slate-500">{b.phone}</div>
                  </td>
                  <td className="p-2 border border-slate-200">
                    <div className="font-semibold text-slate-700">{b.bookingType === 'house' ? 'Хаус' : 'Ресорт өрөө'}</div>
                    <div className="text-[8px] text-slate-400 max-w-[150px] truncate">{b.optionTitle}</div>
                  </td>
                  <td className="p-2 border border-slate-200">
                    <span className="font-bold">{b.checkIn}</span>-аас <span className="font-bold">{b.checkOut}</span>
                  </td>
                  <td className="p-2 border border-slate-200 font-serif">
                    <div className="font-extrabold text-slate-900">{b.totalPrice ? `${b.totalPrice.toLocaleString()}₮` : '0₮'}</div>
                    {Number(b.advancePayment) > 0 && (
                      <div className="text-[7.5px] text-slate-500 font-sans mt-0.5 space-y-0.5" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                        <div>Урьдчилгаа: {Number(b.advancePayment).toLocaleString()}₮</div>
                        <div className="font-bold text-amber-700">Үлдэгдэл: {Math.max(0, (Number(b.totalPrice) || 0) - (Number(b.advancePayment) || 0)).toLocaleString()}₮</div>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border border-slate-200 text-center">
                    <span className={`inline-block text-[7px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : b.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-250'
                    }`}>
                      {b.status === 'confirmed' ? 'Батлагдсан' : b.status === 'cancelled' ? 'Цуцалсан' : 'Хүлээгдэж буй'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Signature blocks */}
      <div className="pt-8 border-t border-slate-400 flex justify-between text-[10px] text-slate-600 mt-auto">
        <div className="space-y-12">
          <p>Тайланг хянасан: ........................................... / Администратор /</p>
          <p className="text-[8px] text-slate-400 italic">Гарын үсэг, тамга баталгаажуулсан огноо: ....... он .... сар .... өдөр</p>
        </div>
        <div className="space-y-12 text-right">
          <p>Тайлан гаргасан систем: ...................................... / СУУТ Систем /</p>
          <p className="text-[8px] text-slate-400 italic">Системд нэвтэрсэн: {adminUserEmail || user?.email || 'Админ хэрэглэгч'}</p>
        </div>
      </div>
    </div>
    </>
  );
}
