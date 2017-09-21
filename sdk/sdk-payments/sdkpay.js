function Sdkpay(){
   
   this.developer = true;
   this.frameOrigin = "http://localhost:70";
   this.buildMessageHandler = function( event ) {
        var me = this;
        var origin = event.origin;
        var data = event.data;
        var msg = null;
        // validate for origin

        if ( data === "iframesReady" ){
            //method used by the consumer
            Sdkpay.ready();
        }else if ( data === "errors"){
            Sdkpay.error()
        }else if (msg = data.match(/errors: (.*)/i)){
            Sdkpay.error( JSON.parse(r[1]) );
        }
   }
   this.log = function( log ){
        if ( window.console && this.developer ){
             console.log( log );
        }
   }
   
   this.tokenizeCreditCard = function(e) {
        return this.sendMessage("getToken")
   }
   
   this.init = function( e, t ){
        this.log("init sdk"); 
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

  //this.messageHandler = this.buildMessageHandler();
  //r.addListener(window, "message", this.messageHandler);
  //this.emitter = new o;
}


var sdk = new Sdkpay();
window.Sdkpay = sdk;


/*
 function y() {
            this.init = function(e, t) {
                this.isLoaded() && this.unload(),
                t && t.source && (this.source = t.source),
                t && t.numberEl ? this.numberTarget = t.numberEl : this.numberTarget = m("data-number-id"),
                t && t.cvvEl ? this.cvvTarget = t.cvvEl : this.cvvTarget = m("data-cvv-id"),
                this.environmentKey = e ? e : m("data-environment-key"),
                this.numberFrameId = "spreedly-number-frame-" + this.uniqueId,
                this.cvvFrameId = "spreedly-cvv-frame-" + this.uniqueId,
                this.addIframeElements()
            }
            ,
            this.addIframeElements = function() {
                var e = s(l);
                e.id = this.numberFrameId,
                e.name = this.numberFrameId,
                e.setAttribute("src", h + g(this.source)),
                document.getElementById(this.numberTarget).appendChild(e);
                var t = s(c);
                t.id = this.cvvFrameId,
                t.name = this.cvvFrameId,
                t.setAttribute("src", p + g(this.source)),
                document.getElementById(this.cvvTarget).appendChild(t)
            }
            ,
            this.checkUniqueId = function(e) {
                return e == this.uniqueId
            }
            ,
            this.on = function(e, t) {
                this.emitter.on(e, t)
            }
            ,
            this.emit = function(e, t, n, r, i) {
                this.emitter.emit(e, t, n, r, i)
            }
            ,
            this.isLoaded = function() {
                return !this.numberFrameId && !this.cvvFrameId ? !1 : !!document.getElementById(this.numberFrameId) || !!document.getElementById(this.cvvFrameId)
            }
            ,
            this.reload = function() {
                this.unload();
                var e = {
                    numberEl: this.numberTarget,
                    cvvEl: this.cvvTarget
                };
                this.init(this.environmentKey, e)
            }
            ,
            this.removeHandlers = function() {
                a(this.emitter)
            }
            ,
            this.resetFields = function() {
                this.sendMessage("reset")
            }
            ,
            this.sendMessage = function(e) {
                document.getElementById(this.numberFrameId).contentWindow.postMessage(e, f)
            }
            ,
            this.setValue = function(e, t) {
                e == "cvv" ? this.sendMessage("setCvv: " + t) : e == "number" && this.sendMessage("setNumber: " + t)
            }
            ,
            this.setLabel = function(e, t) {
                e == "cvv" ? this.sendMessage("setCvvLabel: " + t) : e == "number" && this.sendMessage("setNumberLabel: " + t)
            }
            ,
            this.setFieldType = function(e, t) {
                t || (t = e,
                e = "number"),
                e == "cvv" ? this.sendMessage("setCvvType: " + t) : e == "number" && this.sendMessage("setNumberType: " + t)
            }
            ,
            this.setNumberFormat = function(e) {
                this.sendMessage("numberFormat: " + e)
            }
            ,
            this.setPlaceholder = function(e, t) {
                this.sendMessage("placeholder: " + e + ":" + t)
            }
            ,
            this.setParam = function(e, t) {
                this.sendMessage("param(" + e + "): " + t)
            }
            ,
            this.setStyle = function(e, t) {
                this.sendMessage("style(" + e + "): " + t)
            }
            ,
            this.setRecache = function(e, t) {
                this.sendMessage("setRecache: " + e),
                this.setParam("environment_key", this.environmentKey),
                t && t.last_four_digits && this.setParam("last_four_digits", t.last_four_digits),
                t && t.card_type && this.setParam("card_type", t.card_type)
            }
            ,
            this.recache = function() {
                this.sendMessage("recache")
            }
            ,
            this.tokenizeCreditCard = function(e) {
                if (e) {
                    this.setParam("environment_key", this.environmentKey);
                    for (var t = 0; t < w.length; t++)
                        e[w[t]] && this.setParam(w[t], e[w[t]])
                }
                return this.sendMessage("getToken"),
                !1
            }
            ,
            this.transferFocus = function(e) {
                this.sendMessage("focus: " + e)
            }
            ,
            this.unload = function() {
                var e = document.getElementById(this.numberFrameId);
                e && e.parentNode.removeChild(e);
                var t = document.getElementById(this.cvvFrameId);
                t && t.parentNode.removeChild(t)
            }
            ,
            this.validate = function() {
                this.sendMessage("validate")
            }
            ,
            this.buildMessageHandler = function() {
                var e = this;
                return function(t) {
                    if (t.origin == f && e.checkUniqueId(t.data.substring(0, 4)) && e.isLoaded()) {
                        var n = t.data.substring(4), r;
                        if (n != "frameLoaded:")
                            if (n == "iframesReady")
                                e.source && e.sendMessage("source: " + e.source),
                                e.emit("ready");
                            else if (n == "recacheReady")
                                e.emit("recacheReady");
                            else if (r = n.match(/paymentMethod\((.*)\): (.*)/i))
                                e.emit("paymentMethod", r[1], JSON.parse(r[2]));
                            else if (r = n.match(/recacheResult\((.*)\): (.*)/i))
                                e.emit("recache", r[1], JSON.parse(r[2]));
                            else if (r = n.match(/errors: (.*)/i))
                                e.emit("errors", JSON.parse(r[1]));
                            else if (r = n.match(/validation: (.*)/i))
                                e.emit("validation", JSON.parse(r[1]));
                            else if (r = n.match(/input: (.*)/i)) {
                                var i = JSON.parse(r[1])
                                  , s = i.activeElement;
                                e.emit("fieldEvent", s, "input", s, i)
                            } else
                                (r = n.match(/notifyEvent\( (.*)\): (.*):(.*)/i)) ? e.emit("fieldEvent", r[1], r[2], r[3], {}) : (r = n.match(/consoleError: (.*)/i)) ? e.emit("consoleError", JSON.parse(r[1])) : n == "numberSet" ? e.emit("numberSet") : n == "cvvSet" ? e.emit("cvvSet") : (r = n.match(/sourceSet: (.*)/i)) && e.emit("sourceSet", r[1])
                    }
                }
            }
            ,
            this.uniqueId = v().toString(),
            this.messageHandler = this.buildMessageHandler(),
            r.addListener(window, "message", this.messageHandler),
            this.emitter = new o
}
*/