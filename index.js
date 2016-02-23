var express = require('express');
var app = express();

var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res) {
  res.sendFile('./consume.html', {"root": __dirname})
});

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Testing 123, we are live!');
});
