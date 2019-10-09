const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema(
	{
		name: {
			type: String
		},
		mobile: {
			type: Number,
			required: true
		},
		grade: {
			type: String
		},
		photo: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

StudentSchema.index({ name: 1, grade: 1, mobile: 1 }, { unique: true });
module.exports = Student = mongoose.model("student", StudentSchema);
