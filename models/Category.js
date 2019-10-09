const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
	[
		{
			grade: {
				type: String,
				required: true
			},
			subject: {
				type: String
			},
			test: {
				type: String
			},
			from: {
				type: String
			},
			to: {
				type: String
			}
		}
	],
	{
		timestamps: true
	}
);

module.exports = Category = mongoose.model("category", CategorySchema);
