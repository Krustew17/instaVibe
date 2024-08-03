export default async function makeRequest(
    url,
    method,
    headers,
    body,
    useToken = true
) {
    // set default options
    const options = {};
    let status;

    // if method is not GET update the options method
    if (method) options.method = method;

    // if headers is not empty update the options headers
    if (headers) options.headers = headers;

    // if body is not empty update the options body
    if (body) options.body = body;

    // if token is not empty update the options headers
    if (useToken) {
        const token = JSON.parse(localStorage.getItem("authState")).token;

        if (token) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }
    console.log(options);

    // make the request
    const response = await fetch(url, options);

    // get the status
    status = response.status;

    // convert the response to json
    const data = await response.json();
    console.log(data);

    // return the data
    return { status, data };
}
