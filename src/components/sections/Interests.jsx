import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';

export function Interests() {
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
    targets: '.interest-item',
    hiddenVars: { opacity: 0, y: 28 },
    visibleVars: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
  });

  return (
    <section id="interests" className="section" data-section-id="interests" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">06</span>
          <h2 className="section-title reveal-lines">
            <SplitText>Interests &amp;</SplitText>
            <SplitText><em>Beyond</em></SplitText>
          </h2>
        </div>
        <div className="interests-list">
          <div className="interest-item reveal-item">
            <span className="interest-icon">⛳</span>
            <div className="interest-body">
              <h3 className="interest-title">Golf</h3>
              <p className="interest-desc">A dedicated golfer and President of the NTU Golf Club. Drawn to the precision, strategy, and mental discipline the game demands, whether mapping out complex course strategies or working to beat my current personal best of 73.</p>
              <div className="interest-links">
                <a href="https://www.instagram.com/walterquan_/" target="_blank" rel="noopener noreferrer" className="interest-social" data-cursor="link" title="@walterquan_">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  <span>@walterquan_</span>
                </a>
              </div>
            </div>
          </div>

          <div className="interest-item reveal-item">
            <span className="interest-icon">📸</span>
            <div className="interest-body">
              <h3 className="interest-title">Landscape Photography</h3>
              <p className="interest-desc">Passionate about capturing the natural beauty of sweeping landscapes and golf courses. Armed with an Olympus Micro Four Thirds system, I enjoy exploring the technical interplay of light, framing, and glass to tell compelling visual stories.</p>
              <div className="interest-links">
                <a href="https://www.instagram.com/walterquanpics/" target="_blank" rel="noopener noreferrer" className="interest-social" data-cursor="link" title="@walterquanpics">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  <span>@walterquanpics</span>
                </a>
              </div>
            </div>
          </div>

          <div className="interest-item reveal-item">
            <span className="interest-icon">⛓️</span>
            <div className="interest-body">
              <h3 className="interest-title">Web3 &amp; Blockchain</h3>
              <p className="interest-desc">Fascinated by the future of decentralized finance and smart contract development. I enjoy building and deploying real-world applications on networks like Arbitrum, turning complex architecture into seamless, user-centric reward systems.</p>
            </div>
          </div>

          <div className="interest-item reveal-item">
            <span className="interest-icon">🏗️</span>
            <div className="interest-body">
              <h3 className="interest-title">Systems Analysis &amp; Product Management</h3>
              <p className="interest-desc">Passionate about understanding how complex technical systems—from intricate healthcare IT integrations to scalable consumer apps—fit together. Driven to bridge the gap between business strategy and technical execution to build products that genuinely impact people.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
