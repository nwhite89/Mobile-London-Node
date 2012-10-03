exports.index = function(req, res) {
	res.render('favs/index', {
		title: 'Favourites'
	});
};

exports.journeys = function (req, res) {
	res.render('favs/journeys', {
		title: 'Journeys'
	});
};

exports.journeyEdit = function (req, res) {
	res.render('favs/journeyEdit', {
		title: 'Edit Favourites'
	});
};

exports.buses = function (req, res) {
	res.render('favs/buses', {
		title: 'Bus Stops'
	});
};

exports.busStop = function(req, res) {
	res.render('favs/stop', {
		title:	req.query['name'],
		stopID:	req.query['sID']
	});
};

exports.busEdit = function(req, res) {
	res.render('favs/stopedit', {
		title: 'Edit Favourites'
	});
};