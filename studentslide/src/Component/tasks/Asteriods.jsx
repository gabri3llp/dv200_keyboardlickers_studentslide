import { useState, useEffect, useRef, useCallback } from 'react';

const ROCK_TYPES = ['🪨', '☄️', '🌑', '💫', '🌒'];
const TOTAL_ROCKS = 10;

function makeRock(id) {
  return {
    id,
    emoji: ROCK_TYPES[Math.floor(Math.random() * ROCK_TYPES.length)],
    x: Math.random() * 82 + 4,      
    y: Math.random() * 60 + 10,     
    size: Math.random() * 14 + 22,  
    spin: (Math.random() - 0.5) * 2,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    opacity: 1,
    hit: false,
  };
}

export default function Asteroids({ onComplete }) {
  const [rocks, setRocks]       = useState(() => Array.from({ length: TOTAL_ROCKS }, (_, i) => makeRock(i)));
  const [exploding, setExploding] = useState([]);
  const [destroyed, setDestroyed] = useState(0);
  const [done, setDone]         = useState(false);
  const frameRef                = useRef(null);
  const rocksRef                = useRef(rocks);
  rocksRef.current              = rocks;

  
  useEffect(() => {
    let t = 0;
    function tick() {
      t += 0.5;
      setRocks(prev => prev.map(r => {
        if (r.hit) return r;
        let nx = r.x + r.vx;
        let ny = r.y + r.vy;
        let nvx = r.vx, nvy = r.vy;
        if (nx < 2 || nx > 92) nvx = -nvx;
        if (ny < 2 || ny > 82) nvy = -nvy;
        return { ...r, x: nx, y: ny, vx: nvx, vy: nvy };
      }));
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  function hitRock(id, e) {
    e.stopPropagation();
    const rock = rocksRef.current.find(r => r.id === id);
    if (!rock || rock.hit) return;

    
    setExploding(prev => [...prev, { id: Math.random(), x: rock.x, y: rock.y }]);
    setTimeout(() => setExploding(prev => prev.slice(1)), 600);

    setRocks(prev => prev.map(r => r.id === id ? { ...r, hit: true, opacity: 0 } : r));

    setDestroyed(prev => {
      const next = prev + 1;
      if (next >= TOTAL_ROCKS) {
        setDone(true);
        setTimeout(onComplete, 700);
      }
      return next;
    });
  }

  const remaining = TOTAL_ROCKS - destroyed;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.icon}>☄️</span>
        <div style={{ flex: 1 }}>
          <div style={styles.title}>Shoot Asteroids</div>
          <div style={styles.sub}>Tap each asteroid to destroy it</div>
        </div>
        <div style={{
          ...styles.counter,
          color: remaining === 0 ? '#22c97a' : remaining <= 3 ? '#f7b731' : '#a594f9',
        }}>
          {remaining === 0 ? '✓ Clear!' : `${remaining} left`}
        </div>
      </div>

    
      <div style={styles.field}>
       
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: 'white',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
          }} />
        ))}

       
        {rocks.map(r => (
          <button
            key={r.id}
            onClick={(e) => hitRock(r.id, e)}
            style={{
              position: 'absolute',
              left: `${r.x}%`,
              top: `${r.y}%`,
              fontSize: r.size,
              background: 'none',
              border: 'none',
              cursor: r.hit ? 'default' : 'crosshair',
              padding: 0,
              lineHeight: 1,
              opacity: r.hit ? 0 : 1,
              transform: `rotate(${r.spin * 20}deg) scale(${r.hit ? 0.1 : 1})`,
              transition: r.hit ? 'opacity 0.2s ease, transform 0.2s ease' : 'none',
              userSelect: 'none',
              zIndex: 2,
              filter: r.hit ? 'none' : 'drop-shadow(0 0 6px rgba(247,183,49,0.4))',
            }}
          >
            {r.emoji}
          </button>
        ))}

       
        {exploding.map(ex => (
          <div key={ex.id} style={{
            position: 'absolute',
            left: `${ex.x}%`,
            top: `${ex.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: 24,
            pointerEvents: 'none',
            animation: 'explode 0.5s ease-out forwards',
            zIndex: 3,
          }}>
            💥
          </div>
        ))}

        
        {!done && (
          <div style={{
            position: 'absolute', inset: 0,
            cursor: 'crosshair',
            zIndex: 1,
          }} />
        )}

        {done && (
          <div style={styles.clearBanner}>
            <span style={{ fontSize: 28 }}>🚀</span>
            <span>Field clear!</span>
          </div>
        )}
      </div>

      
      <div style={styles.progressWrap}>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${(destroyed / TOTAL_ROCKS) * 100}%`,
            background: done
              ? 'linear-gradient(90deg, #22c97a, #4af7a0)'
              : 'linear-gradient(90deg, #f7b731, #f75a5a)',
          }} />
        </div>
        <div style={styles.progressLabel}>
          {destroyed}/{TOTAL_ROCKS} destroyed
        </div>
      </div>

      <style>{`
        @keyframes explode {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          50%  { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrap: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 20px 16px',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
  },
  icon: { fontSize: 28 },
  title: { fontSize: 15, fontWeight: 600, color: '#e8e8f0' },
  sub: { fontSize: 12, color: '#9898b0', marginTop: 2 },
  counter: {
    fontFamily: 'monospace', fontSize: 14, fontWeight: 700,
    minWidth: 60, textAlign: 'right',
    transition: 'color 0.3s',
  },
  field: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: 'radial-gradient(ellipse at center, #0d0d1a 0%, #07070f 100%)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  clearBanner: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10,
    background: 'rgba(34,201,122,0.1)',
    color: '#22c97a',
    fontSize: 18, fontWeight: 700,
    animation: 'fadeIn 0.3s ease',
    zIndex: 4,
  },
  progressWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  progressTrack: {
    flex: 1, height: 5,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    transition: 'width 0.2s ease, background 0.5s',
  },
  progressLabel: {
    fontSize: 11, color: '#55556a',
    fontFamily: 'monospace', whiteSpace: 'nowrap',
  },
};
