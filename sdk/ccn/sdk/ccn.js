/* Utils */

function utils(){
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

/* End of utils */

/* message handler */

function messenger(){

  this.message = function( msg ){
    window.parent.postMessage( msg, "*");
  }

  this.getCvvWindow = function(){
    return window.parent.frames[this.cvvWindowName];
  }

  this.setCvvWindow = function( e ){
    var cvv = this.getCvvWindow();
    this.cvvField = cvv.document.getElementById("cvv");
    this.cvvLabel = cvv.document.getElementById("cvv_label");
    this.cvvForm = cvv.document.getElementById("cvv-form");
    this.cvvForm = cvv.document.getElementById("cvv-form")
    this.message("iframesReady")
  }
  
  this.getElement = function(e) {
    if ( e === "number" ){
      return this.numberField;
    }else if ( e === "cvv" ){
      return this.cvvField;
    }
    return null;
    }
  
  this.notifyEvent = function( event, target, flag ){
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
        inputs["ccn"] = cardValidation("ccn")(numberField);

     return  inputs;
    }

    this.buildMessageReceivedHandler = function( event ){
      var data = event.data;
      var n;
      if ( n = data.match(/style\((.*)\): (.*)/i) ){
         var elem = msg.getElement(n[1]);
        elem && msg.applyStyles(elem, n[2]);
      }else if ( data === "getToken" ){
        var inputs = msg.inputProperties();
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
     var url = "http://localhost:5000/token";
     var u = this.utils;
       u.ajax.post( url, JSON.stringify( body ), function( response ){
         console.log( response );
       });

    }

  this.bind = function( instance ){
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
    this.ready()
  }
}

/* End of message handler */


function major_industry_identification( ccn ){
  /*
    https://en.wikipedia.org/wiki/Payment_card_number#Major_Industry_Identifier_.28MII.29
    Supported: Visa, mastercard, discover, american express
  */
  ccn = ccn.replace(/\D/g, "");

  var validator = {
    "AMERICAN_EXPRESS" : {
        cls : 'american-express',
        digits : [15],
        test: function( ccn ){
            var dig = ccn[0] + ccn[1];
            return dig === '34' || dig === '37';
        }
    },
    "VISA" : {
        cls : 'visa',
        digits :[13,16],
        test: function( ccn ){
            return ccn[0] === '4';
        }
    },
    "DISCOVER": {
        cls : 'discover',
        digits: [16],
        test: function( ccn ){
          var tdig = ccn[0] + ccn[1];
          var fdig = tdig + ccn[2] + ccn[3];
          return tdig === '64' || tdig === '65' || fdig === '6011';
        }
    },
    "MASTERCARD" : {
        cls : 'mastercard',
        digits: [16],
        test : function( ccn ){
          var tdig = ~~(ccn[0] + ccn[1]);
          var fdig = ~~(tdig + ccn[2] + ccn[3]);
          return ( tdig >= 51 && tdig <= 55 ) || ( fdig >= 2221 && fdig <= 2720 );
          
        }
    }
  }
  var cardcls = false;
  var error = false;
  var found = false;
  for ( var key in validator ){
    var card = validator[ key ];
    if ( card.test( ccn ) ){
      var digs = card.digits;
      for ( var i = 0; i < digs.length; i++ ){
        if ( digs[ i ] === ccn.length ){
            console.log( 'luhn: ', luhn_algorithm( ccn ) );
            if ( !luhn_algorithm( ccn ) ){
                console.log( 'error', ccn, card );
                error = true;
            }
            break;
        }
      }
      cardcls = card;
      found = true;
      break;
    }
  }
  var spanReference =  document.getElementById("span-card");
  if ( !found ){
    if ( ccn.length >= 4 ) spanReference.className = 'invalid-card';
    else spanReference.className = 'default-card';
  }
  if ( found ){
    if ( !error ){
      spanReference.className = cardcls.cls;
    }else{
      spanReference.className = 'invalid-card';
    }
  }
}

function luhn_algorithm( ccn ){
  /*
      https://en.wikipedia.org/wiki/Luhn_algorithm
  */
  ccn = ccn.replace(/\D/g, "");
  var len = ccn.length, 
      i = len - 1, 
      dup = false,
      sum = 0,
      dig;

  for ( ; i >= 0; i-- ){
    dig = parseInt( ccn[ i ] );
    if ( dup ){
       dig *= 2;
       dig = dig > 10 && ( dig - 9 ) || dig;
    }
    sum += dig;
    dup = !dup;
  }
    return sum % 10 === 0 ? ccn : false;

}

function cardValidation( type ){
	return {
		cvv : function( cvv ){
			return cvv.length >= 3;
		},

		ccn : function( ccn ){
			if ( /[^0-9-\s]+/.test(ccn) ) return false;
      return luhn_algorithm( ccn );
		},

		zip : function( zip ){
			return true;
		}
	}[ type ];
}


/* end messenger */
function setUpEvents( id ){
	
	var format = function( event ){
    var ccn = document.getElementById('card_number');
    ccn.value = ccn.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
  }

  var onkeyup = function( event ){
     console.log( 'keyup' , event );
     major_industry_identification(document.getElementById('card_number').value );
     format();
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
    var me = this;
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