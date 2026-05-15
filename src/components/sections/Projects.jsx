import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';

export function Projects() {
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
    targets: '.project-card',
    hiddenVars: { clipPath: 'inset(100% 0 0 0)', opacity: 1, y: 0 },
    visibleVars: { clipPath: 'inset(0% 0 0 0)', opacity: 1, y: 0, duration: 0.95, ease: 'power4.inOut', stagger: 0.1 }
  });

  return (
    <section id="projects" className="section section--alt" data-section-id="projects" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">05</span>
          <h2 className="section-title reveal-lines">
            <SplitText>Selected</SplitText>
            <SplitText><em>Projects</em></SplitText>
          </h2>
        </div>
        <div className="projects-grid projects-grid--3">
          <article className="project-card reveal-item" data-cursor="link">
            <div className="project-card-inner">
              <div className="project-card-front">
                <div className="project-number">001 · Final Year Project</div>
                <h3 className="project-title">ShiokPay</h3>
                <p className="project-tech">React · Solidity · Arbitrum · IPFS · Goldsky</p>
              </div>
              <div className="project-card-overlay">
                <p className="project-desc">Blockchain cashback rewards DApp on Arbitrum Sepolia hosting hundreds of users. Solo PM — defined the MVP roadmap translating user reward incentives into smart contract logic and 5 functional DApp features.</p>
                <div className="project-links">
                  <a href="https://github.com/YuQuanang/FYP2025" className="project-link project-link--icon" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article className="project-card reveal-item" data-cursor="link">
            <div className="project-card-inner">
              <div className="project-card-front">
                <div className="project-number">002 · Frontend Developer</div>
                <h3 className="project-title">SIAM FEE</h3>
                <p className="project-tech">Vue.js · Firebase · REST APIs · UX Design</p>
              </div>
              <div className="project-card-overlay">
                <p className="project-desc">Real-time carpark finder solving high urban parking costs. Integrated datasets from multiple third-party APIs into a pricing &amp; availability dashboard with 100% feature parity across desktop and mobile.</p>
                <div className="project-links">
                  <a href="https://github.com/YuQuanang/SC2006_SWE_Project" className="project-link project-link--icon" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article className="project-card reveal-item" data-cursor="link">
            <div className="project-card-inner">
              <div className="project-card-front">
                <div className="project-number">003 · Full-Stack &amp; AI</div>
                <h3 className="project-title">PAaaS</h3>
                <p className="project-tech">React · Node.js · LangGraph · Llama 3.1 · OAuth</p>
              </div>
              <div className="project-card-overlay">
                <p className="project-desc">Personal Assistant-as-a-Service. Local LLM (Llama 3.1 via Ollama) orchestrated with LangGraph — translating natural-language prompts into API calls across Calendar, Tasks, and Email via Google OAuth.</p>
                <div className="project-links">
                  <a href="https://github.com/YuQuanang/PersonalAssistant-As-a-Service" className="project-link project-link--icon" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
