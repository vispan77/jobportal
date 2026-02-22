import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBidsForGig, hireBid } from "../api/authApi";
import { toast } from "react-hot-toast";

const BidsListPage = () => {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await getBidsForGig(gigId);
      setBids(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [gigId]);

  const handleHire = async (bidId) => {
    try {
      const res = await hireBid(bidId);
      toast.success(res.data.message);
      fetchBids(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bids...</p>;

  if (bids.length === 0)
    return <p className="text-center mt-10">No bids submitted yet</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Bids for this Gig</h2>
      {bids.map((bid) => (
        <div
          key={bid._id}
          className="p-4 border rounded shadow flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Freelancer:</strong> {bid.freelancerId.name} (
              {bid.freelancerId.email})
            </p>
            <p>
              <strong>Price:</strong> ${bid.price}
            </p>
            {bid.message && (
              <p>
                <strong>Message:</strong> {bid.message}
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  bid.status === "hired"
                    ? "text-green-600 font-bold"
                    : bid.status === "rejected"
                    ? "text-red-600"
                    : "text-gray-700"
                }
              >
                {bid.status || "pending"}
              </span>
            </p>
          </div>

          {bid.status !== "hired" && bid.status !== "rejected" && (
            <button
              onClick={() => handleHire(bid._id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Hire
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidsListPage;
