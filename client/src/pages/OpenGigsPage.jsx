import { useEffect, useState } from "react";
import { getOpenGigs } from "../api/authApi";
import { toast } from "react-hot-toast";
import { FaDollarSign, FaUsers, FaClock } from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

const OpenGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const res = await getOpenGigs(search);
      setGigs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Open Jobs</h2>

      <input
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        placeholder="Search Jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        // <p className="text-gray-600">Loading gigs...</p>
        <LoadingScreen message="Loading..." />
      ) : gigs.length === 0 ? (
        <p className="text-gray-600">No gigs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => {
            const postedDate = new Date(gig.createdAt).toLocaleDateString();
            const ownerInitial = gig.ownerId.name[0].toUpperCase();

            return (
              <div
                key={gig._id}
                className="relative p-5 border border-gray-200 rounded-xl shadow hover:shadow-lg transition bg-white flex flex-col h-full cursor-pointer"
                onClick={() => navigate(`/gig/${gig._id}`)} // navigate to gig details
              >
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${gig.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {gig.status.toUpperCase()}
                </span>

                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{gig.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">{gig.description}</p>
                  <div className="flex gap-5 items-center text-md text-gray-600 mb-4">
                    <p className="flex items-center gap-1">
                      <LuIndianRupee className="text-gray-500" />{gig.budget}
                    </p>
                    {/* <p className="flex items-center gap-1">
                      <FaUsers className="text-gray-500" /> {gig.bids?.length || 0} Bids
                    </p> */}
                    <p className="flex items-center gap-1">
                      <FaClock className="text-gray-500" /> {postedDate}
                    </p>
                  </div>
                  <hr className="border-t border-gray-200 my-3" />
                  <div className="flex items-center mt-auto">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2">
                      {ownerInitial}
                    </div>
                    <p className="text-gray-700 text-sm">{gig.ownerId.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OpenGigsPage;
