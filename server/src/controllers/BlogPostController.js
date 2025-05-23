import {
    CreateBlogPostService,
    deleteBlogPostService, ListByKeywordService, PostListDetailService,
    ReadBlogPostService,
    SingleUserReadBlogService, UpdateBlogPostService, UserByBlogPostListService, UserBySingleListDetailService
} from "../services/BlogPostService.js";


export const CreateBlogPost = async (req, res) => {
    let result = await CreateBlogPostService (req, res)
    return res.json(result)
}
export const ReadBlogPost = async (req, res) => {
    let result = await ReadBlogPostService (req, res)
    return res.json(result)
}

export const SingleUserReadBlog = async (req, res) => {
    let result = await SingleUserReadBlogService (req, res)
    return res.json(result)
}
export const UserByBlogPostList = async (req, res) => {
    let result = await UserByBlogPostListService (req, res)
    return res.json(result)
}

export const deleteBlogPost = async (req, res) => {
    let result = await deleteBlogPostService (req, res)
    return res.json(result)
}
export const UpdateBlogPost = async (req, res) => {
    let result = await UpdateBlogPostService (req, res)
    return res.json(result)
}

export const PostListDetail = async (req, res) => {
    let result = await PostListDetailService (req, res)
    return res.json(result)
}

export const ListByKeyword = async (req, res) => {
    let result = await ListByKeywordService (req, res)
    return res.json(result)
}

export const UserBySingleListDetails = async (req, res) => {
    let result = await UserBySingleListDetailService (req, res)
    return res.json(result)
}