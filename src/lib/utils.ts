import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // If already a direct Google drive web content/lh3 link or already has direct access:
  if (trimmed.includes('lh3.googleusercontent.com') || trimmed.includes('docs.google.com/uc')) {
    return trimmed;
  }
  
  // 1. Match typical Google Drive file viewing link:
  // https://drive.google.com/file/d/1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4/view?usp=sharing
  const fileIdMatch1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch1 && fileIdMatch1[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch1[1]}`;
  }
  
  // 2. Match open id format:
  // https://drive.google.com/open?id=1XNwVkLgLtv9jaAbq1qAEBYOjoxx4PHP4
  const fileIdMatch2 = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch2 && fileIdMatch2[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch2[1]}`;
  }
  
  return trimmed;
}

export function safeToDate(val: any): Date {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') {
    try {
      return val.toDate();
    } catch (e) {
      console.warn("Error calling toDate on field:", e);
    }
  }
  if (val instanceof Date) {
    return val;
  }
  if (val.seconds !== undefined && typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000);
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/\./g, '-').replace(/-+$/, '').trim();
    const parsedCleanup = new Date(cleaned);
    if (!isNaN(parsedCleanup.getTime())) {
      return parsedCleanup;
    }
  }
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatLocaleDate(val: any, options?: Intl.DateTimeFormatOptions): string {
  const date = safeToDate(val);
  try {
    return date.toLocaleDateString('mn-MN', options);
  } catch (e) {
    try {
      return date.toLocaleDateString('en-US', options);
    } catch (err) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }
}


