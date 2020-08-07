var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


//ROOT Route - HOME
router.get("/",function(req,res){
	res.render("landingPage");
});

//================
//Auth Routes
//================

//show Register form
router.get("/register",function(req,res){
	res.render("register");
});

//Handle once registration is submitted
router.post("/register",function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to Yelpcamp!");
			
			res.redirect("/campgrounds");
		});
	});
});

//Show login form
router.get("/login",function(req,res){
	
	res.render("login");
})

router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){	
});

//LOG out
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "Logged out!");
	res.redirect("/campgrounds");
});

//Middleware function
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;