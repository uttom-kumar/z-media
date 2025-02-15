import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";

const CommentStore = create((set) => ({
    CommentListDetail : null,
    commentListDetailsRequest : async (id) => {
        let url = `/api/DetailsComment/${id}`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({CommentListDetail: res.data.data})
        }
    },
    commentInput : {text : ""},
    commentOnchange: (name, value) => {
        set((state) => ({
            commentInput: {
                ...state.commentInput,
                [name]: value
            }
        }))
    },
    CreateCommentRequest : async (reqBody) => {
        try{
            let url = `/api/CreateComment`
            let res = await axios.post(url,reqBody)
            return res.data['status'] === 'success'
        }
        catch(err) {
            Unauthorized(err.response.status)
        }
    },
    // update comment -------------
    commentUpdateInput : {text : ""},
    commentUpdateOnchange: (name, value) => {
        set((state) => ({
            commentUpdateInput: {
                ...state.commentUpdateInput,
                [name]: value
            }
        }))
    },
    singleCommentRequest : async (blogID,commentID) => {
        let url = `/api/SingleComment/${blogID}?commentID=${commentID}`;
        let res = await axios.get(url)
        console.log(res)
        if(res.data['status'] === 'success') {
            set({commentUpdateInput: res.data.data})
        }
    },
    updateCommentRequest : async (blogID,commentID,reqBody) => {
        try{
            let url = `/api/UpdateComment/${blogID}?commentID=${commentID}`;
            let res = await axios.post(url,reqBody)
            if(res.data['status'] === 'success') {
                set({commentUpdateInput: res.data.data})
            }
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },

    //delete comment
    deleteCommentRequest : async (blogID, commentID) => {
        console.log(blogID, commentID)
        let url = `/api/deleteComment`
        let res = await axios.post(url,{blogID:blogID, commentID:commentID})
        return res.data['status'] === 'success'
    }


}))
export default CommentStore