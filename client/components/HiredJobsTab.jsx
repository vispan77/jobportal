import React, { useState } from "react";
import { reopenGig } from "../src/api/authApi";
import { toast } from "react-hot-toast";

const HiredJobsTab = ({ assignedGigs, setAssignedGigs, setOpenGigs }) => {
    const [loadingGigId, setLoadingGigId] = useState(null);

    const handleReopen = async (gig) => {
        try {
            setLoadingGigId(gig.gigId);

            // remove gig from assigned 
            setAssignedGigs((prev) =>
                prev.filter((g) => g.gigId !== gig.gigId)
            );

            // add gig to open gigs 
            setOpenGigs((prev) => [
                {
                    gigId: gig.gigId,
                    title: gig.title,
                    description: gig.description,
                    budget: gig.budget,
                    ownerId: gig.ownerId,
                    status: "open",
                },
                ...prev,
            ]);

            // call backend
            await reopenGig(gig.gigId);

            toast.success("Gig moved back to posted jobs");
        } catch (err) {
            toast.error("Failed to reopen gig");

            // getback if failed
            setAssignedGigs((prev) => [gig, ...prev]);
            setOpenGigs((prev) =>
                prev.filter((g) => g.gigId !== gig.gigId)
            );
        } finally {
            setLoadingGigId(null);
        }
    };

    if (assignedGigs.length === 0) {
        return <p>No assigned gigs yet</p>;
    }

    return (
        <>
            {assignedGigs.map((gig) => (
                <div
                    key={gig.gigId}
                    className="bg-white rounded-xl shadow p-6 mb-4 relative"
                >
                    {/* status badge */}
                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        HIRED
                    </span>

                    <h2 className="text-xl font-semibold mb-2">{gig.title}</h2>
                    <p className="text-gray-700">Budget: ₹{gig.budget}</p>
                    <p className="text-gray-600 mt-1">{gig.description}</p>

                    {gig.hiredFreelancer && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="font-medium">
                                Freelancer: {gig.hiredFreelancer.name}
                            </p>
                            <p>Bid Amount: ₹{gig.hiredFreelancer.bidAmount}</p>
                            <p>Message: {gig.hiredFreelancer.message || "-"}</p>
                        </div>
                    )}

                    {/* reopen button */}
                    {/* <button
                        onClick={() => handleReopen(gig)}
                        disabled={loadingGigId === gig.gigId}
                        className={`mt-4 px-4 py-2 rounded text-white transition ${loadingGigId === gig.gigId
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loadingGigId === gig.gigId ? "Reopening..." : "Reopen Job"}
                    </button> */}
                </div>
            ))}
        </>
    );
};

export default HiredJobsTab;










