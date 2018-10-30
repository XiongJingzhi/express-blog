const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const Comment = require('../models/comment')
// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const content = req.fields.content
  const postId = req.fields.postId
  // 校验参数
  try {
    if (!content.length) {
      throw new Error('请填写留言内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let comment = {
    author: author,
    content: content,
    postId: postId
  }

  Comment.create(comment)
    .then(function(result){
      req.flash('success', '评论成功')
      res.redirect('back')
    })
    .catch(next)
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  const commentId = req.params.commentId
  const author = req.session.user._id
  Comment.getCommentById(commentId)
    .then(function(comment) {
      try {
        if (!comment) {
          throw new Error('留言不存在')
        }
        if (comment.author.toString() !== author.toString()) {
          throw new Error('没有权限删除留言')
        }
      } catch(err) {
        req.flash('error', err.message)
      }
      Comment.deleteCommentById(commentId)
        .then(function(commentId) {
          req.flash('success', '删除评论成功')
          res.redirect('back')
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
