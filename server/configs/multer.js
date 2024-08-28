import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only JPEG, PNG, GIF, and MP4 are allowed."
            )
        );
    }
};

export const upload = multer({
    storage,
    // limits: {
    //     fileSize: 10 * 1024 * 1024,
    // },
    fileFilter,
});
