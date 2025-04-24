import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import Carrito from "./pages/Carrito";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/Carrito" element={<Carrito />} />
      </Routes>
    </Router>
  );
}

export default App;
