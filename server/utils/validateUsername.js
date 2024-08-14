export default function validateUsername(username, type) {
    if (!username) {
        throw new Error(`${type} cannot be empty.`);
    }

    if (username.length < 3 || username.length > 20) {
        throw new Error(`${type} must be between 3 and 20 characters.`);
    }

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        throw new Error(`${type} must only contain letters and numbers.`);
    }

    const regex = /^[0-9]/;
    const usernameStartsWithNum = regex.test(username);

    if (usernameStartsWithNum) {
        throw new Error(`${type} cannot start with a number.`);
    }
}
