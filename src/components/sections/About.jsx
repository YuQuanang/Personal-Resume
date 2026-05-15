import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';

export function About() {
  const sectionRef = useRef(null);

  // Use bidir scroll triggers for elements inside this section
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

  useBidirScrollTrigger(sectionRef, {
    targets: '.about-lead, .about-body',
    hiddenVars: { opacity: 0, y: 32 },
    visibleVars: { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
  });

  useBidirScrollTrigger(sectionRef, {
    targets: '.about-links',
    hiddenVars: { opacity: 0, y: 20 },
    visibleVars: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  });

  useBidirScrollTrigger(sectionRef, {
    targets: '.fact',
    hiddenVars: { opacity: 0, x: 20 },
    visibleVars: { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
  });

  useBidirScrollTrigger(sectionRef, {
    targets: '.about-photo-frame',
    hiddenVars: { clipPath: 'inset(100% 0 0 0)' },
    visibleVars: { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' }
  });

  return (
    <section id="about" className="section section--alt" data-section-id="about" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">01</span>
          <h2 className="section-title reveal-lines">
            <SplitText>About</SplitText>
            <SplitText><em>Me</em></SplitText>
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-bio">
            <p className="about-lead reveal-lines">
              Hi, I'm <strong>Yu Quan Ang</strong> — a recent Computer Science Graduate from Nanyang Technological University with a Second Major in Business.
            </p>
            <p className="about-body reveal-lines">
              I'm passionate about leveraging technology to solve real-world problems, with hands-on experience in system integration, data analytics, and software development across healthcare and government sectors. From deploying enterprise healthcare platforms to automating data pipelines at the Land Transport Authority, I bring both technical depth and strong cross-functional communication to every team I join.
            </p>
            <p className="about-body reveal-lines">
              Beyond the screen, I've led the NTU Golf Club as President — organising events for over 200 members and building a team culture grounded in inclusivity and continuous improvement.
            </p>
            <div className="about-links reveal-fade">
              <a href="mailto:angyuquan12@gmail.com" className="pill-link" title="angyuquan12@gmail.com">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                angyuquan12@gmail.com
              </a>
              <a href="tel:+6598681152" className="pill-link" title="+65 9868 1152">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 16.92z"/></svg>
                +65 9868 1152
              </a>
              <a href="https://github.com/YuQuanang" target="_blank" rel="noopener noreferrer" className="pill-link pill-link--icon" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/yuquanang/" target="_blank" rel="noopener noreferrer" className="pill-link pill-link--icon" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM6.84 20.45H3.84V9h3v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
              </a>
              <a href="https://www.instagram.com/walterquan_/" target="_blank" rel="noopener noreferrer" className="pill-link pill-link--icon" title="@walterquan_">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>
          <div className="about-sidebar">
            <div className="about-photo-frame reveal-fade">
              <img src="images/profile.jpg" alt="Yu Quan Ang" className="about-photo" />
            </div>
            <div className="about-facts reveal-fade">
              <div className="fact">
                <span className="fact-label">Degree</span>
                <span className="fact-value">BSc Computer Science, 2nd Major Business</span>
              </div>
              <div className="fact">
                <span className="fact-label">University</span>
                <span className="fact-value">Nanyang Technological University</span>
              </div>
              <div className="fact">
                <span className="fact-label">GPA</span>
                <span className="fact-value">4.37 / 5.0</span>
              </div>
              <div className="fact">
                <span className="fact-label">Graduated</span>
                <span className="fact-value">May 2026</span>
              </div>
              <div className="fact">
                <span className="fact-label">Status</span>
                <span className="fact-value fact-value--green">Open to opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
