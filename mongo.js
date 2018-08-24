var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tracker";

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, mongoInstance) {
  if (err) throw err;
  console.log("DB created!");
  var dbo = mongoInstance.db("tracker");
  dbo.createCollection("todos", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    mongoInstance.close();
  });
});