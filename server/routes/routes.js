var appRouter = function(app) {
	 app.get("/payments", function(req, res) {
	 	console.log("payments service requesting");
	    res.send("done");
	});
}
 
module.exports = appRouter;