import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './Pages/signIn'
import SignUp from './Pages/signUp'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App