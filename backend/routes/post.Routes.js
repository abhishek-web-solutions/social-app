import { Router } from "express";
import {
  activeCheck,
  createPost,
  deletePost,
  increment_likes,
} from "../controllers/posts.controller.js";
const router = Router();
import multer from "multer";
import { getAllposts } from "../controllers/posts.controller.js";
import {
  commentPost,
  deleteComment,
  get_Comments_by_post,
} from "../controllers/posts.controller.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllposts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_Comments_by_post);
router.route("/delete_comment").post(deleteComment);
router.route("/increment_post_like").post(increment_likes);

export default router;
