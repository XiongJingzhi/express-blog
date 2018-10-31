const assert = require('assert')
const request = require('supertest')
const app = require('../index')

describe('post CURD', function() {
  describe('posts', function() {
    const agent = request.agent(app)

    // 全部结束退出当前进程
    // after(function (done) {
    //   process.exit()
    // })

    // 发表文章 未登录的情况 POST /posts/create
    it('未登录发表', function(done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({title: '请填写标题', content: 'dsadasdas'})
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/未登录/))
          done()
        })
    })

    // 初始 login
    it('登录成功', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({name: 'ssss', password: 'aaaaaa'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/登录成功/))
          done()
        })
    })

    // 登录后，删除文章没有权限的情况 /posts/:postId/remove
    it('删除文章没有权限', function(done) {
      agent
        .post('/posts/5bd633a9fca3a81dc888f7b0/edit')
        .type('form')
        .field({title: '我没有权限来改标题', content: '我没有权限来改内容'})
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/没有权限/))
          done()
        })
    })

    // 登录后，编辑文章没有权限的情况 /posts/:postId/edit
    it('编辑文章没有权限', function(done) {
      agent
        .post('/posts/5bd633a9fca3a81dc888f7b0/edit')
        .type('form')
        .field({title: '我没有权限来改标题', content: '我没有权限来改内容'})
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/没有权限/))
          done()
        })
    })

    // 发表文章成功的情况
    it('发表文章成功', function(done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({title: '我是标题', content: '我是内容'})
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/发表成功/))
          done()
        })
    })

    // 更新一篇文章 的情况
    it('更新文章成功', function (done) {
      agent
        .post('/posts/5bd8fe05736148082c8df040/edit')
        .type('form')
        .field({title: '我是标题', content: '改编不是胡编'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/编辑文章成功/))
          done()
        })
    })

  })
})
