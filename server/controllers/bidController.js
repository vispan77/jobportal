const Bid = require("../models/Bid");
const Gigs = require("../models/Gigs");

// submit a bid for a gig
exports.submitBid = async (req, res) => {
  try {
    //fetch data 
    const freelancerId = req.user.id;
    const { gigId, price, message } = req.body;

    // validate
    if (!gigId || !price) {
      return res.status(401).json({
        success: false,
        message: "Gig ID and price are required"
      });
    }

    // check if gig exists and is open
    const gig = await Gigs.findById(gigId);
    if (!gig) {
      return res.status(401).json({
        success: false,
        message: "Gig not found"
      });
    }

    if (gig.status !== "open") {
      return res.status(401).json({
        success: false,
        message: "You cannot bid on a closed gig"
      });
    }

    // prevent duplicate bid by same freelancer
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(401).json({
        success: false,
        message: "You have already placed a bid on this gig"
      });
    }

    // create bid
    const bid = await Bid.create({
      gigId,
      freelancerId,
      price,
      message
    });

    res.status(200).json({
      success: true,
      message: "Bid submitted successfully",
      data: bid
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting bid"
    });
  }
};






// get all bids for a specific gig (Owner only)
exports.getBidsForGig = async (req, res) => {
  try {
    //fectch data
    const userId = req.user.id;
    const gigId = req.params.gigId;

    // check if gig exists or not
    const gig = await Gigs.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found"
      });
    }

    // login-in user is the owner of the gig
    if (gig.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view bids for this gig"
      });
    }

    //  get all bids for this gig
    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching bids"
    });
  }
};






//hired bids
exports.hireBid = async (req, res) => {
  try {
    const userId = req.user.id;
    const bidId = req.params.bidId;

    // find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

    // check gig
    const gig = await Gigs.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found"
      });
    }

    //  check owner of gig
    if (gig.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    //  hire selected bid
    await Bid.findByIdAndUpdate(bidId, { status: "hired" });

    //  reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" }
    );

    //  update gig status
    await Gigs.findByIdAndUpdate(gig._id, { status: "assigned" });

    res.status(200).json({
      success: true,
      message: "Freelancer hired successfully (no transaction)"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Hiring failed"
    });
  }
};






// get all applied jobs for logged-in user 
exports.getAppliedJobs = async (req, res) => {
  try {
    const freelancerId = req.user.id; 

    const appliedJobs = await Bid.find({ freelancerId })
      .populate({
        path: "gigId",
        select: "title description budget status createdAt ownerId",
        populate: {
          path: "ownerId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appliedJobs.length,
      data: appliedJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs",
    });
  }
};





// Reject a single bid (manual reject)
exports.rejectBid = async (req, res) => {
  try {
    const userId = req.user.id;  
    const bidId = req.params.bidId;

    // find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    // check the gig associated with this bid
    const gig = await Gigs.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    // only the gig owner can reject bids
    if (gig.ownerId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // update bid status to rejected
    bid.status = "rejected";
    await bid.save();

    res.status(200).json({ success: true, message: "Bid rejected successfully", bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to reject bid" });
  }
};








