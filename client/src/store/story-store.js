import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";

const BaseURL = import.meta.env.VITE_BASE_URI;


const StoryStore = create((set) => ({
  storyList:null,
  storyListRequest: async () => {
    try{
      let url = `${BaseURL}/ReadStory`
      let res = await axios.get(url, {withCredentials: true})
      if(res.data['status'] === 'success') {
        set({storyList: res.data.data})
      }
    }
    catch (err){
      Unauthorized(err.response.status)
    }
  },


  // ---- create story -----
  storyInput: {text:"" , background:"", imageUrl:""},
  storyOnchange : (name, value) => {
    set((state) => ({
      storyInput: {
        ...state.storyInput,
        [name]: value
      }
    }))
  },
  createStoryRequest: async (reqBody) => {
    let url = `${BaseURL}/CreateStory`
    let res = await axios.post(url, reqBody, {withCredentials: true})
    return res.data['status'] === "success"
  },
  // ---- delete story request ----
  deleteStoryRequest: async (id) => {
    let url = `${BaseURL}/DeleteStory`
    let res = await axios.delete(url,id ,{withCredentials: true})
    return res.data
  },

  // ---- single story details ----
  singleStoryList : null,
  ReadSingleStoryRequest: async (id) => {
    let url = `${BaseURL}/ReadSingleStory/${id}`
    let res = await axios.get(url, {withCredentials: true})
    set({singleStoryList: res.data.data})
  },

}))
export default StoryStore