// Simulated database
let posts = [
  { 
    id: 1, 
    title: 'Welcome to Our API', 
    content: 'This is the first post demonstrating our REST API capabilities.', 
    author: 'John Doe', 
    category: 'announcement',
    tags: ['api', 'welcome', 'demo'],
    likes: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 2, 
    title: 'Getting Started with REST', 
    content: 'Learn how to use REST APIs effectively with best practices.', 
    author: 'Jane Smith', 
    category: 'tutorial',
    tags: ['rest', 'tutorial', 'beginners'],
    likes: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class PostController {
  // GET all posts
  static getAllPosts(req, res) {
    try {
      const { category, author, page = 1, limit = 10 } = req.query;
      
      let filteredPosts = [...posts];

      // Filter by category
      if (category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by author
      if (author) {
        filteredPosts = filteredPosts.filter(post =>
          post.author.toLowerCase().includes(author.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      res.json({
        success: true,
        count: filteredPosts.length,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredPosts.length,
          pages: Math.ceil(filteredPosts.length / limit)
        },
        data: paginatedPosts,
        message: 'Posts retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // GET post by ID
  static getPostById(req, res) {
    try {
      const post = posts.find(p => p.id === parseInt(req.params.id));
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: post,
        message: 'Post retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // CREATE new post
  static createPost(req, res) {
    try {
      const { title, content, author, category = 'general', tags = [] } = req.body;
      
      // Validation
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title,
        content,
        author: author || 'Anonymous',
        category,
        tags: Array.isArray(tags) ? tags : [tags],
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      posts.push(newPost);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // UPDATE post
  static updatePost(req, res) {
    try {
      const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
      
      if (postIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const updatedPost = {
        ...posts[postIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      posts[postIndex] = updatedPost;
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: updatedPost
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // DELETE post
  static deletePost(req, res) {
    try {
      const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
      
      if (postIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const deletedPost = posts.splice(postIndex, 1)[0];
      
      res.json({
        success: true,
        message: 'Post deleted successfully',
        data: deletedPost
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // LIKE post
  static likePost(req, res) {
    try {
      const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
      
      if (postIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      posts[postIndex].likes += 1;
      posts[postIndex].updatedAt = new Date().toISOString();
      
      res.json({
        success: true,
        message: 'Post liked successfully',
        data: posts[postIndex]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // GET post statistics
  static getPostStats(req, res) {
    try {
      const totalPosts = posts.length;
      const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
      const categories = [...new Set(posts.map(post => post.category))];
      
      const categoryStats = categories.map(category => {
        const categoryPosts = posts.filter(post => post.category === category);
        return {
          category,
          count: categoryPosts.length,
          totalLikes: categoryPosts.reduce((sum, post) => sum + post.likes, 0)
        };
      });

      res.json({
        success: true,
        data: {
          totalPosts,
          totalLikes,
          averageLikes: totalLikes / totalPosts,
          categories: categoryStats
        },
        message: 'Post statistics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = PostController;