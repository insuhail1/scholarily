import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Paper, Typography, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "../css";
import axios from "axios";
import Spinner from "../staticPages/Spinner";

class ScoreCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			givenTestDetails: null,
			loading: true,
			allIndiaRank: 0,
			collegeRank: 0
		};
	}

	async componentWillMount() {
		if (this.props.tests && this.props.tests.test_id === null) {
			return <Redirect to="/subjects" />;
		}
		for (let i = 0; i < this.props.profile.profile.testRecord.length; i++) {
			if (
				this.props.tests.test_id ===
				this.props.profile.profile.testRecord[i].testId
			) {
				await this.setState({
					givenTestDetails: this.props.profile.profile.testRecord[i]
				});
				break;
			}
		}

		var res = await axios.put(
			`/profile/rankcount/${this.props.tests.test_id}/college/${this.props.profile.profile.college}`
		);
		res = Object.values(res.data);
		await this.setState({ allIndiaRank: res[0][0], collegeRank: res[0][1] });
		console.log(this.state.allIndiaRank);

		await this.setState({ loading: false });
	}
	render() {
		if (this.props.tests && this.props.tests.test_id === null) {
			return <Redirect to="/subjects" />;
		}
		let {
			rightAnswers,
			answersArray,
			wrongAnswers
		} = this.state.givenTestDetails;
		let score = rightAnswers;
		let maxScore = answersArray.length;

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
											{score}
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
												{" "}
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

ScoreCard.propTypes = {
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
	{}
)(ScoreCard);
