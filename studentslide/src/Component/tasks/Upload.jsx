import { useState, useEffect, useRef } from 'react';

const FILES = [
  { name: 'crewmate_id.dat',    size: '2.4 MB',  color: '#4a90f7' },
  { name: 'task_manifest.bin',  size: '890 KB',  color: '#22c97a' },
  { name: 'ship_logs.enc',      size: '15.1 MB', color: '#a594f9' },
];

export default function Upload({ onComplete }) {
  const [progress, setProgress]   = useState(0);
  const [fileIdx, setFileIdx]     = useState(0);
  const [fileProgress, setFileProgress] = useState([0, 0, 0]);
  const [status, setStatus]       = useState('uploading'); // uploading | verifying | done
  const [packets, setPackets]     = useState([]);
  const intervalRef               = useRef(null);
  const packetRef                 = useRef(null);

 
  useEffect(() => {
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 3 + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current);
        setStatus('verifying');
        setTimeout(() => { setStatus('done'); setTimeout(onComplete, 500); }, 1200);
      }
      setProgress(Math.min(p, 100));

      
      setFileProgress(prev => {
        const copy = [...prev];
        if (p < 33)       copy[0] = Math.min((p / 33) * 100, 100);
        else if (p < 66)  { copy[0] = 100; copy[1] = Math.min(((p - 33) / 33) * 100, 100); }
        else               { copy[0] = 100; copy[1] = 100; copy[2] = Math.min(((p - 66) / 34) * 100, 100); }
        return copy;
      });

      setFileIdx(p < 33 ? 0 : p < 66 ? 1 : 2);
    }, 80);

    return () => clearInterval(intervalRef.current);
  }, []);

 
  useEffect(() => {
    packetRef.current = setInterval(() => {
      if (status === 'done') return;
      const id = Math.random();
      setPackets(prev => [...prev.slice(-6), {
        id,
        x: Math.random() * 80 + 10,
        delay: 0,
      }]);
      setTimeout(() => setPackets(prev => prev.filter(p => p.id !== id)), 1000);
    }, 300);
    return () => clearInterval(packetRef.current);
  }, [status]);

  const p = Math.round(progress);
  const activeFile = FILES[fileIdx];

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.icon}>📡</span>
        <div style={{ flex: 1 }}>
          <div style={styles.title}>Upload Data</div>
          <div style={styles.sub}>Transmitting to Skeld mainframe</div>
        </div>
        <div style={{
          ...styles.pctBadge,
          color: status === 'done' ? '#22c97a' : status === 'verifying' ? '#f7b731' : '#a594f9',
        }}>
          {status === 'done' ? '✓ Done' : status === 'verifying' ? 'Verifying...' : `${p}%`}
        </div>
      </div>

     
      <div style={styles.antennaWrap}>
        <div style={styles.antenna}>
          <div style={styles.antennaBase} />
          <div style={styles.antennaStick} />
          <div style={{ ...styles.antennaDot, background: status === 'done' ? '#22c97a' : '#a594f9',
            boxShadow: `0 0 ${status === 'done' ? 12 : 8}px ${status === 'done' ? 'rgba(34,201,122,0.8)' : 'rgba(124,106,247,0.8)'}`,
            animation: status !== 'done' ? 'antennaPulse 1s ease-in-out infinite' : 'none',
          }} />
         
          {status !== 'done' && [1,2,3].map(i => (
            <div key={i} style={{
              ...styles.signalRing,
              width: i * 28, height: i * 28,
              marginLeft: -(i * 28) / 2,
              marginTop: -(i * 28) / 2,
              animation: `signalRing 1.5s ease-out ${i * 0.3}s infinite`,
            }} />
          ))}
        </div>

        
        {packets.map(pkt => (
          <div key={pkt.id} style={{
            ...styles.packet,
            left: `${pkt.x}%`,
            animation: 'packetFloat 1s ease-out forwards',
          }}>
            📦
          </div>
        ))}
      </div>

      
      <div style={styles.barWrap}>
        <div style={styles.barTrack}>
          <div style={{
            ...styles.barFill,
            width: `${p}%`,
            background: status === 'done'
              ? 'linear-gradient(90deg, #22c97a, #4af7a0)'
              : 'linear-gradient(90deg, #7c6af7, #a594f9)',
            boxShadow: status === 'done'
              ? '0 0 12px rgba(34,201,122,0.5)'
              : '0 0 12px rgba(124,106,247,0.5)',
          }} />
         
          {status === 'uploading' && (
            <div style={{ ...styles.shimmer, left: `${Math.max(0, p - 8)}%`, width: '8%' }} />
          )}
        </div>
      </div>

     
      <div style={styles.fileList}>
        {FILES.map((f, i) => {
          const fp = Math.round(fileProgress[i]);
          const isDone = fp === 100;
          const isActive = i === fileIdx && status === 'uploading';
          return (
            <div key={f.name} style={{
              ...styles.fileRow,
              borderColor: isActive ? f.color + '44' : 'rgba(255,255,255,0.06)',
              background: isActive ? f.color + '0d' : 'transparent',
            }}>
              <div style={{ ...styles.fileIcon, color: f.color }}>{isDone ? '✓' : isActive ? '↑' : '○'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: isDone ? f.color : isActive ? '#e8e8f0' : '#55556a', fontFamily: 'monospace' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 10, color: '#55556a', marginTop: 2 }}>{f.size}</div>
              </div>
              <div style={{ fontSize: 11, color: isDone ? f.color : '#55556a', fontFamily: 'monospace', fontWeight: 600 }}>
                {fp}%
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes antennaPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes signalRing {
          0% { opacity: 0.6; transform: scale(0.3); }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes packetFloat {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
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
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  icon: { fontSize: 28 },
  title: { fontSize: 15, fontWeight: 600, color: '#e8e8f0' },
  sub: { fontSize: 12, color: '#9898b0', marginTop: 2 },
  pctBadge: {
    fontFamily: 'monospace', fontSize: 15, fontWeight: 700,
    minWidth: 70, textAlign: 'right',
    transition: 'color 0.3s',
  },
  antennaWrap: {
    position: 'relative', height: 70,
    display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
    marginBottom: 16,
    overflow: 'hidden',
  },
  antenna: {
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  antennaBase: {
    width: 24, height: 10,
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    marginTop: 'auto',
  },
  antennaStick: {
    width: 3, height: 28,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    order: -1,
  },
  antennaDot: {
    width: 10, height: 10, borderRadius: '50%',
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%)',
  },
  signalRing: {
    position: 'absolute',
    top: '4px', left: '50%',
    border: '1.5px solid rgba(124,106,247,0.5)',
    borderRadius: '50%',
  },
  packet: {
    position: 'absolute', bottom: 20,
    fontSize: 14,
    pointerEvents: 'none',
  },
  barWrap: { marginBottom: 16 },
  barTrack: {
    width: '100%', height: 8,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 4, overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%', borderRadius: 4,
    transition: 'width 0.1s linear, background 0.5s',
  },
  shimmer: {
    position: 'absolute', top: 0, height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    borderRadius: 4,
    transition: 'left 0.1s linear',
  },
  fileList: {
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  fileRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '7px 10px',
    borderRadius: 8,
    border: '1px solid',
    transition: 'all 0.2s',
  },
  fileIcon: {
    width: 18, textAlign: 'center',
    fontSize: 13, fontWeight: 700,
    fontFamily: 'monospace',
  },
};
