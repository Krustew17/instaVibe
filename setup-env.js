import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server .env variables
const serverEnvVariables = `
SERVER_PORT=3001
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
`;

// Client .env variables
const clientEnvVariables = `
VITE_API_URL=http://127.0.0.1:3001
VITE_PUBLIC_API_KEY=your_public_api_key
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
