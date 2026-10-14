/**
 * Stark Jobs Design System - Connected to src/index.css
 * To change colors, simply edit src/index.css -- all values update automatically!
 */

export const colors = {
  // Primary: Deep Navy
  primary: {
    DEFAULT: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
    light: 'var(--color-primary-light)',
    soft: 'rgba(23, 62, 104, 0.08)',
  },
  
  // Accent: Teal
  accent: {
    DEFAULT: 'var(--color-accent)',
    hover: 'var(--color-accent-hover)',
    light: 'var(--color-accent-light)',
    border: 'var(--color-accent-border)',
    soft: 'rgba(15, 139, 141, 0.1)',
  },

  // Backgrounds
  background: {
    DEFAULT: '#FFFFFF',
    secondary: 'var(--color-secondary-bg)',
    card: '#FFFFFF',
  },

  // Status & Badges
  status: {
    success: 'var(--color-accent)',
    successLight: 'var(--color-accent-light)',
    amber: '#D97706',
    amberLight: '#FEF3C7',
    slate: 'var(--color-muted-text)',
  },

  // Neutrals & Text
  neutral: {
    heading: 'var(--color-main-text)',
    body: 'var(--color-muted-text)',
    muted: '#6B7280',
    border: 'var(--color-card-border)',
    white: '#FFFFFF',
    surface: 'var(--color-secondary-bg)',
  },
};

export default colors;
