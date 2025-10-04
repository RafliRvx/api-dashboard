const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['tutorial', 'announcement', 'news', 'general', 'technology'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  featuredImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });

// Static method to get posts by author
postSchema.statics.getByAuthor = function(authorId) {
  return this.find({ author: authorId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get post statistics
postSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalLikes: { $sum: '$likes' },
        totalViews: { $sum: '$views' },
        averageLikes: { $avg: '$likes' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return stats;
};

// Instance method to increment views
postSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Instance method to like post
postSchema.methods.like = async function() {
  this.likes += 1;
  await this.save();
};

// Virtual for excerpt (first 150 characters)
postSchema.virtual('excerpt').get(function() {
  return this.content.substring(0, 150) + '...';
});

// Virtual for reading time (assuming 200 words per minute)
postSchema.virtual('readingTime').get(function() {
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / 200);
});

module.exports = mongoose.model('Post', postSchema);