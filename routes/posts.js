const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');

// GET /api/posts - Get all posts
router.get('/', PostController.getAllPosts);

// GET /api/posts/stats - Get post statistics
router.get('/stats', PostController.getPostStats);

// GET /api/posts/:id - Get post by ID
router.get('/:id', PostController.getPostById);

// POST /api/posts - Create new post
router.post('/', PostController.createPost);

// PUT /api/posts/:id - Update post
router.put('/:id', PostController.updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', PostController.deletePost);

// POST /api/posts/:id/like - Like a post
router.post('/:id/like', PostController.likePost);

module.exports = router;