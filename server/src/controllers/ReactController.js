import {CreateLikeService, ReactionReadService} from "../services/ReactService.js";


export const CreateLike = async (req, res) => {
    let result = await CreateLikeService(req)
    return res.json(result)
}


export const ReactionRead = async (req, res) => {
    let result = await ReactionReadService(req)
    return res.json(result)
}