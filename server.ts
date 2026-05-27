import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Firestore on Backend
let db: any = null;
try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    const fbApp = initializeApp(firebaseConfig);
    db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("[SUUT Server] Firestore initialized successfully with database id:", firebaseConfig.firestoreDatabaseId || "(default)");
  } else {
    console.warn("[SUUT Server] firebase-applet-config.json is empty/invalid. Firestore backend mapping disabled.");
  }
} catch (err) {
  console.error("[SUUT Server] Failed to initialize Firestore on server:", err);
}

// Initialize Local JSON Persistence Sub-system
const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed Data
const SEED_NEWS = [
  {
    id: "default-1",
    title: "Зуны Нээлтийн Урамшуулал: Ажлын Өдрүүдэд 20% Хямдарлаа!",
    content: "Урин дулаан цаг ирж, амралт зугаалгын улирал эхэлж байгаатай холбогдуулан **SUUT RESORT** нь зуны улирлын нээлтийн тусгай урамшууллыг зарлаж байна.\n\nТа Даваагаас Пүрэв гарагт захиалга өгснөөр дараах хөнгөлөлтүүдийг авах боломжтой:\n- Цэвэр модон хаусууд болон бүх төрлийн өрөөний захиалга **20% хямдарна**.\n- Үүнд өдрийн 3 хоол болон амралтын гаднах стадион ашиглах эрх багтсан болно.\n- Гэр бүл бөгөөд найз нөхдөөрөө нам гүм, байгалийн үзэсгэлэнт газарт ая тухтай амрах хамгийн сайн боломж!\n\n### Захиалга баталгаажуулах заавар:\n1. Захиалга цэс рүү орж тохирох өдрөө сонгоно.\n2. Урьдчилгаа төлбөрөө шилжүүлснээр таны захиалга шууд баталгаажна.\n3. Дэлгэрэнгүй мэдээллийг 8801-0011 утсаар аваарай.",
    category: "Хямдрал",
    image: "https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4",
    author: "Админ",
    createdAt: "2026-05-20T00:00:00.000Z"
  },
  {
    id: "default-2",
    title: "Шинэ Спортын Талбай Болон Тоглоомын Хэсэг Нээгдлээ",
    content: "Бид амрагч нарынхаа чөлөөт цагийг илүү сонирхолтой, идэвхтэй өнгөрүүлэхэд зориулж олон улсын стандартад нийцсэн шинэ спорт заал, гадна талбайг ашиглалтад орууллаа.\n\n### Спортын цогцолборт багтсан:\n- Сагсан бөмбөгийн задгай талбай\n- Волейболын зүлгэн талбай\n- Хүүхдийн аюулгүй элсний талбай, савлуур\n- Ширээний теннис, бильярд\n\nАмрагчид маань ямар нэг нэмэлт төлбөргүйгээр эдгээр хэсгүүдэд тоглож, эрүүл агаарт нэг өдрийг гэр бүлээрээ ид шидийн мэт өнгөрүүлэх боломжтой юм. Манай хамт олон таны тав тухыг хангахаар цаг үргэлж хөдөлмөрлөсөөр байна!",
    category: "Мэдээ",
    image: "https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa",
    author: "Амралтын Захиргаа",
    createdAt: "2026-05-15T00:00:00.000Z"
  },
  {
    id: "default-3",
    title: "Эко Явган Аяллын Шинэ Чиглэлүүд Гаргалаа",
    content: "Байгальтайгаа илүү гүнзгий холбогдож, хусан ойн замаар алхахыг хүссэн амрагчдадаа зориулан тусгай явган аяллын **шинэ 3 чиглэлийг** тэмдэгжүүлсэн замаар тохижууллаа.\n\n### Сонгох боломжтой маршрутууд:\n1. **Хусан төгөл зашал амралт**: Нийт 1.2км хялбар замын алхалт, уушги цэвэрлэх амьсгалын дасгалын цэгүүдтэй.\n2. **Оргил өөд уруудах залуусын чиглэл**: Нийт 2.5км дунд зэргийн хүндрэлтэй, Баянчандмань сумын байгалийг бүхэлд нь харах хяналтын өндөрлөгтэй.\n3. **Болор булаг эко отог**: Байгалийн булаг, рашааны эх ундарга руу хийх 3км-ийн урттай аялал.\n\nАялал бүрд манай мэргэжлийн хөтөч чиглүүлэг өгөх бөгөөд аяллыг илүү сонирхолтой танин мэдэхүйн түүхүүдээр баяжуулах болно. Ирээд заавал туршиж үзээрэй!",
    category: "Эко Аялал",
    image: "https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9",
    author: "Хөтөч Батболд",
    createdAt: "2026-05-10T00:00:00.000Z"
  }
];

