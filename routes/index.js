var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;



/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    let user = req.session.user;
    mongoClient.connect("mongodb://localhost:27017/", function (err, client) {

      if (err) throw err;
      let database = client.db('notebookdb');
      let users = database.collection('users');
      users.findOne({ username: user }).then(function (obj) {
        console.log("szukam")
        let docs = obj.notes;
        res.render('notes', { mylist: docs });
      });
    });
  } else res.render('index', { title: 'Notebook' });
});


router.get('/logout', function (req, res, next) {
  req.session.user = null;
  req.session.notes = null;
  res.redirect('/');
})


module.exports = router;
