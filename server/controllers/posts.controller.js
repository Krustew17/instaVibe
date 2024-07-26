import Post from "../models/Post.js";
import cloudinary from "../configs/cloudinary.js";

export const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        const user = req.user;
        console.log(`req.file.path: ${req.file.path}`);

        if (!user) return res.status(400).json({ message: "bad request" });

        let imageUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ message: error.message });
                    }
                    imageUrl = result.secure_url;
                    console.log(imageUrl);
                }
            );
        }

        const newPost = new Post({
            createdBy: user._id,
            location: user.location,
            description,
            picturePath: imageUrl,
            likes: {},
            comments: [],
        });

        await newPost.save();
        console.log(newPost.description);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
