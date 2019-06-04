var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;

router.use(session({
  secret: 'thisissecret',
  resave: false, // don't save session if unmodified
  saveUninitialized: false // don't create session until something stored
}));

router.get('/', function (req, res, next) {
  res.render('login');
});

router.post('/', function (req, res, next) {
  authenticate(req.body.username, function (err, user) {
    if (user) {
      mongoClient.connect("mongodb://localhost:27017/", function (err, client) {
        if (err) throw err;
        let database = client.db('notebookdb');
        let users = database.collection('users');
        users.find({ username: user }).toArray(function (err, result) {
          if (err) throw err;
          if (result.length == 0) {
            users.insertOne({
              username: user,
              notes: []
            }, function (err, res) {
              if (err) throw err;
            })
          }
        })


      });
      req.session.user = user;
      res.redirect('./')
    } else {
      req.session.error = "Authentication failed";
      res.redirect('/')
    }
  });

});

//TODO
function authenticate(user, callback) {
  return callback(null, user);
}


module.exports = router;
