var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var env = require("dotenv").load();
var exphbs = require("express-handlebars");
var path = require('path');

var PORT = process.env.PORT || 5000;

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(session({ secret: "whiskey proof", resave: true, saveUninitialized: true })); // session secret

app.use(passport.initialize());

app.use(passport.session()); // persistent login sessions

//For Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, '/public')));

//Models
var models = require("./app/models");

//Routes
var authRoute = require("./app/routes/auth.js")(app, passport);
var whiskeyRoutes = require("./app/routes/whiskeyRoutes")(app);

//load passport strategies
require("./app/config/passport/passport.js")(passport, models.user);

//Sync Database
models.sequelize
	.sync()
	.then(function () {
		console.log("Nice! Database looks fine");
	})
	.catch(function (err) {
		console.log(err, "Something went wrong with the Database Update!");
	});

app.listen(PORT, function (err) {
	if (!err) console.log("Site is live");
	else console.log(err);
});
