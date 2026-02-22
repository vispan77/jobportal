// import { createContext, useState, useEffect, useContext } from "react";
// import { getMe } from "../api/authApi";
// import { logout as logoutApi } from "../api/authApi";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // stores logged-in user
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // login 
//   const login = (userData) => {
//     setUser(userData);
//     toast.success("Logged in successfully!");
//   };

//   // logout 
//   const logout = async () => {
//     try {
//       await logoutApi();
//       setUser(null);
//       navigate("/")
//       toast.success("Logged out successfully");
//     } catch (error) {
//       toast.error("Logout failed");
//     }
//   };

//   // const logout = () => {
//   //   setUser(null);
//   //   toast.success("Logged out!");
//   // };

//   // auto-login on page refresh
//   const checkUser = async () => {
//     try {
//       const res = await getMe();
//       console.log("respose data :- ", res)
//       setUser(res.data.user);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     checkUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, checkUser, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use context easily
// export const useAuth = () => useContext(AuthContext);








//new code for handling token
import { createContext, useState, useEffect, useContext } from "react";
import { getMe, logout as logoutApi } from "../api/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Updated login to accept both user and token
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData); // Persist token
    toast.success("Logged in successfully!");
  };

 

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Server-side logout failed", error);
    } finally {
      // Always clear local state even if API call fails
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      navigate("/");
      toast.success("Logged out successfully");
    }
  };

  const checkUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getMe();
      setUser(res.data.user);
      setToken(savedToken);
    } catch (err) {
      // If token is invalid/expired, clean up
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
