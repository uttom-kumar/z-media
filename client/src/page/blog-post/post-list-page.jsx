import PostListLeft from "../../component/post-list/post-list-left.jsx";
import RootLayout from "../../RootLayout.jsx";
import PostListRightComponent from "../../component/post-list/post-list-right-component.jsx";

const PostListPage = () => {
    return (
        <RootLayout>
            <div className="container mx-auto">
                <div className="flex gap-10">
                    <div className="w-full md:w-[65%] lg:w-[70%] py-5">
                        <PostListLeft/>
                    </div>
                    <div className="hidden md:block w-full md:w-[35%] lg:w-[30%] py-5 ">
                        <PostListRightComponent/>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
};

export default PostListPage;