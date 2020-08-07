var mongoose = require("mongoose");


//SCHEMA SET UP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
	},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

//Create the model on which methods can be called
module.exports = mongoose.model("Campground", campgroundSchema);