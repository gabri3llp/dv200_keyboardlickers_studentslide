import { useState, useEffect, useRef } from 'react';
import { loginUser } from '../api/auth';
import Wires from "../Components/tasks/Wires";
import Swipe from "../Components/tasks/Swipe";
import Reactor from "../Components/tasks/Reactor";
import Upload from "../Components/tasks/Upload";
import Asteroids from "../Components/tasks/Asteriods";

const TASK_MAP = { wires: Wires, swipe: Swipe, reactor: Reactor, upload: Upload, asteroids: Asteroids };

const ALL_TASKS = [
  { id: 'wires',     name: 'Fix wiring',     icon: '⚡' },
  { id: 'swipe',     name: 'Card swipe',      icon: '💳' },
  { id: 'reactor',   name: 'Reactor startup', icon: '☢️' },
  { id: 'upload',    name: 'Upload data',     icon: '📡' },
  { id: 'asteroids', name: 'Shoot asteroids', icon: '☄️' },
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

export default function TasksPage({ mode, username, color, sequence, onSuccess, onFail }) {
  const [pickedSequence, setPickedSequence] = useState(mode === 'register' ? sequence : []);
  const [taskIndex, setTaskIndex]           = useState(0);
  const [started, setStarted]               = useState(mode === 'register');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [loginColor, setLoginColor]           = useState('');

  function handleLoginSequencePick(id) {
    setPickedSequence(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  async function handleTaskComplete() {
    const next = taskIndex + 1;
    if (next < pickedSequence.length) {
      setTaskIndex(next);
    } else {
      setLoading(true);
      const result = await loginUser(username, mode === 'login' ? loginColor : color, pickedSequence);
      setLoading(false);
      if (result.ok) {
        localStorage.setItem('crewmart_token', result.token);
        onSuccess(result.user);
      } else {
        setError(result.msg || result.message || 'Wrong sequence. Try again.');
        setTimeout(onFail, 2000);
      }
    }
  }

  const sharedWrapper = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    position: 'relative',
    zIndex: 1,
    padding: '24px 16px',
  };

  const card = {
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
  };

  // Pick sequence screen
  if (!started) {
    return (
      <div style={sharedWrapper}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
          .task-row { transition: all 0.2s; }
          .task-row:hover { background: rgba(124,106,247,0.15) !important; border-color: rgba(124,106,247,0.5) !important; }
          .ss-btn { transition: all 0.2s; }
          .ss-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
          .ss-btn:active:not(:disabled) { transform: scale(0.98); }
        `}</style>
        <AnimatedBackground />

        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              Complete your tasks
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              Select your 3 tasks in the order you set during registration
            </p>
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
            {pickedSequence.length === 0 ? (
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No tasks selected yet</span>
            ) : (
              pickedSequence.map((id, i) => {
                const t = ALL_TASKS.find(x => x.id === id);
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
            {ALL_TASKS.map(t => {
              const isSelected = pickedSequence.includes(t.id);
              const isDisabled = !isSelected && pickedSequence.length >= 3;
              return (
                <div
                  key={t.id}
                  className="task-row"
                  onClick={() => !isDisabled && handleLoginSequencePick(t.id)}
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
                      #{pickedSequence.indexOf(t.id) + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>


         
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 0.3 }}>
              CREWMATE COLOR
              {loginColor && (
                <span style={{ marginLeft: 8, color: loginColor, fontWeight: 900 }}>
                  ● {COLORS.find(c => c.hex === loginColor)?.name}
                </span>
              )}
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <div
                  key={c.hex}
                  title={c.name}
                  onClick={() => setLoginColor(c.hex)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c.hex,
                    border: loginColor === c.hex ? '3px solid #fff' : '3px solid transparent',
                    boxShadow: loginColor === c.hex ? `0 0 0 2px ${c.hex}, 0 0 12px ${c.hex}88` : '0 2px 6px rgba(0,0,0,0.4)',
                    transform: loginColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            className="ss-btn"
            disabled={pickedSequence.length !== 3 || !loginColor}
            onClick={() => setStarted(true)}
            style={{
              width: '100%',
              padding: '13px 0',
              background: pickedSequence.length === 3 && loginColor
                ? 'linear-gradient(135deg, #7c6af7, #a855f7)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 10,
              color: pickedSequence.length === 3 && loginColor ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: 15,
              fontWeight: 800,
              cursor: pickedSequence.length !== 3 || !loginColor ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 0.3,
            }}
          >
            Start tasks →
          </button>
        </div>
      </div>
    );
  }

  // ── Task execution screen ────────────────────────────────────────────────
  const currentId = pickedSequence[taskIndex];
  const TaskComponent = TASK_MAP[currentId];

  return (
    <div style={sharedWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
      `}</style>
      <AnimatedBackground />

      <div style={{ ...card, maxWidth: 560 }}>
       
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
            {pickedSequence.map((id, i) => {
              const t = ALL_TASKS.find(x => x.id === id);
              const isDone   = i < taskIndex;
              const isActive = i === taskIndex;
              return (
                <div key={id} style={{
                  flex: 1,
                  padding: '8px 6px',
                  borderRadius: 10,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  background: isDone
                    ? 'rgba(34,197,94,0.2)'
                    : isActive
                    ? 'rgba(124,106,247,0.3)'
                    : 'rgba(255,255,255,0.05)',
                  border: isDone
                    ? '1.5px solid rgba(34,197,94,0.5)'
                    : isActive
                    ? '1.5px solid rgba(124,106,247,0.6)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  color: isDone ? '#86efac' : isActive ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
                }}>
                  {isDone ? '✓' : t.icon} {t.name}
                </div>
              );
            })}
          </div>
         
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${((taskIndex) / pickedSequence.length) * 100}%`,
              background: 'linear-gradient(90deg, #7c6af7, #a855f7)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {error && (
          <p style={{ margin: '0 0 16px', color: '#f87171', fontSize: 14, textAlign: 'center', fontWeight: 700 }}>
            {error}
          </p>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
            Verifying your sequence…
          </div>
        ) : (
          TaskComponent && <TaskComponent onComplete={handleTaskComplete} />
        )}
      </div>
    </div>
  );
}
