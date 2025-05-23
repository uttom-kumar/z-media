import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";

const BaseURL = import.meta.env.VITE_BASE_URI;

const CommentStore = create((set) => ({
    CommentListDetail : null,
    commentListDetailsRequest : async (id) => {
        let url = `${BaseURL}/DetailsComment/${id}`
        let res = await axios.get(url,{withCredentials: true})
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
            let url = `${BaseURL}/CreateComment`
            let res = await axios.post(url,reqBody,{withCredentials: true})
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
        let url = `${BaseURL}/SingleComment/${blogID}?commentID=${commentID}`;
        let res = await axios.get(url,{withCredentials: true})
        console.log(res)
        if(res.data['status'] === 'success') {
            set({commentUpdateInput: res.data.data})
        }
    },
    updateCommentRequest : async (blogID,commentID,reqBody) => {
        try{
            let url = `${BaseURL}/UpdateComment/${blogID}?commentID=${commentID}`;
            let res = await axios.post(url,reqBody,{withCredentials: true})
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
        let url = `${BaseURL}/deleteComment`
        let res = await axios.post(url,{blogID:blogID, commentID:commentID},{withCredentials: true})
        return res.data['status'] === 'success'
    }


}))
export default CommentStore