const express = require("express");
const router = express.Router();
const auth = require("../middleware/studentauth");
const { check, validationResult } = require("express-validator");
const Profile = require("../models/StudentProfile");
const Student = require("../models/Student");

// @route    GET /profile/me
// @desc     Get current student profile
// @access   Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			student: req.student.id
		}).populate("student", ["name"]);

		if (!profile) {
			return res
				.status(400)
				.json({ msg: "There is no profile for this student" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    GET /profile/:studentID
// @desc     Get current student profile
// @access   Public
router.get("/:studentID", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			student: req.params.studentID
		}).populate("student", ["name","grade"]);

		if (!profile) {
			return res
				.status(400)
				.json({ msg: "There is no profile for this student" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /profile
// desc     to create or update a profile
// access   private
router.post(
	"/",
	[
		auth,
		[
			check("college", "college is required")
				.not()
				.isEmpty(),
			check("district", "district is required")
				.not()
				.isEmpty(),
			check("state", "state is required")
				.not()
				.isEmpty(),
			check("gender", "gender is required")
				.not()
				.isEmpty(),
			check("grade", "grade is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

		const { state, college, district, gender, grade } = req.body;
		let profilefields = {
			student: req.student.id,
			state,
			college,
			district,
			gender
		};

		try {
			let student = await Student.findOneAndUpdate(
				{ _id: req.student.id },
				{
					grade: grade
				},
				{ new: true }
			);
			let profile = await Profile.findOne({ student: req.student.id });
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ student: req.student.id },
					profilefields,
					{ new: true }
				);
				return res.json(profile);
			}

			profile = new Profile(profilefields);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /profile/test
// @desc     To create a new question
// @access   public
router.post(
	"/test",
	[
		auth,
		[
			check("testId", "testId is required")
				.not()
				.isEmpty(),
			check("answersArray", "answersArray is required")
				.not()
				.isEmpty(),
			check("score", "score is required")
				.not()
				.isEmpty(),
			check("rightAnswers", "rightAnswers is required")
				.not()
				.isEmpty(),
			check("wrongAnswers", "wrongAnswers is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		let { testId, answersArray, score, rightAnswers, wrongAnswers } = req.body;

		let testDetails = {
			testId: testId,
			answersArray,
			score,
			rightAnswers,
			wrongAnswers
		};

		try {
			let test = await Profile.findOne({
				$and: [
					{
						student: req.student.id
					},
					{
						"testRecord.testId": testId
					}
				]
			});
			if (test) {
				return res.json("already given test");
			}
			test = await Profile.findOne({
				student: req.student.id
			});
			test.testRecord.unshift(testDetails);
			test = await test.save();
			res.json(test);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// path     /profile/rank/:test_id
// @desc     To get All india rank of a user for a given testId
// @access   private
router.put("/rank/:test_id", async (req, res) => {
	try {
		// let rankArray = await Profile.find(
		// 	{
		// 		"testRecord.testId": req.params.test_id
		// 	},
		// 	{ "testRecord.$": 1 }
		// )
		// 	.sort("-testRecord.score")
		// 	.select({
		// 		"testRecord.score": 1,
		// 		college: 1,
		// 		state: 1,
		// 		district: 1,
		// 		"testRecord.testId": 1
		// 	})
		// 	.populate("student", ["name"]);

		let rankArray = await Profile.aggregate([
			{
				$match: { testRecord: { $elemMatch: { testId: req.params.test_id } } }
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);

		res.json(rankArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /profile/rank/:test_id/state/:state
// @desc     To get state wise rank of a user for a given testId
// @access   private
router.put("/rank/:test_id/state/:state", [auth], async (req, res) => {
	let { test_id, state } = req.params;
	try {
		let rankArray = await Profile.aggregate([
			{
				$match: {
					testRecord: { $elemMatch: { testId: req.params.test_id } },
					state: state
				}
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);

		res.json(rankArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /profile/rank/:test_id/college/:college
// @desc     To get college wise rank of a user for a given testId
// @access   private
router.put("/rank/:test_id/college/:college", [auth], async (req, res) => {
	let { test_id, college } = req.params;
	try {
		let rankArray = await Profile.aggregate([
			{
				$match: {
					testRecord: { $elemMatch: { testId: req.params.test_id } },
					college: college
				}
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);

		res.json(rankArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /profile/rank/:test_id/district/:district
// @desc     To get district wise rank of a user for a given testId
// @access   private
router.put("/rank/:test_id/district/:district", [auth], async (req, res) => {
	let { test_id, district } = req.params;
	try {
		let rankArray = await Profile.aggregate([
			{
				$match: {
					testRecord: { $elemMatch: { testId: req.params.test_id } },
					district: district
				}
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);
		res.json(rankArray);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /profile/:student/rankcount/:test_id/college/:college
// @desc     To get college wise rankcount of a user for a given testId
// @access   private
router.put("/:student/rankcount/:test_id/college/:college",  async (req, res) => {
	let { test_id, college } = req.params;
	try {
		let collegeRankArray = await Profile.aggregate([
			{
				$match: {
					testRecord: { $elemMatch: { testId: req.params.test_id } },
					college: college
				}
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);

		let indiaRankArray = await Profile.aggregate([
			{
				$match: {
					testRecord: { $elemMatch: { testId: req.params.test_id } }
				}
			},
			{
				$lookup: {
					from: "students",
					localField: "student",
					foreignField: "_id",
					as: "student"
				}
			},
			{
				$project: {
					college: 1,
					student: { name: 1, _id: 1 },
					testRecord: {
						$filter: {
							input: "$testRecord",
							as: "testRecord",
							cond: {
								$eq: ["$$testRecord.testId", req.params.test_id]
							}
						}
					}
				}
			},
			{ $sort: { "testRecord.score": -1 } }
		]);

		var ranks = [];
		for (let i = 0; i < indiaRankArray.length; i++) {
			if (
				JSON.stringify(req.params.student) ===
				JSON.stringify(indiaRankArray[i].student[0]._id)
			) {
				ranks.push(i++);
				break;
			}
		}

		for (let i = 0; i < collegeRankArray.length; i++) {
			if (
				JSON.stringify(req.params.student) ===
				JSON.stringify(collegeRankArray[i].student[0]._id)
			) {
				ranks.push(i++);
				break;
			}
		}

		res.json({ ranks });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
