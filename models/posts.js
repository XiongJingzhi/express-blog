const mongoose = require('mongoose')
const Post = require('./mongo').Post

module.exports = {
  // 创建一篇文章
  create: function(post) {
    post = new Post(post)
    return Post.create(post)
  },
  getPostById: function(postId) {
    return (
      Post
        .findOne({_id: postId})
        .populate({path: 'author', model: 'User'})
        .exec()
    )
  },
  getPosts: function(author) {
    let query = {}
    if (author) {
      query.author = author
    }
    return (
      Post.find(query)
        .populate({path: 'author', model: 'User'})
        .sort({_id: -1})
        .exec()
    )
  },
  incPv: function(postId) {
    return (
      Post
        .update({_id: postId}, {$inc: {pv: 1}})
        .exec()
    )
  },
  updatePostById: function(postId, update) {
    return (
      Post
        .findByIdAndUpdate({_id: postId}, update)
        .exec()
    )
  },
  deletePostById: function(postId) {
    return (
      Post
        .deleteOne({_id: postId})
        .exec()
    )
  }
}
