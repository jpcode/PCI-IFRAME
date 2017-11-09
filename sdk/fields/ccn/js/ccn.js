(function() {
    var inputId = 'credit-card-number';
    var elem = document.getElementById( inputId );
    
    var tasks = {
      setStyle : function( style ){
        console.log( style );
        for ( var key in style ){
          elem.style[ key ] = style[ key ];
        }
      }
    }

    function setMessage( property ){
      return {
        origin : 'ccn',
        property: property
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
      window.parent.postMessage( msg, "*");
    }
    window.addEventListener('message', receiveMessage, false );
    sendMessage( setMessage( 'callback' ) );
})();