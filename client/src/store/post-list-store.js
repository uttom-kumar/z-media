import { create } from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";

const BlogPostStore = create((set) => ({
    blogPostRead: null,
    blogPostReadRequest: async () => {
        let url = `/api/ReadBlogPost`;
        let res = await axios.get(url);
        if (res.data['status'] === 'success') {
            set({ blogPostRead: res.data.data });
        }
    },
    PostListDetail: null,
    BlogListDetailRequest: async (blogID) => {
        let url = `/api/PostListDetail/${blogID}`;
        let res = await axios.get(url);
        if (res.data['status'] === 'success') {
            set({ PostListDetail: res.data.data });
        }
    },
    // create blog post request ---------------
    blogInput: { title : "", image: "", role: "" },
    blogOnchange: (name, value) => {
        set((state) => ({
            blogInput: {
                ...state.blogInput,
                [name]: value
            }
        }))
    },
    CreateBlogPostRequest : async (reqBody) => {
        try{
            let url = `/api/CreateBlogPost`
            let res = await axios.post(url,reqBody)
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    // -- update blog post request---------
    updateBLogInput : {title: "", image: "",role:""},
    updateBlogOnchange: (name, value) => {
        set((state) => ({
            updateBLogInput: {
                ...state.updateBLogInput,
                [name]: value
            }
        }))
    },
    singlePostListRequest : async (id) => {
        let url = `/api/SingleDataShow/${id}`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({updateBLogInput: res.data.data});
        }
    },
    UpdatePostListRequest : async (id, reqBody) => {
        try{
            let url = `/api/UpdateBlogPost/${id}`
            let res = await axios.post(url,reqBody)
            // if(res.data['status'] === 'success') {
            //     set({updateBLogInput: res.data.data});
            // }
            return res.data['status'] === 'success'
        }
        catch (err) {
            Unauthorized(err.response?.status)
        }
    },
    // ----Delete Blog post Request ---------------------
    DeletePostListRequest : async (id) => {
        try{
            let url = `/api/deleteBlogPost/${id}`
            let res = await axios.get(url)
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    // ----User Filter by Blog post Request ---------------------
    UserByBlogPostList : null,
    UserByBlogPostListRequest : async () => {
        let url = `/api/UserByBlogPostList`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({UserByBlogPostList: res.data.data})
        }
    },
    // ----Blog post search keyword  request
    SearchInput: "",
    SearchByPostListRequest : async (keyword) => {
        set({SearchInput : keyword})
    },
    UserBySingleListDetails:null,
    UserBySingleListDetailsRequest: async (userID) => {
        let url = `/api/UserBySingleListDetails/${userID}`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({UserBySingleListDetails: res.data.data})
        }
    }

}));

export default BlogPostStore;
