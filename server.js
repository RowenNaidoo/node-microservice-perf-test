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

//register routes
router.get('/home', function (request, response) {
  response.send('Hello world!');
});

var stream = _fs2.default.createWriteStream("output.txt", { flags: 'a' });

var pool = _mysql2.default.createPool({
  connectionLimit: 10,
  host: "35.201.17.69",
  instance: "node-microservice-perf:australia-southeast1:nodemsperf",
  user: "test",
  password: "test",
  database: "perfDB"
});

router.post('/processDB', function (request, response) {

  pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) {
      response.status(400).send(error);
    }
    response.send(results);
  });
});

router.post('/processFile', function (request, response) {
  //var myPromise = new Promise((resolve, reject) => {
  //  setTimeout(() => { resolve('result from promise') }, 5000);
  //});

  //myPromise.then((result) => {
  /*pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      response.status(400).send(error);
    }
    response.send(results);
  })*/
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