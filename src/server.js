//Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import mysql from 'mysql';

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

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "35.201.17.69",
  instance: "node-microservice-perf:australia-southeast1:nodemsperf",
  user: "test",
  password: "test",
  database: "perfDB"
});

router.post('/processDB', (request, response) => {

  pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      response.status(400).send(error);
    }
    response.send(results);
  })

});

router.post('/processFile', (request, response) => {
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
  const result = "the very long string";
  stream.write(result + "\n", 'utf8', () => {
    response.send(result);
  });

  //})
});

// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log(`Magic happening on port ${port}`);
