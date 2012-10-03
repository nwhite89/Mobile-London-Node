var	http = require('http')	
	, XmlStream = require('xml-stream')
	, liveTube = {
		host: 'cloud.tfl.gov.uk',
		path: '/TrackerNet/LineStatus',
		method: 'GET',
		port: 80 
	}
	;

//Tube Status Page
exports.index = function(req, res) {
	// Recieve TFL Tube Status XML
	http.get(liveTube).on('response', function(response) {
		var xml = new XmlStream(response, 'utf8');
		Lines = new Array();
		var i = 0;
		// Gather information from each Line
		xml.on('updateElement: LineStatus', function(item) {
			// Create Status Page Link for Tube Line
			var LineName = item.Line.$.Name
			var url = "/liveStatus/show?line=" + LineName;
			// Add Line to Array			
			Line = new Array(LineName, url, item.Status.$.ID);
			Lines[i] = Line;	
			i++;		
		});
		// When XML completly been looked at Render the Tube Status Page
		xml.on("end", function () {
			// Display Tube Status page (status.jade)
			res.render('status/live', {
				title: 'Tube Status',
				LineStatus: Lines
			});
		});
	});
};

// Tube Line Status
exports.show = function(req, res) {
	// Get the tube line being requested from the URL
	var line = req.query["line"];
	
	// Check that a line has been requested
	if (line == null || line == "") { res.redirect("/status") }

	// Recieve TFL Tube Status XML
	http.get(liveTube).on('response', function(response) {
		var xml = new XmlStream(response, 'utf8');
		var Branch = '';
		var lineName = '';
		// Gather information from required Line
		xml.on('updateElement: LineStatus', function(item) {
			var lineName = item.Line.$.Name;
			// Check that the current line is one required
			if (line == lineName) {
				// Gather information from line
				var Details = item.$.StatusDetails;
				var Desc = item.Status.$.Description;
				Line = new Array(lineName, Desc, Details);
			}						
						
		});
		xml.on("end", function () {
			// Display Tube Status page (status.jade)
			res.render('status/line', {
				title: 'Line Status',
				LineStatus: Line
			});
		});
	});
};


