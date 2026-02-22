import React from "react";

const AppliedJobsTab = ({ submittedBids }) => {
  return (
    <>
      {submittedBids.length === 0 ? (
        <p>You have not applied for any jobs yet</p>
      ) : (
        submittedBids.map((bid) => {
          const clientName = bid.gigId?.ownerId?.name || "N/A";
          const clientInitial = clientName.charAt(0).toUpperCase();

          return (
            <div key={bid._id} className="bg-white rounded-xl shadow p-6 mb-4 relative">
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full font-semibold ${
                  bid.status === "hired"
                    ? "bg-green-100 text-green-700"
                    : bid.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {bid.status.toUpperCase()}
              </span>

              <h2 className="text-xl font-semibold mb-2">
                {bid.gigId?.title || "Gig Deleted"}
              </h2>

              <p>Budget: ₹{bid.gigId?.budget ?? "N/A"}</p>
              <p>Bid Amount: ₹{bid.price}</p>
              {/* <p>{bid.message || "-"}</p> */}

              <div className="flex items-center mt-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  {clientInitial}
                </div>
                <p>{clientName}</p>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default AppliedJobsTab;
