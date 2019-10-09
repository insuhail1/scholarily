import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { Paper, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";
import { getAllCurrentSessionTests } from "../actions/tests";
import styles from "../css";
import { Link, Redirect } from "react-router-dom";
import Spinner from "../staticPages/Spinner";

class Result extends Component {
	constructor(props) {
		super(props);
		this.state = {
			score: 0,
			rightAnswers: 0,
			loading: true,
			leftAnswer: 0,
			allIndiaRank: 0,
			collegeRank: 0,
			wrongAnswers: 0
		};
	}

	async calculateScore(answersArray, questionsArray) {
		
		console.log(this.props.location.state);
		var scoreCount = 0,
			rightAnswersCount = 0,
			wrongAnswerCount = 0,
			leftAnswerCount = 0;
		for (let index = 0; index < answersArray.length; index++) {
			if (answersArray[index] === questionsArray[index].correct) {
				scoreCount++;
				rightAnswersCount++;
			} else if (Number(answersArray[index]) !== 0) wrongAnswerCount++;
		}
		leftAnswerCount =
			answersArray.length - (rightAnswersCount + wrongAnswerCount);

		await this.setState({
			score: scoreCount,
			rightAnswers: rightAnswersCount,
			wrongAnswers: wrongAnswerCount,
			leftAnswer: leftAnswerCount
		});

		try {
			const config = {
				headers: {
					"Content-Type": "application/json"
				}
			};
			const body = JSON.stringify({
				answersArray,
				score: scoreCount,
				rightAnswers: rightAnswersCount,
				wrongAnswers: wrongAnswerCount,
				testId: this.props.tests.test_id
			});
			console.log(body);
			const res = await axios.post("/profile/test", body, config);
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}

		var res = await axios.put(
			`/profile/rankcount/${this.props.tests.test_id}/college/${this.props.profile.profile.college}`
		);
		res = Object.values(res.data);
		await this.setState({ allIndiaRank: res[0][0], collegeRank: res[0][1] });
		await this.setState({ loading: false });
	}
	async componentDidMount() {
		if (!this.props.location.state) {
			return <Redirect to="/subjects" />;
		}
		if (this.props.tests.sessionTests.length === 0)
			await this.props.getAllCurrentSessionTests(this.props.auth.user.grade);
		let { answersArray, questionsArray } = this.props.location.state;
		this.calculateScore(answersArray, questionsArray);
	}

	render() {
		if (!this.props.location.state) {
			return <Redirect to="/subjects" />;
		}
		let { rightAnswers, leftAnswer, wrongAnswers } = this.state;
		let maxScore = this.props.location.state.answersArray.length;
		let testName;
		for (let i = 0; i < this.props.tests.sessionTests.length; i++) {
			if (this.props.tests.test_id === this.props.tests.sessionTests[i]._id)
				testName = this.props.tests.sessionTests[i].test;
		}
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<Fragment>
						<div style={{ marginTop: 100 }}>
							<Typography variant="h5" align="center">
								Scorecard - {testName}
							</Typography>
							<Grid container justify="center" style={{ marginTop: 20 }}>
								<Grid item lg={8}>
									<Paper style={styles.paper}>
										<Typography
											component="h5"
											align="center"
											variant="h5"
											color="textSecondary"
										>
											Your Score
										</Typography>
										<Typography
											align="center"
											variant="h1"
											style={{ color: "#0077b6", padding: 30 }}
										>
											{this.state.score}
											<span style={{ fontSize: 32, color: "black" }}>
												/{maxScore}
											</span>
										</Typography>
										<Typography
											align="center"
											variant="subtitle1"
											style={{ marginTop: 20 }}
										>
											You've secured{" "}
											<strong>{this.state.collegeRank + 1} rank</strong> in your
											college in this test and All India Rank{" "}
											<strong>{this.state.allIndiaRank + 1}</strong>.
										</Typography>
										<Typography
											align="center"
											variant="subtitle1"
											style={{ marginTop: 10 }}
										>
											Hurray! You're improving consistently. Have a look
											in-depth analysis of your performance by going into{" "}
											<Link to={"/Dashboard"} style={{ color: "#0077b5" }}>
												Dashboard section
											</Link>
											.
										</Typography>
									</Paper>
								</Grid>
							</Grid>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}
}
Result.propTypes = {
	answersArray: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	getAllCurrentSessionTests: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	tests: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
	tests: state.tests
});

export default connect(
	mapStateToProps,
	{ getAllCurrentSessionTests }
)(Result);
