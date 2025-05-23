import React from 'react';
import RootLayout from "../../RootLayout.jsx";
import UserProfile from "../../component/user-profile/user-profile.jsx";

const ProfileRead = () => {
    return (
        <RootLayout>
            <div>
                <UserProfile />
            </div>
        </RootLayout>
    );
};

export default ProfileRead;