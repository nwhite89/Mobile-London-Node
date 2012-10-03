var	http = require('http')	
	, XmlStream = require('xml-stream')
	, weekendTube = {
		host: 'tfl.gov.uk',
		path: '/tfl/businessandpartners/syndication/feed.aspx?email=nickwhite@toxicd.co.uk&feedId=1',
		method: 'GET',
		port: 80 
	}
	;

// Weekend Tube Line Status
exports.index = function(req, res) {
	var Lines = new Array();
	// Recieve TFL Tube Weekend Status XML
	http.get(weekendTube).on('response', function(response) {
		var xml = new XmlStream(response, 'utf8');
		Lines = new Array();
		var i = 0;
		xml.on('updateElement: Line', function(item) {
			var LineName = item.Name;
			var Status = item.Status.Text;
			var url = "/weekendStatus/show?line=" + LineName.replace(' & ', '_n_');
			var Line = new Array(LineName, url, Status);
			// Add Information to All Lines Variable
			Lines[i] = Line;
			i++;
		});
		xml.on('end', function() {
			res.render('status/weekend', {
				title: 'Weekend Tube',
				LineStatus: Lines
			});
		});
	});
};

// Tube Line Weekend Information
exports.show = function (req, res) {
	// Get the tube line being requested from the URL
	var line = req.query["line"];
	
	// Check that a line has been requested
	if (line == null || line == "") { res.redirect("/weekend") }
	http.get(weekendTube).on('response', function(response) {
		var xml = new XmlStream(response, 'utf8');
		//LineInfo = new Array();
		// Gather information from required Line
		xml.on('updateElement: Line', function(item) {
			var lineName = item.Name;
			// Check that the current line is one required
			if (line == lineName.replace(' & ', '_n_')) {
				var StatusText = item.Status.Text;
				var StatusMessage = item.Status.Message.Text;
				LineInfo = new Array(lineName, StatusText, StatusMessage);
			}						
						
		});
		xml.on('end', function() {
			res.render('status/weekendLine', {
				title: 'Line Status',
				LineStatus: LineInfo
			});
		});
	});
};

