export default function validateUsername(username) {
    if (!username) {
        throw new Error("Username cannot be empty");
    }

    if (username.length < 3 || username.length > 20) {
        throw new Error("Username must be between 3 and 20 characters");
    }

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        throw new Error("Username must only contain letters and numbers");
    }

    const regex = /^[0-9]/;
    const usernameStartsWithNum = regex.test(username);

    if (usernameStartsWithNum) {
        throw new Error("Username cannot start with a number");
    }
}
