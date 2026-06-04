import { useState, useEffect } from 'react';

const WIRE_COLORS = [
  { id: 0, label: 'Red',    color: '#f75a5a', glow: 'rgba(247,90,90,0.6)' },
  { id: 1, label: 'Yellow', color: '#f7b731', glow: 'rgba(247,183,49,0.6)' },
  { id: 2, label: 'Blue',   color: '#4a90f7', glow: 'rgba(74,144,247,0.6)' },
  { id: 3, label: 'Green',  color: '#22c97a', glow: 'rgba(34,201,122,0.6)' },
];


const CORRECT = { 0: 0, 1: 2, 2: 3, 3: 1 };


const RIGHT_ORDER = [
  { id: 0, label: 'Red',    color: '#f75a5a' },
  { id: 2, label: 'Blue',   color: '#4a90f7' },
  { id: 3, label: 'Green',  color: '#22c97a' },
  { id: 1, label: 'Yellow', color: '#f7b731' },
];

export default function Wires({ onComplete }) {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched]           = useState({}); 
  const [wrongPair, setWrongPair]       = useState(null);
  const [flash, setFlash]               = useState(null);

  useEffect(() => {
    if (Object.keys(matched).length === 4) {
      setTimeout(onComplete, 500);
    }
  }, [matched]);

  function handleLeft(id) {
    if (matched[id] !== undefined) return;
    setSelectedLeft(id);
  }

  function handleRight(rightId) {
    if (selectedLeft === null) return;
    if (Object.values(matched).includes(rightId)) return;

    if (CORRECT[selectedLeft] === rightId) {
      setMatched(prev => ({ ...prev, [selectedLeft]: rightId }));
      setFlash(selectedLeft);
      setTimeout(() => setFlash(null), 400);
    } else {
      setWrongPair({ left: selectedLeft, right: rightId });
      setTimeout(() => setWrongPair(null), 500);
    }
    setSelectedLeft(null);
  }

  function getLeftState(id) {
    if (matched[id] !== undefined) return 'matched';
    if (selectedLeft === id) return 'selected';
    if (wrongPair?.left === id) return 'wrong';
    return 'idle';
  }

  function getRightState(rightId) {
    if (Object.values(matched).includes(rightId)) return 'matched';
    if (wrongPair?.right === rightId) return 'wrong';
    if (selectedLeft !== null && CORRECT[selectedLeft] === rightId) return 'hint';
    return 'idle';
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.icon}>⚡</span>
        <div>
          <div style={styles.title}>Fix Wiring</div>
          <div style={styles.sub}>Match each wire on the left to its pair on the right</div>
        </div>
      </div>

      <div style={styles.board}>
        
        <div style={styles.col}>
          {WIRE_COLORS.map(w => {
            const state = getLeftState(w.id);
            return (
              <button
                key={w.id}
                onClick={() => handleLeft(w.id)}
                disabled={state === 'matched'}
                style={{
                  ...styles.wireBtn,
                  borderColor: state === 'idle' ? 'rgba(255,255,255,0.1)' : w.color,
                  background:
                    state === 'matched' ? `${w.color}22` :
                    state === 'selected' ? `${w.color}33` :
                    state === 'wrong' ? 'rgba(247,90,90,0.15)' :
                    'rgba(255,255,255,0.04)',
                  boxShadow: state === 'selected' ? `0 0 12px ${w.glow}` : 'none',
                  transform: state === 'selected' ? 'scale(1.04)' : 'scale(1)',
                  opacity: state === 'matched' ? 0.5 : 1,
                  color: state === 'matched' ? w.color : '#e8e8f0',
                }}
              >
                <span style={{ ...styles.dot, background: w.color, boxShadow: state === 'selected' ? `0 0 8px ${w.glow}` : 'none' }} />
                {w.label}
                {state === 'matched' && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </div>

        
        <div style={styles.middle}>
          <svg width="60" height="180" style={{ overflow: 'visible' }}>
            {Object.entries(matched).map(([leftId, rightId]) => {
              const lIdx = parseInt(leftId);
              const rIdx = RIGHT_ORDER.findIndex(r => r.id === rightId);
              const w = WIRE_COLORS[lIdx];
              const y1 = lIdx * 44 + 20;
              const y2 = rIdx * 44 + 20;
              return (
                <path
                  key={leftId}
                  d={`M 0 ${y1} C 30 ${y1}, 30 ${y2}, 60 ${y2}`}
                  fill="none"
                  stroke={w.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${w.glow})`, animation: flash === lIdx ? 'wirePop 0.3s ease' : 'none' }}
                />
              );
            })}
            {selectedLeft !== null && (
              <line x1="0" y1={selectedLeft * 44 + 20} x2="60" y2={selectedLeft * 44 + 20}
                stroke={WIRE_COLORS[selectedLeft].color} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
            )}
          </svg>
        </div>

      
        <div style={styles.col}>
          {RIGHT_ORDER.map((w, idx) => {
            const state = getRightState(w.id);
            const baseColor = WIRE_COLORS[w.id];
            return (
              <button
                key={w.id}
                onClick={() => handleRight(w.id)}
                disabled={state === 'matched'}
                style={{
                  ...styles.wireBtn,
                  borderColor: state === 'idle' ? 'rgba(255,255,255,0.1)' : w.color,
                  background:
                    state === 'matched' ? `${w.color}22` :
                    state === 'hint' ? `${w.color}22` :
                    state === 'wrong' ? 'rgba(247,90,90,0.15)' :
                    'rgba(255,255,255,0.04)',
                  boxShadow: state === 'hint' ? `0 0 10px ${baseColor.glow}` : 'none',
                  opacity: state === 'matched' ? 0.5 : 1,
                  color: state === 'matched' ? w.color : '#e8e8f0',
                }}
              >
                <span style={{ ...styles.dot, background: w.color }} />
                {w.label}
                {state === 'matched' && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      
      <div style={styles.progressRow}>
        {WIRE_COLORS.map(w => (
          <div key={w.id} style={{
            ...styles.progressDot,
            background: matched[w.id] !== undefined ? w.color : 'rgba(255,255,255,0.1)',
            boxShadow: matched[w.id] !== undefined ? `0 0 6px ${w.glow}` : 'none',
          }} />
        ))}
      </div>

      <style>{`
        @keyframes wirePop {
          0% { stroke-width: 2.5; }
          50% { stroke-width: 5; }
          100% { stroke-width: 2.5; }
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
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
  },
  icon: { fontSize: 28 },
  title: { fontSize: 15, fontWeight: 600, color: '#e8e8f0' },
  sub: { fontSize: 12, color: '#9898b0', marginTop: 2 },
  board: {
    display: 'flex', alignItems: 'flex-start', gap: 0,
  },
  col: {
    flex: 1, display: 'flex', flexDirection: 'column', gap: 8,
  },
  middle: {
    width: 60, flexShrink: 0, paddingTop: 2,
  },
  wireBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 12px',
    border: '1px solid',
    borderRadius: 10,
    background: 'transparent',
    color: '#e8e8f0',
    fontSize: 13, fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    width: '100%',
  },
  dot: {
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
  },
  progressRow: {
    display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16,
  },
  progressDot: {
    width: 8, height: 8, borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
};
