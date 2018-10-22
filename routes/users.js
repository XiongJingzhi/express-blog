import express from 'express'

const router = express.Router()

router.get('/:name', function(req, res) {
  res.render('users', {
    name: req.params.name,
    supplies: ['mop', 'broom', 'duster']
  })
})

export { router as userRouter }


