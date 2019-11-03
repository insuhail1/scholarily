import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Paper, Typography, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "../css";
import axios from "axios";
import Spinner from "../staticPages/Spinner";
import {
	FacebookShareButton,
	WhatsappShareButton,
	FacebookIcon,
	WhatsappIcon
} from "react-share";
var global = [];
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
		if (
			this.props.match.params.userID.length === 0 ||
			this.props.match.params.testID.length === 0
		) {
			return <Redirect to="/subjects" />;
		}

		var r = await axios.get(`/profile/${this.props.match.params.userID}`);
		var profileData = r.data;
		console.log(profileData);

		var testRecord = profileData.testRecord;
		var i;
		for (i = 0; i < testRecord.length; i++) {
			if (this.props.match.params.testID === testRecord[i].testId) {
				break;
			}
		}
		console.log(testRecord[i]);
		await this.setState({
			givenTestDetails: testRecord[i]
		});

		var res = await axios.put(
			`/profile/${this.props.match.params.userID}/rankcount/${this.props.match.params.testID}/college/${profileData.college}`
		);
		res = Object.values(res.data);
		await this.setState({ allIndiaRank: res[0][0], collegeRank: res[0][1] });
		console.log(this.state.allIndiaRank);

		var sessionTests = await axios.put(
			`/category/grade/currentsession/${profileData.student.grade}`
		);
		sessionTests = sessionTests.data;
		global = [];
		global.push({
			score: testRecord[i].score
		});

		for (let i = 0; i < sessionTests.length; i++) {
			console.log(this.props.match.params.testID, sessionTests[i]._id);
			if (this.props.match.params.testID === sessionTests[i]._id) {
				global.push({
					testName: sessionTests[i].test,
					name: profileData.student.name,
				});

				console.log(this.props.match.params.testID, sessionTests[i]._id);
			}
		}
		console.log(global);
		await this.setState({ loading: false });
	}

	render() {
		if (
			this.props.match.params.userID.length === 0 ||
			this.props.match.params.testID.length === 0
		) {
			return <Redirect to="/subjects" />;
		}

		let maxScore = 50 * 4;

		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<Fragment>
						<div style={{ marginTop: 100 }}>
							<Typography variant="h5" align="center">
								Scorecard - {global[1].testName}
							</Typography>
							<Grid container justify="center" style={{ marginTop: 20 }}>
								<Grid item lg={8}>
									<Paper style={styles.paper} className="shadow-lg">
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
											{global[0].score}
											<span style={{ fontSize: 32, color: "black" }}>
												/{maxScore}
											</span>
										</Typography>
										<Typography
											align="center"
											variant="subtitle1"
											style={{ marginTop: 20 }}
										>
											<Typography variant="h6" style={{ display: "inline" }}>
												{" "}
												{global[1].name}
											</Typography>{" "}
											has secured{" "}
											<strong>{this.state.collegeRank + 1} rank</strong> in
											college in this test and All India Rank{" "}
											<strong>{this.state.allIndiaRank + 1}</strong>.
										</Typography>
										<Typography
											align="center"
											variant="subtitle1"
											style={{ marginTop: 10 }}
										>
											Hurray! You're improving consistently.
											{this.props.auth.user &&
												this.props.auth.user._id ===
													this.props.match.params.userID && (
													<span>
														{" "}
														Have a look in-depth analysis of your performance by
														going into{" "}
														<Link
															to={"/Dashboard"}
															style={{ color: "#0077b5" }}
														>
															{" "}
															Dashboard section
														</Link>
														.
													</span>
												)}
										</Typography>

										<div className="row col-xs-3 container">
											Share{" "}
											<div className="col-xs-4">
												<WhatsappShareButton
													title="Just given the test and got a good score on Scholarily!"
													url={window.location.href}
												>
													<WhatsappIcon size={32} round={true} />
												</WhatsappShareButton>{" "}
											</div>
											<div className="col-xs-4">
												<FacebookShareButton
													quote="Just given the test and got a good score on Scholarily!"
													url={window.location.href}
												>
													<FacebookIcon size={32} round={true} />
												</FacebookShareButton>
											</div>
										</div>
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
