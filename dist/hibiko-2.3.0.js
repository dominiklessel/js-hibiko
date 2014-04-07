/*!
 * Hibiko v2.3.0
 * https://mifitto.com
 *
 * Copyright (c) 2014 
 * Released under the MIT license
 *
 * Date: 2014-04-07
 */

(function() {

  var root = this;
  var Hibiko = {};
  var HibikoLib;

  /**
   * Helper
   *
   * @param {String/Array} collection
   * @param {String} target
   * @returns {Bool}
   */

  var contains = function( collection, target ) {
    var foundTarget = false;
    if ( typeof collection === 'string' ) {
      return collection.indexOf(target) > -1;
    }
    for (var i = collection.length - 1; i >= 0; i--) {
      if ( collection[i].indexOf(target) > -1 ) {
        foundTarget = true;
        break;
      }
    }
    return foundTarget;
  };


  /**
   * Hibiko Library Object
   *
   * @param {window} target                          The window object of the target
   * @param {String/Array} targetOriginWhitelist     The origin of the window that sent the message at the time postMessage was called
   *
   * @constructor
   */

  HibikoLib = function HibikoLib( target, targetOriginWhitelist ) {

    this.target = target;
    this.targetOriginWhitelist = Object.prototype.toString.call( targetOriginWhitelist ) === '[object Array]' ? targetOriginWhitelist : [targetOriginWhitelist];
    this.wpmAvailable = typeof window.postMessage !== 'undefined';

    this.rpcs = {};
    this.JSONMessageIdentifier = ';;JSON;;';
    this.RPCMessageIdentifier = ';;RPC;;';

    window.addEventListener( 'message', this.__onMessage.bind(this), false );

  };


  /**
   * Posts a message to the other window (target)
   *
   * @param {Object/String} msg   Data to be sent to the other window.
   *
   * @public
   */

  HibikoLib.prototype.postMessage = function( msg ) {

    if ( !this.wpmAvailable ) {
      return;
    }

    if ( 'object' === typeof msg && msg.rpName ) {
      msg = this.RPCMessageIdentifier + JSON.stringify( msg );
    }
    else if ( 'object' === typeof msg ) {
      msg = this.JSONMessageIdentifier + JSON.stringify( msg );
    }

    // Broadcast to all whitelisted origins
    for (var i = this.targetOriginWhitelist.length - 1; i >= 0; i-- ) {
      this.target.postMessage( msg, this.targetOriginWhitelist[i] );
    }

  };


  /**
   * Internal message event handler
   * !! Not supposed to be used by the outside world.
   *
   * @param {Event} e   An message event
   *
   * @private
   */

  HibikoLib.prototype.__onMessage = function( e ) {

    if ( !this.wpmAvailable || !contains(this.targetOriginWhitelist, e.origin) ) {
      return;
    }

    var msg = e.data;

    if ( msg.indexOf(this.JSONMessageIdentifier) === 0 ) {
      msg = JSON.parse( msg.replace(this.JSONMessageIdentifier,'') );
      return this.messageCallback( msg );
    }

    if ( msg.indexOf(this.RPCMessageIdentifier) === 0 ) {
      msg = JSON.parse( msg.replace(this.RPCMessageIdentifier,'') );
      if ( !this.rpcs[msg.rpName] ) {
        return;
      }
      return this.rpcs[msg.rpName].apply( null, msg.rpParams );
    }

    return this.messageCallback( msg );

  };

  /**
   * Lets you register a message handler / callback
   *
   * @param {fn} callback   A callback function
   *
   * @public
   */

  HibikoLib.prototype.onMessage = function( callback ) {
    if ( !this.wpmAvailable ) {
      return;
    }
    this.messageCallback = callback;
  };


  /**
   * Lets you expose a procedure
   *
   * @param {String} rpName   Name of the procedure
   * @param {fn} rpParams     Params of the procedure
   *
   * @public
   */

  HibikoLib.prototype.registerRp = function( rpName, rpFunction ) {
    if ( !this.wpmAvailable ) {
      return;
    }
    this.rpcs[rpName] = rpFunction;
  };


  /**
   * Lets you call an exposed procedure
   *
   * @param {String} rpName   Name of the procedure
   * @param {fn} rpParams     Params of the procedure
   *
   * @public
   */

  HibikoLib.prototype.callRp = function( rpName, rpParams ) {
    if ( !this.wpmAvailable || 'undefined' === typeof rpName || 'undefined' === typeof rpParams ) {
      return false;
    }
    this.postMessage({
      rpName: rpName,
      rpParams: rpParams
    });
  };


  /**
   * Hibiko.init()
   *
   * @param {window} target         The window object of the target
   * @param {String} targetOrigin   The origin of the window that sent the message at the time postMessage was called
   * @returns {HibikoLib}
   *
   * @public
   */

  Hibiko.init = function( target, targetOrigin ) {
    if ( !window.postMessage ) {
      return false;
    }
    return new HibikoLib( target, targetOrigin );
  };


  /**
   * Hibiko.inIframe()
   *
   * @returns {Bool}
   * @public
   */

  Hibiko.inIframe = function() {
    try {
      return window.self !== window.top;
    }
    catch( e ) {
      return true;
    }
  };


  /**
   * Export
   */

  if ( 'undefined' !== typeof define && define.amd ) {  // AMD & RequireJS
    define([], function () { return Hibiko; });
  }
  else if ( 'undefined' !== typeof module && module.exports ) { // Node
    module.exports = Hibiko;
  }
  else {
    root.Hibiko = Hibiko;
  }

})();
