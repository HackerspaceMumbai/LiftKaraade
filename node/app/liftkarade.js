var mongoose = require('mongoose');

//
mongoose.connect('mongodb://localhost/ecomm_database');
var Cords = new Schema({
		lat:{ type: Number, required: true },
		long: { type: Number, required: true }
})


var User = new Schema({
	{ handle: String, required: true },
  { authtoken: String,required: true},
  { authsecret: String,required: true}
});

var object = new Schema({
    user: {type: [User]},
    loc: {type: [Cords], index: '2d'},
    created_at: { type: Date, default: Date.now ,index: '1'}
  });

exports.De = mongoose.model('de', object);
exports.Le = mongoose.model('le', object);
