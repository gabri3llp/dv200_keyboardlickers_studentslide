import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import Messages from './Pages/messages';
import CreateListing from './Pages/createListing';
import Marketplace from './Pages/marketplace';
import ProductDetails from './Pages/productDetails';
import AboutUs from './Pages/aboutUS';
import AuthPage from './Pages/SignUpPage';
import SetupPage from './Pages/SetupPage';
import TasksPage from './Pages/TasksPage';
import Dashboard from './Pages/Dashboard';
import './App.css';

// Wrapper to handle auth flow with navigation
function AuthFlow() {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState({
    mode: 'register',
    username: '',
    color: '',
    sequence: []
  });

  // Called after SignUpPage form — goes to setup (register) or tasks (login)
  function handleAuthNext({ mode, username, color }) {
    setAuthData(prev => ({ ...prev, mode, username, color }));
    if (mode === 'register') {
      navigate('/setup');
    } else {
      navigate('/tasks');
    }
  }

  // Called after SetupPage — goes to tasks
  function handleSetupDone(sequence) {
    setAuthData(prev => ({ ...prev, sequence }));
    navigate('/tasks');
  }

  // Called after TasksPage success — goes to dashboard
  function handleAuthSuccess(user) {
    navigate('/dashboard');
  }

  // Called after TasksPage fail — back to auth
  function handleAuthFail() {
    navigate('/auth');
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage onNext={handleAuthNext} />} />
      <Route path="/auth" element={<AuthPage onNext={handleAuthNext} />} />
      <Route path="/setup" element={
        <SetupPage
          username={authData.username}
          onConfirm={handleSetupDone}
          onBack={() => navigate('/auth')}
        />}
      />
      <Route path="/tasks" element={
        <TasksPage
          mode={authData.mode}
          username={authData.username}
          color={authData.color}
          sequence={authData.sequence}
          onSuccess={handleAuthSuccess}
          onFail={handleAuthFail}
        />}
      />
      <Route path="/dashboard" element={<Dashboard onLogout={() => navigate('/auth')} />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/createListing" element={<CreateListing />} />
      <Route path="/listings" element={<CreateListing />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthFlow />
    </BrowserRouter>
  );
}

export default App;