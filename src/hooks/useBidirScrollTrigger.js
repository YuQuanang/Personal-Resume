import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useBidirScrollTrigger(triggerRef, options) {
  const {
    targets, // optional string or element array
    hiddenVars,
    visibleVars,
    resetVars,
    start = 'top bottom',
    end = 'bottom top',
    delay = 0,
    dependencies = []
  } = options;

  useGSAP(() => {
    if (!triggerRef.current) return;
    
    const els = targets ? gsap.utils.toArray(targets) : triggerRef.current;
    const reset = resetVars || { ...hiddenVars, duration: undefined, delay: undefined, stagger: undefined };

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      onEnter: () => gsap.to(els, { ...visibleVars, delay }),
      onEnterBack: () => gsap.to(els, { ...visibleVars, delay: 0 }),
      onLeave: () => gsap.set(els, reset),
      onLeaveBack: () => gsap.set(els, reset),
    });
  }, { scope: triggerRef, dependencies: [...dependencies] });
}
