const COLORS = ['red','blue','green','yellow','purple','cyan','orange','white'];

export default function LoginPage({ mode, setMode, username, setUsername, color, setColor, onNext }) {
  const [error, setError] = useState('');

  function handleNext() {
    if (!username || username.length < 3) return setError('Username must be at least 3 characters.');
    if (!color) return setError('Pick a crewmate color.');
    setError('');
    onNext();
  }

  return (
    <div>
      <h2>Student Slide</h2>

      <div>
        <button onClick={() => setMode('login')}  className={mode==='login'  ? 'active' : ''}>Log in</button>
        <button onClick={() => setMode('register')} className={mode==='register' ? 'active' : ''}>Register</button>
      </div>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      
      <div>
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ background: c, border: color === c ? '3px solid white' : '2px solid transparent' }}
          />
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleNext}>Board the ship →</button>
    </div>
  );
}