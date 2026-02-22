import { useState } from "react";
import { useParams } from "react-router-dom";
import { submitBid } from "../api/authApi";
import { toast } from "react-hot-toast";

const SubmitBidPage = () => {
  const { gigId } = useParams();
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitBid({ gigId, price, message });
      toast.success(res.data.message);
      setPrice("");
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Bid submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Submit a Bid</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Message (optional)"
          className="w-full border px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Bid"}
        </button>
      </form>
    </div>
  );
};

export default SubmitBidPage;
