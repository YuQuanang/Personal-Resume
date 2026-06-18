import React, { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Components
import { CustomCursor } from './components/ui/CustomCursor';
import { Navigation } from './components/sections/Navigation';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Leadership } from './components/sections/Leadership';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Interests } from './components/sections/Interests';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { ChatWidget } from './components/ui/ChatWidget';

function Layout() {
  const parallaxRef = useRef(null);
  const lenis = useLenis();

  // Parallax background
  useEffect(() => {
    if (!lenis || !parallaxRef.current) return;
    
    const onScroll = ({ scroll, limit }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      const bgY = 20 + progress * 60;
      parallaxRef.current.style.backgroundPositionY = bgY + '%';
    };
    
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis]);

  // Skew effect
  useGSAP(() => {
    if (!lenis) return;
    
    let skewSetter = gsap.quickSetter('.section', 'skewY', 'deg');
    let clampSkew = gsap.utils.clamp(-2.5, 2.5);

    let skewResetTimeout;
    const onScroll = (e) => {
      skewSetter(clampSkew(e.velocity * 0.05));

      clearTimeout(skewResetTimeout);
      skewResetTimeout = setTimeout(() => {
        gsap.to('.section', { skewY: 0, duration: 0.8, ease: 'power3.out', overwrite: true });
      }, 160);
    };
    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
      clearTimeout(skewResetTimeout);
    };
  }, [lenis]);

  return (
    <>
      <div id="parallax-bg" className="parallax-bg" ref={parallaxRef}></div>
      <CustomCursor />
      <div id="curtain" className="curtain"></div>
      
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Experience />
        <Leadership />
        <Skills />
        <Projects />
        <Interests />
        <Contact />
      </main>
      
      <Footer />

      {/* Floating AI chat assistant — fixed position, renders above all content */}
      <ChatWidget />
    </>
  );
}

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }} autoRaf={false} ref={lenisRef}>
      <Layout />
    </ReactLenis>
  );
}

export default App;
