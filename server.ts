import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.get("/api/news", (req, res) => {
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  res.json(newsData);
});

app.post("/api/news", (req, res) => {
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
  newsData.unshift(newItem);
  writeJSON(NEWS_FILE, newsData);
  res.status(201).json(newItem);
});

app.put("/api/news/:id", (req, res) => {
  const { id } = req.params;
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  const index = newsData.findIndex((n: any) => n.id === id);
  if (index !== -1) {
    newsData[index] = {
      ...newsData[index],
      ...req.body
    };
    writeJSON(NEWS_FILE, newsData);
    res.json(newsData[index]);
  } else {
    res.status(404).json({ error: "News not found" });
  }
});

app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params;
  newsData = readJSON(NEWS_FILE, SEED_NEWS);
  const initialLen = newsData.length;
  newsData = newsData.filter((n: any) => n.id !== id);
  
  if (newsData.length < initialLen) {
    writeJSON(NEWS_FILE, newsData);
    res.json({ success: true, message: "Deleted successfully" });
  } else {
    res.status(404).json({ error: "News article not found" });
  }
});

// --- Gallery API ---
app.get("/api/gallery", (req, res) => {
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  res.json(galleryData);
});

app.post("/api/gallery", (req, res) => {
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  const newItem = {
    id: req.body.id || `g-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    image: req.body.image,
    category: req.body.category || "Nature",
    caption: req.body.caption || "",
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  galleryData.unshift(newItem);
  writeJSON(GALLERY_FILE, galleryData);
  res.status(201).json(newItem);
});

app.delete("/api/gallery/:id", (req, res) => {
  const { id } = req.params;
  galleryData = readJSON(GALLERY_FILE, SEED_GALLERY);
  const initialLen = galleryData.length;
  galleryData = galleryData.filter((g: any) => g.id !== id);
  
  if (galleryData.length < initialLen) {
    writeJSON(GALLERY_FILE, galleryData);
    res.json({ success: true, message: "Deleted successfully" });
  } else {
    res.status(404).json({ error: "Gallery item not found" });
  }
});

// --- Bookings API ---
app.get("/api/bookings", (req, res) => {
  bookingsData = readJSON(BOOKINGS_FILE, []);
  res.json(bookingsData);
});

app.post("/api/bookings", (req, res) => {
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
  bookingsData.unshift(newBooking);
  writeJSON(BOOKINGS_FILE, bookingsData);
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  bookingsData = readJSON(BOOKINGS_FILE, []);
  const index = bookingsData.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    bookingsData[index] = {
      ...bookingsData[index],
      ...req.body
    };
    writeJSON(BOOKINGS_FILE, bookingsData);
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
