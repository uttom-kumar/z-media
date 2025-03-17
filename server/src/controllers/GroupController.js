import {
  CreateGroupService,
  UpdateGroupService,
  ReadGroupService,
  CreateGroupPostService,
  UpdateGroupPostService,
  DeleteGroupPostService,
  UpdateBySinglePostListService,
  GroupPostAddLikeService,
  GroupPostRemoveLikeService,
  GroupCreateCommentService,
  GroupUpdateCommentService,
  GroupSingleReadCommentService,
  GroupByDeleteCommentService,
  AddCommentReplyService,
  UpdateCommentOrReplyService,
  DeleteCommentReplyService,
  SingleReadCommentReplyService,
  UpdateUserRoleInGroupService,
  addFollowerByGroupService,
  removeFollowerByGroupService
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

// ----** Create comment section

export const GroupCreateComment =async (req, res) => {
  let result = await GroupCreateCommentService(req)
  return res.json(result)
}



export const GroupUpdateComment =async (req, res) => {
  let result = await GroupUpdateCommentService(req)
  return res.json(result)
}

export const GroupSingleReadComment =async (req, res) => {
  let result = await GroupSingleReadCommentService(req)
  return res.json(result)
}


export const GroupByDeleteComment =async (req, res) => {
  let result = await GroupByDeleteCommentService(req)
  return res.json(result)
}


// add to comment reply
export const AddCommentReply =async (req, res) => {
  let result = await AddCommentReplyService(req)
  return res.json(result)
}

export const UpdateCommentOrReply =async (req, res) => {
  let result = await UpdateCommentOrReplyService(req)
  return res.json(result)
}

export const DeleteCommentReply =async (req, res) => {
  let result = await DeleteCommentReplyService(req)
  return res.json(result)
}


export const SingleReadCommentReply =async (req, res) => {
  let result = await SingleReadCommentReplyService(req)
  return res.json(result)
}



export const addFollowerByGroup =async (req, res) => {
  let result = await addFollowerByGroupService(req)
  return res.json(result)
}



export const removeFollowerByGroup =async (req, res) => {
  let result = await removeFollowerByGroupService(req)
  return res.json(result)
}







// Update User Role In Group Service
export const UpdateUserRoleInGroup =async (req, res) => {
  let result = await UpdateUserRoleInGroupService(req)
  return res.json(result)
}


