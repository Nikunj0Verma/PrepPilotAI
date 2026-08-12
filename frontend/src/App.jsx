import PublicNavbar from "./components/PublicNavbar";
import { BrowserRouter,Route, Routes } from "react-router-dom";
import "./App.css";
import HeroSection from "./components/HeroSection";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Features from "./components/features";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PublicNavbar />
              <HeroSection />
              <Features />
              <About />
              <Contact />
            </>
          }
        />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
