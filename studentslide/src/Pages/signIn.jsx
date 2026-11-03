import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../Component/AuthLayout'

const SignIn = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="ss-form">
        <div>
          <label className="ss-label">Student Email</label>
          <input
            className="ss-input"
            type="email"
            name="email"
            placeholder="Please enter email"
            onChange={handleChange}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="ss-label" style={{ marginBottom: 0 }}>Password</label>
            <button type="button" className="ss-forgot">Forgot?</button>
          </div>
          <input
            className="ss-input"
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
          />
        </div>

        <button className="ss-btn ss-btn--primary ss-btn--block" type="submit">
          Sign In
        </button>

        <div className="ss-divider">OR</div>

        <p className="ss-switch">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignIn
