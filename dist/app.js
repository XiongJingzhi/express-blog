'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('./routes/index');

var _users = require('./routes/users');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const port = 3000;

app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', _index.indexRouter);
app.use('/users', _users.userRouter);

app.use(_express2.default.static('public'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));