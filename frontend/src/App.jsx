import PublicNavbar from "./components/PublicNavbar";
import "./App.css";
import HeroSection from "./components/HeroSection";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Features from "./components/features";

function App() {

  return (
    <>
      <div>
        <PublicNavbar />
        <HeroSection />
        <Features />
      </div>
    </>
  );
}

export default App;
