import { useEffect, useState } from "react";
import {
    getMe,
    getOpenGigs,
    getBidsForGig,
    getUserSubmittedBids,
    hireBid,
    getAssignedGigs,
    deleteGig
} from "../api/authApi";
import { toast } from "react-hot-toast";

import PostedJobsTab from "../../components/PostedJobsTab";
import AppliedJobsTab from "../../components/AppliedJobsTab";
import HiredJobsTab from "../../components/HiredJobsTab";
import api from "../api/api";

const OwnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [gigs, setGigs] = useState([]);
    const [bids, setBids] = useState([]);
    const [submittedBids, setSubmittedBids] = useState([]);
    const [assignedGigs, setAssignedGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedGigId, setExpandedGigId] = useState(null);
    const [updatingBidId, setUpdatingBidId] = useState(null);
    const [activeTab, setActiveTab] = useState("posted");

    //  get user 
    const fetchUser = async () => {
        try {
            const res = await getMe();
            setUser(res.data.user);
        } catch {
            toast.error("Failed to fetch user");
        }
    };


    //  get the user posted jobs 
    const fetchUserGigs = async () => {
        try {
            const res = await getOpenGigs();
            if (!user) return;
            setGigs(res.data.data.filter(gig => gig.ownerId._id === user._id));
        } catch {
            toast.error("Failed to fetch your gigs");
        }
    };


    //  get the all the bids for the jobs
    const fetchBids = async (gigId) => {
        try {
            if (!gigId) {
                setExpandedGigId(null);
                setBids([]);
                return;
            }

            const res = await getBidsForGig(gigId);
            setBids(res.data.data);
            setExpandedGigId(gigId);
        } catch {
            toast.error("Failed to fetch bids");
        }
    };


    // get the user applied for jobs
    const fetchSubmittedBids = async () => {
        try {
            const res = await getUserSubmittedBids();
            setSubmittedBids(res.data.data);
        } catch {
            toast.error("Failed to fetch your applied jobs");
        }
    };


    // get the freelancer hired for jobs
    const fetchAssignedGigs = async () => {
        try {
            const res = await getAssignedGigs();
            setAssignedGigs(res.data.data);
        } catch {
            toast.error("Failed to fetch assigned gigs");
        }
    };


    // get the hire bids
    const handleHire = async (bidId) => {
        try {
            setUpdatingBidId(bidId);
            await hireBid(bidId);

            toast.success("Freelancer hired successfully!");

            // remove gig from Posted Jobs
            if (expandedGigId) {
                setGigs(prev => prev.filter(gig => gig._id !== expandedGigId));
                setExpandedGigId(null);
                setBids([]);
            }

            fetchAssignedGigs();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to hire freelancer");
        } finally {
            setUpdatingBidId(null);
        }
    };


    // rejected bids
    const handleReject = async (bidId) => {
        try {
            setUpdatingBidId(bidId);
            await api.patch(`/bids/${bidId}/reject`);

            toast.success("Bid rejected successfully!");
            setBids(prev => prev.filter(bid => bid._id !== bidId));
        } catch {
            toast.error("Failed to reject bid");
        } finally {
            setUpdatingBidId(null);
        }
    };

    // delete jobs
    const handleDeleteGig = async (gigId) => {
        try {
            await deleteGig(gigId);


            setGigs(prev => prev.filter(gig => gig._id !== gigId));

            // reset expanded state if needed
            if (expandedGigId === gigId) {
                setExpandedGigId(null);
                setBids([]);
            }

            toast.success("Job deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete gig");
            throw error;
        }
    };


    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserGigs();
            fetchSubmittedBids();
            fetchAssignedGigs();
            setLoading(false);
        }
    }, [user]);

    // render
    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!user) return <p className="text-center mt-10">You must be logged in</p>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{user.name}'s Dashboard</h1>

            <div className="flex gap-4 mb-6">
                {["posted", "applied", "hired"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        {tab === "posted" && "Posted Jobs"}
                        {tab === "applied" && "Applied Jobs"}
                        {tab === "hired" && "Hired Freelancer"}
                    </button>
                ))}
            </div>

            {/* posted jobs */}
            {activeTab === "posted" && (
                <PostedJobsTab
                    gigs={gigs}
                    bids={bids}
                    expandedGigId={expandedGigId}
                    fetchBids={fetchBids}
                    handleHire={handleHire}
                    handleReject={handleReject}
                    setBids={setBids}
                    deleteGig={handleDeleteGig}
                    updatingBidId={updatingBidId}
                />
            )}


            {/* applied jobs */}
            {activeTab === "applied" && (
                <AppliedJobsTab submittedBids={submittedBids} />
            )}


            {/* hired jobs */}
            {activeTab === "hired" && (
                <HiredJobsTab
                    assignedGigs={assignedGigs}
                    setAssignedGigs={setAssignedGigs}
                />
            )}
        </div>
    );
};

export default OwnerDashboard;
