var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=================
//COMMENTS Routes
//=================

//NEW Route - For comments - DISPLAY FORM
router.get("/campground/:id/comments/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})});

//CREATE Route - Add new comment to DB and SHOW the campground
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
	var newcomment = req.body.comment;
	Comment.create(newcomment,function(err,comment){
		if(err){
			console.log("comment not created");
		}else{
			Campground.findById(req.params.id,function(err,campground){
				if(err){
					console.log("Campground not found");
				}else{
					//add user name to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
});
});

//EDIT route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentsOwnership, function(req,res){
			Comment.findById(req.params.comment_id, function(err,foundComment){
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				
			});
});


//UPDATE Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentsOwnership, function(req,res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
			
			
					
				
				});
				res.redirect("/campgrounds/"+req.params.id);
		});

//DELETE route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentsOwnership, function(req,res){
		Comment.findByIdAndRemove(req.params.comment_id, function(err){
			if(err){
				res.redirect("back")
			}else{
				res.redirect("/campgrounds/"+req.params.id);
			}
		});
});

module.exports = router;