import {create} from "zustand";
import axios from "axios";
import {Unauthorized} from "../utility/utility.js";
import toast from "react-hot-toast";

const BaseURL = import.meta.env.VITE_BASE_URI;


const UserStore = create((set) => ({
    isLoading: false,
    setLoading: (value) => set({ isLoading: value }),


    registerInput: { fullName: "", username: "", gender:"", email:"", password: "",phone:"" },
    registerOnchange: (name, value) => {
        set((state) => ({
            registerInput:{
                ...state.registerInput,
                [name]: value
            }
        }))
    },
    RegisterRequest: async (reqBody) => {
        try{
            let url = `${BaseURL}/Register`
            let res = await axios.post(url,reqBody, {withCredentials: true})
            return res.data
        }
        catch (err){
            toast.error(err.response.data.message)
        }
    },
    // ---- login request ---------------
    loginInput : {email:"", password:""},
    loginOnchange : (name, value) => {
        set((state) => ({
            loginInput: {
                ...state.loginInput,
                [name]: value
            }
        }))
    },
    loginRequest : async (reqBody) => {
        let url = `${BaseURL}/Login`
        let res = await axios.post(url,reqBody, {withCredentials: true})
        return res.data
    },
    // ---- Read user profile  ------------
    profileList : null,
    profileListRequest: async () => {
        try{
            let url = `${BaseURL}/ReadProfile`
            let res = await axios.get(url, {withCredentials: true})
            if (res.data['status'] === 'success') {
                set({profileList: res.data.data})
            }
        }
        catch(err) {
            Unauthorized(err.response.status)
        }
    },

    SingleProfileDetailsRequest: async () => {
        try{
            let url = `${BaseURL}/SingleProfileDetails`
            let res = await axios.get(url, {withCredentials: true})
            if (res.data['status'] === 'success') {
                set({updateProfileInput: res.data.data[0]})
            }
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    // ---- update profile request
    updateProfileInput : {
        fullName:"", username:"", phone:"", gender:"", password:"", profilePicture:"", bio: "", location:"", address:"", profession:"",
    },
    UpdateProfileOnchange : (name, value) => {
        set((state) => ({
            updateProfileInput: {
                ...state.updateProfileInput,
                [name]: value
            }
        }))
    },
    profileUpdateRequest: async (reqBody) => {
        try{
            let url = `${BaseURL}/UpdateProfile`
            let res = await axios.post(url,reqBody, {withCredentials: true} )
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    // logoutRequest ---------
    LogoutRequest : async () => {
        try{
            let url = `${BaseURL}/LogOut`
            let res = await axios.post(url, {withCredentials: true})
            return res.data
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    singleProfileRead: null,
    singleProfileListRequest: async (id) => {
        try{
            let url = `${BaseURL}/singleProfileRead/${id}`
            let res = await axios.get(url, {withCredentials: true})
            if(res.data['status'] === 'success') {
                set({singleProfileRead: res.data.data})
            }
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },
    allUserList: null,
    allUserListRequest: async () => {
        try{
            let url = `${BaseURL}/seeAllUser`
            let res = await axios.get(url, {withCredentials: true})
            if(res.data['status'] === 'success') {
                set({allUserList: res.data.data})
            }
            return res.data['status'] === 'success'
        }
        catch (err){
            Unauthorized(err.response.status)
        }
    },

}))
export default UserStore