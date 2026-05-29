import { useRef, useState } from 'react';

export default function Swipe({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const dragging = useRef(false);
  const startX   = useRef(0);
  const startLeft = useRef(4);
  const trackRef  = useRef(null);

  function onMouseDown(e) {
    dragging.current = true;
    startX.current = e.clientX;
    startLeft.current = parseInt(e.currentTarget.style.left) || 4;
  }

  function onMouseMove(e) {
    if (!dragging.current || !trackRef.current) return;
    const maxL = trackRef.current.offsetWidth - 48;
    const nl = Math.max(4, Math.min(maxL, startLeft.current + (e.clientX - startX.current)));
    setProgress(Math.round((nl - 4) / (maxL - 4) * 100));
    if (nl >= maxL - 4) { dragging.current = false; setTimeout(onComplete, 300); }
  }

  function onMouseUp() {
    if (dragging.current) { dragging.current = false; setProgress(0); }
  }

  return (
    <div onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <h3>Swipe your card</h3>
      <div ref={trackRef} style={{ position:'relative', height:52, background:'#eee', borderRadius:26 }}>
        <div style={{ width:`${progress}%`, height:'100%', background:'#7c6af7', borderRadius:26 }} />
        <div
          onMouseDown={onMouseDown}
          style={{ position:'absolute', top:4, left:`${4 + progress * 0.96}%`, width:44, height:44, background:'#7c6af7', borderRadius:'50%', cursor:'grab', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          💳
        </div>
      </div>
    </div>
  );
}