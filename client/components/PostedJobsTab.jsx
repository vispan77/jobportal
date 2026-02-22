// import React, { useEffect } from "react";
// import { FaTrash } from "react-icons/fa";
// import { toast } from "react-hot-toast";

// const PostedJobsTab = ({
//     gigs,
//     setGigs,
//     bids,
//     setBids,
//     expandedGigId,
//     fetchBids,
//     handleHire,
//     handleReject,
//     deleteGig,
//     updatingBidId,
// }) => {
//     // auto-expand first gig
//     useEffect(() => {
//         if (gigs.length > 0 && !expandedGigId) {
//             fetchBids(gigs[0]._id);
//         }
//     }, [gigs]);

//     // anly pending bids
//     const pendingBids = bids.filter((bid) => bid.status === "pending");

//     // deelete gig 
//     const handleDeleteGig = async (e, gigId) => {
//         e.stopPropagation();
//         try {
//             await deleteGig(gigId);

//             // remove gig  
//             setGigs((prev) => prev.filter((gig) => gig._id !== gigId));

//             // clear bids panel if deleted job was open
//             if (expandedGigId === gigId) {
//                 fetchBids(null);
//                 setBids([]);
//             }

//             toast.success("Job is deleted");
//         } catch (error) {
//             //   toast.error("Failed to delete job");
//         }
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* left - posted jobs */}
//             <div className="space-y-6">
//                 {gigs.length === 0 ? (
//                     <p className="text-gray-600">You have not posted any gigs yet.</p>
//                 ) : (
//                     gigs.map((gig) => (
//                         <div
//                             key={gig._id}
//                             onClick={() =>
//                                 expandedGigId === gig._id
//                                     ? fetchBids(null)
//                                     : fetchBids(gig._id)
//                             }
//                             className={`relative bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition ${expandedGigId === gig._id ? "border-2 border-blue-600" : ""
//                                 }`}
//                         >
//                             {/* delete */}
//                             <button
//                                 onClick={(e) => handleDeleteGig(e, gig._id)}
//                                 className="absolute top-4 right-4 text-red-500 hover:text-red-700"
//                                 title="Delete Job"
//                             >
//                                 <FaTrash />
//                             </button>

//                             <h2 className="text-xl font-semibold">{gig.title}</h2>
//                             <p className="text-gray-700 mt-1">Budget: ₹{gig.budget}</p>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 Status: {gig.status.toUpperCase()}
//                             </p>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* right :- all bids */}
//             <div>
//                 {expandedGigId ? (
//                     <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
//                         <h2 className="text-xl font-semibold mb-4">
//                             Bids for this Job
//                         </h2>

//                         {pendingBids.length === 0 ? (
//                             <p className="text-gray-600">No pending bids</p>
//                         ) : (
//                             <div className="space-y-4">
//                                 {pendingBids.map((bid) => (
//                                     <div
//                                         key={bid._id}
//                                         className="bg-gray-50 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center"
//                                     >
//                                         {/* freelanccer */}
//                                         <div className="flex flex-col items-center text-center md:text-left mb-3 md:mb-0">
//                                             <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-2">
//                                                 {bid.freelancerId?.name?.[0] || "F"}
//                                             </div>
//                                             <p className="font-medium">{bid.freelancerId?.name}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 {bid.freelancerId?.email}
//                                             </p>
//                                         </div>

//                                         {/* detaisl */}
//                                         <div className="flex-1 md:ml-6 mb-3 md:mb-0">
//                                             <p>Bid Amount: ₹{bid.price}</p>
//                                             <p className="text-sm text-gray-500">{bid.message}</p>
//                                             <p className="text-sm mt-1 text-yellow-600 font-semibold">
//                                                 {bid.status.toUpperCase()}
//                                             </p>
//                                         </div>

