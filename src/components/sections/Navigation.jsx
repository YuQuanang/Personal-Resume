import React, { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { Magnetic } from '../ui/Magnetic';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection observer for active links
  useEffect(() => {
    const sectionEls = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navAnchors.forEach((a) => {
            if (a.getAttribute('href') === '#' + e.target.id) {
              a.classList.add('active');
            } else {
              a.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    
    sectionEls.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(targetId);
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.5 });
    }
  };

  return (
    <nav id="nav" className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Magnetic>
        <a href="#hero" className="nav-logo" data-cursor="link" onClick={(e) => handleLinkClick(e, '#hero')}>
          <span className="nav-logo-name">Yu Quan Ang</span>
          <span className="nav-logo-dot">®</span>
        </a>
      </Magnetic>
      <button 
        className={`nav-toggle ${menuOpen ? 'open' : ''}`} 
        id="nav-toggle" 
        aria-label="Toggle menu" 
        data-cursor="link"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span><span></span>
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
        <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>About</a></li>
        <li><a href="#experience" onClick={(e) => handleLinkClick(e, '#experience')}>Experience</a></li>
        <li><a href="#leadership" onClick={(e) => handleLinkClick(e, '#leadership')}>Leadership</a></li>
        <li><a href="#skills" onClick={(e) => handleLinkClick(e, '#skills')}>Skills</a></li>
        <li><a href="#projects" onClick={(e) => handleLinkClick(e, '#projects')}>Projects</a></li>
        <li><a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a></li>
      </ul>
    </nav>
  );
}
