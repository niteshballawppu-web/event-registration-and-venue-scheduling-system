/**
 * Color Tokens & Category Styling System
 * Provides rich multi-color palette definitions for institutional categories,
 * status indicators, venues, and visual tags.
 */

export type AppTheme = 'VIBRANT_MULTI' | 'OCEAN_CYAN' | 'ROYAL_VIOLET' | 'EMERALD_ACADEMIC' | 'SUNSET_WARM';

export interface CategoryColorDef {
  bgLight: string;
  bgSolid: string;
  border: string;
  text: string;
  textDark: string;
  gradient: string;
  badge: string;
  ring: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColorDef> = {
  'CAT-01': {
    // Workshops & Labs: Azure & Electric Cyan
    bgLight: 'bg-cyan-50/90',
    bgSolid: 'bg-cyan-600',
    border: 'border-cyan-300',
    text: 'text-cyan-700',
    textDark: 'text-cyan-950',
    gradient: 'from-cyan-500 via-teal-500 to-blue-600',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    ring: 'focus:ring-cyan-500'
  },
  'CAT-02': {
    // Seminars & Symposia: Royal Violet & Purple
    bgLight: 'bg-violet-50/90',
    bgSolid: 'bg-violet-600',
    border: 'border-violet-300',
    text: 'text-violet-700',
    textDark: 'text-violet-950',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    badge: 'bg-violet-50 text-violet-800 border-violet-200',
    ring: 'focus:ring-violet-500'
  },
  'CAT-03': {
    // Guest Lectures: Amber & Sunset Orange
    bgLight: 'bg-amber-50/90',
    bgSolid: 'bg-amber-500',
    border: 'border-amber-300',
    text: 'text-amber-800',
    textDark: 'text-amber-950',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    ring: 'focus:ring-amber-500'
  },
  'CAT-04': {
    // Cultural Fest & Arts: Rose & Vivid Pink
    bgLight: 'bg-rose-50/90',
    bgSolid: 'bg-rose-500',
    border: 'border-rose-300',
    text: 'text-rose-700',
    textDark: 'text-rose-950',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    ring: 'focus:ring-rose-500'
  },
  'CAT-05': {
    // Hackathons & Summits: Emerald & Vibrant Mint
    bgLight: 'bg-emerald-50/90',
    bgSolid: 'bg-emerald-600',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    textDark: 'text-emerald-950',
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    ring: 'focus:ring-emerald-500'
  }
};

export const DEFAULT_CATEGORY_COLOR: CategoryColorDef = {
  bgLight: 'bg-indigo-50/90',
  bgSolid: 'bg-indigo-600',
  border: 'border-indigo-300',
  text: 'text-indigo-700',
  textDark: 'text-indigo-950',
  gradient: 'from-indigo-500 to-blue-600',
  badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  ring: 'focus:ring-indigo-500'
};

export function getCategoryStyle(categoryId?: string): CategoryColorDef {
  if (!categoryId) return DEFAULT_CATEGORY_COLOR;
  return CATEGORY_COLORS[categoryId] || DEFAULT_CATEGORY_COLOR;
}

export const VENUE_COLOR_MAP: Record<string, { badge: string; text: string; dot: string }> = {
  'VEN-01': { badge: 'bg-blue-50 border-blue-200 text-blue-700', text: 'text-blue-700', dot: 'bg-blue-500' },
  'VEN-02': { badge: 'bg-teal-50 border-teal-200 text-teal-700', text: 'text-teal-700', dot: 'bg-teal-500' },
  'VEN-03': { badge: 'bg-pink-50 border-pink-200 text-pink-700', text: 'text-pink-700', dot: 'bg-pink-500' },
  'VEN-04': { badge: 'bg-amber-50 border-amber-200 text-amber-700', text: 'text-amber-700', dot: 'bg-amber-500' },
  'VEN-05': { badge: 'bg-purple-50 border-purple-200 text-purple-700', text: 'text-purple-700', dot: 'bg-purple-500' },
};
