//D:\D-Luxury-Car-Showroom\Frontend\src\app\App.tsx
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import SplashScreen from "../components/splash/SplashScreen";
import Navbar from "../components/navbar/Navbar";
import AppRoutes from "./routes";

import "./App.css";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
        />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      )}
    </>
  );
}