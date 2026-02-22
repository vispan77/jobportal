const mongoose = require("mongoose");

const gigsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        budget: {
            type: Number,
            required: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ["open", "assigned"],
            default: "open"
        },

        hiredFreelancer: {
            freelancerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            bidId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Bid"
            },
            bidAmount: Number,
            message: String
        }

    },
    { timestamps: true }

)



module.exports = mongoose.model("Gigs", gigsSchema);