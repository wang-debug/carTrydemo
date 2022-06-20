var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mp = require('./routes/mp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('../src'));

app.use('/api/mp',mp);

app.listen(3000,()=>{
    console.log("serve run at port 3000")
})