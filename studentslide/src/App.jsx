import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import Messages from './Pages/messages';
import CreateListing from './Pages/createListing';
import Marketplace from './Pages/marketplace';
import ProductDetails from './Pages/productDetails';
import AboutUs from './Pages/aboutUS';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/listings" element={<CreateListing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;