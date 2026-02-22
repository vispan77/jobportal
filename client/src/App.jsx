import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css"
import Navbar from "../components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OpenGigsPage from "./pages/OpenGigsPage";
import CreateGigPage from "./pages/CreateGigPage";
import Home from "./pages/Home";
import SubmitBidPage from "./pages/SubmitBidPage";
import BidsListPage from "./pages/BidsListPage";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import GigDetailsPage from "./pages/GigDetailsPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import LoadingScreen from "../components/LoadingScreen";

const Dashboard = () => <h2 className="text-center mt-10 text-2xl">Welcome Dashboard!</h2>;

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen message="Loading..." />;

  return (
    <>
      <Navbar />

      <Toaster />

      <Routes>

        {/* home page */}
        <Route 
        path="/" element={<Home />} />

        {/* get all the jobs */}
        <Route 
        path="/gigs" element={<OpenGigsPage />} />

        {/*  Create jobs */}
        <Route
          path="/create-gig"
          element={user ? <CreateGigPage /> : <Navigate to="/login" />}
        />

        {/* jobs detaisl */}
        <Route path="/gig/:gigId" element={<GigDetailsPage />} />

        {/* signup  */}
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />

        {/* Owner Dashboard Route */}
        <Route path="/dashboard" element={<OwnerDashboard />} />

        {/* Bids routes
        <Route
          path="/bid/:gigId"
          element={user ? <SubmitBidPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/bids/:gigId"
          element={user ? <BidsListPage /> : <Navigate to="/login" />}
        /> */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;




