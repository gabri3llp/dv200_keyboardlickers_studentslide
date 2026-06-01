import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import Messages from './Pages/messages';
import CreateListing from './Pages/createListing';
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

  const canManageListings = user?.role === 'admin' || user?.role === 'moderator';

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
      <Route
        path="/admin/listings"
        element={
          canManageListings
            ? <CreateListing user={user} adminView />
            : <Marketplace user={user} onLogout={handleLogout} />
        }
      />
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
      <CartProvider>
        <AuthFlow />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
