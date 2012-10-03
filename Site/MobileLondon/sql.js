
	var Client = require('mysql').Client,
    client = new Client();
    client.port = '/var/run/mysqld/mysqld.sock';  // change this to a hostname if you don't want to use sockets
    client.user = 'root'; // change this
    client.password = 'manutd'; // change this
    //client.connect();
    // use the correct database
    client.query('USE nodejs_mysql_test'); // change this
 
	// Configuration
	return	client.query('SELECT * FROM test WHERE id = "6"', // change this
			function selectCb(err, results, fields) {
    			if (err) {
      				throw err;
    			}
			//console.log(results[0].title);
 			if (results[0].id == 6) {
				res.redirect('/',301);
			}
			//For each item do something with the result
			for (var i in results){
          			var result = results[i];
      			}	
		}
		);
