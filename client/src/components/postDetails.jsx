import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Comment from "./Comment";
import Post from "./post";
<<<<<<< Updated upstream
import Loader from "./Loader";

export default function PostDetails() {
    const [post, setPost] = useState({
        description: "",
        image: "",
        likes: [],
        comments: [],
        createdAt: "",
        createdBy: {
            username: "",
            profilePicture: "",
            _id: "",
        },
        likesCount: 0,
        picturePath: "",
    });
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(false);

=======

export default function PostDetails() {
    const [post, setPost] = useState(null);
>>>>>>> Stashed changes
    const { username, id } = useParams();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/posts/${username}/${id}`;

            const data = await makeRequest(fetchUrl);

<<<<<<< Updated upstream
            if (!data) return window.location.replace("/");
            // setIsLiked(!!data.likes[data.createdBy._id]); // TODO: update with current logged in user's id
            // setLikesCount(data.likesCount);
            setPost(data);
        } catch (error) {
            console.error("Failed to fetch post details:", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    // const formattedDate = convertDate(post.createdAt);

=======
        if (!data) return window.location.replace("/");

        setPost(data);
    };

>>>>>>> Stashed changes
    useEffect(() => {
        fetchPost();
    }, []);

<<<<<<< Updated upstream
    if (loading) {
        return <Loader />;
    }
    return (
        <div className="ml-[250px] min-h-screen">
=======
    if (!post) return null;
    return (
        <div className=" md:ml-[70px] lg:ml-[250px]">
>>>>>>> Stashed changes
            <Post {...post} />
            <div className="mt-2 md:mt-4">
                {post.comments &&
                    post.comments.map((comment, index) => (
                        <Comment key={index} {...comment} />
                    ))}
            </div>
        </div>
        // <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700 md:ml-[70px] lg:ml-[250px] ">
        //     <div className="flex">
        //         <img
        //             src="/default_avatar.jpg"
        //             alt={`${post.createdBy.username}'s profile`}
        //             className="w-12 h-12 rounded-full mr-4"
        //         />
        //         <div className="flex-1">
        //             <div className="flex justify-between items-center">
        //                 <div>
        //                     <span className="font-bold">
        //                         {post.createdBy.username}
        //                     </span>
        //                     <span className="text-gray-500 dark:text-gray-400 ml-2">
        //                         {formattedDate}
        //                     </span>
        //                 </div>
        //             </div>
        //             <div className="mt-2">
        //                 <p>{post.description}</p>
        //                 {post.picturePath && (
        //                     <img
        //                         src={post.picturePath}
        //                         alt="Post media"
        //                         className="mt-2 rounded-lg max-w-full"
        //                     />
        //                 )}
        //             </div>
        //             <div className="flex gap-6 mt-2 md:mt-4 text-gray-500 dark:text-gray-400">
        //                 <div
        //                     className="hover:text-red-500 gap-1 flex select-none hover:cursor-pointer"
        //                     onClick={handleLikePost}
        //                 >
        //                     {isLiked ? (
        //                         <IoHeartSharp className="text-2xl text-red-500" />
        //                     ) : (
        //                         <IoHeartOutline className="text-2xl" />
        //                     )}
        //                     <span>{likesCount}</span>
        //                 </div>
        //                 <div className="flex items-center gap-1 hover:text-blue-400 hover:cursor-pointer select-none">
        //                     <FaRegComment className="text-lg" />
        //                     <span>{post.comments.length}</span>
        //                 </div>
        //                 <div className="flex items-center gap-1 hover:cursor-pointer hover:text-yellow-600">
        //                     <FaShare />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="mt-2 md:mt-4">
        //         {post.comments &&
        //             post.comments.map((comment, index) => (
        //                 <Comment key={index} {...comment} />
        //             ))}
        //     </div>
        // </div>
    );
}
