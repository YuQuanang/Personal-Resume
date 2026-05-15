import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';

export function Leadership() {
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

  useBidirScrollTrigger(sectionRef, {
    targets: '.timeline-item',
    hiddenVars: { opacity: 0, y: 36 },
    visibleVars: { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08 }
  });

  return (
    <section id="leadership" className="section section--alt" data-section-id="leadership" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">03</span>
          <h2 className="section-title reveal-lines">
            <SplitText>Leadership</SplitText>
            <SplitText><em>Experience</em></SplitText>
          </h2>
        </div>
        <div className="timeline">
          <div className="timeline-item reveal-item">
            <div className="timeline-meta">
              <span className="timeline-date">Aug 2023 — Jun 2024</span>
              <span className="timeline-type">President</span>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-role">President</h3>
              <p className="timeline-company">NTU Golf Club</p>
              <ul className="timeline-points">
                <li>Spearheaded revitalisation of the Golf Club by implementing 3 new engagement strategies, elevating member experience and growing engagement levels</li>
                <li>Organised tournaments and networking sessions for over 200 members across special occasions and club events</li>
                <li>Coordinated equipment procurement and inventory management, ensuring seamless operations during training sessions and events</li>
                <li>Led a 12-person EXCO team through club hosting events and strategic planning meetings</li>
              </ul>
              <div className="timeline-tags">
                <span className="tag">Leadership</span>
                <span className="tag">Event Management</span>
                <span className="tag">200+ Members</span>
                <span className="tag">Strategy</span>
              </div>
            </div>
          </div>

          <div className="timeline-item reveal-item">
            <div className="timeline-meta">
              <span className="timeline-date">Sep 2022 — Aug 2023</span>
              <span className="timeline-type">Captain</span>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-role">Captain</h3>
              <p className="timeline-company">NTU Golf Club</p>
              <ul className="timeline-points">
                <li>Led strategic planning of weekly training programmes for over 200 members, focusing on individual skill improvement and team cohesion</li>
                <li>Curated proposals for university-level events and managed business relations with external stakeholders</li>
                <li>Grew club membership by 20% by partnering with an external coaching school to raise player quality</li>
                <li>Delivered effective coaching and communication during weekly training sessions</li>
              </ul>
              <div className="timeline-tags">
                <span className="tag">Coaching</span>
                <span className="tag">Stakeholder Management</span>
                <span className="tag">Training</span>
                <span className="tag">Growth +20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
