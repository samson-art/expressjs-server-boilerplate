import React, { useEffect, useRef } from 'react';

interface RickConfig {
  id: string;
  src: string;
  width: string;
  speedX: number;
  speedY: number;
  startX: number;
  startY: number;
  zIndex: number;
}

const rickConfigs: RickConfig[] = [
  {
    id: 'rick1',
    src: 'https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif',
    width: 'min(40vw, 300px)',
    speedX: 3,
    speedY: 3.5,
    startX: 50,
    startY: 50,
    zIndex: 2
  },
  {
    id: 'rick2',
    src: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExanZob3prZWFuOXh0bnUzdWptcWI0ZHo0OXE1YWJoeWppejNvN2EwOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tqI9aaw8dtoYM/giphy.gif',
    width: 'min(20vw, 150px)',
    speedX: -2.5,
    speedY: 4,
    startX: 200,
    startY: 100,
    zIndex: 3
  },
  {
    id: 'rick3',
    src: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHAxcnQ2YnZhM3B1cG1pYmx1djlpbHc2bmxuYzlsazY1c3dseTNvcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L3T7nKw5iftXeONnob/giphy.gif',
    width: 'min(15vw, 120px)',
    speedX: 4,
    speedY: -2.8,
    startX: 300,
    startY: 200,
    zIndex: 4
  },
  {
    id: 'rick4',
    src: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWZ5a2xoOWI4MWh4Zzc3Z25jZnI3Z2pydnUwY2t3eWlwdWh4bzZncSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5IcU1aAiinLLLb07iY/giphy.gif',
    width: 'min(12vw, 100px)',
    speedX: -3.2,
    speedY: -3,
    startX: 150,
    startY: 300,
    zIndex: 5
  },
  {
    id: 'rick5',
    src: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRobGtuNnVheW9wb3U2enlzOTR0dWpidWN2Z3dueW9ranpiNzljaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AmHgqpGdXWsCs/giphy.gif',
    width: 'min(10vw, 80px)',
    speedX: 2.8,
    speedY: 3.8,
    startX: 400,
    startY: 150,
    zIndex: 6
  },
  {
    id: 'rick6',
    src: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXRicnh0enZ5N3dwMnpicm5vOW1tN3J5bHExa2p2aXVzc3hlamhsNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cHrbvTUogC0EKxesJ0/giphy.gif',
    width: 'min(8vw, 60px)',
    speedX: -4.5,
    speedY: 2.2,
    startX: 500,
    startY: 80,
    zIndex: 7
  }
];

function RickRunner({ config }: { readonly config: RickConfig }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const img = imgRef.current;
    const stage = document.getElementById('stage');
    if (!img || !stage) return;

    let x = config.startX;
    let y = config.startY;
    let vx = config.speedX;
    let vy = config.speedY;
    let W = 0, H = 0, w = 0, h = 0;

    function measure() {
      W = stage?.clientWidth || 0;
      H = stage?.clientHeight || 0;
      w = img?.clientWidth || 200;
      h = img?.clientHeight || 200;
    }

    function clamp(n: number, min: number, max: number): number {
      return Math.max(min, Math.min(n, max));
    }

    function tick() {
      x += vx;
      y += vy;
      const mx = W - w;
      const my = H - h;
      
      if (x <= 0 || x >= mx) {
        vx *= -1;
        x = clamp(x, 0, mx);
      }
      if (y <= 0 || y >= my) {
        vy *= -1;
        y = clamp(y, 0, my);
      }
      
      if (img) {
        img.style.transform = `translate(${x}px, ${y}px)`;
      }
      animationRef.current = requestAnimationFrame(tick);
    }

    function onResize() {
      measure();
      x = clamp(x, 0, Math.max(0, W - w));
      y = clamp(y, 0, Math.max(0, H - h));
    }

    function onLoad() {
      measure();
      animationRef.current = requestAnimationFrame(tick);
    }

    img.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    
    if (img.complete) {
      measure();
      animationRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      img.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
    };
  }, [config]);

  return (
    <img
      ref={imgRef}
      id={config.id}
      alt="Never gonna give you up"
      src={config.src}
      style={{
        position: 'absolute',
        width: config.width,
        height: 'auto',
        filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.6))',
        userSelect: 'none',
        zIndex: config.zIndex
      }}
    />
  );
}

export function App(): React.ReactElement {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div 
        id="stage" 
        style={{
          position: 'fixed', 
          inset: 0, 
          width: '100vw', 
          height: '100vh', 
          background: '#000', 
          overflow: 'hidden'
        }}
      >
        {rickConfigs.map(config => (
          <RickRunner key={config.id} config={config} />
        ))}
        
        <iframe 
          title="Rick Astley - Never Gonna Give You Up"
          width="100%" 
          height="300" 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 1
          }}
          allow="autoplay" 
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1242868615&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
        ></iframe>
      </div>
    </div>
  );
} 

