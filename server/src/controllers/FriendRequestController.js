import {
    acceptFollowService,
    FollowerService,
    GetFollowerService, GetFollowingService, GetMutualFollowService,
    SearchFriendRequestService,
    UnfollowService
} from "../services/FriendRequestService.js";


export const Follower = async (req, res) => {
    let result = await FollowerService(req)
    return res.json(result)
}

export const AcceptFollow = async (req, res) => {
    let result = await acceptFollowService(req, res)
    return res.json(result)
}

export const UnFollow = async (req, res) => {
    let result = await UnfollowService(req, res)
    return res.json(result)
}




export const SearchFriend = async (req, res) => {
    let result = await SearchFriendRequestService(req, res)
    return res.json(result)
}



export const GetFollower = async (req, res) => {
    let result = await GetFollowerService(req, res)
    return res.json(result)
}

export const GetFollowing = async (req, res) => {
    let result = await GetFollowingService(req, res)
    return res.json(result)
}


export const GetMutualFollow = async (req, res) => {
    let result = await GetMutualFollowService(req, res)
    return res.json(result)
}




