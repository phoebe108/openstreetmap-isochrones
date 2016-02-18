/**
 * Created by phoebe on 2/18/16.
 */
var express = require('express');
var app = express(); // application instance

// route url
app.get('/', function(req, res) {
});

// starts a server and listens on port 3001
app.listen(3001, function() {
    console.log('Listening on port 3001');
});