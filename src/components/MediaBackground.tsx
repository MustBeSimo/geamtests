// MediaBackground.tsx – v11  (with dynamic GSAP imports)
// ---------------------------------------------------------------------
// • Stripes now twice as tall: 22 vh desktop, 20 vh mobile
// • Added loading state to prevent layout shifts
// • Dynamic GSAP imports for better bundle splitting
// ---------------------------------------------------------------------

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

/* ─── Tunables ─────────────────────────────────────────────── */
const CARD_ASPECT = 0.33; // width = height × 0.33  (portrait)
const DESKTOP_ROW_H = 22; // ↑ doubled from 11 vh
const MOBILE_ROW_H = 20; // ↑ doubled from 10 vh
const SPEED_PX_SEC = 38; // marquee speed
const FADE_DURATION = 0.75; // crossfade duration in seconds

/* Types */
interface MediaItem {
  url: string;
  type: 'image' | 'video';
}
interface Props {
  className?: string;
}

/* Helpers */
const layout = () => {
  const mobile = window.innerWidth < 640;
  const ROW_H = mobile ? MOBILE_ROW_H : DESKTOP_ROW_H;
  const rowsNeeded = Math.ceil(100 / ROW_H) + 1; // fill viewport
  return { ROW_H, rowsNeeded };
};

const fillRow = (items: MediaItem[], cardW: number, vw: number) => {
  const minWidth = vw * 2;
  const out: MediaItem[] = [];
  let i = 0,
    w = 0;
  while (w < minWidth) {
    const it = items[i % items.length];
    if (it) out.push(it);
    w += cardW;
    i++;
  }
  return out;
};

export default function MediaBackground({ className }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [rows, setRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const rowHRef = useRef<number>(DESKTOP_ROW_H);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const tlRefs = useRef<any[]>([]);

  // Dynamic GSAP import
  useEffect(() => {
    const loadGsap = async () => {
      try {
        const { gsap } = await import('gsap');
        // Store gsap reference for later use
        (window as any).__gsap = gsap;
        setGsapLoaded(true);
      } catch (error) {
        console.error('Failed to load GSAP:', error);
        setGsapLoaded(false);
      }
    };

    loadGsap();
  }, []);

  /* Fetch */
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => {
        setMedia(d.items ?? []);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  }, []);

  /* Layout on resize */
  useEffect(() => {
    const recalc = () => {
      const { ROW_H, rowsNeeded } = layout();
      rowHRef.current = ROW_H;
      setRows(rowsNeeded);
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  /* Build rows */
  useEffect(() => {
    if (!media.length || !rows || !gsapLoaded) return;

    const gsap = (window as any).__gsap;
    if (!gsap) return;

    const vw = window.innerWidth;
    const ROW_H = rowHRef.current;
    const stripeH = (ROW_H / 100) * window.innerHeight;
    const cardW = stripeH * CARD_ASPECT;

    if (tlRefs.current.length < rows) tlRefs.current.length = rows;

    rowRefs.current.slice(0, rows).forEach((row, idx) => {
      if (!row) return;
      tlRefs.current[idx]?.kill();
      row.innerHTML = '';

      const seq = fillRow(media, cardW, vw);

      seq.forEach((item, i) => {
        const holder = document.createElement('div');
        holder.className = 'relative h-full flex-none overflow-hidden';
        holder.style.width = `${cardW}px`;

        if (item.type === 'video') {
          // Lazy-load videos only when row is near viewport
          const v = document.createElement('video');
          v.src = item.url;
          v.loop = v.autoplay = v.muted = true;
          v.playsInline = true;
          v.preload = 'none';
          v.className = 'w-full h-full object-cover';
          holder.appendChild(v);
        } else {
          // Serve downscaled images using CDN query param (example: ?w=cardW)
          // If using Vercel Image Optimization, swap for <Image />
          const img = document.createElement('img');
          img.src = item.url.includes('?')
            ? `${item.url}&w=${Math.round(cardW)}`
            : `${item.url}?w=${Math.round(cardW)}`;
          img.width = Math.round(cardW);
          img.height = Math.round(stripeH);
          img.decoding = 'async';
          img.className = 'w-full h-full object-cover';
          // Priority-load first 2 images in first row
          if (idx === 0 && i < 2) {
            img.loading = 'eager';
            (img as any).fetchPriority = 'high';
          } else {
            img.loading = 'lazy';
            (img as any).fetchPriority = 'auto';
          }
          holder.appendChild(img);
        }
        row.appendChild(holder);
      });

      // IntersectionObserver to lazy-load videos in this row
      const rowIO = new window.IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) {
            (
              row.querySelectorAll(
                'video[preload="none"]'
              ) as NodeListOf<HTMLVideoElement>
            ).forEach((v) => {
              v.preload = 'metadata';
              v.load();
            });
            rowIO.disconnect();
          }
        },
        { rootMargin: '600px' }
      );
      rowIO.observe(row);

      const dir = idx % 2 ? 1 : -1;
      const dist = row.scrollWidth;
      const dur = dist / SPEED_PX_SEC;
      const tl = gsap.timeline({
        repeat: -1,
        defaults: {
          ease: 'none',
          immediateRender: true,
        },
      });

      // Create a crossfade effect
      tl.to(row, {
        x: dir * -dist,
        duration: dur,
        onUpdate: () => {
          // Add smooth easing for opacity transitions
          row.querySelectorAll('img, video').forEach((el) => {
            const element = el as HTMLElement;
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const fadeZone = viewportWidth * 0.1; // 10% of viewport for fade

            if (rect.right < fadeZone) {
              element.style.opacity = String(rect.right / fadeZone);
            } else if (rect.left > viewportWidth - fadeZone) {
              element.style.opacity = String(
                (viewportWidth - rect.left) / fadeZone
              );
            } else {
              element.style.opacity = '1';
            }
          });
        },
      });

      tlRefs.current[idx] = tl;
    });
  }, [media, rows, gsapLoaded]);

  /* Render */
  const ROW_H = rowHRef.current;

  if (isLoading || !gsapLoaded) {
    return (
      <div id="bg-marquee" className={cn('fixed inset-0 z-0', className)}>
        <div className="relative w-full h-full overflow-hidden">
          {/* Loading skeleton */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>

            {/* Animated loading bars */}
            <div className="absolute inset-0 flex flex-col">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="bg-marquee" className={cn('fixed inset-0 z-0', className)}>
      <div className="relative w-full h-full overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (rowRefs.current[i] = el!)}
            className="absolute w-full flex gap-0 will-change-transform"
            style={{ top: `${i * ROW_H}vh`, height: `${ROW_H}vh` }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
      </div>
    </div>
  );
}
