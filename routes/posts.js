const express = require('express')
const marked = require('marked')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')
const CommentModel = require('../models/comment')
// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  const author = req.query.author
  console.log('/posts author', author)
  PostModel.getPosts(author)
    .then(function(posts) {
      posts.map(post => {
        post.content = marked(post.content)
      })
      Promise.all(posts.map(post => {
        return (
          CommentModel.getCommentsCount(post._id)
            .then(function(res) {
              post.commentsCount = res
              console.log('/posts count', res)
            })
        )
      }))
        .then(function(result) {
          res.render('posts', {
            posts: posts
          })
        })
        .catch(next)
    })
    .catch(next)
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function(req, res, next) {
  const title = req.fields.title
  const content = req.fields.content
  const author = req.session.user._id
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
  // format 文章
  let post = {
    author: author,
    title: title,
    content: content
  }
  PostModel.create(post)
    .then(function (result) {
      console.log('create blog', result)
      // 此 post 是插入 mongodb 后的值，包含 _id
      req.flash('success', '发表成功')
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${result._id}`)
    })
    .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId
  console.log('详细文章页 postId', postId)
  Promise.all([
    PostModel.getPostById(postId),
    CommentModel.getCommentsByPostId(postId),
    CommentModel.getCommentsCount(postId),
    PostModel.incPv(postId)
  ])
    .then(function(result) {
      const post = result[0]
      post.content = marked(post.content)
      post.commentsCount = result[2]
      console.log('post content', result)
      const comments = result[1]
      console.log('post comment', comments)
      if (!post) {
        throw new Error('该文章不存在')
      }
      res.render('post', {
        post: post,
        comments: comments
      })
    })
    .catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  PostModel.getPostById(postId)
    .then(function(result) {
      res.render('edit', {
        post: result
      })
    })
    .catch(next)
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
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
  PostModel.getPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
    .catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id
  const url = `/posts?author=${author}`
  PostModel.getPostById(postId)
    .then(function(post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.deletePostById(postId)
        .then(function(post){
          req.flash('success', '删除文章成功')
          res.redirect(url)
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
