import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";


const ReactionStore = create((set) => ({
    ReactionList : null,
    ReactionListRequest : async (id) => {
        let url = `/api/ReactionRead/${id}`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({ReactionList: res.data.data})
        }
    },
    CreateLikeRequest: async (blogID) => {
        try{
            let url = `/api/CreateLike`
            let res = await axios.post(url, {blogID:blogID})
            return res.data
        }
        catch(err) {
            Unauthorized(err.response.status)
        }
    },


}))
export default ReactionStore