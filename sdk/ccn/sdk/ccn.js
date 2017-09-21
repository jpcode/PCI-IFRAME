/* messenger */

function cardValidation( type ){
	return {
		cvv : function( cvv ){
			return cvv.length >= 3;
		},

		ccn : function( ccn ){
			return true;
		},

		zip : function( zip ){
			return true;
		}
	}[ type ];
}


function utils(){
	var apiUrl = "";
	var ajax = {};
	ajax.x = function () {
	    var xhr;

	    if (window.XMLHttpRequest) {

	        xhr = new XMLHttpRequest();
	    } else {

	        xhr = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    return xhr;
	};

	ajax.send = function (url, callback, method, data, async) {
	    if (async === undefined) {
	        async = true;
	    }
	    var x = ajax.x();
	    x.open(method, url, async);
	    x.onreadystatechange = function () {
	        if (x.readyState == 4) {
	            callback(x.responseText)
	        }
	    };
	    if (method == 'POST') {
	        x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	    }
	    console.log( 'data: ', data );
	    x.send(data)
	};

	ajax.get = function (url, data, callback, async) {
	    var query = [];
	    for (var key in data) {
	        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	    }
	    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
	};

	ajax.post = function (url, data, callback, async) {
	    ajax.send(url, callback, 'POST', data, async)
	};

	return {
		ajax : ajax
	};
}

function messenger(){
	this.message = function( msg ){
		console.log( "message", msg );
		window.parent.postMessage( msg, "*");
	}

	this.getCvvWindow = function(){
		return window.parent.frames[this.cvvWindowName]
	}

	this.setCvvWindow = function( e ){
		console.log("setting cvvWindow");
		var cvv = this.getCvvWindow();
		this.cvvField = cvv.document.getElementById("cvv");
        this.cvvLabel = cvv.document.getElementById("cvv_label");
        this.cvvForm = cvv.document.getElementById("cvv-form");
        //this.cvvInputListener = this.buildInputListener();
        //r.addInputListener(this.cvvField, this.cvvInputListener);
        this.cvvForm = cvv.document.getElementById("cvv-form")
        console.log( this.cvvField, this.cvvLabel );
        this.message("iframesReady")

	}
	
	this.getElement = function(e) {
		console.log("getElement",  e );
		if ( e === "number" ){
			return this.numberField;
		}else if ( e === "cvv" ){
			return this.cvvField;
		}
		return null;
    }
	
	this.notifyEvent = function( event, target, flag ){
		console.log( "notifyEvent", event, target, flag );
		var origin = "";
		if ( flag && document.hasFocus() ){
			origin = "number";
		}else{
			if ( flag ){
				//this.getCvvWindow().document.hasFocus();
				origin = "cvv";
			}
		}
		this.message("notifyEvent( " + event + "): " + target + ":" + origin );
	}

	this.ready= function() {
		console.log("ready");
        this.message("frameLoaded:")
    }

    this.applyStyles = function(elem, t) { 
   		if (typeof t != "undefined") {
            var n = t.split(";");
            	for (var i = 0; i < n.length; i++) {
                   var s = n[i].split(":"), o = s[1];
                    elem.style[this.trim( s[0] )] = this.trim(o);
                }
        }
    }

    this.errors = function( errors ) {
        this.message("errors: " + JSON.stringify( errors ) ); 
    }

    this.trim = function( str ){
    	if (!str) return "";
    	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    	return str.replace(rtrim, '');
    }

    this.inputProperties = function(){

    	 var cvvField = this.cvvField.value;
         var inputs = {};
         var numberField = this.numberField.value;
         /* do validations here */
         inputs["cvv"] = cardValidation("cvv")(cvvField) ? cvvField : false;
		 inputs["ccn"] = cardValidation("ccn")(numberField) ? numberField : false;

		 return	 inputs;
    }

    this.buildMessageReceivedHandler = function( event ){
    	var data = event.data;
    	var n;
    	if ( n = data.match(/style\((.*)\): (.*)/i) ){
    		 var elem = msg.getElement(n[1]);
    		 //console.log("receive a style message", elem );
             elem && msg.applyStyles(elem, n[2]);
    	}else if ( data === "getToken" ){
    		console.log('getToken');
    		var inputs = msg.inputProperties();
    		console.log( inputs );
    		msg.getToken();
    	}
    }	

    this.buildPaymentMethodBody = function(){
    	return {
    		number : this.numberField.value,
            verification_value : this.cvvField.value
    	}
    }

    this.getToken = function() {
     var body = this.buildPaymentMethodBody();
     var url = "http://localhost:3000/token";
     console.log(JSON.stringify( body ));
     var u = this.utils;
    	 u.ajax.post( url, JSON.stringify( body ), function( response ){
     		 console.log( response );
	     });

    }

	this.bind = function( instance ){
		console.log("init bind");
		this.utils = utils();
		this.uniqueId = "1001";
		this.cvvWindowName = "spreedly-cvv-frame-" + this.uniqueId;
        this.suppliedParameters = {};
        this.numberField = document.getElementById("card_number");
        //this.inputListener = this.buildInputListener(),
        //instance.addListener(this.numberField, "keyup", this.inputListener),
        this.numberLabel = document.getElementById("number_label");
        //instance.addListener(window, "message", this.buildMessageReceivedHandler()),
        window.addEventListener("message", this.buildMessageReceivedHandler, false);
        console.log( this.numberField, this.numberLabel );
        this.ready()
	}
}
/* end messenger */
function setUpEvents( id ){
	
	var onkeyup = function( event ){
		 if (!event ) return;
		 if ( event.keyCode === 13 ){
		 	event.preventDefault();
		 	event.stopPropagation();
		 	notifyEvent("number","enter")
		 }else if ( event.keyCode === 27 ){
		 	event.preventDefault();
		 	event.stopPropagation();
		 	notifyEvent("number","escape");
		 }
	}

	var onkeydown = function( event ){
		if ( !event ) return;
	    if ( event.keyCode === 9 && event.shiftKey ){
	    	notifyEvent("number","shiftTab");
	    }else if ( event.keyCode === 9 ){
	    	notifyEvent("number","tab");
	    }
	}

	var card_number = document.getElementById( id );
    
    card_number.onkeyup = function(e) {
                onkeyup( e )
            }
            
    card_number.onkeydown = function(e) {
                onkeydown( e )
            }
            
    card_number.onblur = function() {
                notifyEvent("number", "blur", false),
                removeSelection()
            }
    
    card_number.onfocus = function() {
                notifyEvent("number", "focus", false)
            }
	
	card_number.onmouseover = function() {
                notifyEvent("number", "mouseover", true)
            }
	
	card_number.onmouseout = function() {
                notifyEvent("number", "mouseout", true)
            }
}


var msg = new messenger();

window.notifyEvent = function( e ,t ,n ){
	msg.notifyEvent( e, t, n );
}

window.removeSelection = function() {
	window.getSelection && window.getSelection().removeAllRanges()
}


window.onerror = function( e, t, n, i , s ){
	console.log( e );
	//msg.consoleError(e,t,n,i,s);
}

window.setUpNumber = function(){
	setUpEvents('card_number');
	msg.bind( msg );
}
window.setUpCvv = function() {
    msg.setCvvWindow()
}

window.onfocus = function(){
	document.getElementById("card_number").focus()
}