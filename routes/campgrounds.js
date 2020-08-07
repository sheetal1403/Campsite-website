//================
//Campgroud Routes
//=================

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//INDEX
router.get("/campgrounds",function(req,res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

//NEW Route-Displaya a form
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
	
		 res.render("new");
});

//CREATE Route - Add new data to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newcg = {
		name: name,
		image: image,
		description: desc,
		author: author
	};
	console.log(req.user);
	//Create the new campground and save it to database
	Campground.create(newcg,function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	})
	
});

//SHOW Route - Show details of a particular campground when clicked
router.get("/campgrounds/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("show", {campground: foundCampground});
		}
	});
});

//EDIT
router.get("/campground/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	
		Campground.findById(req.params.id, function(err,foundCampground){
		res.render("edit",{campground: foundCampground});	
	});
	});


//UPDATE Route
router.put("/campground/:id", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,foundCampground){
			
		});
		res.redirect("/campgrounds/"+req.params.id);
});

//DESTROY Route
router.delete("/campgrounds/:id",function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}	
	});
});

module.exports = router;