import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, isSameDay, isBefore, startOfToday, addDays } from 'date-fns';
import { mn } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Home as HomeIcon, Bed, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

// Firebase imports
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  { id: 'villa-1', type: 'house', title: 'Тансаг зэрэглэлийн Вилла', price: '450,000₮', image: 'https://lh3.googleusercontent.com/d/15Bp6lMsOa5kELfVPEmG2xtgv0AwlaNJN' },
  { id: 'villa-2', type: 'house', title: 'Ой модны Вилла', price: '350,000₮', image: 'https://lh3.googleusercontent.com/d/1OWnzvTHAaMOfQ3l0IsMxayzXi6bhNkfd' },
  { id: 'villa-3', type: 'house', title: 'Гэр бүлийн Вилла', price: '280,000₮', image: 'https://lh3.googleusercontent.com/d/1tiyuEYQ8eHZlLsFng6zYfMCytWSmJha2' },
  { id: 'room-1', type: 'room', title: 'Стандарт өрөө', price: '180,000₮', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
  { id: 'room-2', type: 'room', title: 'Делюкс өрөө', price: '250,000₮', image: 'https://lh3.googleusercontent.com/d/1mu0C8z2FhG7HJF6vuVEItWV-O2WDkFYa' },
  { id: 'room-3', type: 'room', title: 'Гэр бүлийн өрөө', price: '320,000₮', image: 'https://lh3.googleusercontent.com/d/1zoXTewURVSFqXbQvarGOUJV046P0J0DU' },
];

// Mock booked dates
const mockBookedDates = [
  addDays(new Date(), 2),
  addDays(new Date(), 3),
  addDays(new Date(), 7),
  addDays(new Date(), 8),
  addDays(new Date(), 9),
];

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

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday()) || mockBookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        adults: adults,
        children: children,
        optionId: selectedOption?.id,
        optionTitle: selectedOption?.title,
        checkIn: selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : '',
        checkOut: selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Захиалга хийхэд алдаа гарлаа. Та дахин оролдоно уу.');
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
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
            Та өөрт таалагдсан хаус эсвэл өрөөгөө сонгон захиалгаа өгөөрэй.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-brand-teal/5">
      <div className="max-w-5xl mx-auto section-padding">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {['Төрөл сонгох', 'Сонголт', 'Хугацаа', 'Мэдээлэл'].map((label, i) => (
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
              animate={{ width: `${(step / 4) * 100}%` }}
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
                  <p className="text-brand-teal/60 max-w-md mx-auto">
                    Таны захиалгыг бид хүлээн авлаа. Бид тантай утсаар холбогдож захиалгыг баталгаажуулах болно.
                  </p>
                </div>
                  <div className="p-6 bg-brand-teal/5 rounded-2xl text-left space-y-3 max-w-md mx-auto border border-brand-teal/10">
                    <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Захиалагч:</span> <span className="font-bold text-brand-teal">{formData.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Сонголт:</span> <span className="font-bold text-brand-teal">{selectedOption?.title}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Хугацаа:</span> <span className="font-bold text-brand-teal">
                      {selectedRange?.from && format(selectedRange.from, 'MM/dd')} - {selectedRange?.to && format(selectedRange.to, 'MM/dd')}
                    </span></div>
                    <div className="flex justify-between text-sm"><span className="text-brand-teal/50">Зочид:</span> <span className="font-bold text-brand-teal">{adults} том хүн, {children} хүүхэд</span></div>
                  </div>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Нүүр хуудас руу буцах</button>
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
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-serif font-bold text-brand-teal">Захиалгын төрөл сонгох</h2>
                      <p className="text-brand-teal/60">Та хаус эсвэл өрөөний аль нэгийг сонгоно уу.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button 
                        onClick={() => { setSelectedType('house'); handleNext(); }}
                        className="group p-8 bg-brand-teal/5 border-2 border-transparent hover:border-brand-teal rounded-3xl transition-all text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-brand-teal text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <HomeIcon size={40} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-serif font-bold text-brand-teal uppercase">ХАУС</h3>
                          <p className="text-sm text-brand-teal/60">Гэр бүл, найз нөхдөөрөө амрахад тохиромжтой.</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedType('room'); handleNext(); }}
                        className="group p-8 bg-brand-teal/5 border-2 border-transparent hover:border-brand-teal rounded-3xl transition-all text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-brand-teal text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Bed size={40} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-serif font-bold text-brand-teal uppercase">ӨРӨӨ</h3>
                          <p className="text-sm text-brand-teal/60">Хосоороо эсвэл цөөнүүлээ амрахад тохиромжтой.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Option Selection */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <button onClick={handleBack} className="text-brand-teal font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">← Буцах</button>
                      <h2 className="text-2xl font-serif font-bold text-brand-teal">Сонголт хийх</h2>
                      <div className="w-20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {options.filter(o => o.type === selectedType).map(option => (
                        <button 
                          key={option.id}
                          onClick={() => { setSelectedOption(option); handleNext(); }}
                          className={cn(
                            "group text-left bg-white border-2 rounded-2xl overflow-hidden transition-all",
                            selectedOption?.id === option.id ? "border-brand-teal shadow-xl" : "border-brand-teal/5 hover:border-brand-teal/30"
                          )}
                        >
                          <div className="h-40 overflow-hidden">
                            <img src={option.image} alt={option.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-brand-teal">{option.title}</h4>
                            <p className="text-brand-green font-bold">{option.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Guests */}
                {step === 3 && (
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
                        <div className="flex gap-6 text-xs font-medium">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-teal rounded-full" /> Сонгосон</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-teal/10 rounded-full" /> Боломжтой</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-full" /> Захиалагдсан</div>
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
                            className="p-6 bg-brand-yellow/10 rounded-2xl border border-brand-yellow/20 space-y-2"
                          >
                            <div className="flex items-center gap-2 text-brand-teal font-bold">
                              <CalendarIcon size={18} />
                              <span>
                                {format(selectedRange.from, 'MM/dd')} 
                                {selectedRange.to && ` - ${format(selectedRange.to, 'MM/dd')}`}
                              </span>
                            </div>
                            <p className="text-sm text-brand-teal/60">Таны сонгосон хугацаанд захиалга авах боломжтой байна.</p>
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

                {/* Step 4: Contact Info */}
                {step === 4 && (
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
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">Сонголт:</span>
                              <span className="font-bold">{selectedOption?.title}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">Хугацаа:</span>
                              <span className="font-bold">
                                {selectedRange?.from && format(selectedRange.from, 'MM/dd')} 
                                {selectedRange?.to && ` - ${format(selectedRange.to, 'MM/dd')}`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">Зочид:</span>
                              <span className="font-bold">{adults} том, {children} хүүхэд</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                              <span className="text-lg font-serif">Нийт үнэ:</span>
                              <span className="text-2xl font-bold text-brand-yellow">{selectedOption?.price}</span>
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
