const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.protected = async (req, res, next) => {
    try {
        // fetch token from cookies or header
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        // validate token 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing. Please login",
            });
        }

        try {
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // attach user data to request
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating token",
        });
    }
};
