var application_root = __dirname,
express = require("express"),
path = require("path"),
mongoose = require('mongoose'),
tweets = require(path.join(application_root, "app/tweets")),
OAuth= require('oauth').OAuth;
var ObjectID = require('mongodb').ObjectID;


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
  var a = this.model('Want').find({loc: { $near: [this.loc.lat,this.loc.lon], $maxDistance: 5} , created_at: {$gte: start, $lt: end} }, cb);
  // return GiveModel.find({ loc :{$near: [this.loc.lat,this.loc.lon],$maxDistance : 5 },timestamp:{$gte: start, $lt: end}},cb);
};


object.methods.update_user = function(model,want,req,res,cb){
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
      if(req.body.destination != null) {
        wants.destination = req.body.destination
      }
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
  console.log("Want :   ")
  console.log(want);
  if(want.user.handle == null || want.user.handle == '' ){
    tweets.getUserName(want.user,function(error,data){
      if (!error) {
        want.user.handle = data["screen_name"]
        want.update_user('Want',want,req,res,function(err,want){
          if (!err) {
            console.log("waant");
            res.send(want)
          } else {
            res.send(err);
          }
        });
      } 
      else {
                    console.log(error);
        res.send(error);
      }
    });
  }
  else{
    want.update_user('Want',want,req,res,function(err,want){
      if (!err) {
        console.log("want");
        res.send(want)
      } else {
        res.send(err);
      }
    });
  }
});

app.post('/api/tweet',function(req,res){
  var me = req.body.me
  var to = req.body.to
  GiveModel.findOne({'_id': new ObjectID(me)},function(error,give){
    if (!error) {
      WantModel.findOne({_id: new ObjectID(to)},function(error,want){
        post = "@" + want.user.handle +  " aaja mere gaadi main baith jaa..!!"
        tweets.postUpdate(give,post,function(err,post){
          if (!err) {
            res.send("success")
          } else {
            res.send(err);
          }
        });
      });
    } 
    else {
      res.send(error);
    }
  });
});


app.post('/api/gives', function (req, res) {
  var give;
  give = new GiveModel(req.body);
  console.log("Give :   ")
console.log(give)
  give = new GiveModel(req.body);
  if(give.user.handle == null || give.user.handle == ''){
    tweets.getUserName(give.user,function(error,data){
      console.log(error)
      console.log(data)
      if (!error) {
        give.user.handle = data["screen_name"]
        give.update_user('Give',give,req,res,function(err,fakirs){
          if (!err) {
            console.log(fakirs)
          } else {
            console.log(err);
          }
          getfakirs(give,res);
        }); 
      } else {
        res.send(error);
      }
    });
  }
  else{
    give.update_user('Give',give,req,res,function(err,fakirs){
      if (!err) {
        console.log(fakirs)
      } else {
        console.log(err);
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
      value = new Object({me: give ,fakirs: fakirs});
      res.send(value)
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