const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "student"
		},
		testRecord: [
			{
				testId: {
					type: String,
					required: true,
					unique: true
				},
				score: {
					type: Number,
					required: true
				},
				rightAnswers: {
					type: Number,
					required: true
				},
				wrongAnswers: {
					type: Number,
					required: true
				},
				answersArray: {
					type: Array
				}
			}
		],

		state: {
			type: String,
			unique: true
		},
		college: {
			type: String,
			unique: true
		},
		gender: {
			type: String
		},
		dob: {
			type: String
		},
		photo: {
			type: String
		},
		district: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
