import Profile from "../models/profiles.model.js";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { matchesGlob } from "path";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "running" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file !== undefined ? req.file.filename : "",
      fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllposts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name email username profilePicture"
    );
    console.log("Posts fetched:", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const post = await Post.findOne({
      _id: post_id,
    });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await Post.deleteOne({ _id: post_id });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: message.error });
  }
};
export const increment_likes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    post.likes = post.likes + 1; // Increment the likes count
    await post.save(); // Save the updated post
    res.json({ message: "Likes incremented successfully", likes: post.likes });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  console.log(token);
  console.log(req.query);

  try {
    const user = await User.findOne({ token: token }).select("_id");
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });
    await comment.save();
    return res.json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: message.error });
  }
};
export const get_Comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name"
    );
    console.log("get allcomments");
    return res.json(comments.reverse());
  } catch (error) {
    console.error("Error fetching comments by post:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
