import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SignUp = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', surname: '', email: '', password: '', confirmPassword: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <div className="auth-background">
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="mb-4 text-center">
            /* Logo placeholder *\/
          <h2 className="text-white fw-bold">STUDENT SLIDE</h2>
          <span className="text-warning">— PASS IT ON —</span>
        </div>
        <div className="auth-card w-100">
          <h5 className="text-center text-white mb-1">Welcome to</h5>
          <h2 className="text-center auth-title mb-4">Student Slide!</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">Student Name</Form.Label>
                  <Form.Control className="auth-input" type="text" name="name" placeholder="Please enter name" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">Student Surname</Form.Label>
                  <Form.Control className="auth-input" type="text" name="surname" placeholder="Please enter surname" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Student Email</Form.Label>
              <Form.Control className="auth-input" type="email" name="email" placeholder="Please enter email" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Password</Form.Label>
              <Form.Control className="auth-input" type="password" name="password" placeholder="········" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="auth-label">Confirm Password</Form.Label>
              <Form.Control className="auth-input" type="password" name="confirmPassword" placeholder="········" onChange={handleChange} />
            </Form.Group>
            <Button className="auth-btn w-100 mb-3" type="submit">Sign Up</Button>
            <div className="auth-divider mb-3"><span>OR</span></div>
            <p className="text-center text-white mb-0">
              Already have an account?{' '}
              <span className="auth-link" onClick={() => navigate('/signin')}>Sign In</span>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  )
}

export default SignUp