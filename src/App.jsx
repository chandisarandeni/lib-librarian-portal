import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import Dashboard from './pages/Dashboard/Dashboard'
import AppContextProvider from './Context/AppContext'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AppContextProvider>
      <div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: "",
            duration: 3000,
          }}
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route 
          path="/dashboard/*" 
          element={
            
              <Dashboard />
            
          } 
        />
        </Routes>
      </div>
    </AppContextProvider>
  );
}

export default App;
