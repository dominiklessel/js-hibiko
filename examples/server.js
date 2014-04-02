
/**
 * Module dependencies
 */

var path = require('path');
var package = require( path.join(__dirname, '..', 'package.json') );
var express = require('express');

/**
 * Config
 */

var jsFilePath = path.join(__dirname, '..', 'lib', package.main + '.js' );

var config = {
  'devA': { port: 3000, template: __dirname + '/devA/index.html' },
  'devB': { port: 3001, template: __dirname + '/devB/index.html' }
};

config = config[process.env.NODE_ENV];

/**
 * Server
 */

var app = express();

app.get('/', function( req, res ) {
  res.sendfile( config.template );
});

app.get('/hibiko.js', function( req, res ) {
  res.sendfile( jsFilePath );
});

/**
 * Listen
 */

app.listen( config.port );
