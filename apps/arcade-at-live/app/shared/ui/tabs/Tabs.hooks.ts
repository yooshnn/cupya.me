import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Manages horizontal scroll state and expose scroll actions.
 * Tracks whether the element can be scrolled left or right and updates on resize/scroll.
 */
export function useScrollable() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el)
      return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el)
      return;

    el.addEventListener('scroll', updateScrollState, { passive: true });

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });
    observer.observe(el);

    const rafId = requestAnimationFrame(() => {
      updateScrollState();
    });

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [updateScrollState]);

  function handleScrollLeft() {
    if (!scrollRef.current)
      return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - scrollRef.current.clientWidth,
      behavior: 'smooth',
    });
  }

  function handleScrollRight() {
    if (!scrollRef.current)
      return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + scrollRef.current.clientWidth,
      behavior: 'smooth',
    });
  }

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    handleScrollLeft,
    handleScrollRight,
  };
}
