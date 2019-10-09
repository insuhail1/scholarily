const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
	{
		city: {
			type: String,
			required: true
		},
		stateName: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = City = mongoose.model("city", CitySchema);
