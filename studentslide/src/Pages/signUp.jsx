import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../Component/AuthLayout';
import { API_URL } from '../api/client';

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
    <AuthLayout>
      {error && <div className="ss-alert ss-alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="ss-form">
        <div className="ss-form-row">
          <div>
            <label className="ss-label">Student Name</label>
            <input className="ss-input" type="text" name="name" placeholder="Please enter name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="ss-label">Student Surname</label>
            <input className="ss-input" type="text" name="surname" placeholder="Please enter surname" value={form.surname} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="ss-label">Student Number</label>
          <input className="ss-input" type="text" name="studentNum" placeholder="Please enter student number" value={form.studentNum} onChange={handleChange} />
        </div>

        <div>
          <label className="ss-label">Student Email</label>
          <input className="ss-input" type="email" name="email" placeholder="Please enter email" value={form.email} onChange={handleChange} />
        </div>

        <div>
          <label className="ss-label">Password</label>
          <input className="ss-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        </div>

        <div>
          <label className="ss-label">Confirm Password</label>
          <input className="ss-input" type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />
        </div>

        <button className="ss-btn ss-btn--primary ss-btn--block" type="submit" disabled={saving}>
          {saving ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="ss-divider">OR</div>

        <p className="ss-switch">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/signin')}>Sign In</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
