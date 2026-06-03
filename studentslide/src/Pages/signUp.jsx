import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/StudentSlide_Logo_Full.png';

const API_URL = 'http://localhost:5000/api';

const initialForm = {
  name: '',
  surname: '',
  studentNum: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    if (!form.name || !form.surname || !form.studentNum || !form.email || !form.password || !form.confirmPassword) {
      return 'Please fill in all fields';
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      return 'Please enter a valid email address';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          studentNum: form.studentNum,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not create account');
      }

      navigate('/signin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-background">
      <Container fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="mb-4 text-center">
          <img src={logo} alt="Student Slide Logo" className="auth-logo" />
        </div>

        <div className="auth-card w-100">
          <h5 className="text-center text-white mb-1">Welcome to</h5>
          <h2 className="text-center auth-title mb-4">Student Slide!</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">Student Name</Form.Label>
                  <Form.Control className="auth-input" type="text" name="name" placeholder="Please enter name" value={form.name} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">Student Surname</Form.Label>
                  <Form.Control className="auth-input" type="text" name="surname" placeholder="Please enter surname" value={form.surname} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Student Number</Form.Label>
              <Form.Control className="auth-input" type="text" name="studentNum" placeholder="Please enter student number" value={form.studentNum} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Student Email</Form.Label>
              <Form.Control className="auth-input" type="email" name="email" placeholder="Please enter email" value={form.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Password</Form.Label>
              <Form.Control className="auth-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="auth-label">Confirm Password</Form.Label>
              <Form.Control className="auth-input" type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />
            </Form.Group>

            <Button className="auth-btn w-100 mb-3" type="submit" disabled={saving}>
              {saving ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="auth-divider mb-3">
              <span>OR</span>
            </div>

            <p className="text-center text-white mb-0">
              Already have an account?{' '}
              <span className="auth-link" onClick={() => navigate('/signin')}>
                Sign In
              </span>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
