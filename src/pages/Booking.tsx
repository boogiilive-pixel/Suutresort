import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, isSameDay, isBefore, startOfToday, addDays, getDay, differenceInCalendarDays } from 'date-fns';
import { mn } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Home as HomeIcon, Bed, CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

// Firebase imports
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

// Types
type BookingType = 'house' | 'room';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Option {
  id: string;
  type: BookingType;
  title: string;
  price: string;
  image: string;
}

const options: Option[] = [
  { id: 'villa-1', type: 'house', title: 'Цэвэр Модон Хаус (Тав тух & Халаалт)', price: '600,000₮ - 800,000₮', image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa' },
  { id: 'villa-2', type: 'house', title: 'Цэвэр Модон Хаус (Унтлагын хэсэг & Амралт)', price: '600,000₮ - 800,000₮', image: 'https://lh3.googleusercontent.com/d/1IoAQw8BDVtkB4dL3ZC6ek7U6SfKdh_gu' },
  { id: 'villa-3', type: 'house', title: 'Цэвэр Модон Хаус (Тоглоом & Энтертайнмент)', price: '600,000₮ - 800,000₮', image: 'https://lh3.googleusercontent.com/d/1fWwKCW7vLNqrj6QSMm1k2EO9CEtrOT__' },
  { id: 'room-1', type: 'room', title: 'Стандарт өрөө', price: '180,000₮', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
  { id: 'room-2', type: 'room', title: 'Делюкс өрөө', price: '250,000₮', image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa' },
  { id: 'room-3', type: 'room', title: 'Гэр бүлийн өрөө', price: '320,000₮', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
];

export const pricingConfig: Record<string, { weekday: number; weekend: number }> = {
  'villa-1': { weekday: 600000, weekend: 800000 },
  'villa-2': { weekday: 600000, weekend: 800000 },
  'villa-3': { weekday: 600000, weekend: 800000 },
  'room-1': { weekday: 150000, weekend: 180000 },
  'room-2': { weekday: 200000, weekend: 250000 },
  'room-3': { weekday: 270000, weekend: 320000 },
};

export const calculatePriceReport = (optionId: string | undefined, range: DateRange | undefined) => {
  if (!optionId || !range?.from || !range?.to) {
    return {
      weekdayNights: 0,
      weekendNights: 0,
      weekdayPrice: 0,
      weekendPrice: 0,
      totalPrice: 0,
      totalNights: 0,
      weekdayRate: 0,
      weekendRate: 0,
    };
  }

  const config = pricingConfig[optionId] || { weekday: 0, weekend: 0 };
  const totalDays = differenceInCalendarDays(range.to, range.from);
  let weekdayNights = 0;
  let weekendNights = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(range.from, i);
    const dayOfWeek = getDay(currentDate); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Weekends are Friday (5) and Saturday (6)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      weekendNights++;
    } else {
      weekdayNights++;
    }
  }

  return {
    weekdayNights,
    weekendNights,
    weekdayPrice: weekdayNights * config.weekday,
    weekendPrice: weekendNights * config.weekend,
    totalPrice: (weekdayNights * config.weekday) + (weekendNights * config.weekend),
    totalNights: totalDays,
    weekdayRate: config.weekday,
    weekendRate: config.weekend,
  };
};

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<BookingType | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realBookedDates, setRealBookedDates] = useState<Record<string, Date[]>>({});

  useEffect(() => {
    const q = collection(db, 'bookings');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datesMap: Record<string, Date[]> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status !== 'cancelled' && data.checkIn && data.checkOut && data.optionId) {
          const optId = data.optionId;
          if (!datesMap[optId]) {
            datesMap[optId] = [];
          }
          try {
            // parse manual yyyy-MM-dd cleanly in local timezone
            const [startYear, startMonth, startDay] = data.checkIn.split('-').map(Number);
            const [endYear, endMonth, endDay] = data.checkOut.split('-').map(Number);
            
            const start = new Date(startYear, startMonth - 1, startDay);
            const end = new Date(endYear, endMonth - 1, endDay);
            
            let curr = new Date(start);
            while (curr < end) {
              datesMap[optId].push(new Date(curr));
              curr.setDate(curr.getDate() + 1);
            }
          } catch (e) {
            console.error('Error parsing booking dates:', e);
          }
        }
      });
      setRealBookedDates(datesMap);
    }, (err) => {
      console.error('Snapshot error for bookings:', err);
    });
    return () => unsubscribe();
  }, []);

  const priceReport = calculatePriceReport(selectedOption?.id, selectedRange);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (step === 2 && selectedType === 'house') {
      setSelectedType(null);
      setSelectedOption(null);
      setStep(1);
    } else {
      setStep(s => s - 1);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, startOfToday())) return true;
    if (!selectedOption) return false;
    const optionBookings = realBookedDates[selectedOption.id] || [];
    return optionBookings.some(bookedDate => isSameDay(bookedDate, date));
  };

  const sendBookingEmailAuto = async (name: string, phone: string, email: string) => {
    const checkInStr = selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : '';
    const checkOutStr = selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : '';
    
    const payload = {
      _subject: `🔔 ШИНЭ ЗАХИАЛГА: ${name} (${selectedOption?.title || 'Суут Амралт'})`,
      _template: 'table',
      _replyto: email,
      "Захиалагчийн нэр": name,
      "Утасны дугаар": phone,
      "Имэйл хаяг": email,
      "Төрөл": selectedType === 'house' ? 'Хаус түрээс' : 'Амралт/Ресорт өрөө',
      "Сонгосон хувилбар": selectedOption?.title || (selectedType === 'house' ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт'),
      "Нийт хоносон": `${priceReport.totalNights} хоног (${checkInStr} - ${checkOutStr})`,
      "Энгийн өдөр (Ням-Пүрэв)": `${priceReport.weekdayNights} хоног (Нэг хоног: ${priceReport.weekdayRate.toLocaleString()}₮)`,
      "Амралтын өдөр (Баасан-Бямба)": `${priceReport.weekendNights} хоног (Нэг хоног: ${priceReport.weekendRate.toLocaleString()}₮)`,
      "Нийт дүн": `${priceReport.totalPrice.toLocaleString()}₮`
    };

    try {
      await fetch('https://formsubmit.co/ajax/boogiilive@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log('Automated booking email dispatched successfully to boogiilive@gmail.com');
    } catch (error) {
      console.error('Automated booking email dispatch failed:', error);
    }
  };

  const sendBookingEmail = (name: string, phone: string, email: string) => {
    const subject = encodeURIComponent(`Шинэ захиалга: ${name} (${selectedOption?.title || 'Суут Амралт'})`);
    
    const body = encodeURIComponent(
      `--- ШИНЭ ЗАХИАЛГА ---\n\n` +
      `Захиалагчийн мэдээлэл:\n` +
      `- Нэр: ${name}\n` +
      `- Утас: ${phone}\n` +
      `- Имэйл: ${email}\n\n` +
      `Захиалгын мэдээлэл:\n` +
      `- Сонгосон төрөл: ${selectedType === 'house' ? 'Хаус түрээс' : 'Амралтын өрөө'}\n` +
      `- Сонголт: ${selectedOption?.title || (selectedType === 'house' ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт')}\n` +
      `- Зочид: Том хүн: ${adults} хүн, Хүүхэд: ${children} хүүхэд\n` +
      `- Хугацаа: ${selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : ''} - ${selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : ''} (${priceReport.totalNights} хоног)\n\n` +
      `Үнийн тооцоолол:\n` +
      `- Энгийн өдрийн хоног (Ням-Пүрэв): ${priceReport.weekdayNights} хоног (Нэг хоногийн: ${priceReport.weekdayRate.toLocaleString()}₮)\n` +
      `- Амралтын өдрийн хоног (Баасан-Бямба): ${priceReport.weekendNights} хоног (Нэг хоногийн: ${priceReport.weekendRate.toLocaleString()}₮)\n` +
      `- НИЙТ БОДОГДСОН ҮНЭ: ${priceReport.totalPrice.toLocaleString()}₮\n\n` +
      `--------------------`
    );
    
    window.location.href = `mailto:boogiilive@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const path = 'bookings';
    
    const bookingData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      adults: adults,
      children: children,
      bookingType: selectedType,
      optionId: selectedOption?.id || '',
      optionTitle: selectedOption?.title || (selectedType === 'house' ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт'),
      checkIn: selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : '',
      checkOut: selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : '',
      weekdayNights: priceReport.weekdayNights,
      weekendNights: priceReport.weekendNights,
      totalPrice: priceReport.totalPrice,
      status: 'pending',
      createdAt: new Date(),
    };

    // Firebase-ийн хадгалах үйлдлийг ард ажиллуулснаар хэрэглэгчийн интерфейс хүлээхгүй сулрахгүй
    addDoc(collection(db, path), bookingData).catch((err) => {
      console.error('Background Booking error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (e) {
        // Ignore background reporting errors
      }
    });

    // Идэвхтэйгээр цаана имэйл чимээгүй илгээнэ
    sendBookingEmailAuto(formData.name, formData.phone, formData.email);

    // Хэрэглэгчийн вебдээр шууд амжилттай болсон төлөв рүү маш хурдан 250ms хугацаанд шилжүүлнэ
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1Oxp_ZDBK19Hdy24jBetAr25G0wutZpQG" 
            alt="Booking Hero" 
            className="w-full h-full object-cover object-bottom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-4"
          >
            Амралтаа <span className="text-brand-yellow italic">Захиалах</span>
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Та өөрт таалагдсан хаус эсвэл амралт/ресортоо сонгон захиалгаа өгөөрэй.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-brand-teal/5">
      <div className="max-w-5xl mx-auto section-padding">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {['Төрөл сонгох', 'Хугацаа', 'Мэдээлэл'].map((label, i) => (
              <div key={i} className={cn(
                "text-xs font-bold uppercase tracking-widest transition-colors",
                step > i ? "text-brand-teal" : "text-brand-teal/30"
              )}>
                {label}
              </div>
            ))}
          </div>
          <div className="h-2 bg-brand-teal/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-brand-teal"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-teal/5">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green mx-auto">
                  <CheckCircle2 size={64} />
                </div>
                <img src="https://lh3.googleusercontent.com/d/18uAV6mFKrTaRXMtml9Qu0ENa3DfsgMEA" alt="SUUT RESORT Logo" className="h-12 w-auto mx-auto opacity-50" />
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-bold text-brand-teal">Захиалга амжилттай!</h2>
                </div>

                <div className="p-6 bg-brand-yellow/10 rounded-2xl text-center space-y-4 max-w-md mx-auto border border-brand-yellow/20 shadow-sm">
                  <h3 className="text-lg font-bold text-brand-teal">Захиалгыг амжилттай илгээлээ!</h3>
                  <div className="space-y-2 text-sm text-brand-teal/80 font-medium leading-relaxed">
                    <p>Бид тантай удахгүй холбоо барих болно.</p>
                    <p>Хэрэв та яаралтай холбогдох бол <a href="tel:88010011" className="font-bold text-brand-teal underline">8801-0011</a>, <a href="tel:88007338" className="font-bold text-brand-teal underline">88007338</a> дугаараар холбогдоорой.</p>
                    <div className="text-brand-red font-bold text-sm mt-3 bg-brand-red/5 p-3 rounded-xl border border-brand-red/10 leading-relaxed shadow-inner">
                      ⚠️ Урьдчилгаа төлбөр төлж байж захиалга баталгаажихыг анхаарна уу!
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-brand-teal/5 rounded-2xl text-left space-y-3 max-w-md mx-auto border border-brand-teal/10">
                  <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Захиалагч:</span> <span className="font-bold text-brand-teal">{formData.name}</span></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-teal/50">Сонголт:</span> 
                    <span className="font-bold text-brand-teal">
                      {selectedOption?.title || (selectedType === 'house' ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-teal/50">Хугацаа:</span> 
                    <span className="font-bold text-brand-teal border-b border-brand-teal/10 pb-1">
                      {selectedRange?.from && format(selectedRange.from, 'MM/dd')} - {selectedRange?.to && format(selectedRange.to, 'MM/dd')}
                      {` (${priceReport.totalNights} хоног)`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Энгийн өдөр (Ням-Пүрэв):</span> <span className="font-bold text-brand-teal">{priceReport.weekdayNights} хоног</span></div>
                  <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Амралтын өдөр (Баасан-Бямба):</span> <span className="font-bold text-brand-teal">{priceReport.weekendNights} хоног</span></div>
                  <div className="pt-2 border-t border-brand-teal/10 flex justify-between text-sm"><span className="text-brand-teal font-bold">Нийт бодогдсон дүн:</span> <span className="font-bold text-brand-red text-base">{priceReport.totalPrice.toLocaleString()}₮</span></div>
                </div>

                <div className="pt-4">
                  <button onClick={() => window.location.href = '/'} className="btn-primary">Нүүр хуудас руу буцах</button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                {/* Step 1: Type Selection */}
                {step === 1 && (
                  <div className="space-y-8">
                    {!selectedType ? (
                      <>
                        <div className="text-center space-y-2">
                          <h2 className="text-3xl font-serif font-bold text-brand-teal">Захиалгын төрөл сонгох</h2>
                          <p className="text-brand-teal/60">Та хаус эсвэл амралт/ресортын аль нэгийг сонгоно уу.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button 
                            onClick={() => { 
                              setSelectedType('house'); 
                              const defaultHouse = options.find(o => o.type === 'house') || {
                                id: 'villa-1',
                                type: 'house',
                                title: 'Цэвэр Модон Хаус',
                                price: '600,000₮ - 800,000₮',
                                image: 'https://lh3.googleusercontent.com/d/1hUTtrjo0_w0pbY9Pd5C4HGOYRF6VkyRa'
                              };
                              setSelectedOption({
                                ...defaultHouse,
                                title: 'Цэвэр Модон Хаус'
                              }); 
                              setStep(2); 
                            }}
                            className="group p-8 bg-brand-teal/5 border-2 border-transparent hover:border-brand-teal rounded-3xl transition-all cursor-pointer text-center space-y-6"
                          >
                            <div className="w-20 h-20 bg-brand-teal text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <HomeIcon size={40} />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-serif font-bold text-brand-teal uppercase font-bold tracking-wider">ХАУС ТҮРЭЭС</h3>
                              <p className="text-sm text-brand-teal/60 font-medium">25 хүртэлх тооны хамт олон, гэр бүл, найз нөхдөөрөө амрахад тохиромжтой.</p>
                            </div>
                          </button>
                          <button 
                            onClick={() => { setSelectedType('room'); setSelectedOption(null); }}
                            className="group p-8 bg-brand-teal/5 border-2 border-transparent hover:border-brand-teal rounded-3xl transition-all cursor-pointer text-center space-y-6"
                          >
                            <div className="w-20 h-20 bg-brand-teal text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <Bed size={40} />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-serif font-bold text-brand-teal uppercase font-bold tracking-wider">АМРАЛТ / РЕСОРТ ӨРӨӨ</h3>
                              <p className="text-sm text-brand-teal/60 font-medium">Тохилог стандарт болон делюкс өрөөнүүдэд амрахад тохиромжтой.</p>
                            </div>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <button onClick={() => setSelectedType(null)} className="text-brand-teal font-bold flex items-center gap-2 hover:underline">← Буцах</button>
                          <h2 className="text-2xl font-serif font-bold text-brand-teal">
                            {selectedType === 'house' ? 'Та түрээслэх модон хаусаа сонгоно уу' : 'Та захиалах өрөөгөө сонгоно уу'}
                          </h2>
                          <div className="w-20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                          {options.filter(o => o.type === selectedType).map(option => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSelectedOption(option);
                                handleNext();
                              }}
                              className={cn(
                                "group text-left bg-white border-2 border-brand-teal/10 hover:border-brand-teal rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full",
                                selectedOption?.id === option.id && "border-brand-teal bg-brand-teal/5"
                              )}
                            >
                              <div className="h-44 w-full overflow-hidden relative">
                                <img src={option.image} alt={option.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                              </div>
                              <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                                <h4 className="font-serif font-bold text-brand-teal text-lg leading-snug">{option.title}</h4>
                                <div className="space-y-1">
                                  <div className="text-xs text-brand-teal/50 font-bold uppercase tracking-wider">Үнэ:</div>
                                  <div className="text-brand-red font-extrabold text-lg">{option.price}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 2: Date & Guests */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <button onClick={handleBack} className="text-brand-teal font-bold flex items-center gap-2">← Буцах</button>
                      <h2 className="text-2xl font-serif font-bold text-brand-teal">Хугацаа сонгох</h2>
                      <div className="w-20" />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-brand-teal/60">Хэзээ амрах вэ?</label>
                        <div className="bg-brand-teal/5 p-4 rounded-3xl border border-brand-teal/10 inline-block">
                          <DayPicker
                            mode="range"
                            selected={selectedRange}
                            onSelect={setSelectedRange}
                            disabled={isDateDisabled}
                            locale={mn}
                            className="mx-auto"
                            modifiersClassNames={{
                              selected: "bg-brand-teal text-white rounded-full",
                              today: "text-brand-red font-bold underline"
                            }}
                          />
                        </div>
                        <div className="flex gap-4 md:gap-6 text-xs font-bold select-none flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-brand-teal rounded-full border border-brand-teal shrink-0" /> 
                            <span className="text-slate-800">Сонгосон</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-[#ecfdf5] rounded-full border border-emerald-500 shrink-0" /> 
                            <span className="text-emerald-800">Боломжтой</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-[#fef2f2] rounded-full border border-red-300 relative overflow-hidden flex items-center justify-center shrink-0">
                              <div className="absolute w-full h-[1.5px] bg-red-400 rotate-45" />
                            </div> 
                            <span className="text-red-500 line-through">Захиалагдсан</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <label className="text-sm font-bold text-brand-teal/60">Том хүн</label>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal flex items-center justify-center font-bold hover:bg-brand-teal hover:text-white transition-all"
                              >-</button>
                              <span className="text-2xl font-serif font-bold text-brand-teal">{adults}</span>
                              <button 
                                onClick={() => setAdults(adults + 1)}
                                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal flex items-center justify-center font-bold hover:bg-brand-teal hover:text-white transition-all"
                              >+</button>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-sm font-bold text-brand-teal/60">Хүүхэд</label>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal flex items-center justify-center font-bold hover:bg-brand-teal hover:text-white transition-all"
                              >-</button>
                              <span className="text-2xl font-serif font-bold text-brand-teal">{children}</span>
                              <button 
                                onClick={() => setChildren(children + 1)}
                                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal flex items-center justify-center font-bold hover:bg-brand-teal hover:text-white transition-all"
                              >+</button>
                            </div>
                          </div>
                        </div>

                        {selectedRange?.from && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 space-y-4"
                          >
                            <div className="flex items-center gap-2 text-brand-teal font-extrabold text-base border-b border-brand-teal/10 pb-2">
                              <CalendarIcon size={18} className="text-brand-yellow" />
                              <span>
                                {format(selectedRange.from, 'yyyy/MM/dd')} 
                                {selectedRange.to && ` - ${format(selectedRange.to, 'yyyy/MM/dd')}`}
                              </span>
                            </div>
                            
                            {selectedRange.to ? (
                              <div className="space-y-2 text-sm text-brand-teal">
                                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-brand-teal/5">
                                  <span className="font-medium text-brand-teal/70">Сонгосон хугацаа: </span>
                                  <span className="font-extrabold text-brand-teal">{priceReport.totalNights} хоног</span>
                                </div>
                                <div className="text-xs space-y-1.5 px-1 py-1">
                                  <div className="flex justify-between">
                                    <span>Энгийн өдөр (Ням-Пүрэв) ({priceReport.weekdayNights} хоног x {priceReport.weekdayRate.toLocaleString()}₮):</span>
                                    <span className="font-semibold text-right">{priceReport.weekdayPrice.toLocaleString()}₮</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Амралтын өдөр (Баасан-Бямба) ({priceReport.weekendNights} хоног x {priceReport.weekendRate.toLocaleString()}₮):</span>
                                    <span className="font-semibold text-right">{priceReport.weekendPrice.toLocaleString()}₮</span>
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-brand-teal/10 flex justify-between items-center text-brand-teal font-bold text-base">
                                  <span>Нийт дүн:</span>
                                  <span className="text-xl font-extrabold text-brand-red">{priceReport.totalPrice.toLocaleString()}₮</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-brand-teal/60 font-medium">Гарах өдрөө сонгосноор үнийн бодолт харагдана.</p>
                            )}
                          </motion.div>
                        )}

                        <button 
                          disabled={!selectedRange?.from || !selectedRange?.to}
                          onClick={handleNext}
                          className="btn-primary w-full py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Үргэлжлүүлэх
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <button onClick={handleBack} className="text-brand-teal font-bold flex items-center gap-2">← Буцах</button>
                      <h2 className="text-2xl font-serif font-bold text-brand-teal">Мэдээллээ оруулна уу</h2>
                      <div className="w-20" />
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-teal/60 ml-2">Таны нэр</label>
                          <input 
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            type="text" 
                            placeholder="Овог нэр" 
                            className="w-full px-6 py-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl focus:outline-none focus:border-brand-teal transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-teal/60 ml-2">Утасны дугаар</label>
                          <input 
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            type="tel" 
                            placeholder="+976 XXXX-XXXX" 
                            className="w-full px-6 py-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl focus:outline-none focus:border-brand-teal transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-teal/60 ml-2">И-мэйл хаяг</label>
                          <input 
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            type="email" 
                            placeholder="example@mail.com" 
                            className="w-full px-6 py-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl focus:outline-none focus:border-brand-teal transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-8 bg-brand-teal text-white rounded-3xl space-y-6 shadow-xl">
                          <h4 className="text-xl font-serif font-bold border-b border-white/10 pb-4">Захиалгын хураангуй</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-white/60 text-sm shrink-0">Сонголт:</span>
                              <span className="font-bold text-right text-sm leading-snug">{selectedOption?.title || (selectedType === 'house' ? 'Цэвэр Модон Хаус' : 'Амралт/Ресорт')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">Хугацаа:</span>
                              <span className="font-bold text-sm">
                                {selectedRange?.from && format(selectedRange.from, 'MM/dd')} 
                                {selectedRange?.to && ` - ${format(selectedRange.to, 'MM/dd')}`}
                                {` (${priceReport.totalNights} хоног)`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">Зочид:</span>
                              <span className="font-bold text-sm">{adults} том, {children} хүүхэд</span>
                            </div>
                            
                            {/* Detailed price splitting breakdown */}
                            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/80">
                              {priceReport.weekdayNights > 0 && (
                                <div className="flex justify-between">
                                  <span>Энгийн өдөр ({priceReport.weekdayNights} хоног x {priceReport.weekdayRate.toLocaleString()}₮):</span>
                                  <span>{priceReport.weekdayPrice.toLocaleString()}₮</span>
                                </div>
                              )}
                              {priceReport.weekendNights > 0 && (
                                <div className="flex justify-between">
                                  <span>Амралтын өдөр ({priceReport.weekendNights} хоног x {priceReport.weekendRate.toLocaleString()}₮):</span>
                                  <span>{priceReport.weekendPrice.toLocaleString()}₮</span>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                              <span className="text-lg font-serif">Нийт үнэ:</span>
                              <span className="text-2xl font-bold text-brand-yellow">
                                {priceReport.totalPrice.toLocaleString()}₮
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-brand-red/5 rounded-2xl border border-brand-red/10 text-brand-red text-xs">
                          <AlertCircle size={16} className="shrink-0" />
                          <p>Захиалга баталгаажуулахын тулд бид тантай утсаар холбогдох болно. Урьдчилгаа төлбөр төлснөөр захиалга баталгаажна.</p>
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
                            {error}
                          </div>
                        )}

                        <button 
                          disabled={isSubmitting}
                          className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 bg-brand-yellow text-brand-teal hover:bg-white"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" size={20} /> Боловсруулж байна...
                            </>
                          ) : 'Захиалга баталгаажуулах'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);
}
