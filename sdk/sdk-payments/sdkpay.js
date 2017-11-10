function Sdkpay(){
   this.developer = true;
   this.frameOrigin = "http://localhost:70";
   this.callback = null;
   this.getElementsUsed = function(){
     var elemsUsed = [];
     var elems = this.elemsAllowed;
     for ( var key in elems ){
        if ( elems.hasOwnProperty( key ) ){
          var elem = elems[ key ];
          if ( elem.used ){
             elemsUsed.push( elem.id );
          }
        }
     }
     return elemsUsed;
   }

   this.createToken = function( callback ){
      console.log('requesting token');
      var me = this;
      this.callback = callback;
      Sdkpay.sendMessage( this.elemsAllowed.ccn.id, { 
                    task : 'getToken',
                    message: me.getElementsUsed()
                  });
   }

   this.mount = function( el, domTarget ){
    if ( !domTarget )  throw "Missing argument. Make sure to call mount() with a valid DOM element or selector;";
    var queryTarget = document.querySelectorAll( domTarget );
    //queryTarget[0].removeChild(queryTarget[0].firstChild);
    queryTarget[0].appendChild( el );
   }

   this.elemsAllowed = {
        "ccn" : {
            src : this.frameOrigin + '/fields/ccn',
            id: 'sdk-ccn-iframe',
            callback: function(){
                if ( this.style )
                  Sdkpay.sendMessage( this.id, { 
                    task : 'setStyle',
                    message: this.style.base
                  });
            },
            focus : function(){
              console.log( 'focus' );
            },
            resolvingToken: function( data ){
              setTimeout(function(){
                Sdkpay.callback({
                success: true,
                token: data.extraParams
              })
              },3000)
            },
            style : '',
            target: '',
            used : false
        },
        "exp" : {
            src : this.frameOrigin + '/fields/exp',
            id: 'sdk-exp-iframe',
            callback: function(){
                if ( this.style )
                  Sdkpay.sendMessage( this.id, { 
                    task : 'setStyle',
                    message: this.style.base
                  });
            },
            style: '',
            target : '',
            used: false
        },
        "zip" : {
            src : this.frameOrigin + '/fields/zip',
            id: 'sdk-zip-iframe',
            callback: function(){
                if ( this.style )
                  Sdkpay.sendMessage( this.id, { 
                    task : 'setStyle',
                    message: this.style.base
                  });
            },
            style: '',
            target: '',
            used: false
        }
    }

   this.buildIframe = function( elem, target, style ){
    var iframeObj = this.elemsAllowed[ elem  ];
    var ifrm = document.createElement("iframe");
        ifrm.setAttribute("frameborder", 0 );
        ifrm.setAttribute("allowtransparency", true );
        ifrm.setAttribute("scrolling", "no" );
        ifrm.setAttribute("name", iframeObj.id );
        ifrm.setAttribute("id", iframeObj.id );
        ifrm.setAttribute("src", iframeObj.src );
        ifrm.setAttribute("style","height: 21px")
    iframeObj.style = style; 
    iframeObj.target = target;
    iframeObj.used = true;   
    this.mount( ifrm, target );
    return ifrm;
   }

   this.createElement = function( elem, target, style ){
        var elemsAllowed = ["ccn", "exp", "zip", "cvc", "pay" ];
        if ( elemsAllowed.indexOf( elem ) > -1 ){
            return this.buildIframe( elem, target, style );
        }else{
            throw "Currently elems allowed are " + elemsAllowed.toString(); 
        }
   }

   this.buildMessageHandler = function( event ) {
        var me = this;
        var origin = event.origin;
        var data = event.data;
        var msg = null;
        var origin = data.origin;
        var property = data.property;
        var input = Sdkpay.elemsAllowed[ origin ];
        console.log( data );
        if ( input && input.hasOwnProperty(property) ){
            if ( typeof input[property] === 'function' )
              input[ property ]( data );
            else{
              //console.log( data )
            }
        }
   }
   this.log = function( log ){
        if ( window.console && this.developer ){
             console.log( log );
        }
   }
      
   this.init = function( api_key ){
        this.api_key = api_key;
   }

   this.setStyle = function(e, t) {
        console.log("setting style", e, t );
        this.sendMessage("style(" + e + "): " + t)
   }

   this.sendMessage = function(numberFrameId, e) {
        var f =  this.frameOrigin;
        document.getElementById(numberFrameId).contentWindow.postMessage(e, f );
   }
   window.addEventListener("message", this.buildMessageHandler, false);
}


window.Sdkpay = new Sdkpay;
