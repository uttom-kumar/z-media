import React from 'react';
import {isLoggedIn} from "../../utility/utility.js";
import {Navigate} from "react-router-dom";

const PrivetRoute = ({children}) => {
    if(!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }
    return children
};

export default PrivetRoute;