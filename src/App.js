import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/mainLayout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Applications from "./pages/applications/applications";
import Home from "./pages/home/home";
import Jobs from "./pages/jobs/jobs";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";
import Resumes from "./pages/resumes/resumes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/resumes" element={<Resumes />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
