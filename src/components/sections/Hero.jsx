import React, { useRef, useEffect, useState } from 'react';
import { SplitText } from '../ui/SplitText';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Hero() {
  const container = useRef(null);
  const [timeStr, setTimeStr] = useState('—');

  useEffect(() => {
    const updateClock = () => {
      setTimeStr(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1);
    tl.to('.hero-title-line .split-line-inner', { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.12 }, 0.3);
    tl.to('.hero-tagline', { opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.85);
    tl.to(['.hero-scroll-indicator', '.hero-meta'], { opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 1.1);
    gsap.to('.scroll-arrow', { y: 8, opacity: 0.4, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 1.8 });
  }, { scope: container });

  return (
    <section id="hero" className="hero section" ref={container}>
      <div className="hero-bg-overlay"></div>
      <div className="hero-content">
        <p className="hero-eyebrow reveal-line" style={{ opacity: 0, transform: 'translateY(20px)' }}>
          Computer Science &amp; Business · Blockchain · Golf · Photography
        </p>
        <h1 className="hero-title">
          <span className="hero-title-line">
            <span className="split-line">
              <span className="split-line-inner" style={{ transform: 'translateY(110%)' }}>
                <span className="reveal-mask"><em>Yu</em> Quan</span>
              </span>
            </span>
          </span>
          <span className="hero-title-line">
            <span className="split-line">
              <span className="split-line-inner" style={{ transform: 'translateY(110%)' }}>
                <span className="reveal-mask">Ang.</span>
              </span>
            </span>
          </span>
        </h1>
        <p className="hero-tagline reveal-line" style={{ opacity: 0 }}>
          Building data-driven solutions and bridging technology with business strategy.
        </p>
      </div>
      <div className="hero-scroll-indicator" style={{ opacity: 0 }}>
        <span>Scroll to explore</span>
        <div className="scroll-arrow">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none"><path d="M8 0v20M1 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div className="hero-meta" style={{ opacity: 0 }}>
        <span>Singapore</span>
        <span className="hero-meta-sep">·</span>
        <span>{timeStr}</span>
      </div>
    </section>
  );
}
