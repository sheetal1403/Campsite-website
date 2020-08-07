var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user");
	// seedDB = require("./seed");
	
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb+srv://USER:<password>@cluster0.slzgg.mongodb.net/yelp_camp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();

//Passport configuration
app.use(require("express-session")({
	secret: "It's a Beautiful world",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.set("view engine","ejs");	
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Use Routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();

//Create a campground in DB
// Campground.create({
// 	name: "Kodachadri",
// 	image: "https://www.platbos.co.za/images/IMG_4207-001.jpg",
// 	description: "This is a beautiful trek!"
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("New campground created");
// 		console.log(campground);
// 	}
	
// });

//Hard coded campgrounds
// var campgrounds =[
// 		{name:"KP", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
// 		{name:"Kodachadri", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
// 		{name:"Kodachadri", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
// 		{name:"Kodachadri", image: "http://www.camp-liza.com/wp-content/uploads/2017/10/DSC_4608.jpg"},
// 		{name:"Kodachadri", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
// 		{name:"Kodachadri", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
// 		{name:"Kodachadri", image: "http://www.camp-liza.com/wp-content/uploads/2017/10/DSC_4608.jpg"}
// 	];
				 
//Start the server
app.listen(3000,function(){
	console.log("Listening");
});
