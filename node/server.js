var application_root = __dirname,
express = require("express"),
path = require("path"),
mongoose = require('mongoose'),
tweets = require(path.join(application_root, "app/tweets")),
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
  authsecret:{type: String,required: true},
  authverifier:String,
},
loc: { 
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
},
destination :String,
created_at: { type: Date, default: Date.now ,index: '1'}
});

object.methods.findNearByFakirs = function(cb) {
  var start = new Date().subHours(1);
  var end = new Date();
  var a = this.model('Give').find({loc: { $near: [this.loc.lat,this.loc.lon], $maxDistance: 5} , created_at: {$gte: start, $lt: end} }, cb);
  // return GiveModel.find({ loc :{$near: [this.loc.lat,this.loc.lon],$maxDistance : 5 },timestamp:{$gte: start, $lt: end}},cb);
};


object.methods.update_user = function(model,want,req,res,cb){
  console.log(want);
  this.model(model).findOne({'user.handle': want.user.handle},function (err, wants) {
    if(wants ==  null ) {
      want.save(function (err) {
        if (!err) {
          cb(err,want);
        } else {
          cb(err,want);
        }
      });
    }
    else
    {
      wants.created_at =  Date.now()
      wants.loc = req.body.loc
      wants.save(function (err) {
        if (!err) {
          cb(err,wants);
        } else {
          cb(err,wants);
        }
      });
    }
  });
}


var WantModel = mongoose.model('Want', object);
var GiveModel = mongoose.model('Give', object);



app.get('/api', function (req, res) {
  res.send('API is running');
});

app.get('/auth/twitter', function(req, res){

});


app.post('/api/name',function(req,res){
  tweets.getUserName(req.body.user,"Update",function(){
    res.send("enjoy....")
  });
})

app.post('/api/wants', function (req, res) {
  var want;
  want = new WantModel(req.body);
  if(want.user.handle == null){
    tweets.getUserName(want.user,function(error,data){
      want.user.handle = data["screen_name"]
      want.update_user('Give',want,req,res,function(err,want){
        if (!err) {
          res.send(want)
        } else {
          res.send(err);
        }
      });
    });
  }
  else{
    want.update_user('Want',want,req,res,function(err,want){
      if (!err) {
        res.send(want)
      } else {
        res.send(err);
      }
    });
  }
});



app.post('/api/gives', function (req, res) {
  var give;
  give = new GiveModel(req.body);

  give = new GiveModel(req.body);
  if(give.user.handle == null){
    tweets.getUserName(give.user,function(error,data){
      give.user.handle = data["screen_name"]
      give.update_user('Give',give,req,res,function(err,give){
        if (!err) {
          // console.log(give)
        } else {
          // console.log(err);
        }
        getfakirs(give,res);
      });
    });
  }
  else{
    give.update_user('Give',give,req,res,function(err,give){
      if (!err) {
        // console.log(give)
      } else {
        // console.log(err);
      }
      getfakirs(give,res);
    });
  }
 
});


var getfakirs = function(give,res){
   var start = new Date().subHours(1);
  var end = new Date();
  give.findNearByFakirs(
    function(err,fakirs){
      if (!err) {
        console.log(fakirs)
        res.send(fakirs)
      } else {
        res.send(err)
      }
    });
}




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