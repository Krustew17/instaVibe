export default async function makeRequest(
    url,
    method,
    headers,
    body,
    useToken = true
) {
    // set default options
    const options = {};

    // if method is not GET update the options method
    if (method) options.method = method;

    // if headers is not empty update the options headers
    if (headers) options.headers = headers;

    // if body is not empty update the options body
    if (body) options.body = body;

    // if token is not empty update the options headers
    if (useToken) {
        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTRjZTYyZTUxY2Y1NDAzN2NkYTgwOCIsImlhdCI6MTcyMjU5MDQ4MywiZXhwIjoxNzIyNjc2ODgzfQ.86THG-crd7Ec148o8GEbh-jsEVuFjFcq94G_X5euWM8";
        if (token) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    // make the request
    const response = await fetch(url, options);

    // convert the response to json
    const data = await response.json();
    console.log(data);

    // return the data
    return data;
}
