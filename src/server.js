//Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

//Declarations
const app = express();
app.disable('etag').disable('x-powered-by');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//get port
const port = process.env.PORT || 8080;

//get instance of express router
const router = express.Router();

//register routes
router.get('/home', (request, response) => {
    response.send('Hello world!');
});

const stream = fs.createWriteStream("output.txt", { flags: 'a' });

router.post('/process', (request, response) => {
    var myPromise = new Promise((resolve, reject) => {
        setTimeout(() => { resolve('result from promise') }, 5000);
    });

    myPromise.then((result) => {
        stream.write(result + "\n");
        response.send(result);
    })
});

// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log(`Magic happening on port ${port}`);
