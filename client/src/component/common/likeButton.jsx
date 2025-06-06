import { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ReactionStore from "../../store/reaction-store.js";
import BlogPostStore from "../../store/post-list-store.js";

// eslint-disable-next-line react/prop-types
const LikeButton = ({ postId, initialLiked = false, initialCount = 0 }) => {
    const { CreateLikeRequest } = ReactionStore();

    // ----------  state  ----------
    const [liked, setLiked]   = useState(initialLiked);  // is THIS user currently liking?
    const [count, setCount]   = useState(initialCount);  // total like count
    const [busy,  setBusy]    = useState(false);         // network guard

    // when parent sends new props (list scroll, pagination, etc.)
    useEffect(() => {
        setLiked(initialLiked);
        setCount(initialCount);
    }, [initialLiked, initialCount, postId]);

    // ----------  handlers  ----------
    const handleLike = async () => {
        if (busy) return;
        setBusy(true);

        // optimistic UI – remember previous values so we can roll back if needed
        const prevLiked = liked;
        const prevCount = count;

        const nextLiked = !liked;
        const nextCount = nextLiked ? count + 1 : count - 1;

        setLiked(nextLiked);
        setCount(nextCount);

        try {
            const res = await CreateLikeRequest(postId);

            if (res?.status === "success") {
                toast.success("Liked successfully");
            } else if (res?.status === "unlike") {
                toast.success("Unliked successfully");
            } else {
                throw new Error("Server returned an unexpected status");
            }
        } catch (err) {
            // rollback – restore previous UI state
            setLiked(prevLiked);
            setCount(prevCount);
            toast.error("Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    // ----------  render  ----------
    return (
        <>
            <div className={'flex items-center gap-1'}>
                <motion.button
                    whileTap={{ scale: 2 }}
                    onClick={handleLike}
                    className="flex items-center gap-2 text-[24px] cursor-pointer select-none disabled:opacity-60"
                    disabled={busy}
                >
                    {liked ? (
                        <AiFillLike className="text-blue-600" />
                    ) : (
                        <AiOutlineLike className="text-gray-600" />
                    )}
                </motion.button>
                <span className="text-[16px] font-semibold">{count} likes</span>
            </div>
        </>
    );
};

export default LikeButton;
