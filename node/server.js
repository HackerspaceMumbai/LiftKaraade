var application_root = __dirname,
express = require("express"),
path = require("path"),
mongoose = require('mongoose'),
OAuth= require('oauth').OAuth;

Date.prototype.subHours= function(h){
  this.setHours(this.getHours()-h);
  return this;
}
var app = express();

// Database

mongoose.connect('mongodb://localhost/liftkarade');

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;  

var object = new Schema({
 user: { 
  handle:{type: String,  unique: true},
  authtoken:{type: String,required: true},
  authsecret:{type: String,required: true}
},
loc: { 
  lat: { type: Number, required: true },
  long: { type: Number, required: true }
},
destination :String,
created_at: { type: Date, default: Date.now ,index: '1'}
});

object.methods.findNearByFakirs = function(cb) {
  var start = new Date().subHours(1);
  var end = new Date();
  var a = this.model('Give').find({loc: { $near: [this.loc.lat,this.loc.long], $maxDistance: 1} , created_at: {$gte: start, $lt: end} }, cb);
  // return GiveModel.find({ loc :{$near: [this.loc.lat,this.loc.long],$maxDistance : 5 },timestamp:{$gte: start, $lt: end}},cb);
};

var WantModel = mongoose.model('Want', object);
var GiveModel = mongoose.model('Give', object);



app.get('/api', function (req, res) {
  res.send('API is running');
});




app.post('/api/wants', function (req, res) {
  var want;
  want = new WantModel(req.body);
  console.log(want);
  WantModel.findOne({'user.handle': want.user.handle},function (err, wants) {
    if(wants ==  null ) {
      wants = new WantModel({
        user: req.body.user,
        loc: req.body.loc
      });
      wants.save(function (err) {
        if (!err) {
          return res.send(wants);
        } else {
          return res.send(err);
        }
      });
    }
    else
    {
      wants.created_at =  Date.now()
      wants.loc = req.body.loc
      wants.save(function (err) {
        if (!err) {
          return res.send(wants);
        } else {
          return res.send(err);
        }
      });
    }
  });
});


// return res.send(wants.findNearByFakirs(wants));

app.post('/api/gives', function (req, res) {
  var give;
  give = new GiveModel(req.body);
  GiveModel.findOne({'user.handle': give.user.handle},function (err, gives) {
    if(gives ==  null ) {
      gives = new GiveModel({
        user: req.body.user,
        loc: req.body.loc
      });
      gives.save(function (err) {
        if (!err) {
          return console.log(gives);
        } else {
          return console.log(err);
        }
      });
    }
    else
    {
      gives.created_at =  Date.now()
      gives.loc = req.body.loc
      gives.save(function (err) {
        if (!err) {
          // return console.log(gives);
        } else {
          return console.log(err);
        }
      });
    }
    var start = new Date().subHours(1);
    var end = new Date();
    gives.findNearByFakirs(
      function(err,fakirs){
        console.log(err);
        if (!err) {
          res.send(fakirs)
        } else {
          res.send(err)
        }
      });
  });
});



// app.get('/api/wants', function (req, res){
//   return WantModel.find(function (err, products) {
//     if (!err) {
//       return res.send(products);
//     } else {
//       return console.log(err);
//     }
//   });
// });


// var nearPlaces = function(req) {
//   //I'm just sending the geolocation points in a format like this 39.92,-23
//   // but you can send it however you  want
//   var park = new Wants({: coord});
//   park.findNear(
//     function(err,docs) {
//       if (!err) {
//         res.json(docs);
//       } else {
//         throw err;
//       }
//     });
// };

// Launch server
var express = require("express");

app.listen(4242);