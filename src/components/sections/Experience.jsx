import React, { useRef } from 'react';
import { useBidirScrollTrigger } from '../../hooks/useBidirScrollTrigger';
import { SplitText } from '../ui/SplitText';

export function Experience() {
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
    <section id="experience" className="section" data-section-id="experience" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-number reveal-fade">02</span>
          <h2 className="section-title reveal-lines">
            <SplitText>Internship</SplitText>
            <SplitText><em>Experience</em></SplitText>
          </h2>
        </div>
        <div className="timeline">
          <div className="timeline-item reveal-item">
            <div className="timeline-meta">
              <span className="timeline-date">Jan 2025 — Jun 2025</span>
              <span className="timeline-type">Internship</span>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-role">System Analyst Intern</h3>
              <p className="timeline-company">Synexe</p>
              <ul className="timeline-points">
                <li>Led system integration of the NGEMR platform with SingHealth's Queue Management System, coordinating technical requirements across multiple stakeholder groups</li>
                <li>Orchestrated cross-functional collaboration with vendors and clinical users, driving 100% on-time delivery using waterfall project methodology</li>
                <li>Managed full-cycle SDLC activities spanning requirements gathering, system integration, deployment, and stakeholder alignment across concurrent workstreams</li>
                <li>Reduced implementation delays by 20% against baseline KPIs through parallel workstream management and process optimisation</li>
              </ul>
              <div className="timeline-tags">
                <span className="tag">SDLC</span>
                <span className="tag">System Integration</span>
                <span className="tag">Waterfall PM</span>
                <span className="tag">Healthcare IT</span>
              </div>
            </div>
          </div>

          <div className="timeline-item reveal-item">
            <div className="timeline-meta">
              <span className="timeline-date">May 2024 — Jul 2024</span>
              <span className="timeline-type">Internship</span>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-role">Data Analyst Intern</h3>
              <p className="timeline-company">Land Transport Authority</p>
              <ul className="timeline-points">
                <li>Partnered with data engineers to analyse, visualise, and present operational data via Python-powered dashboards, enabling data-driven decision-making for engineering and management teams</li>
                <li>Automated and streamlined legacy Python data pipelines, significantly reducing analysis turnaround time and freeing engineering bandwidth for higher-value tasks</li>
                <li>Fostered cross-functional alignment by presenting analytical findings in weekly stand-ups with engineering teams and senior management, consistently meeting tight delivery deadlines</li>
              </ul>
              <div className="timeline-tags">
                <span className="tag">Python</span>
                <span className="tag">Data Pipelines</span>
                <span className="tag">Dashboards</span>
                <span className="tag">SQL</span>
              </div>
            </div>
          </div>

          <div className="timeline-item reveal-item">
            <div className="timeline-meta">
              <span className="timeline-date">Feb 2022 — Jul 2022</span>
              <span className="timeline-type">Internship</span>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-role">UAT Tester</h3>
              <p className="timeline-company">NETS</p>
              <ul className="timeline-points">
                <li>Collaborated in a cross-functional team diagnosing and evaluating UAT systems, ensuring reliability and functionality through structured test cases</li>
                <li>Demonstrated technical aptitude working across different systems, platforms, and applications with a team of 4 members</li>
                <li>Leveraged Excel for test data management, result analysis, and reporting</li>
                <li>Identified and documented defects leading to multiple defect resolutions, improving system usability</li>
              </ul>
              <div className="timeline-tags">
                <span className="tag">UAT</span>
                <span className="tag">Test Cases</span>
                <span className="tag">Excel</span>
                <span className="tag">QA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
