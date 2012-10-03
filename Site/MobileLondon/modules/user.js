// User login
exports.index = function(req, res) {
	res.render('user/form', {
		title: 'Login'
	});
};
// Recieve log in data
exports.create = function(req, res) {
	var user = require('TFL-User');
	user.login(req, res);
};
// User logout
exports.logout = function(req, res) {
	var user = require('TFL-User');
	user.logout(req, res);
};