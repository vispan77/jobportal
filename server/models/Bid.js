const mongoose = require("mongoose");



const bidSchema = new mongoose.Schema(
    {
        gigId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gigs",
            required: true
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        message: {
            type: String,

        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "hired", "rejected"],
            default: "pending"
        }

    },
    { timestamps: true }
)


module.exports = mongoose.model("Bid", bidSchema)