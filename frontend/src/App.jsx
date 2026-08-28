import PublicNavbar from "./components/PublicNavbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import SideBar from "./components/SideBar";
import PrivateNavbar from "./components/privateNavbar";
import InterviewPrep from "./components/InterviewPrep";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import CompanyPrep from "./components/CompanyPrep";
import Progress from "./components/Progress";
import Interview from "./components/Interview";
import { useLocation } from "react-router-dom";
import InterviewResult from "./components/InterviewResult";

function AppRoutes() {
  const location = useLocation();

  const backgroundLocation =
    location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <InterviewPrep />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <ResumeAnalyzer />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-prep"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <CompanyPrep />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Progress />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Interview />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id/result"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <InterviewResult />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/interview/:id"
            element={<Interview />}
          />
        </Routes>
      )}
    </>
  );
}
function App() {
  return (
    <>
      <BrowserRouter>
      <AppRoutes/>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
