import React, { Component, Fragment } from "react";
import styles from "../css";
import { Paper, Typography, Container, Button } from "@material-ui/core/";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../staticPages/Spinner";
import { getSubjects, setTestId } from "../actions/tests";
import { getCurrentProfile } from "../actions/profile";
import { loadUser } from "../actions/auth";
import { Link } from "react-router-dom";

class Subjects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}
	async componentWillMount() {
		if (!this.props.auth.user) {
			await this.props.loadUser();
		}
		await this.props.getCurrentProfile();

		this.props.auth && this.props.getSubjects(this.props.auth.user.grade);
		this.setState({ loading: false });
	}

	// async componentWillMount() {
	// 	(await this.props.auth) &&
	// 		this.props.getSubjects(this.props.auth.user.grade);
	// }

	isGivenTest(testsId) {
		if (this.props.profile.profile && this.props.profile.profile.testRecord)
			for (let i = 0; i < this.props.profile.profile.testRecord.length; i++) {
				if (testsId === this.props.profile.profile.testRecord[i].testId) {
					return true;
				}
			}
		return false;
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	render() {
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<Fragment>
						<Container style={{ marginTop: 130 }}>
							<Typography align="center" variant="h5">
								All India Assessment Test - Final (Jan-Mar, 2019)
							</Typography>
							<div
								className="row"
								style={{
									flex: 1,
									justifyContent: "center",
									flexDirection: "row"
								}}
							>
								{this.props.tests.subjects.map(s => (
									<div class="col-md-3">
										<Paper style={{ borderRadius: 10, marginTop: 30 }}>
											<div
												position="static"
												color="default"
												style={{
													height: 220,
													borderTopLeftRadius: 10,
													borderTopRightRadius: 10,
													backgroundColor: "rgba(85, 44, 79,0.2)",
													backgroundImage:
														"url(https://image.freepik.com/free-vector/online-education-concept_52683-9046.jpg)",
													backgroundPosition: "center",
													backgroundSize: "cover"
												}}
											></div>
											<div class="text-center">
												<Typography
													variant="display1"
													style={styles.darkwithpadding}
												>
													{s.subject.toLocaleUpperCase()}
												</Typography>
												<div class="text-center">
													{!this.isGivenTest(s._id) ? (
														<Link
															justify="center"
															style={{
																textDecoration: "none",
																color: "#0077b5"
															}}
															onClick={e => {
																this.props.setTestId(s._id);
																this.props.history.push({
																	pathname: "/rules"
																});
															}}
														>
															Take Test
														</Link>
													) : (
														<Link
															justify="center"
															style={{
																textDecoration: "none",
																color: "#0077b5"
															}}
															onClick={e => {
																this.props.setTestId(s._id);
																this.props.history.push({
																	pathname: "/scorecard"
																});
															}}
														>
															ScoreCard
														</Link>
													)}
												</div>
											</div>
										</Paper>
									</div>
								))}
							</div>
						</Container>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

Subjects.propTypes = {
	getSubjects: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	setTestId: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	loadUser: PropTypes.func.isRequired,
	tests: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth,
	tests: state.tests
});

export default connect(
	mapStateToProps,
	{ getSubjects, setTestId, getCurrentProfile, loadUser }
)(Subjects);
