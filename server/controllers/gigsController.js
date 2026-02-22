const Bid = require("../models/Bid");
const Gigs = require("../models/Gigs");

exports.createGigs = async (req, res) => {
    try {
        const ownerId = req.user.id;

        //fecth the data from the request
        const { title, description, budget, status } = req.body;

        //validate
        if (!title || !description || !budget || !status) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            })
        }
        //save in the data base
        const gigs = await Gigs.create({
            title,
            description,
            budget,
            ownerId,
            status: status 
        })

        return res.status(200).json({
            success: true,
            message: "Jobs created successfully",
            data: gigs
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating gigs"
        })
    }
}







// fetch all open gigs with optional simple search
exports.getOpenGigs = async (req, res) => {
  try {
    const search = req.query.search; 

    // get all open gigs from database
    let gigs = await Gigs.find({ status: "open" }).populate("ownerId", "id name email").sort({ createdAt: -1 });

    // if search exists, filter in JavaScript
    if (search) {
      const searchLower = search.toLowerCase(); 
      gigs = gigs.filter(
        gig =>
          gig.title.toLowerCase().includes(searchLower) ||
          gig.description.toLowerCase().includes(searchLower)
      );
    }

    // return response
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching gigs"
    });
  }
};




//get individuals gigs
exports.getGigById = async (req, res) => {
  try {
    const { gigId } = req.params;
    console.log("Gig ID received:", gigId);

    const gig = await Gigs.findById(gigId).populate(
      "ownerId",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      gig,
    });
  } catch (error) {
    console.error("ERROR FETCHING GIG:", error); 

    res.status(500).json({
      success: false,
      message: "Failed to fetch gig",
    });
  }
};




//  get all assigned gigs for logged-in owner 
exports.getAssignedGigs = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const assignedGigs = await Gigs.find({ ownerId, status: "assigned" });
    console.log("Assigned Gigs:", assignedGigs);

    const result = await Promise.all(
      assignedGigs.map(async (gig) => {
        const hiredBid = await Bid.findOne({ gigId: gig._id, status: "hired" })
          .populate("freelancerId", "name email")
          .exec();
        console.log(`Hired Bid for gig ${gig._id}:`, hiredBid);

        return {
          gigId: gig._id,
          title: gig.title,
          description: gig.description,
          budget: gig.budget,
          status: gig.status,
          hiredFreelancer: hiredBid
            ? {
                id: hiredBid.freelancerId?._id,
                name: hiredBid.freelancerId?.name,
                email: hiredBid.freelancerId?.email,
                bidAmount: hiredBid.price,
                message: hiredBid.message,
              }
            : null,
        };
      })
    );

    console.log("Final result:", result);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("ERROR FETCHING ASSIGNED GIGS:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching assigned gigs",
    });
  }
};



exports.reopenGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gigs.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // reset all hired and rejected bids to pending
    const result = await Bid.updateMany(
      { gigId: gig._id, status: { $in: ["hired", "rejected"] } },
      { status: "pending" }
    );
    console.log(`${result.modifiedCount} bids reset to pending`);

    // Reset gig
    gig.status = "open";
    gig.hiredFreelancer = {};
    await gig.save();

    res.status(200).json({
      success: true,
      message: "Gig reopened successfully",
    });
  } catch (error) {
    console.error("ERROR REOPENING GIG:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while reopening gig",
    });
  }
};






// delete a gig along with all its bids
exports.deleteGig = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { gigId } = req.params;

    // find the gig
    const gig = await Gigs.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // check if the logged-in user is the owner
    if (gig.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this gig",
      });
    }

    // delete all bids attached with this gig
    await Bid.deleteMany({ gigId: gig._id });

    // delete the gig
    await Gigs.findByIdAndDelete(gig._id);

    res.status(200).json({
      success: true,
      message: "Gig and all its bids deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gig:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting gig",
    });
  }
};





