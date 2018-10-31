module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
  // 404 页面处理, 如果前面都没有响应则进入此路由
  app.use(function(req, res, next) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
  // 错误处理, 如权限，不存在等
  app.use(function (err, req, res, next) {
    console.log('错误处理', err.message)
    req.flash('error', err.message)
    res.redirect('/posts')
  })
}
