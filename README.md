# WIP: Hibiko

JS cross origin communication between iFrames made simple.

## Features

* Hibiko
	* .init( target, targetOrigin )
  * .inIframe()
* hibiko
	* .postMessage( message )
	* .onMessage( callback )
	* .registerRp( rpName, rpFunction )
	* .callRp( rpName, rpParams )
	
## Example

**Server A**  

```
<!DOCTYPE HTML>
<html lang="de-DE">
  <head>
    <meta charset="UTF-8">
    <title>Server A</title>
  </head>
  <body>
    <h1>Server A</h1>
    <iframe id="hibikoIframe" src="http://127.0.0.1:3001/"></iframe>
    <script src="/hibiko.js"></script>
    <script>

      var target = document.getElementById('hibikoIframe');

      target.onload = function() {

        target = (target.contentWindow || target.contentDocument);

        var hibiko = Hibiko.init( target, 'http://127.0.0.1:3001' );

        hibiko.onMessage(function( msg ) {
          console.log( 'Server A - Message:' );
          console.log( msg );
        });

        hibiko.postMessage({
          'foo': 'bar'
        });

        var iframeGotInformation = function( foo, bar ) {
          console.log('Server A - iframeGotInformation:');
          console.dir( foo );
          console.dir( bar );
        };

        hibiko.registerRp( 'gotInformation', iframeGotInformation );

      };

    </script>
  </body>
</html>

```

**Server B**  

```
<!DOCTYPE HTML>
<html lang="de-DE">
  <head>
    <meta charset="UTF-8">
    <title>Server B</title>
  </head>
  <body>
    <h1>Server B</h1>
    <script src="/hibiko.js"></script>
    <script>

      var target = window.parent;

      var hibiko = Hibiko.init( target, 'http://127.0.0.1:3000' );

      hibiko.onMessage(function( msg ) {
        console.log( 'Server B - Message:' );
        console.log( msg );
        hibiko.postMessage('Server B: How are you?');
        hibiko.callRp( 'gotInformation', ['foo',2] );
      });

    </script>
  </body>
</html>
```

## Compatibility

* FF3+
* Chrome
* Safari
* IE7+
* Opera10+
