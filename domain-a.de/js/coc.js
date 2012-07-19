// Cross Origin Communication
var COC = COC || {};
COC = (function() {
  var originWhitelist = {};
  var intervalId, lastHash, cacheBust = 1, attachedCallback, window = this;
  var postMessage = function( message, target_url, target ) {
    if ( !target_url ) {
      return;
    }
    target = target || parent;
    if ( window['postMessage'] ) {
      target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
    } else if ( target_url ) {
      target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date()) + (cacheBust++) + '&' + message;
    }
  };
  var receiveMessage = function( callback, source_origin ) {
    if ( window['postMessage'] ) {
      if ( callback ) {
        attachedCallback = function( e ) {
          if ( (typeof source_origin === 'string' && e.origin !== source_origin) || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1) ) {
            return !1;
          }
          callback( e );
        };
      }
      if ( window['addEventListener'] ) {
        window[callback ? 'addEventListener' : 'removeEventListener']('message', attachedCallback, !1);
      } else {
        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attachedCallback);
      }
    } else {
      intervalId && clearInterval( intervalId );
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
    }
  };
  var processMessage = function( event, whitelist ) {
    this.originWhitelist = whitelist;
    if ( event.origin !== undefined ) {
      if ( typeof originWhitelist[event.origin] === "undefined" || originWhitelist[event.origin].allowed !== true) {
        return;
      }
    }
    if ( event.data.indexOf("location") !== -1 ) {
      var newUrl = event.data.split('location=')[1];
      window.opener.window.location.href = newUrl;
    }
  };
  return {
    postMessage : postMessage,
    receiveMessage : receiveMessage,
    processMessage : processMessage
  };
})();