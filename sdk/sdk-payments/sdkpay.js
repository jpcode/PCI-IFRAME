function Sdkpay(){
   this.developer = true;
   this.frameOrigin = "http://localhost:70";

   this.createToken = function(){
      return this.sendMessage("getToken")
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
                    message: this.style
                  });
            },
            style : ''
        },
        "exp" : {
            src : this.frameOrigin + '/fields/exp',
            id: 'sdk-exp-iframe',
            callback: 'sdk-exp-iframe-loaded',
            style: ''
        },
        "zip" : {
            src : this.frameOrigin + '/fields/zip',
            id: 'sdk-zip-iframe',
            callback: 'sdk-zip-iframe-loaded',
            style: ''
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
        if ( input && input.hasOwnProperty(property) && typeof input[property] === 'function' ){
            input[property]();
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
