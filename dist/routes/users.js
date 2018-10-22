'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRouter = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/:name', function (req, res) {
  res.render('users', {
    name: req.params.name,
    supplies: ['mop', 'broom', 'duster']
  });
});

exports.userRouter = router;