import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Index.jsx";
import Home from "./pages/home/home.jsx";
import Register from "./pages/register/Index.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import MainLayout from "./components/mainLayout/mainLayout.jsx";
import Profile from "./pages/profile/profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;