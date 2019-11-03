import React, { Component, Fragment } from "react";
import styles from "../css";
import { Typography } from "@material-ui/core/";
import PieChart from "react-minimal-pie-chart";
import { getQuestions } from "../actions/tests";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../actions/profile";
import { connect } from "react-redux";
import Spinner from "../staticPages/Spinner";

class LogicalAndAnalytical extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			testDetails: [],
			cright: 0,
			cwrong: 0,
			fright: 0,
			fwrong: 0
		};
	}
	async componentWillMount() {
		await this.props.getCurrentProfile();
		await this.props.getQuestions(this.props.tests.test_id);

		var givenTestDetails;
		for (let i = 0; i < this.props.profile.profile.testRecord.length; i++) {
			if (
				this.props.tests.test_id ===
				this.props.profile.profile.testRecord[i].testId
			) {
				await this.setState({
					testDetails: this.props.profile.profile.testRecord[i]
				});
			}
		}
		givenTestDetails = this.state.testDetails;
		var data = this.props.tests.questions.questions;
		await this.setState({
			isLoading: false
		});

		var cright = 0,
			cwrong = 0,
			fright = 0,
			fwrong = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i].type === "C") {
				if (givenTestDetails.answersArray[i] === data[i].correct) {
					cright++;
				} else if (
					givenTestDetails.answersArray[i] &&
					givenTestDetails.answersArray[i] !== data[i].correct
				) {
					cwrong++;
				}
			} else {
				if (givenTestDetails.answersArray[i] === data[i].correct) {
					fright++;
				} else if (
					givenTestDetails.answersArray[i] &&
					givenTestDetails.answersArray[i] !== data[i].correct
				) {
					++fwrong;
				}
			}
		}
		console.log(cright, fright);
		var fright1 = (parseFloat(fright * 100) / (fright + cright)).toFixed(2);
		fright1 = parseInt(fright1);

		var cright1 = (parseFloat(cright * 100) / (fright + cright)).toFixed(2);
		cright1 = parseInt(cright1);

		console.log(cright, fright);
		this.setState({
			cright: cright1,
			cwrong: cwrong,
			fright: fright1,
			fwrong: fwrong
		});
		await this.setState({ loading: false });
	}

	render() {
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<Fragment>
						<div className="bg-white shadow-lg p-5 text-center">
							<div className="row">
								<div className="col-md-12">
									<Typography variant="h4" className="m-3">
										Mental Assessment
									</Typography>
									<PieChart
										style={{
											height: "220px"
										}}
										label
										labelPosition={50}
										labelStyle={{
											fill: "#121212",
											fontFamily: "sans-serif",
											fontSize: "10px"
										}}
										lengthAngle={360}
										lineWidth={100}
										data={[
											{
												title: "Conceptual : " + this.state.cright + "%",
												value: this.state.cright,
												color: "#E38627"
											},
											{
												title: "Analytical : " + this.state.fright + "%",
												value: this.state.fright,
												color: "#C13C37"
											}
										]}
									/>
									<div className="m-3">
										<Typography variant="p" className="m-1">
											Conceptual :{this.state.cright + "%"}
										</Typography>
										<Typography variant="p" className="m-1">
											Analytical :{this.state.fright + "%"}
										</Typography>
									</div>
								</div>
							</div>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

LogicalAndAnalytical.propTypes = {
	tests: PropTypes.object.isRequired,
	getQuestions: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	tests: state.tests,
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ getQuestions, getCurrentProfile }
)(LogicalAndAnalytical);
