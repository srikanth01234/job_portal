/**
 * Jobhub Design System - Color Palette & Theme Tokens
 * Centralized theme colors for reusability across components
 */

export const colors = {
  // Brand Colors
  primary: {
    DEFAULT: '#7B61FF', // Signature Jobhub purple for CTA buttons & active states
    hover: '#6A4EF5',
    light: '#F3F0FF',
    soft: 'rgba(123, 97, 255, 0.1)',
  },
  
  brandBlue: {
    DEFAULT: '#2563EB', // Blue arch backdrop in hero
    light: '#3B82F6',
    dark: '#1D4ED8',
    soft: '#EFF6FF',
  },

  // Hero Background
  hero: {
    bg: '#FAF7F2', // Warm cream background container
    bgSoft: '#FBF9F5',
  },

  // Status & Badges
  status: {
    success: '#10B981', // Best Jobs Place badge dot, checkmark
    successLight: '#ECFDF5',
    cyan: '#06B6D4',
    orange: '#F97316',
    amber: '#F59E0B',
    purple: '#8B5CF6',
  },

  // Neutrals & Text
  neutral: {
    heading: '#101828', // Primary headings
    body: '#475467',    // Paragraph / descriptions
    muted: '#98A2B3',   // Placeholders, subtle captions
    border: '#EAECF0',  // Dividers & card outlines
    white: '#FFFFFF',
    surface: '#F8F9FA',
  },

  // Logo Accent Dots (The 4 signature dots in Jobhub logo)
  logoDots: {
    mint: '#00D09C',
    blue: '#0075FF',
    coral: '#FF5E5E',
    yellow: '#FFAE00',
  },
};

export default colors;
