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
