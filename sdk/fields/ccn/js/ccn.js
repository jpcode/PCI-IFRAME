(function() {
    var inputId = 'input';
    var elem = document.getElementById( inputId );
    
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
         var url = "http://localhost:5000/token";
         Helper.ajax.post( url, JSON.stringify( result ), function( response ){
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
      console.log( data );
      if ( data.hasOwnProperty('task') ){
        var msg = data.message;
        var fn = tasks[ data['task'] ];
        fn( msg );
      }
    }
    function sendMessage( msg ){
      window.parent.postMessage( msg, "*");
    }
    window.addEventListener('message', receiveMessage, false );

    eventsAllowed( elem );
    sendMessage( setMessage( 'callback' ) );
})();

console.log( Helper );

