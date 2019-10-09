const express = require("express");
const router = express.Router();
const City = require("../models/Cities");
// const states = require("./statesdata.json");

// path     /city
// @desc     To get all cities
// @access   public
router.get("/", async (req, res) => {
	try {
		const cities = await City.find({});
		res.json(cities);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /city/states
// @desc     To get all states
// @access   public
router.get("/states", async (req, res) => {
	try {
		// const cities = await City.find({})
		// 	.distinct("stateName")
		// 	.sort('stateName');

		const cities = await City.aggregate([
			{ $group: { _id: "$stateName" } },
			{
				$sort: { _id: 1 }
			}
		]);

		res.json(cities);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		I;
	}
});

// path     /city/:state
// @desc     To get all cities of a state
// @access   public
router.get("/:state", async (req, res) => {
	try {
		// const cities = await City.find({ stateName: req.params.state })
		// 	.select("city")
		// 	.sort("city");

		const cities = await City.aggregate([
			{ $match: { stateName: req.params.state } },
			{ $group: { _id: "$city" } },
			{
				$sort: { _id: 1 }
			}
		]);

		res.json(cities);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// path     /city
// @desc     To create a new city
// @access   public
// router.post(
// 	"/",

// 	async (req, res) => {
// 		try {
// 			// console.log(states);
// 			for (let i = 0; i < states.length; i++) {
// 				let field = { city: states[i].city, stateName: states[i].stateName };

// 				let city = new City(field);
// 				city = await city.save();
// 			}
// 		} catch (err) {
// 			console.error(err.message);
// 			res.status(500).send("Server Error");
// 		}
// 	}
// );

module.exports = router;
