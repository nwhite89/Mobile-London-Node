// Register
exports.index = function(req, res) {
	res.render('register/form', {
		title: 'Register'
	});
};
// Recieve register form
exports.create = function(req, res) {
	var reg = require('TFL-Register');
	reg.newUser(req, res);
};

