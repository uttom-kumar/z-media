import {
    FriendDetailService,
    FriendRequestAcceptService,
    FriendRequestSentService, SearchFriendRequestService,
    UnFriendRequestService
} from "../services/FriendRequestService.js";


export const FriendRequestSent = async (req, res) => {
    let result = await FriendRequestSentService(req, res)
    return res.json(result)
}
export const FriendRequestAccept = async (req, res) => {
    let result = await FriendRequestAcceptService(req, res)
    return res.json(result)
}

export const UnFriendRequest = async (req, res) => {
    let result = await UnFriendRequestService(req, res)
    return res.json(result)
}

export const FriendDetail = async (req, res) => {
    let result = await FriendDetailService(req, res)
    return res.json(result)
}


export const SearchFriendRequest = async (req, res) => {
    let result = await SearchFriendRequestService(req, res)
    return res.json(result)
}


