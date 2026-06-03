import { useState, useEffect, useRef } from 'react';
import { registerUser } from '../api/auth';

const TASKS = [
  { id: 'wires',     name: 'Fix wiring',      icon: '⚡' },
  { id: 'swipe',     name: 'Card swipe',       icon: '💳' },
  { id: 'reactor',   name: 'Reactor startup',  icon: '☢️' },
  { id: 'upload',    name: 'Upload data',      icon: '📡' },
  { id: 'asteroids', name: 'Shoot asteroids',  icon: '☄️' },
];

const COLORS = [
  { hex: '#ef4444', name: 'Red'    },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#eab308', name: 'Yellow' },
  { hex: '#22c55e', name: 'Green'  },
  { hex: '#06b6d4', name: 'Cyan'   },
  { hex: '#3b82f6', name: 'Blue'   },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#ec4899', name: 'Pink'   },
  { hex: '#ffffff', name: 'White'  },
  { hex: '#6b7280', name: 'Grey'   },
];

function AnimatedBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;
    const blobs = [
      { x: 0.15, y: 0.3,  r: 320, color: '#4c1d95', speed: 0.0008 },
      { x: 0.85, y: 0.7,  r: 280, color: '#7c1d4f', speed: 0.001  },
      { x: 0.5,  y: 0.85, r: 250, color: '#1e1b4b', speed: 0.0012 },
      { x: 0.7,  y: 0.2,  r: 200, color: '#312e81', speed: 0.0009 },
    ];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function draw() {
      t += 1;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      blobs.forEach((b, i) => {
        const ox = Math.sin(t * b.speed + i * 1.2) * 80;
        const oy = Math.cos(t * b.speed * 0.8 + i * 0.9) * 60;
        const cx = b.x * canvas.width + ox;
        const cy = b.y * canvas.height + oy;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        grad.addColorStop(0, b.color + 'cc');
        grad.addColorStop(1, b.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />;
}

export default function SetupPage({ username, name, surname, onConfirm, onBack }) {
  const [sequence,      setSequence]      = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);

  function toggleTask(id) {
    setSequence(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
    setError('');
  }

  const canSubmit = sequence.length === 3 && selectedColor !== '';

  async function handleConfirm() {
    if (sequence.length !== 3) return setError('Pick exactly 3 tasks.');
    if (!selectedColor) return setError('Pick a crewmate color.');
    setLoading(true);
    setError('');
    try {
      const result = await registerUser(username, selectedColor, sequence, { name, surname });
      if (!result.ok) {
        setError(result.msg || result.message || 'Registration failed. Please try again.');
      } else {
        onConfirm(sequence);
      }
    } catch {
      setError('Could not connect to server. Is your backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      position: 'relative',
      zIndex: 1,
      padding: '24px 16px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
        .task-row { transition: all 0.2s; }
        .task-row:hover { background: rgba(124,106,247,0.15) !important; border-color: rgba(124,106,247,0.5) !important; }
        .ss-btn { transition: all 0.2s; }
        .ss-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .ss-btn:active:not(:disabled) { transform: scale(0.98); }
        .color-dot { transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
        .color-dot:hover { transform: scale(1.15); }
      `}</style>

      <AnimatedBackground />

      <div style={{
        background: 'rgba(20, 18, 32, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '32px 36px',
        width: '100%',
        maxWidth: 480,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}>

       
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
            Set your task sequence
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            Pick a crewmate color and 3 tasks in order
          </p>
        </div>

       
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 0.3 }}>
            CREWMATE COLOR
            {selectedColor && (
              <span style={{ marginLeft: 8, color: selectedColor, fontWeight: 900 }}>
                ● {COLORS.find(c => c.hex === selectedColor)?.name}
              </span>
            )}
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <div
                key={c.hex}
                className="color-dot"
                title={c.name}
                onClick={() => { setSelectedColor(c.hex); setError(''); }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: c.hex,
                  border: selectedColor === c.hex
                    ? '3px solid #fff'
                    : '3px solid transparent',
                  boxShadow: selectedColor === c.hex
                    ? `0 0 0 2px ${c.hex}, 0 0 12px ${c.hex}88`
                    : '0 2px 6px rgba(0,0,0,0.4)',
                  transform: selectedColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

       
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 6,
        }}>
          {sequence.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No tasks selected yet</span>
          ) : (
            sequence.map((id, i) => {
              const t = TASKS.find(x => x.id === id);
              return (
                <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>→</span>}
                  <span style={{
                    background: 'rgba(124,106,247,0.3)',
                    border: '1px solid rgba(124,106,247,0.5)',
                    borderRadius: 8,
                    padding: '3px 10px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#c4b5fd',
                  }}>
                    {t.icon} {t.name}
                  </span>
                </span>
              );
            })
          )}
        </div>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {TASKS.map(t => {
            const isSelected = sequence.includes(t.id);
            const isDisabled = !isSelected && sequence.length >= 3;
            return (
              <div
                key={t.id}
                className="task-row"
                onClick={() => !isDisabled && toggleTask(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: isSelected
                    ? '1.5px solid rgba(124,106,247,0.6)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  background: isSelected
                    ? 'rgba(124,106,247,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  opacity: isDisabled ? 0.35 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.75)' }}>
                  {t.icon} {t.name}
                </span>
                {isSelected && (
                  <span style={{
                    background: 'rgba(124,106,247,0.5)',
                    borderRadius: 20,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 900,
                    color: '#fff',
                  }}>
                    #{sequence.indexOf(t.id) + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

       
        {error && (
          <p style={{ margin: '0 0 16px', color: '#f87171', fontSize: 13, textAlign: 'center' }}>
            {error}
          </p>
        )}

       
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="ss-btn"
            onClick={onBack}
            style={{
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Back
          </button>
          <button
            className="ss-btn"
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            style={{
              flex: 1,
              padding: '12px 0',
              background: canSubmit
                ? 'linear-gradient(135deg, #7c6af7, #a855f7)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 10,
              color: canSubmit ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: 15,
              fontWeight: 800,
              cursor: !canSubmit || loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 0.3,
            }}
          >
            {loading ? 'Saving…' : 'Lock in sequence →'}
          </button>
        </div>
      </div>
    </div>
  );
}
