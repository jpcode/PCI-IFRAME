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

   this.buildIframe = function( elem, target ){
    var domain = this.frameOrigin;
    var elemsAllowed = {
        "ccn" : {
            src : domain + '/fields/ccn'
        },
        "exp" : {
            src : domain + '/fields/exp'
        },
        "zip" : {
            src : domain + '/fields/zip'
        }
    }
    var iframeObj = elemsAllowed[ elem  ];
    var ifrm = document.createElement("iframe");
        ifrm.setAttribute("frameborder", 0 );
        ifrm.setAttribute("allowtransparency", true );
        ifrm.setAttribute("scrolling", "no" );
        ifrm.setAttribute("style","border: none !important; margin: 0px !important; padding: 0px !important; width: 1px !important; min-width: 100% !important; overflow: hidden !important; display: block !important; height: 19.2px;")
        ifrm.setAttribute("src", iframeObj.src );
    this.mount( ifrm, target );
    return ifrm;
   }

   this.createElement = function( elem, target ){
        var elemsAllowed = ["ccn", "exp", "zip", "cvc", "pay" ];
        if ( elemsAllowed.indexOf( elem ) > -1 ){
            return this.buildIframe( elem, target );
        }else{
            throw "Currently elems allowed are " + elemsAllowed.toString(); 
        }
   }

   this.buildMessageHandler = function( event ) {
        var me = this;
        var origin = event.origin;
        var data = event.data;
        var msg = null;
        // validate for origin
        if ( data === "iframesReady" ){
            Sdkpay.ready();
        }/*
        else if ( data === "errors"){
            Sdkpay.error()
        }else if (msg = data.match(/errors: (.*)/i)){
            Sdkpay.error( JSON.parse(r[1]) );
        }
        */
   }
   this.log = function( log ){
        if ( window.console && this.developer ){
             console.log( log );
        }
   }
      
   this.init = function( api_key ){
        this.log("init sdk" +  api_key ); 
        this.api_key = api_key;
        this.numberFrameId = "spreedly-number-frame-1001";
   }

   this.setStyle = function(e, t) {
        console.log("setting style", e, t );
        this.sendMessage("style(" + e + "): " + t)
   }

   this.sendMessage = function(e) {
        var f =  this.frameOrigin;
        document.getElementById(this.numberFrameId).contentWindow.postMessage(e, f );
   }
   window.addEventListener("message", this.buildMessageHandler, false);
}

window.Sdkpay = new Sdkpay;
