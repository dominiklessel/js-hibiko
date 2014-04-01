
var Hibiko = Hibiko || (function( window, document ) {

  var intervalId;
  var lastHash;
  var attachedCallback;
  var originWhitelist = {};
  var cacheBust = 1;

  var publicInterface = {};
  var postMessage;
  var receiveMessage;
  var processMessage;

  postMessage = publicInterface.postMessage = function( message, targetUrl, target ) {

    if ( !targetUrl ) {
      return;
    }

    target = target || parent;

    if ( !window.postMessage ) {
      target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date()) + (cacheBust++) + '&' + message;
      return;
    }

    target.postMessage(message, targetUrl.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

  };

  receiveMessage = publicInterface.receiveMessage = function( callback, sourceOrigin ) {

    if ( window.postMessage ) {
      if ( callback ) {
        attachedCallback = function( e ) {
          if ( (typeof sourceOrigin === 'string' && e.origin !== sourceOrigin) || (Object.prototype.toString.call(sourceOrigin) === "[object Function]" && sourceOrigin(e.origin) === !1) ) {
            return !1;
          }
          callback( e );
        };
      }

      if ( window.addEventListener ) {
        window[callback ? 'addEventListener' : 'removeEventListener']('message', attachedCallback, !1);
      }
      else {
        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attachedCallback);
      }

      return;
    }

    if ( intervalId ) {
      clearInterval( intervalId );
    }

    intervalId = null;

    if ( callback ) {
      intervalId = setInterval(function() {
        var hash = document.location.hash, re = /^#?\d+&/;
        if ( hash !== lastHash && re.test(hash) ) {
          lastHash = hash;
          callback( {data: hash.replace(re, '')} );
        }
      }, 100);
    }

  };

  processMessage = publicInterface.processMessage = function( event, whitelist ) {

    this.originWhitelist = whitelist;

    if ( event.origin && ('undefined' === typeof originWhitelist[event.origin] || !originWhitelist[event.origin].allowed) ) {
      return;
    }

    if ( event.data.indexOf('location') > -1 ) {
      window.opener.window.location.href = event.data.split('location=')[1];
    }

  };

  return publicInterface;

})( window, document );
