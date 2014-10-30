var express = require('express');
var app = express();
var config = require('./config');
var fs = require('fs');

if (fs.existsSync('./local-config.js')) {
  config = require('./local-config.js');
}

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', config);
});

console.log('app running on port 3000');
app.listen(3000);