const SEED_GALLERY = [
  { id: 'g-1', category: 'Nature', caption: 'Суут Резортын үзэсгэлэнт байгаль, уудам уулсын дүр төрх', image: 'https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG', createdAt: "2026-05-20T00:00:00.000Z" },
  { id: 'g-2', category: 'Nature', caption: 'Хусан ойн нам гүм, цэнгэг агаарт алхан биеэ журамшуулах замын агшин', image: 'https://lh3.googleusercontent.com/d/1VPMeteBUV7gEU-Ay-GqdoINLS-gUJW7H', createdAt: "2026-05-19T00:00:00.000Z" },
  { id: 'g-3', category: 'Nature', caption: 'Ногоон зүлэг, өвөрмөц тохижилт бүхий задгай талбайн хэсэг', image: 'https://lh3.googleusercontent.com/d/1QyGzIVu5zReIP6TE194liiqltKGztEb9', createdAt: "2026-05-18T00:00:00.000Z" },
  { id: 'g-4', category: 'Rooms', caption: 'Ая тухтай, орчин үеийн гэр бүлийн дотоод засал чимэглэл бүхий стандарт өрөө', image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa', createdAt: "2026-05-17T00:00:00.000Z" },
  { id: 'g-5', category: 'Rooms', caption: 'Тав тухыг дээд зэргээр хангасан, толигор өрөөний дулаахан унтлагын хэсэг', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU', createdAt: "2026-05-16T00:00:00.000Z" },
  { id: 'g-6', category: 'Houses', caption: 'Байгальд орших цэвэр модон тансаг зэрэглэлийн хаусны гаднах болон орчны харагдах байдал', image: 'https://lh3.googleusercontent.com/d/1IoAQw8BDVtkB4dL3ZC6ek7U6SfKdh_gu', createdAt: "2026-05-15T00:00:00.000Z" },
  { id: 'g-7', category: 'Houses', caption: 'Хүүхдийн тоглоомын хэсэг болон амрах талбай бүхий гэр бүлд зориулагдсан модон хаус', image: 'https://lh3.googleusercontent.com/d/1cQEYwq-79GPLXX6QmOyDrrQ_bwX51Z8T', createdAt: "2026-05-14T00:00:00.000Z" },
  { id: 'g-8', category: 'Houses', caption: 'Хус модны төгөлд байрласан тухлаг, уламжлалт хэв маягийг шингээсэн зуслангийн гэр', image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa', createdAt: "2026-05-13T00:00:00.000Z" },
  { id: 'g-9', category: 'Houses', caption: 'Харуулц хангасан тагттай, цэлгэр цонхтой байгалийн үзэмжит хаусны дүр зураг', image: 'https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__', createdAt: "2026-05-12T00:00:00.000Z" },
  { id: 'g-10', category: 'Houses', caption: 'Үдшийн гэрэлтүүлэгтэй маш тохилог, намуухан амралтын модон сууцнууд', image: 'https://lh3.googleusercontent.com/d/1weJpTiCTRZwGq5smajOL4tcOQWj2mqjG', createdAt: "2026-05-11T00:00:00.000Z" }
];

// Helper to Safely Read JSON Files
function readJSON(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading database file ${filePath}:`, error);
    return defaultData;
  }
}

// Helper to Safely Write JSON Files
function writeJSON(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing database file ${filePath}:`, error);
  }
}

// Bootstrap files
let newsData = readJSON(NEWS_FILE, SEED_NEWS);
let galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
let bookingsData = readJSON(BOOKINGS_FILE, []);

// ==================== API Endpoints ====================

// --- News API ---
app.get("/api/news", async (req, res) => {
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  
  if (db) {
    try {
      const qSnap = await getDocs(collection(db, "news"));
      const fsNews: any[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        let formattedDate = data.createdAt;
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          formattedDate = data.createdAt.toDate().toISOString();
        } else if (data.createdAt && data.createdAt.seconds !== undefined) {
          formattedDate = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (data.createdAt) {
          formattedDate = new Date(data.createdAt).toISOString();
        } else {
          formattedDate = new Date().toISOString();
        }

        fsNews.push({
          id: docSnap.id,
          title: data.title || "",
          content: data.content || "",
          category: data.category || "Мэдээ",
          image: data.image || "https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4",
          author: data.author || "Админ",
          createdAt: formattedDate
        });
      });
      
      if (fsNews.length > 0) {
        fsNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        newsData = fsNews;
        writeJSON(NEWS_FILE, newsData);
      }
    } catch (err) {
      console.warn("[SUUT Server] Warning: Fallback to local files. Loading news from Firestore failed:", (err as any).message);
    }
  }
  
  res.json(newsData);
});

