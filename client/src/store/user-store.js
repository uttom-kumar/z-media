import {create} from "zustand";
import axios from "axios";


const UserStore = create((set) => ({


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
        let url = `/api/Register`
        let res = await axios.post(url,reqBody)
        return res.data
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
        let url = `https://z-media-rest-api.onrender.com/api/Login`
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

    SingleProfileDetailsRequest: async () => {
        let url = `/api/SingleProfileDetails`
        let res = await axios.get(url)
        if (res.data['status'] === 'success') {
            set({updateProfileInput: res.data.data[0]})
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
        let url = `/api/UpdateProfile`
        let res = await axios.post(url,reqBody)
        return res.data['status'] === 'success'
    },
    // logoutRequest ---------
    LogoutRequest : async () => {
        let url = `/api/LogOut`
        let res = await axios.post(url)
        return res.data
    },
    singleProfileRead: null,
    singleProfileListRequest: async (id) => {
        let url = `/api/singleProfileRead/${id}`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({singleProfileRead: res.data.data})
        }
        return res.data['status'] === 'success'
    },
    allUserList: null,
    allUserListRequest: async () => {
        let url = `/api/seeAllUser`
        let res = await axios.get(url)
        if(res.data['status'] === 'success') {
            set({allUserList: res.data.data})
        }
        return res.data['status'] === 'success'
    },

}))
export default UserStore