var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.html');
});


console.log('app running on port 3000');
app.listen(3000);
