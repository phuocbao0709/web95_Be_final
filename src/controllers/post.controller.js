import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        message: "userId and content are required",
      });
    }

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only create posts for your own account",
      });
    }

    const newPost = new Post({
      userId,
      content,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required to update",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    post.content = content;
    post.updatedAt = Date.now();
    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
