const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
	{
		test_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "category"
		},
		questions: [
			{
				questionTitle: {
					type: String,
					required: true
				},
				option0: {
					type: String,
					required: true
				},
				option1: {
					type: String,
					required: true
				},
				option2: {
					type: String,
					required: true
				},
				option3: {
					type: String,
					required: true
				},
				correct: {
					type: String,
					required: true
				},
				difficultyLevel: {
					type: Number,
					required: true
				},
				type: {
					type: String,
					required: true
				},
				description: {
					type: String
				},
				chapterNo: {
					type: Number
				},
				chapter: {
					type: String,
					required: true
				}
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = Test = mongoose.model("test", TestSchema);
