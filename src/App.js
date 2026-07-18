import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Index.jsx";
import Home from "./pages/home/home.jsx";
import Register from "./pages/register/Index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;