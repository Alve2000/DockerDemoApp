const Post = require("../models/postModel");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: "success",
       results: posts.length,
       data: {
         posts
       }
    })
  } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail"
    });
  }    
};

exports.getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      status: "success",
       data: {
         post
       }
    })
  } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail"
    });
  } 
};

exports.createPost = async (req, res) => {
  const newPost = new Post({...req.body});
  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      status: "success",
       data: {
         savedPost
       }
    })
  } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail"
    });
  } 
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
       data: {
         post
       }
    })
  } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail"
    });
  } 
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success"
    });
  } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail"
    });
  } 
};