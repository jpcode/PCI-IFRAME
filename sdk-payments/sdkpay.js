(function(){

	var postMessage = function( message, target ){

	}

	var notifyError = function(){

	} 

	var addStyles = function(){

	}
	
	var stablishCommunication = function( iframe1, iframe2 ){
				window.onmessage = function(e){
				    if (e.data == 'cvv') {
				    }else if ( e.data == 'cnn'){

				    }else if ( e.data == 'complete' ){

				    }
				};
	}

	var postRequest = function(){
		//connect with node.js 
	}

	var getDom = function( id ){
		return document.getElementById( id );
	}

	var sdkpay = function(){
		/* factory */
		var cnn = getDom('cnnid');
		var cvv = getDom('cvvid');
		return {
			init : function(){
				stablishCommunication( cnn, cvv );
			},
			getToken : function(){

			}
		}
	};
	
	window.Sdkpay = sdkpay();
})();