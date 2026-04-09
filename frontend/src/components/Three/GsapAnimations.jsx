import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useHeroAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero__badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.hero__title', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.hero__desc', {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
      });

      gsap.from('.hero__stats .hero__stat', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};
