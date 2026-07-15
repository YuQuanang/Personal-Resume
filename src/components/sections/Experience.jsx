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
                <li>Worked closely with Supervisor &amp; 4 Software Engineers to lead system integration of the new NGEMR platform with the SingHealth Queue Management System, impacting 5,000 daily users and reducing system downtime by 15%</li>
                <li>Orchestrated cross-functional collaboration with vendors and clinical users, driving system upgrades and software deployments with 100% on-time delivery using waterfall project methodology</li>
                <li>Managed partial SDLC activities, delivering integration milestones 10% ahead of schedule and coordinating a team of 4</li>
                <li>Reduced implementation delays by 20% against baseline KPIs by maintaining parallel workstreams and applying process optimisations to adapt to evolving scope changes under tight deadlines</li>
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
                <li>Partnered with data engineers to analyse over 2 million operational data records using Jupyter Notebooks, applying Python-based regression models to drive evidence-based traffic signal timing changes that improved traffic flow at key intersections</li>
                <li>Automated and streamlined legacy Python data pipelines, cutting analysis turnaround time by 40% and freeing up engineering bandwidth for higher-value tasks</li>
                <li>Fostered cross-functional alignment by presenting analytical findings in weekly stand-ups across 2 functional teams, consistently achieving 100% on-time delivery of all analysis milestones</li>
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
              <h3 className="timeline-role">User Acceptance Test Intern</h3>
              <p className="timeline-company">NETS</p>
              <ul className="timeline-points">
                <li>Collaborated as an integral member of a cross-functional team, executing over 100 UAT test cases daily with a ~5% defect detection rate, contributing to progressive reduction in system defects through timely issue reporting</li>
                <li>Utilised multiple UAT equipment and tools, demonstrating strong technical aptitude and adaptability while working with a team of four members</li>
                <li>Acquired expertise in Excel to manage over 100 test records daily, automating data input processes to reduce manual typing time by 10% and accelerate test turnaround</li>
                <li>Identified and contributed to the resolution of 5 critical defects, improving overall system usability and reliability prior to production release</li>
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
