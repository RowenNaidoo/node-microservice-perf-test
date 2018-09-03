'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

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

router.post('/process', function (request, response) {
    var myPromise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('result from promise');
        }, 5000);
    });

    myPromise.then(function (result) {
        response.send(result);
    });
});

// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log('Magic happening on port ' + port);