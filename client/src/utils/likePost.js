import makeRequest from "./makeRequest";

export default async function likePost(e, id, isLiked) {
    e.preventDefault();
    const host = import.meta.env.VITE_SERVER_HOST;

    const headers = {
        "Content-Type": "application/json",
    };

    const data = makeRequest(`${host}/posts/${id}/like`, "POST", headers);

    if (!data) {
        console.error("Error liking post:", data.message);
    }

    return {
        success: true,
        isLiked: !isLiked,
        likesCountChange: isLiked ? -1 : 1,
    };
}
