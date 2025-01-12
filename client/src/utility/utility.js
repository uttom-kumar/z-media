import Cookies from "js-cookie";

export const isLoggedIn = () => {
    let token = Cookies.get('Token')
    console.log(token)
    if(token){
        return !!Cookies.get('Token');
    }
    else{
        sessionStorage.clear()
        localStorage.clear()
        return false
    }
}