module.exports = {
  port: 3000,
  session: {
    secret: 'gfdsafgs',
    key: 'blog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/blog',
  // 密码保护加盐
  salt: 'f#!fCWVgs!^&%'
}
