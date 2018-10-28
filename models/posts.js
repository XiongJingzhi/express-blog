const mongoose = require('mongoose')
const Post = require('./mongo').Post

module.exports = {
  // 创建一篇文章
  create: function(req, res, next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题')
      }
      if (!content.length) {
        throw new Error('请填写内容')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    let post = {
      author: author,
      title: title,
      content: content
    }

    Post.create(new Post(post))
      .then(function (result) {
        // 此 post 是插入 mongodb 后的值，包含 _id
        req.flash('success', '发表成功')
        // 发表成功后跳转到该文章页
        res.redirect(`/posts/${result._id}`)
      })
      .catch(next)
  },
  getPostById: function(postId) {
    return (
      Post
        .findOne({_id: postId})
        .populate({ path: 'author', model: 'User' })
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
  }
}
