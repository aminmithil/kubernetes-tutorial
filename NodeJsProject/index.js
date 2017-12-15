var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});

connection.connect(function(err){
	if(err) {
	    throw err;
	    console.log("Error in database connection ...");  
	    console.log("Host : ", process.env.MYSQL_HOST);
	    console.log("User : ", process.env.MYSQL_USER);
	    console.log("Password : ", process.env.MYSQL_PASSWORD);
	    console.log("Database : ", process.env.MYSQL_DATABASE);
	} else {
	    console.log("Database is connected ...");    
	    console.log("Host : ", process.env.MYSQL_HOST);
	    console.log("User : ", process.env.MYSQL_USER);
	    console.log("Password : ", process.env.MYSQL_PASSWORD);
	    console.log("Database : ", process.env.MYSQL_DATABASE);
	    connection.query('CREATE TABLE IF NOT EXISTS visits (visit INT)',function(err) {
                        if(err) throw err;
                });
	}
});

app.get("/",function(req,res){
	connection.query('SELECT * from visits', function(err, rows) {
	  if (!err) {
	  	try {
		    res.send('Before visited users : ' + rows[0]['visit']);
			var val = {visit: rows[0]['visit']+1}; 
			connection.query('UPDATE visits SET ?', val, function(err, rows, fields) {
				if(!err)
					res.send('Hello User Number : ', val);
				else
					console.log('Error in innter query');
			});
		} catch(e) {
			val = {visit: 1}
			connection.query('INSERT INTO visits SET ?', val, function(err, rows, fields){
				if(!err)
					console.log('1st Entry');
			});
		}
	  } else
	    console.log('Error while performing Query.');
	  });
});

app.listen(8888, function(){
	console.log('Server on 8888');
})
