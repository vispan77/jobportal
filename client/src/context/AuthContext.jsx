import { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "../api/authApi";
import { logout as logoutApi } from "../api/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  // login 
  const login = (userData) => {
    setUser(userData);
    toast.success("Logged in successfully!");
  };

  // logout 
  const logout = async () => {
    try {
      await logoutApi(); 
      setUser(null); 
      navigate("/")   
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   toast.success("Logged out!");
  // };

  // auto-login on page refresh
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
