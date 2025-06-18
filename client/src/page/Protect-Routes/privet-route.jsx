import {isLoggedIn} from "../../utility/utility.js";
import {Navigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivetRoute = ({children}) => {
    if(!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }
    return children
};

export default PrivetRoute;