var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;



router.use(session({
  secret: 'thisissecret',
  resave: false, // don't save session if unmodified
  saveUninitialized: false // don't create session until something stored
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('editor');
});

router.post('/', function (req, res, next) {
  //if (!req.session.notes) req.session.notes = [];
  let doc = {
    timestamp: new Date(),
    content: req.body.content
  }
  let user = req.session.user;
  mongoClient.connect("mongodb://localhost:27017/", function (err, client) {
    if (err) throw err;
    let database = client.db('notebookdb');
    let users = database.collection('users');
    users.findOne({ username: user }).then(function (obj) {

      obj.notes.push(doc);
      arr = obj.notes;
      users.updateOne({ username: user }, { $set: { username: user, notes: arr }},
          function (err, result) {
            if (err) throw err;
            users.find({}, function (err, res) {
              //console.log(res);
            }); 
  
        });
    }

    );
  });
  res.redirect('./');

});


module.exports = router;
