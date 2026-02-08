import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Simulator from './pages/Simulator'; // <-- Nhớ import file này

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;