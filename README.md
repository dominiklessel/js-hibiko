# Cross Origin Communication

## Scenario
`domain-a.de/index.html` opens `domain-a.de/popup.html` and loads `domain-b.de/content.html` into an iframe. The Content inside the iframe is allowed to send messages back to the popup, which can then manipulate the index page.

## Compatibility

* FF3+
* Chrome
* Safari
* IE7+
* Opera10+