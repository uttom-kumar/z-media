import {create} from "zustand";
import axios from "axios";


const StoryStore = create((set) => ({
  storyList:null,
  storyListRequest: async () => {
    let url = `/api/ReadStory`
    let res = await axios.get(url)
    if(res.data['status'] === 'success') {
      set({storyList: res.data.data})
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
    let url = `/api/CreateStory`
    let res = await axios.post(url, reqBody)
    return res.data['status'] === "success"
  },
  // ---- delete story request ----
  deleteStoryRequest: async (id) => {
    let url = `/api/DeleteStory`
    let res = await axios.delete(url,id)
    return res.data
  },

  // ---- single story details ----
  singleStoryList : null,
  ReadSingleStoryRequest: async (id) => {
    let url = `/api/ReadSingleStory/${id}`
    let res = await axios.get(url)
    set({singleStoryList: res.data.data})
  },

}))
export default StoryStore