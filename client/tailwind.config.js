/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "selector",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                playWriteArgentina: ["Playwrite AR", "cursive"],
                playWriteDKLoopet: ["Playwrite DK Loopet", "cursive"],
                Pacifico: ["Pacifico", "cursive"],
            },
            fontSize: {
                customBase: "1.2rem",
            },
            screens: {
                cxs: "500px",
            },
        },
        plugins: [],
    },
};