app.post("/api/news", async (req, res) => {
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  const newItem = {
    id: req.body.id || `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || "Мэдээ",
    image: req.body.image || "https://lh3.googleusercontent.com/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4",
    author: req.body.author || "Админ",
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  
  // Save to local cache first
  newsData = newsData.filter((item: any) => item.id !== newItem.id);
  newsData.unshift(newItem);
  writeJSON(NEWS_FILE, newsData);

  // Sync to Firestore
  if (db) {
    try {
      await setDoc(doc(db, "news", newItem.id), {
        title: newItem.title,
        content: newItem.content,
        category: newItem.category,
        image: newItem.image,
        author: newItem.author,
        createdAt: new Date(newItem.createdAt)
      });
      console.log("[SUUT Server] Synced news creation to Firestore:", newItem.id);
    } catch (err) {
      console.error("[SUUT Server] Failed to sync news creation to Firestore:", err);
    }
  }

  res.status(201).json(newItem);
});

app.put("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  const index = newsData.findIndex((n: any) => n.id === id);
  if (index !== -1) {
    newsData[index] = {
      ...newsData[index],
      ...req.body
    };
    writeJSON(NEWS_FILE, newsData);
    
    // Sync to Firestore
    if (db) {
      try {
        const payload: any = {};
        if (req.body.title !== undefined) payload.title = req.body.title;
        if (req.body.content !== undefined) payload.content = req.body.content;
        if (req.body.category !== undefined) payload.category = req.body.category;
        if (req.body.image !== undefined) payload.image = req.body.image;
        if (req.body.author !== undefined) payload.author = req.body.author;
        if (req.body.createdAt !== undefined) payload.createdAt = new Date(req.body.createdAt);
        
        await setDoc(doc(db, "news", id), {
          title: newsData[index].title,
          content: newsData[index].content,
          category: newsData[index].category,
          image: newsData[index].image,
          author: newsData[index].author,
          createdAt: new Date(newsData[index].createdAt)
        }, { merge: true });
        console.log("[SUUT Server] Synced news update to Firestore:", id);
      } catch (err) {
        console.error("[SUUT Server] Failed to sync news update to Firestore:", err);
      }
    }
    
    res.json(newsData[index]);
  } else {
    res.status(404).json({ error: "News not found" });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  const initialLen = newsData.length;
  newsData = newsData.filter((n: any) => n.id !== id);
  
  if (newsData.length < initialLen) {
    writeJSON(NEWS_FILE, newsData);
    
    // Sync to Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, "news", id));
        console.log("[SUUT Server] Synced news category deletion to Firestore:", id);
      } catch (err) {
        console.error("[SUUT Server] Failed to delete news from Firestore:", err);
      }
    }
    
    res.json({ success: true, message: "Deleted successfully" });
  } else {
    res.status(404).json({ error: "News article not found" });
  }
});

// --- Gallery API ---
app.get("/api/gallery", async (req, res) => {
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  
  if (db) {
    try {
      const qSnap = await getDocs(collection(db, "gallery"));
      const fsGallery: any[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        let formattedDate = data.createdAt;
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          formattedDate = data.createdAt.toDate().toISOString();
        } else if (data.createdAt && data.createdAt.seconds !== undefined) {
          formattedDate = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (data.createdAt) {
          formattedDate = new Date(data.createdAt).toISOString();
        } else {
          formattedDate = new Date().toISOString();
        }

        fsGallery.push({
          id: docSnap.id,
          image: data.image || "",
          category: data.category || "Nature",
          caption: data.caption || "",
          createdAt: formattedDate
        });
      });
      
      if (fsGallery.length > 0) {
        fsGallery.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        galleryData = fsGallery;
        writeJSON(GALLERY_FILE, galleryData);
      }
    } catch (err) {
      console.warn("[SUUT Server] Warning: Fallback to local files. Loading gallery from Firestore failed:", (err as any).message);
    }
  }
  
  res.json(galleryData);
});

app.post("/api/gallery", async (req, res) => {
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  const newItem = {
    id: req.body.id || `g-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    image: req.body.image,
    category: req.body.category || "Nature",
    caption: req.body.caption || "",
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  
  // Save to local cache first
  galleryData = galleryData.filter((g: any) => g.id !== newItem.id);
  galleryData.unshift(newItem);
  writeJSON(GALLERY_FILE, galleryData);
  
  // Sync to Firestore
  if (db) {
    try {
      await setDoc(doc(db, "gallery", newItem.id), {
        image: newItem.image,
        category: newItem.category,
        caption: newItem.caption,
        createdAt: new Date(newItem.createdAt)
      });
      console.log("[SUUT Server] Synced gallery item to Firestore:", newItem.id);
    } catch (err) {
      console.error("[SUUT Server] Failed to sync gallery item to Firestore:", err);
    }
  }
  
  res.status(201).json(newItem);
});

app.delete("/api/gallery/:id", async (req, res) => {
  const { id } = req.params;
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  const initialLen = galleryData.length;
  galleryData = galleryData.filter((g: any) => g.id !== id);
  
  if (galleryData.length < initialLen) {
    writeJSON(GALLERY_FILE, galleryData);
    
    // Sync to Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, "gallery", id));
        console.log("[SUUT Server] Synced gallery deletion to Firestore:", id);
      } catch (err) {
        console.error("[SUUT Server] Failed to delete gallery item from Firestore:", err);
      }
    }
    
    res.json({ success: true, message: "Deleted successfully" });
  } else {
    res.status(404).json({ error: "Gallery item not found" });
  }
});

