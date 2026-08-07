import PublicNavbar from "./components/PublicNavbar";
import "./App.css";
import HeroSection from "./components/HeroSection";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Features from "./components/features";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <div>
        <PublicNavbar />
        <HeroSection />
        <Features />
        <About/>
        <Contact/>
        <Footer/>
      </div>
    </>
  );
}

export default App;
