import mongoose from "mongoose"


const DataSchema = mongoose.Schema({
    blogID: {type : mongoose.Schema.Types.ObjectId,  required : true},

    like : {type : Number, default: 0},
    dislike : {type : Number, default: 0},
    likeByUserID : [{type : mongoose.Schema.Types.ObjectId, required : true}],
    dislikeByUserID : [{type : mongoose.Schema.Types.ObjectId, required : true}],

}, {timestamps : true, versionKey : false})

export const ReactModel = mongoose.model('reacts', DataSchema)