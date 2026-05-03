import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: any, currency: string = 'USD') {
  const numericAmount = typeof amount === 'number' ? amount : 0;
  if (isNaN(numericAmount)) return '0.00';
  
  const locale = currency === 'PHP' ? 'en-PH' : 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(numericAmount);
  } catch (e) {
    return numericAmount.toFixed(2);
  }
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
