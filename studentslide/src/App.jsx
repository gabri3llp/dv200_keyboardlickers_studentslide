import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import Messages from './Pages/Messages';
import Cart from './Pages/Cart';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;