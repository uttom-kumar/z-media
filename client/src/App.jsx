import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./page/home/home-page.jsx";
import LoginComponent from "./component/user/login-component.jsx";
import RegisterPage from "./page/user/register-page.jsx";
import PrivetRoute from "./page/privet-route/privet-route.jsx";
import PostDetailPage from "./page/blog-post/post-detail-page.jsx";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterPage />} />


                    <Route path="/" element={<PrivetRoute><HomePage /></PrivetRoute>} />
                    <Route path="/" element={<PrivetRoute><PostDetailPage /></PrivetRoute>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;