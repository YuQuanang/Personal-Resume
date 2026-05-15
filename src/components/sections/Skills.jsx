import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Skills() {
  const sectionRef = useRef(null);

  useBidirScrollTrigger(sectionRef, {
    targets: '.section-number',
    hiddenVars: { opacity: 0, x: -32 },
    visibleVars: { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
  });

  useBidirScrollTrigger(sectionRef, {
    targets: '.section-title .split-line-inner',
    hiddenVars: { y: '110%' },
    visibleVars: { y: '0%', duration: 1.0, ease: 'power4.out', stagger: 0.1 }
  });

  useGSAP(() => {
    const cats = gsap.utils.toArray('.skill-category');
    
    cats.forEach((cat, i) => {
      gsap.set(cat, { opacity: 0, y: 28 });
      const tags = cat.querySelectorAll('.skill-tag');
      gsap.set(tags, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: cat,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          gsap.to(cat, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.08 });
          gsap.to(tags, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: i * 0.08 + 0.12 });
        },
        onEnterBack: () => {
          gsap.to(cat, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
          gsap.to(tags, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.1 });
        },
        onLeave: () => { gsap.set(cat, { opacity: 0, y: 28 }); gsap.set(tags, { opacity: 0, y: 16 }); },
        onLeaveBack: () => { gsap.set(cat, { opacity: 0, y: 28 }); gsap.set(tags, { opacity: 0, y: 16 }); },
      });
    });
  }, { scope: sectionRef });

  return (
    <section id="skills" className="section" data-section-id="skills" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">04</span>
          <h2 className="section-title reveal-lines">
            <SplitText>Skills &amp;</SplitText>
            <SplitText><em>Tools</em></SplitText>
          </h2>
        </div>
        <div className="skills-grid">
          <div className="skill-category reveal-item">
            <h3 className="skill-category-title">Languages</h3>
            <div className="skill-tags">
              <span className="skill-tag">Python</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">SQL</span>
              <span className="skill-tag">Solidity</span>
              <span className="skill-tag">HTML / CSS</span>
            </div>
          </div>

          <div className="skill-category reveal-item">
            <h3 className="skill-category-title">Frameworks &amp; Libraries</h3>
            <div className="skill-tags">
              <span className="skill-tag">React</span>
              <span className="skill-tag">Vue</span>
              <span className="skill-tag">Firebase</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Pandas</span>
              <span className="skill-tag">NumPy</span>
              <span className="skill-tag">Matplotlib</span>
              <span className="skill-tag">RestAPI</span>
            </div>
          </div>

          <div className="skill-category reveal-item">
            <h3 className="skill-category-title">Tools &amp; Platforms</h3>
            <div className="skill-tags">
              <span className="skill-tag">Git</span>
              <span className="skill-tag">Excel</span>
              <span className="skill-tag">Tableau</span>
              <span className="skill-tag">Microsoft Office Suite</span>
              <span className="skill-tag">Figma</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">Network Attached Storage(NAS)</span>
            </div>
          </div>

          <div className="skill-category reveal-item">
            <h3 className="skill-category-title">Methodologies</h3>
            <div className="skill-tags">
              <span className="skill-tag">Waterfall</span>
              <span className="skill-tag">Agile / Scrum</span>
              <span className="skill-tag">SDLC</span>
              <span className="skill-tag">UAT</span>
              <span className="skill-tag">Data Analytics</span>
              <span className="skill-tag">System Integration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
