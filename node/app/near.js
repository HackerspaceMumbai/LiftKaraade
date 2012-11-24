// exports.nearPlaces = function(req, res) {
//         //I'm just sending the geolocation points in a format like this 39.92,-23
//         // but you can send it however you  want
// 	var coord = req.query.geo.split(',');
// 	var Place = mongoose.model('Place');
// 	var park = new Place({geo: coord});
// 	place.findNear(
// 		function(err,docs) {
// 			if (!err) {
// 				res.json(docs);
// 			} else {
// 				throw err;
// 			}
// 		});
// };