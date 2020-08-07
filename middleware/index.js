var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	//Check if the User has logged in
	if(req.isAuthenticated()){ 
		Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//Check if the logged in user owns the campground
			if(foundCampground.author.id.equals(req.user._id)){ 
				next();
			} else{
				req.flash("error","You do have permission to do that!");
				res.redirect("back");
			}	
		}
	});
	} else{
		req.flash("error","Please login");
		res.redirect("/login");
	}
},
middlewareObj.checkCommentsOwnership = function(req,res,next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				//Check if user owns the comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error","Please log in first");
		res.redirect("/login");
	}
},
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login");
}


module.exports = middlewareObj;