//                                         {/* actions */}
//                                         <div className="flex gap-2 md:flex-col">
//                                             <button
//                                                 onClick={() => handleHire(bid._id)}
//                                                 disabled={updatingBidId === bid._id}
//                                                 className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
//                                             >
//                                                 Hire
//                                             </button>

//                                             <button
//                                                 onClick={() => handleReject(bid._id)}
//                                                 disabled={updatingBidId === bid._id}
//                                                 className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
//                                             >
//                                                 Reject
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <p className="text-gray-500 mt-4">Select a job to view bids</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PostedJobsTab;








// new code
import React, { useEffect } from "react";
import { FaTrash, FaSpinner } from "react-icons/fa";
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
    isLoadingGigs, // Added this prop
    isLoadingBids  // Added this prop
}) => {

    // Auto-expand first gig on initial load
    useEffect(() => {
        if (gigs.length > 0 && !expandedGigId && !isLoadingGigs) {
            fetchBids(gigs[0]._id);
        }
    }, [gigs, isLoadingGigs]);

    // Filter for pending bids only
    const pendingBids = bids.filter((bid) => bid.status === "pending");

    const handleDeleteGig = async (e, gigId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await deleteGig(gigId);
            setGigs((prev) => prev.filter((gig) => gig._id !== gigId));

            if (expandedGigId === gigId) {
                fetchBids(null);
                setBids([]);
            }
            toast.success("Job deleted successfully");
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
            {/* Left Column: Posted Jobs */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Your Posted Jobs</h2>

                {isLoadingGigs ? (
                    <div className="flex flex-col items-center justify-center py-12 text-blue-600">
                        <FaSpinner className="animate-spin text-4xl mb-4" />
                        <p className="text-gray-500">Loading your gigs...</p>
                    </div>
                ) : gigs.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
                        <p className="text-gray-600">You haven't posted any gigs yet.</p>
                    </div>
                ) : (
                    gigs.map((gig) => (
                        <div
                            key={gig._id}
                            onClick={() => expandedGigId === gig._id ? fetchBids(null) : fetchBids(gig._id)}
                            className={`relative bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border-2 ${expandedGigId === gig._id ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent"
                                }`}
                        >
                            <button
                                onClick={(e) => handleDeleteGig(e, gig._id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Delete Job"
                            >
                                <FaTrash size={16} />
                            </button>

                            <h3 className="text-xl font-semibold text-gray-800 pr-8">{gig.title}</h3>
                            <div className="mt-3 flex items-center gap-4">
                                <span className="text-green-600 font-bold">₹{gig.budget}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {gig.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Right Column: Bids Detail Panel */}
            <div className="relative">
                {expandedGigId ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Applications</h2>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {pendingBids.length} Bids
                            </span>
                        </div>

                        {isLoadingBids ? (
                            <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                                <FaSpinner className="animate-spin text-3xl mb-3" />
                                <p className="text-gray-500 text-sm">Fetching bids...</p>
                            </div>
                        ) : pendingBids.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No pending bids for this gig yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {pendingBids.map((bid) => (
                                    <div key={bid._id} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                {bid.freelancerId?.name?.[0] || "F"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{bid.freelancerId?.name}</p>
                                                <p className="text-xs text-gray-500">{bid.freelancerId?.email}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700">Bid: <span className="text-green-600">₹{bid.price}</span></p>
                                            <p className="text-sm text-gray-600 mt-1 italic leading-relaxed">"{bid.message}"</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleHire(bid._id)}
                                                disabled={updatingBidId === bid._id}
                                                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                                            >
                                                {updatingBidId === bid._id ? <FaSpinner className="animate-spin" /> : "Hire"}
                                            </button>
                                            <button
                                                onClick={() => handleReject(bid._id)}
                                                disabled={updatingBidId === bid._id}
                                                className="flex-1 bg-white border-2 border-red-100 text-red-600 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
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
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                        <p className="text-gray-400 font-medium">Select a job from the left to manage bids</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostedJobsTab;


































