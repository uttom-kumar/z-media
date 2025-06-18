import { isLoggedIn } from "../../utility/utility.js";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
    if (isLoggedIn()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PublicRoute;
