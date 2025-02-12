import React from 'react';
import RootLayout from "../../RootLayout.jsx";
import ServerMaintenance from "../../component/server-maintenance/server-maintenance.jsx";

const NotificationPage = () => {
    return (
        <RootLayout>
            <ServerMaintenance />
        </RootLayout>
    );
};

export default NotificationPage;