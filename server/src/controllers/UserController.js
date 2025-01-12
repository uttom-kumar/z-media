import {
    DeleteProfileService,
    LoginService,
    LogOutProfileService, ProfileAllDetailsService,
    ReadProfileService,
    RegisterService,
    UpdateProfileService,
} from "../services/UserService.js";


export const Register = async (req, res) => {
    let result = await  RegisterService(req, res)
    return res.json(result)
}
export const Login = async (req, res) => {
    let result = await LoginService (req, res)
    return res.json(result)
}
export const UpdateProfile = async (req, res) => {
    let result = await UpdateProfileService (req, res)
    return res.json(result)
}

export const ReadProfile = async (req, res) => {
    let result = await ReadProfileService (req, res)
    return res.json(result)
}

export const LogOutProfile = async (req, res) => {
    let result = await LogOutProfileService (req, res)
    return res.json(result)
}

export const DeleteProfile = async (req, res) => {
    let result = await DeleteProfileService (req, res)
    return res.json(result)
}

export const ProfileAllDetails = async (req, res) => {
    let result = await ProfileAllDetailsService (req, res)
    return res.json(result)
}
