const express = require("express");
const authRouter = express.Router();



//import the controller
const {registerUser, loginUser, getMe, logoutUser} = require("../controllers/auth");
const { protected } = require("../middleware/protected");



//mount the router
authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.get("/auth/me", protected, getMe);
authRouter.post("/auth/logout", logoutUser);



//export 
module.exports = authRouter;