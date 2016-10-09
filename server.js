/**
 * Created by phoebe on 2/18/16.
 */
var express = require('express');
var app = express(); // application instance

var bodyParser = require('body-parser');

var concave = require('turf-concave');
var isochrone = require('osrm-isochrone');

app.use(express.static('public')); //serve static file in the public directory
app.use(bodyParser.json());

// route url
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/osrm', function(req, res, next) {
    var location = [req.body[1], req.body[0]] || null;

    // calculate one isochrone line geom using coordinates(lat/long) and time(seconds)
    function getIsochrones(coords, time) {
        var iso = {};
        var options = {
            resolution: 25, // sample resolution
            maxspeed: 3, // in 'unit'/hour
            unit: 'miles', // 'miles' or 'kilometers'
            network: __dirname + '/nairobi_foot/nairobi_kenya.osrm' // prebuild dc osrm network file
        };

        isochrone(coords, time, options, function(err, drivetime) {
            if(err) throw err;
            // a geojson line
            res.json(drivetime);
            res.end();
        });
    }

    getIsochrones(location, 2400); // 40min
});

// starts a server and listens on port 3001
app.listen(3000, function() {
    console.log('Listening on port 3030');
});
