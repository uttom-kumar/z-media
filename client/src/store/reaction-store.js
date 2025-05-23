import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";

const BaseURL = import.meta.env.VITE_BASE_URI;


const ReactionStore = create((set) => ({
    ReactionList : null,
    ReactionListRequest : async (id) => {
        let url = `${BaseURL}/ReactionRead/${id}`
        let res = await axios.get(url, {withCredentials: true})
        if(res.data['status'] === 'success') {
            set({ReactionList: res.data.data})
        }
    },
    CreateLikeRequest: async (blogID) => {
        try{
            let url = `${BaseURL}/CreateLike`
            let res = await axios.post(url, {blogID:blogID}, {withCredentials: true})
            return res.data
        }
        catch(err) {
            Unauthorized(err.response.status)
        }
    },


}))
export default ReactionStore