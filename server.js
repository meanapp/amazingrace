var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config.js');
var Schema = mongoose.Schema;

mongoose.connect(config.database, function(err) {
	if(err) {
		console.log("Error in connecting to database : " + err);
	} else {
		console.log("Connected to database");
	}
});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    workStation: {
        type: String,
        required: true
    },
    contactNumber: {
      type: Number,
        required: true
    },
    status: {
        type: String
    },
    auditCreateDate: {
        type: Date,
        default: Date.now()
    }
});


app.post('api/register', function(req, res) {
    var user = new UserSchema({firstName: req.body.firstname, lastName: req.body.lastname, emailAddress: req.body.emailaddress, workStation:   req.body.workstation, contactNumber: req.body.contactnumber, status: 'P'});

    user.save(function(err, userObj) {
        if(err) {
            console.log("Error" + err);
            res.json({status: 500, message: "Error"});
        } else if(err.errorCode === 11000) {
            console.log("Error " + err);
            res.json({status: 305, message: "User already registered"});
        } else {
            res.json({status: 200, message: "User registered successfully"});
        }
    });
});


app.get('api/confirmUser/:id', function(req, res) {
    UserSchema.findOneAndUpdate({_id: req.params.id}, {status: 'A'}, function(err, user) {
       if(err) {
           console.log("Error : " + err);
           res.json({status: 500, message: "Error"});
       } else if(!user) {
           console.log("Error : " + err);
           res.json({status: 404, message:"User does not exists"});
       } else {
            res.json({status: 200, message: "User confirmation complete"});            
        }
    });
});

app.get('api/admin/dashboard', function(req, res) {
    var count = 0;
    fs.readFile('pageCount.txt', function(err, data) {
        if(err) {
            console.log("Error");
        } else {
            count = data.toString();
        }
    });
    
    res.json({count: count});
})

app.get('*', function(req, res) {
    fs.readFile('pageCount.txt', function(err, data) {
		if(err) {
			console.log("Error");
		} else {
			var count = parseInt(data.toString()) + 1;
			fs.writeFile('pageCount.txt', count, function(err){
				if(err) {
					console.log("Could not write");
				} else {
					console.log(count);
				}
			});
		}
	});
	res.sendFile(__dirname + '/public/views/index.html');	
});

app.listen(config.port, function(err) {
	if(err) {
		console.log("Error on port " + config.port + ', error:  ' + err);
	} else {
		console.log("Listening on port " + config.port);
	}
})
