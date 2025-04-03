import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from './Components/Login/Login.jsx';
import Signup from './Components/Singup/Singup.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Homepage from './Pages/Homepage.jsx';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
    <Route path="/signup" element={<Signup/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;


