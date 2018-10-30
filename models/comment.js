const marked = require('marked')
const Comment = require('./mongo').Comment

module.exports = {
  create: function(comment) {
    comment = new Comment(comment)
    return Comment.create(comment)
  },
  getCommentsByPostId: function(postId) {
    return (
      Comment
        .find({postId: postId})
        .populate({path: 'author', model: 'User'})
        .sort({_id: -1})
        .exec()
    )
  },
  getCommentById: function(id) {
    return (
      Comment
        .findOne({_id: id})
        .exec()
    )
  },
  getCommentsCount: function (postId) {
    return (
      Comment
        .countDocuments({ postId: postId })
        .exec()
    )
  },
  deleteCommentById: function(id) {
    return (
      Comment
        .deleteOne({_id: id})
        .exec()
    )
  }
}
