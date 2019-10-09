const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const Student = require("../models/Student");
const auth = require("../middleware/studentauth");

// path     /student
// @desc     To get all students
// @access   public
router.get("/", async (req, res) => {
	try {
		const students = await Student.find({});
		res.json(students);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /student
// @desc     To create a new student
// @access   public
router.post(
	"/",
	[
		check("name", "Name is required")
			.matches("[a-zA-Z][a-zA-Z ]+")
			.isLength({ min: 3 }),
		check("mobile", "mobile is required")
			.isNumeric()
			.isLength(10),
		check("grade", "grade is required")
			.isNumeric()
			.isLength(1)
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { name, mobile, grade } = req.body;
		try {
			let student = new Student({
				name,
				mobile,
				grade
			});

			student = await student.save();

			const payload = {
				student: {
					id: student.id
				}
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /student/exists
// @desc     To login (Author)student
// @access   public
router.post(
	"/exists",
	[
		check("mobile", "mobile is required")
			.isNumeric()
			.isLength(10)
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { mobile } = req.body;
		try {
			let student = await Student.find({ mobile });

			res.json(student);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /student/auth
// @desc     To login (Author)student
// @access   private
router.get("/auth", auth, async (req, res) => {
	try {
		const student = await Student.findById(req.student.id);
		res.json(student);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /student/auth
// @desc     To login (Author)student
// @access   public
router.post(
	"/auth",
	[
		check("_id", "_id is required")
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { _id } = req.body;
		try {
			let student = await Student.findOne({ _id });

			const payload = {
				student: {
					id: student.id
				}
			};
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;
