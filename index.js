// Load dependencies
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config()

const app = express();

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
const SESConfig = {
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.ACCESS_SECRET_AWS,
}
aws.config.update(SESConfig);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,

});
console.log("credintial:", s3.config.credentials)
// Change bucket property to your Space name
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'avatarsnapbot',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
  }).array('upload', 1);

  
  app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log(error);
        return response.redirect("/error");
      }
      console.log('File uploaded successfully.');
      response.redirect("/success");
    });
  });
  

// Views in public directory
app.use(express.static('public'));

// Main, error and success views
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
  });
  
  app.get("/success", function (request, response) {
    response.sendFile(__dirname + '/public/success.html');
  });
  
  app.get("/error", function (request, response) {
    response.sendFile(__dirname + '/public/error.html');
  });


app.listen(3000, function () {
    console.log('Server listening on port 3000.');
  });