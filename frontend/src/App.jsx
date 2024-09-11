import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterExaminer from './pages/RegisterExaminer';

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <RegisterAdmin />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register/admin" element={<RegisterAndLogout />} />
        <Route path="/register/examiner" element={<RegisterExaminer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