// --- Bookings API ---
app.get("/api/bookings", async (req, res) => {
  bookingsData = readJSON(BOOKINGS_FILE, []);
  
  if (db) {
    try {
      const qSnap = await getDocs(collection(db, "bookings"));
      const fsBookings: any[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        let formattedDate = data.createdAt;
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          formattedDate = data.createdAt.toDate().toISOString();
        } else if (data.createdAt && data.createdAt.seconds !== undefined) {
          formattedDate = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (data.createdAt) {
          formattedDate = new Date(data.createdAt).toISOString();
        } else {
          formattedDate = new Date().toISOString();
        }

        fsBookings.push({
          id: docSnap.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          guests: data.guests || 1,
          adults: data.adults || 1,
          children: data.children || 0,
          bookingType: data.bookingType,
          optionId: data.optionId,
          optionTitle: data.optionTitle,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          weekdayNights: data.weekdayNights || 0,
          weekendNights: data.weekendNights || 0,
          totalPrice: data.totalPrice || 0,
          status: data.status || "pending",
          createdAt: formattedDate
        });
      });
      
      if (fsBookings.length > 0) {
        fsBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        bookingsData = fsBookings;
        writeJSON(BOOKINGS_FILE, bookingsData);
      }
    } catch (err) {
      console.warn("[SUUT Server] Warning: Fallback to local files. Loading bookings from Firestore failed:", (err as any).message);
    }
  }
  
  res.json(bookingsData);
});

