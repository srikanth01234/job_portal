import React, { useEffect, useRef, useState } from 'react';

/**
 * RevealOnScroll Component
 * Smooth, hardware-accelerated scroll reveal animation for page sections.
 * Triggers when the user scrolls to each section.
 *
 * @param {React.ReactNode} children - Elements to animate
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Animation delay in milliseconds (default: 0)
 * @param {string} direction - 'up' | 'down' | 'left' | 'right' | 'none' (default: 'up')
 * @param {number} distance - Movement distance in pixels (default: 36)
 * @param {number} duration - Transition duration in ms (default: 850)
 * @param {number} threshold - Intersection threshold 0 to 1 (default: 0.12)
 */
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 36,
  duration = 850,
  threshold = 0.12,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold]);

  // Compute transform offsets based on direction
  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={elementRef} style={style} className={`w-full ${className}`}>
      {children}
    </div>
  );
}
