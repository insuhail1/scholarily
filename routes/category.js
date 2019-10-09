const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// path     /category
// @desc     To get all categories
// @access   public
router.get("/", async (req, res) => {
	try {
		const categories = await Category.find({});
		res.json(categories);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /category
// @desc     To get all categories
// @access   public
router.get("/removeall", async (req, res) => {
	try {
		const categories = await Category.deleteMany({});
		res.json(categories);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /category/grade/currentsession/:grade
// @desc     To get current session tests
// @access   public
router.put(
	"/grade/currentsession/:grade",

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		try {
			let current_datetime = new Date();
			let newSessionDate = current_datetime.getFullYear() + "-" + "04-01";
			let newSessionendDate =
				1 + Number(current_datetime.getFullYear()) + "-" + "04-01";
			let current_date =
				current_datetime.getFullYear() +
				"-" +
				("0" + (current_datetime.getMonth() + 1)).slice(-2) +
				"-" +
				("0" + current_datetime.getDate()).slice(-2);

			if (newSessionDate > current_date) {
				newSessionDate = 1 - current_datetime.getFullYear() + "-" + "04-01";
				newSessionendDate =
					1 - Number(current_datetime.getFullYear()) + "-" + "04-01";
			}
			const categories = await Category.find({
				grade: req.params.grade,
				from: { $gte: newSessionDate },
				to: { $lt: newSessionendDate }
			}).sort({ subject: 1, from: 1 });
			res.json(categories);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /category/grade/current
// @desc     To get current tests of all subjects class wise
// @access   public
router.put(
	"/grade/current",
	[
		check("grade", "grade is required")
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { grade } = req.body;
		try {
			let current_datetime = new Date();
			let current_date =
				current_datetime.getFullYear() +
				"-" +
				("0" + (current_datetime.getMonth() + 1)).slice(-2) +
				"-" +
				("0" + current_datetime.getDate()).slice(-2);
			const categories = await Category.find({
				grade: grade,
				from: { $lte: current_date },
				to: { $gte: current_date }
			});
			res.json(categories);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /category
// @desc     To create a new category
// @access   public
router.post(
	"/",
	[
		check("grade", "grade is required")
			.not()
			.isEmpty(),
		check("subject", "subject are required")
			.not()
			.isEmpty(),
		check("from", "from are required")
			.not()
			.isEmpty(),
		check("to", "to are required")
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { grade, subject, from, to } = req.body;
		var test =
			subject.substring(0, 2).toUpperCase() +
			from.substring(5, 7) +
			to.substring(5, 7) +
			to.substring(0, 4);
		try {
			let fields = {
				grade,
				subject,
				test,
				from,
				to
			};

			let category = await Category.findOne({
				grade: grade,
				subject: subject,
				test: test
			});
			if (category) {
				category = await Category.findOneAndUpdate(
					{ grade: grade, subject: subject, test: test },
					{ from: from, to: to },
					{ new: true }
				);
				return res.json(category);
			}
			category = new Category(fields);
			category = await category.save();
			res.json(category);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;
