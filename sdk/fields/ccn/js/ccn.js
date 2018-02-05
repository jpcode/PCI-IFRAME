/*
    ***postmessage security concern,
    If you want a more security you can add origin for sendMessage, see example:
    https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
*/

(function() {
    var inputId = 'input';
    var elem = document.getElementById( inputId );
    var api = SDKConfig.config.api;
    var tasks = {
      setStyle : function( style ){
        for ( var key in style ){
          elem.style[ key ] = style[ key ];
        }
      },
      getToken : function( elemUsed ){
        var result = {};
        var dociframe;
        for ( var i = 0; i < elemUsed.length; i++ ){
          dociframe = window.parent.frames[ elemUsed[ i ] ];
          result[ elemUsed[ i ] ] =  dociframe.document.getElementById("input").value;
        }
         Helper.ajax.post( api.token, JSON.stringify( result ), function( response ){
            sendMessage( setMessage("resolvingToken", response ) );
         });  
      }

    }

    var eventsAllowed = function( elem ){
          elem.onfocus = function() {
                sendMessage( setMessage('focus') );
            }
    }

    function setMessage( property, extraParams ){
      return {
        origin : 'ccn',
        property: property,
        extraParams : extraParams
      }
    }
    function receiveMessage( event ){
      var data = event.data;
      if ( data.hasOwnProperty('task') ){
        var msg = data.message;
        var fn = tasks[ data['task'] ];
        fn( msg );
      }
    }
    function sendMessage( msg ){
      window.parent.postMessage( msg, SDKConfig.config.origin );
    }
    window.addEventListener('message', receiveMessage, false );

    eventsAllowed( elem );
    sendMessage( setMessage( 'callback' ) );
})();


