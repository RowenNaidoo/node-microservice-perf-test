'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Declarations
//Dependencies
var app = (0, _express2.default)();
app.disable('etag').disable('x-powered-by');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

//get port
var port = process.env.PORT || 8080;

//get instance of express router
var router = _express2.default.Router();

var stream = _fs2.default.createWriteStream("output.txt", { flags: 'a' });

var pool = _mysql2.default.createPool({
  connectionLimit: 10,
  host: "35.201.17.69",
  user: "test",
  password: "test",
  database: "world"
});

//register routes
router.get('/home', function (request, response) {
  response.send('Hello world!');
});

router.post('/dbRead', function (request, response) {

  pool.query('SELECT * FROM world.city', function (error, results, fields) {
    if (error) {
      response.status(400).send(error);
    }
    response.send(results);
  });
});

router.post('/dbWrite', function (request, response) {

  pool.query('INSERT INTO perfTest(Value) VALUES ("some random text")', function (error, results, fields) {
    if (error) {
      response.status(400).send(error);
    }
    response.send(results);
  });
});

router.post('/dbReadWrite', function (request, response) {

  pool.query('SELECT * FROM world.city', function (error, results, fields) {
    if (error) {
      response.status(400).send(error);
    }
    pool.query('SELECT * FROM world.city', function (error, results, fields) {
      if (error) {
        response.status(400).send(error);
      }
      pool.query('INSERT INTO perfTest(Value) VALUES ("some other random text")', function (error, results, fields) {
        if (error) {
          response.status(400).send(error);
        }
        response.status(200).send("OK");
      });
    });
  });
});

router.post('/file', function (request, response) {
  var result = "the very long string";
  stream.write(result + "\n", 'utf8', function () {
    response.send(result);
  });

  //})
});

// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log('Magic happening on port ' + port);