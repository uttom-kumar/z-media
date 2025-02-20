import {
  CreateGroupService,
  UpdateGroupService,
  ReadGroupService,
  CreateGroupPostService,
  UpdateGroupPostService,
  DeleteGroupPostService,
  UpdateBySinglePostListService,
  GroupPostAddLikeService, GroupPostRemoveLikeService
} from "../services/GroupService.js";

// create and update both working
export const CreateGroup =async (req, res) => {
  let result = await CreateGroupService(req)
  return res.json(result)
}


export const UpdateGroup =async (req, res) => {
  let result = await UpdateGroupService(req)
  return res.json(result)
}



export const ReadGroup =async (req, res) => {
  let result = await ReadGroupService(req)
  return res.json(result)
}



export const CreateGroupPost =async (req, res) => {
  let result = await CreateGroupPostService(req)
  return res.json(result)
}


export const UpdateGroupPost =async (req, res) => {
  let result = await UpdateGroupPostService(req)
  return res.json(result)
}

export const DeleteGroupPost =async (req, res) => {
  let result = await DeleteGroupPostService(req)
  return res.json(result)
}


export const UpdateBySinglePostList =async (req, res) => {
  let result = await UpdateBySinglePostListService(req)
  return res.json(result)
}


export const GroupPostAddLike =async (req, res) => {
  let result = await GroupPostAddLikeService(req)
  return res.json(result)
}




export const GroupPostRemoveLike =async (req, res) => {
  let result = await GroupPostRemoveLikeService(req)
  return res.json(result)
}


