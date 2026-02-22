import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="bg-white shadow-md">

      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          GigFlow
        </Link>

        {/* desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Signup
              </Link>
            </>

          ) : (

            <>
              <Link
                to="/create-gig"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Create Gig
              </Link>
              

              {/* user icon  */}
              <div className="relative">
                <FaUserCircle
                  className="text-3xl cursor-pointer text-gray-700 hover:text-blue-600 transition"
                  onClick={toggleDropdown}
                />

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link> */}
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* mobile menu */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block w-full px-4 py-2 border rounded-md text-gray-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenu(false)}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/create-gig"
                onClick={() => setMobileMenu(false)}
                className="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Create Gig
              </Link>

              {/* <Link
                to="/profile"
                onClick={() => setMobileMenu(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >

                Profile
              </Link> */}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenu(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;