app.post("/api/bookings", async (req, res) => {
  bookingsData = readJSON(BOOKINGS_FILE, []);
  const newBooking = {
    id: req.body.id || `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    guests: Math.max(1, parseInt(req.body.guests || "1", 10)),
    adults: Math.max(1, parseInt(req.body.adults || "1", 10)),
    children: parseInt(req.body.children || "0", 10),
    bookingType: req.body.bookingType,
    optionId: req.body.optionId,
    optionTitle: req.body.optionTitle,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    weekdayNights: parseInt(req.body.weekdayNights || "0", 10),
    weekendNights: parseInt(req.body.weekendNights || "0", 10),
    totalPrice: parseInt(req.body.totalPrice || "0", 10),
    status: req.body.status || "pending",
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  
  // Save to local cache first
  bookingsData = bookingsData.filter((b: any) => b.id !== newBooking.id);
  bookingsData.unshift(newBooking);
  writeJSON(BOOKINGS_FILE, bookingsData);
  
  // Sync to Firestore
  if (db) {
    try {
      await setDoc(doc(db, "bookings", newBooking.id), {
        name: newBooking.name,
        phone: newBooking.phone,
        email: newBooking.email,
        guests: newBooking.guests,
        adults: newBooking.adults,
        children: newBooking.children,
        bookingType: newBooking.bookingType,
        optionId: newBooking.optionId,
        optionTitle: newBooking.optionTitle,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        weekdayNights: newBooking.weekdayNights,
        weekendNights: newBooking.weekendNights,
        totalPrice: newBooking.totalPrice,
        status: newBooking.status,
        createdAt: new Date(newBooking.createdAt)
      });
      console.log("[SUUT Server] Synced booking creation to Firestore:", newBooking.id);
    } catch (err) {
      console.error("[SUUT Server] Failed to sync booking creation to Firestore:", err);
    }
  }
  
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  bookingsData = readJSON(BOOKINGS_FILE, []);
  const index = bookingsData.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    bookingsData[index] = {
      ...bookingsData[index],
      ...req.body
    };
    writeJSON(BOOKINGS_FILE, bookingsData);
    
    // Sync to Firestore
    if (db) {
      try {
        const payload: any = {};
        if (req.body.name !== undefined) payload.name = req.body.name;
        if (req.body.phone !== undefined) payload.phone = req.body.phone;
        if (req.body.email !== undefined) payload.email = req.body.email;
        if (req.body.guests !== undefined) payload.guests = parseInt(req.body.guests, 10);
        if (req.body.adults !== undefined) payload.adults = parseInt(req.body.adults, 10);
        if (req.body.children !== undefined) payload.children = parseInt(req.body.children, 10);
        if (req.body.bookingType !== undefined) payload.bookingType = req.body.bookingType;
        if (req.body.optionId !== undefined) payload.optionId = req.body.optionId;
        if (req.body.optionTitle !== undefined) payload.optionTitle = req.body.optionTitle;
        if (req.body.checkIn !== undefined) payload.checkIn = req.body.checkIn;
        if (req.body.checkOut !== undefined) payload.checkOut = req.body.checkOut;
        if (req.body.weekdayNights !== undefined) payload.weekdayNights = parseInt(req.body.weekdayNights, 10);
        if (req.body.weekendNights !== undefined) payload.weekendNights = parseInt(req.body.weekendNights, 10);
        if (req.body.totalPrice !== undefined) payload.totalPrice = parseInt(req.body.totalPrice, 10);
        if (req.body.status !== undefined) payload.status = req.body.status;
        if (req.body.createdAt !== undefined) payload.createdAt = new Date(req.body.createdAt);
        
        await setDoc(doc(db, "bookings", id), {
          name: bookingsData[index].name,
          phone: bookingsData[index].phone,
          email: bookingsData[index].email,
          guests: bookingsData[index].guests,
          adults: bookingsData[index].adults,
          children: bookingsData[index].children,
          bookingType: bookingsData[index].bookingType,
          optionId: bookingsData[index].optionId,
          optionTitle: bookingsData[index].optionTitle,
          checkIn: bookingsData[index].checkIn,
          checkOut: bookingsData[index].checkOut,
          weekdayNights: bookingsData[index].weekdayNights,
          weekendNights: bookingsData[index].weekendNights,
          totalPrice: bookingsData[index].totalPrice,
          status: bookingsData[index].status,
          createdAt: new Date(bookingsData[index].createdAt)
        }, { merge: true });
        console.log("[SUUT Server] Synced booking update to Firestore:", id);
      } catch (err) {
        console.error("[SUUT Server] Failed to sync booking update to Firestore:", err);
      }
    }
    
    res.json(bookingsData[index]);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});


// ==================== Vite / Static Asset Pipeline ====================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SUUT Server] Running at http://localhost:${PORT}`);
  });
}

start();
