const multer = require("multer");
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		// rejects storing a file
		cb(null, false);
	}
};

const upload = multer({
	limits: {
		fileSize: 1024 * 1024 * 50
	},
	fileFilter: fileFilter
});

router
	.route("/user")
	.post(upload.single("imageData"), async (req, res, next) => {
		let student = await Student.findOneAndUpdate(
			{ _id: req.body.student },
			{ photo: req.body.imageData },
			{ new: true }
		);
		return res.status(200).json({ success: true, student });
	});

module.exports = router;
