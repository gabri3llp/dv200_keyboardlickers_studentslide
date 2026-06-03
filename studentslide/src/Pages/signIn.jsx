import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/StudentSlide_Logo_Full.png' 


const SignIn = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const handleSubmit = (e) => {
  e.preventDefault()
  if (!validate()) return
  console.log('Ready for API call:', form)
}

const validate = () => {
  // check neither field is empty
  if (!form.email || !form.password) {
    alert('Please fill in all fields')
    return false
  }
  // basic email format check
  if (!form.email.includes('@')) {
    alert('Please enter a valid email')
    return false
  }
  return true
}

  return (
   <div className="auth-background">
  <Container fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100">
    
    {/* Logo */}
    <div className="mb-4 text-center">
      <img src={logo} alt="Student Slide Logo" className="auth-logo" />
    </div>

        {/* Card */}
        <div className="auth-card w-100">
          <h5 className="text-center text-white mb-1">Welcome to</h5>
          <h2 className="text-center auth-title mb-4">Student Slide!</h2>

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Student Email</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                name="email"
                placeholder="Please enter email"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label className="auth-label">Password</Form.Label>
                <span className="auth-link">Forgot?</span>
              </div>
              <Form.Control
                className="auth-input"
                type="password"
                name="password"
                placeholder="········"
                onChange={handleChange}
              />
            </Form.Group>

            <Button className="auth-btn w-100 mb-3" type="submit">
              Sign In
            </Button>

            <div className="auth-divider mb-3">
              <span>OR</span>
            </div>

            <p className="text-center text-white mb-0">
              Don't have an account?{' '}
              <span className="auth-link" onClick={() => navigate('/signup')}>
                Sign Up
              </span>
            </p>

          </Form>
        </div>
      </Container>
    </div>
  )
}

export default SignIn
