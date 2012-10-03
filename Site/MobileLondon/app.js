/* --------------------------------------------------- *\
|														|
|	TFL NodeJS Express Website							|
|														|
|	Optimised for iPhone (using jQuery mobile)			|
|	Created by: Nick White								|
|	Final Year Project									|
|	HEMIS: 418227										|
|	CAM80767											|
|														|
\* --------------------------------------------------- */
	
// Include all needed modules
var	http = require('http')	
	,	express = require('express')
	,	url = require('url')
	,	XmlStream = require('xml-stream')
	,	app = module.exports = express.createServer()
	,	$ = require('jquery')
	;
require('express-resource');
// Create HTTP Information for and XML and JSON needed 
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	//app.use(express.session({secret: "keyboard cat"}));
	app.use(express.methodOverride());
	app.use(app.router);
	//app.use(require('connect-assets')());
	coffeeDir = __dirname + '/coffee';
	publicDir = __dirname + '/public';
	app.use(express.compiler({src: coffeeDir, dest: publicDir, enable: ['coffeescript']}))
	app.use(express.static(publicDir));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
	res.render('index', {
		title: 'Mobile London'
	});
});

// Import Live Tube Status Module
app.resource('liveStatus', require('./modules/liveStatus'));
// Import Weekend Tube Status Module
app.resource('weekendStatus', require('./modules/weekendStatus'));
// Import Bus Stop Countdown Module
app.resource('bus', require('./modules/bus'));
// Import user fav module and map url requests
var favs = require('./modules/favs'),
    favsResource = app.resource('favs', favs);
var planner = require('./modules/planner'),
	plannerResource = app.resource('planner', planner);


// Map all custom URL's
favsResource.map('get', '/journeys', favs.journeys);
favsResource.map('get', '/journeys/edit', favs.journeyEdit);
favsResource.map('get', '/buses', favs.buses);
favsResource.map('get', '/buses/stop', favs.busStop);
favsResource.map('get', '/buses/edit', favs.busEdit);	
plannerResource.map('get', '/journey', planner.redir);
plannerResource.map('post', '/journey', planner.journey);

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
