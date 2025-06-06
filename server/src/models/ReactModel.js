import mongoose from "mongoose"


const DataSchema = mongoose.Schema({
    blogID: {type : mongoose.Schema.Types.ObjectId,  required : true},
    like : {type : Number, default: 0},
    likeByUserID : [{
        userID: {type : mongoose.Schema.Types.ObjectId, required : true},
        liked : {type : Boolean, default: false},
    }],

}, {timestamps : true, versionKey : false})

export const ReactModel = mongoose.model('reacts', DataSchema)