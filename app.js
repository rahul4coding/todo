// Mongo Details
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Express Details

const express = require('express');
const _ = require('underscore');
const app = express();


const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//todo begins

var todos = [];

app.post('/todo', (req, response) => {
    // todos.push(req.body.todo);

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, mongoInstance) {
        if (err) throw err;
        var dbo = mongoInstance.db("tracker");
        dbo.collection("todos").insertOne({ todo: req.body.todo}, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          response.send(req.body.todo);
          mongoInstance.close();
        });
    });
});

app.get('/todo', (req, response) => {
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, mongoInstance) {
      if (err) throw err;
      var dbo = mongoInstance.db("tracker");
        dbo.collection("todos").find({}).toArray(function(err, todos) {
            if (err) throw err;
            response.send(_.pluck(todos, 'todo'));
            mongoInstance.close();
        });
    });

});

app.put('/todo', (req, response) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, mongoInstance) {
        if (err) throw err;
        var dbo = mongoInstance.db("tracker");
        var query = { todo: req.body.old };
        var newValues = { $set: {todo: req.body.new } };
        dbo.collection("todos").updateOne(query, newValues, function(err, res) {
          if (err) throw err;
          console.log(res.result.n + " document updated");
          response.send(req.body.new);
          mongoInstance.close();
        });
      });
});

app.delete('/todo', (req, response) => {
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, mongoInstance) {
        if (err) throw err;
        var dbo = mongoInstance.db("tracker");
        dbo.collection("todos").deleteOne({ todo: req.body.todo }, function(err, obj) {
            if (err) throw err;            
            console.log(obj.deletedCount + " document(s) deleted");    
            response.send('deleted');
            mongoInstance.close();
        });
      });
});
        
app.listen(3333, () => console.log('Started listening on port 3333!'));

//------------------------------todo end