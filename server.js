var express = require('express');
var cors = require('cors');
var AWS = require('aws-sdk');
AWS.config.update({ region:'us-east-1' });
var sqs = new AWS.SQS();

var app = express();

app.use(cors());

setInterval(function() {
  sqs.receiveMessage({
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/526935631633/Spooterfy',
    VisibilityTimeout: 20
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      if (data.Messages) {
        console.log("Received Message: ", data.Messages[0]);
        sqs.deleteMessage({
          QueueUrl: 'https://sqs.us-east-1.amazonaws.com/526935631633/Spooterfy',
          ReceiptHandle: data.Messages[0].ReceiptHandle
        }, function(err, data) {
          if (err) {
            console.log(err)
          }
        });
      } else {
        console.log("No Messages");
      }
    }
  });
}, 1000);

app.get('/', function(req, res) {
  res.send('Welcome to SQS listener')
});

var server = app.listen(8082, function() {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
});