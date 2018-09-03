//Dependencies
import express from 'express';
import bodyParser from 'body-parser';
//import fs from 'fs';
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

//const stream = fs.createWriteStream("output.txt", { flags: 'a' });

const con = mysql.createConnection({
  host: "35.201.17.69",
  user: "test",
  password: "test",
  database: "perfDB"
});

router.post('/process', (request, response) => {
  var myPromise = new Promise((resolve, reject) => {
    setTimeout(() => { resolve('result from promise') }, 5000);
  });

  myPromise.then((result) => {
    con.query('SELECT 1', (error, results, fields) => {
      if (error) {
        response.status(400);
        response.send(error);
      }
      response.send(results);
    })
    //stream.write(result + "\n");
  })
});

// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log(`Magic happening on port ${port}`);
