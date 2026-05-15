import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringXY = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const LERP = 0.11;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    };

    const tick = () => {
      ringXY.x += (mouse.x - ringXY.x) * LERP;
      ringXY.y += (mouse.y - ringXY.y) * LERP;
      gsap.set(ring, { x: ringXY.x, y: ringXY.y });
    };

    const setCursorHover = (text = '') => {
      document.body.classList.add('cursor-hover');
      if (label) label.textContent = text;
    };
    
    const clearCursorHover = () => {
      document.body.classList.remove('cursor-hover');
      if (label) label.textContent = '';
    };

    const onMouseDown = () => {
      document.body.classList.add('cursor-drag');
      gsap.to(ring, { scale: 0.75, duration: 0.2, ease: 'power2.out' });
    };
    const onMouseUp = () => {
      document.body.classList.remove('cursor-drag');
      gsap.to(ring, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    gsap.ticker.add(tick);

    // Event delegation for links and interactive elements
    const onMouseOver = (e) => {
      const target = e.target.closest('a, .pill-link, button, .cta-button, .skill-tag, .project-card, [data-cursor="link"]');
      if (target) {
        if (target.classList.contains('project-card')) {
          setCursorHover('View');
        } else if (target.classList.contains('skill-tag') || target.tagName === 'BUTTON' || target.classList.contains('cta-button') || target.classList.contains('nav-toggle')) {
          setCursorHover('');
        } else {
          setCursorHover('→');
        }
      }
    };
    
    const onMouseOut = (e) => {
      const target = e.target.closest('a, .pill-link, button, .cta-button, .skill-tag, .project-card, [data-cursor="link"]');
      if (target) {
        clearCursorHover();
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" className="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" className="cursor-ring" ref={ringRef}>
        <span id="cursor-label" className="cursor-label" ref={labelRef}></span>
      </div>
    </>
  );
}
