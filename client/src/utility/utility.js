import Cookies from "js-cookie";


export const isLoggedIn = () => {
    let token = Cookies.get('token')
    if(token){
        return !!Cookies.get('token');
    }
    else{
        sessionStorage.clear()
        localStorage.clear()
        return false
    }
}

export const getEmail= () => {
    return sessionStorage.getItem("email")
}

export function Unauthorized (code){
    if(code===401){
        sessionStorage.clear();
        localStorage.clear();
        window.location.href="/login"
    }
}

export  const TimestampToDate = (timestamp) => {
    let date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}

export const profileUrl = "https://i.ibb.co.com/S6HDZkJ/user-profile.webp"


export function formatBlogPostDate(createdAt) {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInSeconds = (now - postDate) / 1000;

    if (diffInSeconds < 60) {
        // ১ মিনিটের কম হলে
        return `sent ${Math.floor(diffInSeconds)} sec ago`;
    } else if (diffInSeconds < 3600) {
        // ১ ঘণ্টার কম হলে
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
        // ১ দিনের কম হলে
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hours`;
    } else {
        // ১ দিনের বেশি হলে
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} days`;
    }
}