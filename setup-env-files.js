import fs from "fs";
import path from "path";

// Server .env variables
const serverEnvVariables = `
SERVER_PORT=3001
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=somereallysecretjwtkey
CLOUDINARY_API_KEY=your_cloudinary_api_key
`;

// Client .env variables
const clientEnvVariables = `
VITE_API_URL=http://localhost:3001
VITE_PUBLIC_API_KEY=your_public_api_key
`;

// Paths to the .env files
const serverEnvPath = path.join(__dirname, "server", ".env");
const clientEnvPath = path.join(__dirname, "client", ".env");

// Create server .env file
fs.writeFileSync(serverEnvPath, serverEnvVariables.trim(), (err) => {
    if (err) {
        console.error("Error writing server .env file", err);
    } else {
        console.log("Server .env file created successfully!");
    }
});

// Create client .env file
fs.writeFileSync(clientEnvPath, clientEnvVariables.trim(), (err) => {
    if (err) {
        console.error("Error writing client .env file", err);
    } else {
        console.log("Client .env file created successfully!");
    }
});
