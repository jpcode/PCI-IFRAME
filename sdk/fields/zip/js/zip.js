(function() {
    var inputId = 'input';
    var elem = document.getElementById( inputId );
    
    var tasks = {
      setStyle : function( style ){
        for ( var key in style ){
          elem.style[ key ] = style[ key ];
        }
      }
    }

    function setMessage( property ){
      return {
        origin : 'zip',
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
      window.parent.postMessage( msg, SDKConfig.config.origin );
    }
    window.addEventListener('message', receiveMessage, false );
    sendMessage( setMessage( 'callback' ) );
})();