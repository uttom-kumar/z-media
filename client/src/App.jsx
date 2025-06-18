import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import HomePage from "./page/home/home-page.jsx";
import LoginComponent from "./component/user/login-component.jsx";
import RegisterPage from "./page/user/register-page.jsx";
import PrivetRoute from "./page/Protect-Routes/privet-route.jsx";
import PostDetailPage from "./page/blog-post/post-detail-page.jsx";
import ProfileRead from "./page/profile/profile-read.jsx";
import FriendPage from "./page/friends/friend-page.jsx";
import SearchPage from "./page/explore/search-page.jsx";
import MessagesPage from "./page/messages/messages-page.jsx";
import NotificationPage from "./page/notification/notification-page.jsx";
import QrCodePage from "./page/profile/qr-code-page.jsx";
import SingleUserPage from "./page/profile/single-user-page.jsx";
import UpdateProfile from "./page/profile/update-profile.jsx";
import NextTopLoader from "nextjs-toploader";
import CreateStory from "./page/story/create-story.jsx";
import CreateTextPage from "./page/story/create-text-page.jsx";
import SingleStoryPage from "./page/story/single-story-page.jsx";
import RecoverEmailPage from "./page/user/recover-email-page.jsx";
import OtpConfirmPage from "./page/user/otp-confirm-page.jsx";
import ResetPasswordPage from "./page/user/reset-password-page.jsx";
import GroupPage from "./page/group/group-page.jsx";
import GroupCreatePage from "./page/group/GroupCreate-page.jsx";
import PublicRoute from "./page/Protect-Routes/Public-Routes.jsx";


function ScrollToTopOnNavigation() {
    const { pathname } = useLocation();
    useEffect(() => {
        const scroll = () => {
            window.scrollTo(0, 0);
        };
        requestAnimationFrame(scroll);
    }, [pathname]);
    return null;
}


const App = (props) => {

    return (
        <div>
            {props.children}
            <BrowserRouter>
                <NextTopLoader
                  speed={400}
                  zIndex={1600}
                  showSpinner={false}
                />
                <ScrollToTopOnNavigation />
                <Routes>
                    <Route path="/login" element={<PublicRoute><LoginComponent /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                    <Route path="/recover-email" element={<RecoverEmailPage />} />
                    <Route path="/sent-otp" element={<OtpConfirmPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />


                    <Route path="/" element={<PrivetRoute><HomePage /></PrivetRoute>} />
                    <Route path="/blogDetails/:blogID" element={<PrivetRoute><PostDetailPage /></PrivetRoute>} />

                    <Route path="/groups" element={<PrivetRoute><GroupPage /></PrivetRoute>} />
                    <Route path="/create-group" element={<PrivetRoute><GroupCreatePage /></PrivetRoute>} />

                    <Route path="/search" element={<PrivetRoute><SearchPage /></PrivetRoute>} />
                    <Route path="/friends/:id" element={<PrivetRoute><FriendPage /></PrivetRoute>} />
                    <Route path="/message" element={<PrivetRoute><MessagesPage /></PrivetRoute>} />
                    <Route path="/notifications" element={<PrivetRoute><NotificationPage /></PrivetRoute>} />
                    <Route path="/profile" element={<PrivetRoute><ProfileRead /></PrivetRoute>} />
                    <Route path="/profile/:userID" element={<PrivetRoute><SingleUserPage /></PrivetRoute>} />
                    <Route path="/profile/update/info" element={<PrivetRoute><UpdateProfile /></PrivetRoute>} />
                    <Route path="/profile/update/password" element={<PrivetRoute><UpdateProfile /></PrivetRoute>} />

                    <Route path="/story" element={<PrivetRoute><CreateStory /></PrivetRoute>} />
                    <Route path="/create-text-story" element={<PrivetRoute><CreateTextPage /></PrivetRoute>} />

                    <Route path="/story/:storyID" element={<PrivetRoute><SingleStoryPage /></PrivetRoute>} />

                    <Route path="/profile/qr-code" element={<QrCodePage />} />


                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;