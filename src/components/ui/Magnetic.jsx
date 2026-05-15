import React, { useRef } from 'react';
import gsap from 'gsap';

export function Magnetic({ children }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (clientY - (rect.top + rect.height / 2)) * 0.35;
    gsap.to(ref.current, { x, y, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  // Merge incoming event handlers from children with our magnetic handlers
  const handleChildMouseMove = (e) => {
    if (children.props.onMouseMove) children.props.onMouseMove(e);
    handleMouseMove(e);
  };

  const handleChildMouseLeave = (e) => {
    if (children.props.onMouseLeave) children.props.onMouseLeave(e);
    handleMouseLeave(e);
  };

  return React.cloneElement(children, {
    ref,
    onMouseMove: handleChildMouseMove,
    onMouseLeave: handleChildMouseLeave,
  });
}
