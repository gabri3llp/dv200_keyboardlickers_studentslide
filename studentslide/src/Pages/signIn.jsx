import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SignIn = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
    // API call goes here later
  }

  return (
    <div className="auth-background">
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">

        {/* Logo placeholder */}
        <div className="mb-4 text-center">
          <h2 className="text-white fw-bold">STUDENT SLIDE</h2>
          <span className="text-warning">— PASS IT ON —</span>
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
