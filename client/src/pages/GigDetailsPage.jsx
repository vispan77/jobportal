import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getGigById, submitBid } from "../api/authApi";

const GigDetailsPage = () => {
    const { gigId } = useParams();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [proposal, setProposal] = useState("");

    // fetch single gig
    const fetchGigDetails = async () => {
        try {
            const res = await getGigById(gigId);
            setGig(res.data.gig);
        } catch (error) {
            toast.error("Failed to fetch gig");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGigDetails();
    }, [gigId]);

    // submit Bid
    const handleBidSubmit = async (e) => {
        e.preventDefault();

        if (!bidAmount || !proposal) {
            return toast.error("All fields are required");
        }

        try {
            await submitBid({
                gigId: gig._id,          
                price: Number(bidAmount),
                message: proposal,
            });

            toast.success("Bid submitted successfully");

            setIsModalOpen(false);
            setBidAmount("");
            setProposal("");

        } catch (error) {
              toast.error(error.response?.data?.message || "Bid failed");
            // toast.error("Please login to submit a bid")
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!gig) {
        return <p className="text-center mt-10">Gig not found</p>;
    }

    const ownerInitial = gig.ownerId?.name?.charAt(0)?.toUpperCase();
    const postedDate = new Date(gig.createdAt).toLocaleDateString();

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* left part */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h1 className="text-2xl font-semibold mb-4">{gig.title}</h1>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {ownerInitial}
                            </div>
                            <div>
                                <p className="font-medium">{gig.ownerId?.name}</p>
                                <p className="text-sm text-gray-500">
                                    Posted on {postedDate}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            {gig.description}
                        </p>
                    </div>
                </div>

                {/* right part */}
                <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">
                    <p className="text-3xl font-semibold mb-2">₹{gig.budget}</p>
                    <p className="text-md text-gray-500 mb-4">Budget</p>

                    <div className="flex justify-between text-sm text-gray-600 mb-6">
                        <span className="text-sm">Status: {gig.status}</span>
                    </div>

                    {gig.status === "open" && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Submit a Bid
                        </button>
                    )}

                    {gig.status !== "open" && (
                        <p className="text-center text-red-500 font-medium">
                            This gig is already assigned
                        </p>
                    )}
                </div>
            </div>

            {/* bid submit form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Submit a Bid</h2>

                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <label htmlFor="" className="font-semi-bold">Your Bid (₹)</label>
                            <input
                                type="number"
                                placeholder="Your bid amount"
                                className="w-full border rounded-lg px-4 py-2"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                            />

                            <label htmlFor="" className="font-semi-bold">Your Proposal</label>
                            <textarea
                                rows="4"
                                placeholder="Describe why you are the best for the proposal..."
                                className="w-full border rounded-lg px-4 py-2"
                                value={proposal}
                                onChange={(e) => setProposal(e.target.value)}
                            />

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border rounded-lg py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GigDetailsPage;
