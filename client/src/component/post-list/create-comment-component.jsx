import {profileUrl} from "../../utility/utility.js";
import {FaLocationArrow} from "react-icons/fa";
import  {useEffect} from "react";
import UserStore from "../../store/user-store.js";
import BlogPostStore from "../../store/post-list-store.js";
import CommentStore from "../../store/comment-store.js";
import {useParams} from "react-router-dom";
import toast from "react-hot-toast";

const CreateCommentComponent = ({comment}) => {
  const { BlogListDetailRequest } = BlogPostStore();
  const {profileList, profileListRequest} = UserStore()
  const {commentListDetailsRequest, commentInput, commentOnchange, CreateCommentRequest} = CommentStore()
  const { blogID } = useParams()


  useEffect(() => {
    ( async () => {
      await BlogListDetailRequest(blogID);
      await profileListRequest()
      await commentListDetailsRequest(blogID)
    })();
  }, [blogID]);

  const CreateCommentHandler = async (blogID) => {
    let res = await CreateCommentRequest({...commentInput, blogID})
    if(res === true) {
      await BlogListDetailRequest(blogID);
      await profileListRequest()
      await commentListDetailsRequest(blogID)
      commentOnchange("text", "")
      toast.success("Comment successfully created!")
    }
  }


  return (
    <div>
      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg w-full">
        {
          profileList?.map((profile, i) => {
            return (
              <div key={i}>
                <img
                  alt="User profile"
                  className="rounded-full w-[40px] h-[40px]"
                  src={profile?.profile[0]?.profilePicture || profileUrl}
                />
              </div>
            )
          })
        }
        <textarea
          id="comment"
          className="flex-grow outline-none scroll-hidden placeholder-gray-400 px-2 py-2 resize-none  border-b-2 border-gray-400"
          placeholder={`Comment as ${profileList?.map((item) => item?.fullName)}`}
          rows={2}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          value={commentInput?.text}
          onChange={(e) => {
            commentOnchange("text", e.target.value)
          }}
        />

        <button className="text-gray-400 hover:text-gray-700 cursor-pointer" onClick={() => CreateCommentHandler(blogID)}>
          <FaLocationArrow className="rotate-45"/>
        </button>
      </div>
    </div>
  );
};

export default CreateCommentComponent;