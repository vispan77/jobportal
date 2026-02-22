const express = require("express");
const gigsRouter = express.Router();

// import the controller
const { protected } = require("../middleware/protected"); 
const { createGigs, getOpenGigs, getGigById, getAssignedGigs, reopenGig, deleteGig } = require("../controllers/gigsController");

// mount router
gigsRouter.post("/gigs", protected, createGigs);
gigsRouter.get("/gigs", getOpenGigs);
gigsRouter.get("/gigs/assigned", protected, getAssignedGigs);
gigsRouter.get("/gigs/:gigId", getGigById);
gigsRouter.put("/gigs/reopen/:gigId", protected, reopenGig);
gigsRouter.delete("/gigs/:gigId", protected, deleteGig);



// export
module.exports = gigsRouter;

