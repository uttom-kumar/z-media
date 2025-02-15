import {create} from "zustand";
import axios from "axios";


const FriendStore = create((set) => ({

    SendFollowRequest: async (targetUserId) => {
        let url = `/api/Follower`
        let res = await axios.post(url, { targetUserId });
        return res.data["status"] === "success";
    },

    acceptFollowRequest : async (targetUserId) => {
        let url = `/api/AcceptFollow`
        let res = await axios.post(url, {targetUserId});
        return res.data["status"] === "success"
    },

    UnFollowRequest : async (targetUserId) => {
        let url = `/api/UnFollow`
        let res = await axios.post(url, {targetUserId});
        return res.data["status"] === "success"
    },

    FollowerList: null,
    getFollowerRequest : async (userID) => {
        let url = `/api/GetFollower/${userID}`;
        let res = await axios.get(url);
        if(res.data['status'] === 'success') {
            set({FollowerList: res.data.data})
        }
    },

    FollowingList: null,
    getFollowingRequest : async (userID) => {
        let url = `/api/GetFollowing/${userID}`;
        let res = await axios.get(url);
        if(res.data['status'] === 'success') {
            set({FollowingList: res.data.data})
        }
    },

    MutualFriendList: null,
    getMutualFriendListRequest : async (userID) => {
        let url = `/api/GetMutualFollow/${userID}`;
        let res = await axios.get(url);
        if(res.data['status'] === 'success') {
            set({MutualFriendList: res.data.data})
        }
    },

    // --- SearchFriendRequest---------------
    SearchKeyword : [],
    searchUsersRequest : async (keyword) => {
        let url = `/api/SearchFriend`
        let res = await axios.get(url,keyword)
        console.log(res)
        set({SearchKeyword: res.data.data});
    }


}))
export default FriendStore