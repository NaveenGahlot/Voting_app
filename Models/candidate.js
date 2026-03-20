const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0
    }

}, {timestamps:true}) //createdAt & updatedAt

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
