import { BrowserRouter, Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import Messages from './Pages/messages';
import CreateListing from './Pages/createListing';
import AdminListings from './Pages/AdminListings';
import Marketplace from './Pages/marketplace';
import ProductDetails from './Pages/productDetails';
import Cart from './Pages/Cart';
import AboutUs from './Pages/aboutUS';
import AuthPage from './Pages/SignUpPage';
import SetupPage from './Pages/SetupPage';
import TasksPage from './Pages/TasksPage';
import Dashboard from './Pages/Dashboard';
import CartDrawer from './Component/CartDrawer';
import { clearSession, getStoredUser } from './api/client';
import { getMe } from './api/auth';
import { CartProvider } from './context/CartContext';
import './App.css';

function AuthFlow() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [authData, setAuthData] = useState({
    mode: 'register',
    username: '',
    name: '',
    surname: '',
    color: '',
    sequence: [],
  });

  useEffect(() => {
    let isMounted = true;

    getMe().then((result) => {
      if (isMounted && result.ok && result.user) {
        setUser(result.user);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleAuthNext({ mode, username, color, name, surname }) {
    setAuthData((prev) => ({ ...prev, mode, username, color, name, surname }));
    navigate(mode === 'register' ? '/setup' : '/tasks');
  }

  function handleSetupDone(sequence) {
    setAuthData((prev) => ({ ...prev, sequence }));
    navigate('/tasks');
  }

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    const manager = loggedInUser?.role === 'admin' || loggedInUser?.role === 'moderator';
    navigate(manager ? '/admin/listings' : '/marketplace');
  }

  function handleAuthFail() {
    navigate('/auth');
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    navigate('/auth');
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage onNext={handleAuthNext} />} />
      <Route path="/auth" element={<AuthPage onNext={handleAuthNext} />} />
      <Route
        path="/setup"
        element={
          <SetupPage
            username={authData.username}
            name={authData.name}
            surname={authData.surname}
            onConfirm={handleSetupDone}
            onBack={() => navigate('/auth')}
          />
        }
      />
      <Route
        path="/tasks"
        element={
          <TasksPage
            mode={authData.mode}
            username={authData.username}
            color={authData.color}
            sequence={authData.sequence}
            onSuccess={handleAuthSuccess}
            onFail={handleAuthFail}
          />
        }
      />
      <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      <Route path="/marketplace" element={<Marketplace user={user} onLogout={handleLogout} />} />
      <Route path="/product/:id" element={<ProductDetails user={user} onLogout={handleLogout} />} />
      <Route path="/cart" element={<Cart user={user} onLogout={handleLogout} />} />
      <Route path="/createListing" element={<CreateListing user={user} />} />
      <Route path="/listings" element={<CreateListing user={user} />} />
      <Route path="/admin" element={<Navigate to="/admin/listings" replace />} />
      <Route
        path="/admin/listings"
        element={<AdminListings user={user} onLogout={handleLogout} />}
      />
      <Route path="/messages" element={<Messages user={user} onLogout={handleLogout} />} />
      <Route path="/aboutus" element={<AboutUs user={user} onLogout={handleLogout} />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
