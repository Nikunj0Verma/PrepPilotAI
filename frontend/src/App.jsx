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
import Resume from "./components/Resume";
import { useLocation } from "react-router-dom";
import InterviewResult from "./components/InterviewResult";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";
import Company from "./components/Company";
import Profile from "./components/Profile";

function AppRoutes() {
  const location = useLocation();

  const backgroundLocation =
    location.state?.backgroundLocation;

  return (
    <>
    <ScrollToTop />
      <Routes location={backgroundLocation || location}>
          <Route element={<PublicRoute />}>
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          </Route>
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
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Profile />
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
            path="/resume/analyze/:id"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Resume />
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
            path="/company-prep/:id"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <SideBar />

                  <main className="min-w-0 flex-1">
                    <PrivateNavbar />
                    <Company />
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
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>


      {backgroundLocation && (
  <Routes>
    <Route
      path="/interview/:id"
      element={
        <Interview />
      }
    />

    <Route
      path="/resume/analyze/:id"
      element={
        <Resume />
      }
    />

    <Route
      path="/company-prep/:id"
      element={
        <Company />
      }
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
