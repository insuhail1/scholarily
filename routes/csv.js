const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const Test = require("../models/Test");

const csv = require("csvtojson");

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		// rejects storing a file
		cb(null, false);
	}
};

const upload = multer({
	// storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 50
	}
	// fileFilter: fileFilter
});

router.route("/").post(upload.single("imageData"), async (req, res, next) => {
	console.log(req.body);

	try {
		const jsonArray = await csv().fromString(req.file.buffer.toString());

		for (let index = 0; index < jsonArray.length; index++) {
			console.log(jsonArray[index]);

			if (jsonArray[index].questionTitle !== "") {
				let question = {
					questionTitle: jsonArray[index].questionTitle,
					option0: jsonArray[index].option0,
					option1: jsonArray[index].option1,
					option2: jsonArray[index].option2,
					option3: jsonArray[index].option3,
					correct: jsonArray[index].correct,
					chapter: jsonArray[index].chapter,
					chapterNo: jsonArray[index].chapterNo,
					difficultyLevel: jsonArray[index].difficultyLevel,
					type: jsonArray[index].type,
					description: jsonArray[index].description
				};

				var test = await Test.findOne({ test_id: req.body.test_id });
				if (!test) {
					test = new Test({ test_id: req.body.test_id });
					test = await test.save();
				}
				test.questions.unshift(question);

				test = await test.save();
			}
		}
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
