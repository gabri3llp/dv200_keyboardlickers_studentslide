import { useState, useEffect, useRef } from 'react';

const BUTTONS = ['🟥','🟧','🟨','🟩','🟦','🟪','⬛','🟫','⬜'];
const SEQUENCE = [0, 4, 8, 2, 6];

export default function Reactor({ onComplete }) {
  const [step, setStep]         = useState(0);
  const [states, setStates]     = useState(Array(9).fill('idle')); // idle | correct | wrong | previewing
  const [previewing, setPreviewing] = useState(true);
  const [previewStep, setPreviewStep] = useState(-1);
  const [done, setDone]         = useState(false);
  const timerRef                = useRef(null);

 
  useEffect(() => {
    let i = 0;
    const show = () => {
      if (i >= SEQUENCE.length) {
        setPreviewStep(-1);
        setPreviewing(false);
        return;
      }
      setPreviewStep(SEQUENCE[i]);
      i++;
      timerRef.current = setTimeout(() => {
        setPreviewStep(-1);
        timerRef.current = setTimeout(show, 200);
      }, 500);
    };
    timerRef.current = setTimeout(show, 600);
    return () => clearTimeout(timerRef.current);
  }, []);

  function press(idx) {
    if (previewing || done) return;

    if (idx === SEQUENCE[step]) {
      const next = step + 1;
      setStates(prev => {
        const s = [...prev];
        s[idx] = 'correct';
        return s;
      });
      if (next >= SEQUENCE.length) {
        setDone(true);
        setTimeout(onComplete, 600);
      } else {
        setStep(next);
      }
    } else {
      
      setStates(prev => {
        const s = [...prev];
        s[idx] = 'wrong';
        return s;
      });
      setTimeout(() => {
        setStates(Array(9).fill('idle'));
        setStep(0);
      }, 500);
    }
  }

  function getButtonStyle(idx) {
    const state = states[idx];
    const isPreviewing = previewStep === idx;
    const isNextTarget = !previewing && idx === SEQUENCE[step] && state === 'idle';

    return {
      ...styles.reactorBtn,
      background:
        state === 'correct'  ? 'rgba(34,201,122,0.2)' :
        state === 'wrong'    ? 'rgba(247,90,90,0.25)' :
        isPreviewing         ? 'rgba(124,106,247,0.35)' :
        'rgba(255,255,255,0.04)',
      borderColor:
        state === 'correct'  ? '#22c97a' :
        state === 'wrong'    ? '#f75a5a' :
        isPreviewing         ? '#a594f9' :
        isNextTarget         ? 'rgba(255,255,255,0.25)' :
        'rgba(255,255,255,0.08)',
      boxShadow:
        state === 'correct'  ? '0 0 14px rgba(34,201,122,0.4)' :
        state === 'wrong'    ? '0 0 14px rgba(247,90,90,0.4)' :
        isPreviewing         ? '0 0 18px rgba(124,106,247,0.5)' :
        'none',
      transform: isPreviewing || state === 'correct' ? 'scale(0.93)' : 'scale(1)',
      cursor: previewing ? 'default' : 'pointer',
    };
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.icon}>☢️</span>
        <div>
          <div style={styles.title}>Reactor Startup</div>
          <div style={styles.sub}>
            {previewing ? 'Watch the sequence carefully...' : `Press button ${step + 1} of ${SEQUENCE.length}`}
          </div>
        </div>
        <div style={styles.badge}>
          {previewing ? (
            <span style={{ ...styles.badgeInner, background: 'rgba(124,106,247,0.2)', color: '#a594f9', borderColor: 'rgba(124,106,247,0.3)' }}>
              👁 Watch
            </span>
          ) : (
            <span style={{ ...styles.badgeInner, background: 'rgba(247,183,49,0.15)', color: '#f7b731', borderColor: 'rgba(247,183,49,0.3)' }}>
              {step}/{SEQUENCE.length}
            </span>
          )}
        </div>
      </div>

     
      <div style={styles.seqStrip}>
        {SEQUENCE.map((btnIdx, i) => (
          <div key={i} style={{
            ...styles.seqDot,
            background: i < step ? '#22c97a' : i === step && !previewing ? '#a594f9' : 'rgba(255,255,255,0.08)',
            boxShadow: i === step && !previewing ? '0 0 8px rgba(124,106,247,0.6)' : 'none',
          }} />
        ))}
      </div>

     
      <div style={styles.grid}>
        {BUTTONS.map((emoji, idx) => (
          <button key={idx} onClick={() => press(idx)} style={getButtonStyle(idx)}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
          </button>
        ))}
      </div>

      {done && (
        <div style={styles.successBanner}>
          ✓ Reactor online
        </div>
      )}
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
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  icon: { fontSize: 28 },
  title: { fontSize: 15, fontWeight: 600, color: '#e8e8f0', flex: 1 },
  sub: { fontSize: 12, color: '#9898b0', marginTop: 2 },
  badge: { marginLeft: 'auto' },
  badgeInner: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12, fontWeight: 600,
    border: '1px solid',
    fontFamily: 'monospace',
  },
  seqStrip: {
    display: 'flex', gap: 6, marginBottom: 16, justifyContent: 'center',
  },
  seqDot: {
    width: 8, height: 8, borderRadius: '50%',
    transition: 'all 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  reactorBtn: {
    padding: '14px 0',
    border: '1px solid',
    borderRadius: 12,
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.12s ease',
    aspectRatio: '1',
  },
  successBanner: {
    marginTop: 14,
    textAlign: 'center',
    padding: '10px',
    background: 'rgba(34,201,122,0.15)',
    border: '1px solid rgba(34,201,122,0.3)',
    borderRadius: 10,
    color: '#22c97a',
    fontSize: 13, fontWeight: 600,
  },
};
