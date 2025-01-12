import {ReactModel} from "../models/ReactModel.js";


export const CreateLikeService = async (req) => {
    try {
        let userID = req.headers.user_id
        const { blogID } = req.body;

        // Find the reaction document for the blog
        const reaction = await ReactModel.findOne({ blogID:blogID });

        if (!reaction) {
            // If no reaction document exists, create one
            await ReactModel.create({
                blogID:blogID,
                like: 1,
                likeByUserID: [userID],
            });
            return { status: "success", message: "Blog liked successfully!" };
        }

        // Check if the user has already liked the blog
        if (reaction.likeByUserID.includes(userID)) {
            return { status: "fail", message: "You have already liked this blog." };
        }

        // Update the like count and add the userID to likeByUserID
        reaction.like += 1;
        reaction.likeByUserID.push(userID);

        // If the user had disliked the blog, remove the dislike
        if (reaction.dislikeByUserID.includes(userID)) {
            reaction.dislike -= 1;
            reaction.dislikeByUserID = reaction.dislikeByUserID.filter(id => id.toString() !== userID);
        }

        await reaction.save();
        return { status: "success", message: "Blog liked successfully!" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
};


export const CreateDisLikeService = async (req) => {
    try {
        let userID = req.headers.user_id
        const { blogID } = req.body


        // Find the reaction document for the blog
        const reaction = await ReactModel.findOne({ blogID });

        if (!reaction) {
            // If no reaction document exists, create one
            await ReactModel.create({
                blogID,
                dislike: 1,
                dislikeByUserID: [userID],
            });
            return { status: "success", message: "Blog disliked successfully!" };
        }

        // Check if the user has already disliked the blog
        if (reaction.dislikeByUserID.includes(userID)) {
            return { status: "fail", message: "You have already disliked this blog." };
        }

        // Update the dislike count and add the userID to dislikeByUserID
        reaction.dislike += 1;
        reaction.dislikeByUserID.push(userID);

        // If the user had liked the blog, remove the like
        if (reaction.likeByUserID.includes(userID)) {
            reaction.like -= 1;
            reaction.likeByUserID = reaction.likeByUserID.filter(id => id.toString() !== userID);
        }

        await reaction.save();
        return { status: "success", message: "Blog disliked successfully!" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
};


export const ReactionReadService = async (req) => {
    try {
        const  blogID  = req.params.id

        const reaction = await ReactModel.findOne({ blogID });

        if (!reaction) {
            return { status: "fail", message: "No reactions found for this blog." };
        }

        return {
            status: "success",
            data: reaction
        };
    } catch (err) {
        return { status: "error", message: err.message };
    }
};