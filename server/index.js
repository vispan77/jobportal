const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");


//dotenv for environment
dotenv.config();


const cors = require("cors");

app.use(
    cors({
        origin: ["http://localhost:5173", "https://jobportal-olive-nine.vercel.app"], 
        credentials: true,
    })
);



//middleware
app.use(express.json());
app.use(cookieParser());

//database connection
const dbConnect = require("./config/dbConnect");
dbConnect();

//router
const authRouter = require("./routes/auth");
const gigsRouter = require("./routes/gigsRoutes");
const bidRouter = require("./routes/bidroutes");

app.use("/api", authRouter);
app.use("/api", gigsRouter);
app.use("/api", bidRouter);


const PORT = process.env.PORT || 3000;

//connecting to the server
app.listen(PORT, () => {
    console.log(`Server is listening at Port ${PORT}`);
})

//home page 
app.get("/", (req, res) => {
    res.send("Welcome to the server");
})


