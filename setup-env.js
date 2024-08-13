import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server .env variables
const serverEnvVariables = `
PORT=3001
MONGO_URI=mongodb+srv://instaVibeUser:instaVibePassword@instavibetestdb.yncbm.mongodb.net/?retryWrites=true&w=majority&appName=instaVibeTestDB
JWT_SECRET=somereallylongsecretthatcannotbeguessedbyanybody!
CLOUDINARY_CLOUD_NAME=dlac8f4rt
API_KEY=798293197172219
API_SECRET=SAjxCmNBZlz_ZnpBFMVkSA-1_6Y
`;

// Client .env variables
const clientEnvVariables = `
VITE_SERVER_HOST=http://127.0.0.1:3001
VITE_TENOR_API=AIzaSyDR-qoRW6PGxzEF6ms44U14fzBx_JmugFs
`;

// Paths to the .env files
const serverEnvPath = path.join(__dirname, "server", ".env");
const clientEnvPath = path.join(__dirname, "client", ".env");

// Create server .env file
writeFile(serverEnvPath, serverEnvVariables.trim())
    .then(() => console.log("Server .env file created successfully!"))
    .catch((err) => console.error("Error writing server .env file", err));

// Create client .env file
writeFile(clientEnvPath, clientEnvVariables.trim())
    .then(() => console.log("Client .env file created successfully!"))
    .catch((err) => console.error("Error writing client .env file", err));
