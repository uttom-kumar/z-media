import {
    CreateCommentService,
    deleteCommentService,
    UpdateCommentService, DetailsCommentService, SingleCommentService
} from "../services/CommentService.js";


export const CreateComment = async (req, res) => {
    let result = await CreateCommentService (req, res)
    return res.json(result)
}

export const deleteComment = async (req, res) => {
    let result = await deleteCommentService (req, res)
    return res.json(result)
}

export const DetailsComment = async (req, res) => {
    let result = await DetailsCommentService (req, res)
    return res.json(result)
}

export const SingleComment = async (req, res) => {
    let result = await SingleCommentService (req, res)
    return res.json(result)
}


export const UpdateComment = async (req, res) => {
    let result = await UpdateCommentService (req, res)
    return res.json(result)
}
