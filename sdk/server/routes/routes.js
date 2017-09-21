
var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

var epay = function( ){

}

var appRouter = function(app) {
	 app.get("/payments", function(req, res) {
	 	var ccnCvv = '4634030103951029-069';
		var encrypted = key.encrypt(ccnCvv, 'base64');
		var decrypted = key.decrypt(encrypted, 'utf8');
		console.log('decrypted: ', decrypted);
	    res.send(encrypted);
	});

	app.post('/token', function (req, res) {
		var data = req.body;
		var number = data['number'];
		var verification = data['verification_value'];
		var token =  key.encrypt(number + verification, 'base64');
  		res.send(token);
	});
}
 
module.exports = appRouter;