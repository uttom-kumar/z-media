import Cookies from "js-cookie";

export const isLoggedIn = () => {
    let token = Cookies.get('token')
    console.log(token)
    if(token){
        return !!Cookies.get('token');
    }
    else{
        sessionStorage.clear()
        localStorage.clear()
        return false
    }
}