import {create} from "zustand";
import axios from "axios";
import Cookies from "js-cookie";


const UserStore = create((set) => ({

    IsLoggedIn : () => {return !! Cookies.get('token')},

    registerInput: { fullName: "", username: "", gender:"",email:"", password: "" },
    registerOnchange: (name, value) => {
        set((state) => ({
            registerInput:{
                ...state.registerInput,
                [name]: value
            }
        }))
    },
    RegisterRequest: async (reqBody) => {
        let url = `/api/Register`
        let res = await axios.post(url,reqBody)
        if(res.data['status'] === 'success') {
            set({registerInput: res.data})
        }
        return res.data['status'] === 'success'
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
        let url = `/api/Login`
        let res = await axios.post(url,reqBody)
        return res.data
    },
    // ---- Read user profile  ------------
    profileList : null,
    profileListRequest: async () => {
        let url = `/api/ReadProfile`
        let res = await axios.get(url)
        if (res.data['status'] === 'success') {
            set({profileList: res.data.data})
        }
    },
    // ---- update profile request
    updateProfileInput : {fullName:"", gender:"", password:"", profilePicture:"", bio: "", location:""},
    UpdateProfileOnchange : (name, value) => {
        set((state) => ({
            updateProfileInput: {
                ...state.updateProfileInput,
                [name]: value
            }
        }))
    },
    profileUpdateRequest: async (reqBody) => {
        let url = `/api/UpdateProfile`
        let res = await axios.post(url,reqBody)
        if(res.data['status'] === 'success') {
            set({updateProfileInput: res.data.data})
        }
        return res.data['status'] === 'success'
    },
    // logoutRequest ---------
    LogoutRequest : async () => {
        let url = `/api/LogOut`
        await axios.get(url)
    }
}))
export default UserStore