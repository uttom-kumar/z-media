import React from 'react';
import RootLayout from "../../RootLayout.jsx";
import MessengerComponent from "../../component/messenger/messenger-component.jsx";

const MessagesPage = () => {
    return (
        <RootLayout>
            <MessengerComponent />
        </RootLayout>
    );
};

export default MessagesPage;