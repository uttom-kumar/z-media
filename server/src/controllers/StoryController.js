import {
  CreateStoryService,
  DeleteStoryService,
  ReadSingleStoryService,
  ReadStoryService
} from "../services/StoryService.js";


export const CreateStory = async (req, res) => {
  let result = await CreateStoryService(req)
  return res.json(result)
}
export const ReadStory = async (req, res) => {
  let result = await ReadStoryService(req)
  return res.json(result)
}



export const DeleteStory = async (req, res) => {
  let result = await DeleteStoryService(req)
  return res.json(result)
}

export const ReadSingleStory = async (req, res) => {
  let result = await ReadSingleStoryService(req)
  return res.json(result)
}

