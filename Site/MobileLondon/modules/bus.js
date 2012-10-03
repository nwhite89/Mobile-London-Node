exports.index = function(req, res) {
	if (req.query["x"]) {
		res.render('bus/form', {
			title: 'Countdown'
		});
	} else {
		res.redirect('/');
	}
};
// Bus Stop Search Form Submitted
exports.create = function(req, res) {
	var bs = require('TFL-BusStop');
	bs.busStops(req, res);
};

// Bus Stop Countdown
exports.show = function (req, res) {
	var bs = require('TFL-BusStop');
	bs.countdown(req, res, req.query["sid"]);
};
