import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 3000,
        }}
      />
      <LoginPage />
    </div>
  );
}

export default App;
