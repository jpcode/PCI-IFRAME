
var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

var epay = function(argument) {
  var error_handler = {
    
  }
}

var appRouter = function(app) {
	app.post('/token', function (req, res) {
		var data = req.body;
		var token =  key.encrypt( data, 'base64');
  	res.send( token );
	});
}
 
module.exports = appRouter;