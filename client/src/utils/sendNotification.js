import makeRequest from "./makeRequest";

export default async function sendNotification(sender, receiver, type, postId) {
    const host = import.meta.env.VITE_SERVER_HOST;
    const fetchUrl = `${host}/notifications/create`;
    const body = JSON.stringify({ sender, receiver, type, postId });
    const headers = {
        "Content-Type": "application/json",
    };

    const { status, data } = await makeRequest(fetchUrl, "POST", headers, body);
    if (status !== 200) {
        return;
    }
    return { message: "success" };
}
