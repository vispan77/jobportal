import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const PostedJobsTab = ({
    gigs,
    setGigs,
    bids,
    setBids,
    expandedGigId,
    fetchBids,
    handleHire,
    handleReject,
    deleteGig,
    updatingBidId,
}) => {
    // auto-expand first gig
    useEffect(() => {
        if (gigs.length > 0 && !expandedGigId) {
            fetchBids(gigs[0]._id);
        }
    }, [gigs]);

    // anly pending bids
    const pendingBids = bids.filter((bid) => bid.status === "pending");

    // deelete gig 
    const handleDeleteGig = async (e, gigId) => {
        e.stopPropagation();
        try {
            await deleteGig(gigId);

            // remove gig  
            setGigs((prev) => prev.filter((gig) => gig._id !== gigId));

            // clear bids panel if deleted job was open
            if (expandedGigId === gigId) {
                fetchBids(null);
                setBids([]);
            }

            toast.success("Job is deleted");
        } catch (error) {
            //   toast.error("Failed to delete job");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* left - posted jobs */}
            <div className="space-y-6">
                {gigs.length === 0 ? (
                    <p className="text-gray-600">You have not posted any gigs yet.</p>
                ) : (
                    gigs.map((gig) => (
                        <div
                            key={gig._id}
                            onClick={() =>
                                expandedGigId === gig._id
                                    ? fetchBids(null)
                                    : fetchBids(gig._id)
                            }
                            className={`relative bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition ${expandedGigId === gig._id ? "border-2 border-blue-600" : ""
                                }`}
                        >
                            {/* delete */}
                            <button
                                onClick={(e) => handleDeleteGig(e, gig._id)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                title="Delete Job"
                            >
                                <FaTrash />
                            </button>

                            <h2 className="text-xl font-semibold">{gig.title}</h2>
                            <p className="text-gray-700 mt-1">Budget: ₹{gig.budget}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Status: {gig.status.toUpperCase()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* right :- all bids */}
            <div>
                {expandedGigId ? (
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">
                            Bids for this Job
                        </h2>

                        {pendingBids.length === 0 ? (
                            <p className="text-gray-600">No pending bids</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingBids.map((bid) => (
                                    <div
                                        key={bid._id}
                                        className="bg-gray-50 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center"
                                    >
                                        {/* freelanccer */}
                                        <div className="flex flex-col items-center text-center md:text-left mb-3 md:mb-0">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-2">
                                                {bid.freelancerId?.name?.[0] || "F"}
                                            </div>
                                            <p className="font-medium">{bid.freelancerId?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {bid.freelancerId?.email}
                                            </p>
                                        </div>

                                        {/* detaisl */}
                                        <div className="flex-1 md:ml-6 mb-3 md:mb-0">
                                            <p>Bid Amount: ₹{bid.price}</p>
                                            <p className="text-sm text-gray-500">{bid.message}</p>
                                            <p className="text-sm mt-1 text-yellow-600 font-semibold">
                                                {bid.status.toUpperCase()}
                                            </p>
                                        </div>

                                        {/* actions */}
                                        <div className="flex gap-2 md:flex-col">
                                            <button
                                                onClick={() => handleHire(bid._id)}
                                                disabled={updatingBidId === bid._id}
                                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                                            >
                                                Hire
                                            </button>

                                            <button
                                                onClick={() => handleReject(bid._id)}
                                                disabled={updatingBidId === bid._id}
                                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4">Select a job to view bids</p>
                )}
            </div>
        </div>
    );
};

export default PostedJobsTab;

































