const express = require("express");
const bidRouter = express.Router();

//import controller
const { protected } = require("../middleware/protected");
const { submitBid, getBidsForGig, hireBid, getAppliedJobs, rejectBid } = require("../controllers/bidController");



// mount router
bidRouter.post("/bids", protected, submitBid);
bidRouter.get("/bids/applied-jobs", protected, getAppliedJobs);
bidRouter.get("/bids/:gigId", protected, getBidsForGig);
bidRouter.patch("/bids/:bidId/hire", protected, hireBid);
bidRouter.patch("/bids/:bidId/reject", protected, rejectBid);





//export
module.exports = bidRouter;
