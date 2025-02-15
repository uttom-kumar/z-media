import React from 'react';
import RootLayout from "../../RootLayout.jsx";
import SingleUserComponent from "../../component/user-profile/single-user-component.jsx";

const SingleUserPage = () => {
  return (
    <RootLayout>
      <SingleUserComponent />
    </RootLayout>
  );
};

export default SingleUserPage;