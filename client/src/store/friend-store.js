import {create} from "zustand";
import axios from "axios";


const BaseURL = import.meta.env.VITE_BASE_URI;

const FriendStore = create((set) => ({

    SendFollowRequest: async (targetUserId) => {
        let url = `${BaseURL}/Follower`
        let res = await axios.post(url, { targetUserId },{withCredentials: true});
        return res.data["status"] === "success";
    },

    acceptFollowRequest : async (targetUserId) => {
        let url = `${BaseURL}/AcceptFollow`
        let res = await axios.post(url, {targetUserId},{withCredentials: true});
        return res.data["status"] === "success"
    },

    UnFollowRequest : async (targetUserId) => {
        let url = `${BaseURL}/UnFollow`
        let res = await axios.post(url, {targetUserId},{withCredentials: true});
        return res.data["status"] === "success"
    },

    FollowerList: null,
    getFollowerRequest : async (userID) => {
        let url = `${BaseURL}/GetFollower/${userID}`;
        let res = await axios.get(url,{withCredentials: true});
        if(res.data['status'] === 'success') {
            set({FollowerList: res.data.data})
        }
    },

    FollowingList: null,
    getFollowingRequest : async (userID) => {
        let url = `${BaseURL}/GetFollowing/${userID}`;
        let res = await axios.get(url,{withCredentials: true});
        if(res.data['status'] === 'success') {
            set({FollowingList: res.data.data})
        }
    },

    MutualFriendList: null,
    getMutualFriendListRequest : async (userID) => {
        let url = `${BaseURL}/GetMutualFollow/${userID}`;
        let res = await axios.get(url,{withCredentials: true});
        if(res.data['status'] === 'success') {
            set({MutualFriendList: res.data.data})
        }
    },

    // --- SearchFriendRequest---------------
    SearchKeyword : '',
    searchUsersRequest : async (keyword) => {
        set({SearchKeyword : keyword})
    }


}))
export default FriendStore