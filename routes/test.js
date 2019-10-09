const express = require("express");
const Test = require("../models/Test");
const Profile = require("../models/StudentProfile");
const router = express.Router();
const auth = require("../middleware/studentauth");
const { check, validationResult } = require("express-validator");
// path     /test
// @desc     To get all tests
// @access   public
router.get("/", async (req, res) => {
	try {
		const tests = await Test.find({}).populate("category", [
			"grade",
			"subject"
		]);
		res.json(tests);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /test
// @desc     To delete all tests
// @access   public
router.delete("/", async (req, res) => {
	try {
		const tests = await Test.deleteMany({});
		res.json(tests);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// @route    GET /test/:test_id
// @desc     Get test by test ID
// @access   Public
router.get("/:test_id", async (req, res) => {
	try {
		const test = await Test.findOne({
			test_id: req.params.test_id
		}).populate("category", ["grade", "subject"]);

		if (!test) return res.status(400).json({ msg: "Test not found" });

		res.json(test);
	} catch (err) {
		console.error(err.message);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "Test not found" });
		}
		res.status(500).send("Server Error");
	}
});





module.exports = router;
