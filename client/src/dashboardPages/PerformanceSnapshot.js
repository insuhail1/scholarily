import React, { Component, Fragment } from "react";
import styles from "../css";
import {
	Paper,
	Grid,
	Typography,
	Button,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from "@material-ui/core/";

import { getQuestions } from "../actions/tests";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../actions/profile";
import { connect } from "react-redux";

class PerformanceSnapshot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			mapData: new Map(),
			values: [],
			testDetails: [],
			keys: []
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

		for (let i = 0; i < data.length; i++) {
			if (this.state.mapData.has(data[i].chapter)) {
				var array = this.state.mapData.get(data[i].chapter);
				array[0] = array[0] + 1; //total questions array[0]
				if (givenTestDetails.answersArray[i] === data[i].correct) {
					array[1] = array[1] + 1; //total right answers array[1]
				} else if (
					givenTestDetails.answersArray[i] &&
					givenTestDetails.answersArray[i] !== data[i].correct
				) {
					array[2] = array[2] + 1; //total wrong answers array[2]
				}
				this.state.mapData.set(data[i].chapter, array);
			} else {
				array = [1, 0, 0];
				if (givenTestDetails.answersArray[i] === data[i].correct) {
					array[1] = array[1] + 1;
				} else if (
					givenTestDetails.answersArray[i] &&
					givenTestDetails.answersArray[i] !== data[i].correct
				) {
					array[2] = array[2] + 1;
				}
				this.state.mapData.set(data[i].chapter, array);
			}
		}

		var v = [],
			k = [],
			j = 0;

		this.state.mapData.forEach((values, key) => {
			v[j] = values;
			k[j] = key;
			j++;
		});

		await this.setState({ values: v, keys: k });
	}

	render() {
		return (
			<Fragment>
				<Paper>
					<table className="table table-hover" style={styles.table}>
						<thead>
							<tr>
								<th>
									<Typography component="h6">Chapter</Typography>
								</th>
								<th align="center">
									<Typography component="h6">Total Questions</Typography>
								</th>
								<th align="center">
									<Typography component="h6">Analysis</Typography>
								</th>
								<th align="center">
									<Typography component="h6">Accuracy</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.state.values.map((v, index) => (
								<tr key={index}>
									<td className="text-capitalize">{this.state.keys[index]}</td>
									<td>{v[0]}</td>
									<td>
										<span
											className=" btn-circle-sm shadow-md button button-round"
											style={{
												backgroundColor: "green",
												outline: "none"
											}}
										>
											{v[1]}
										</span>{" "}
										<span
											className=" btn-circle-sm shadow-md button button-round"
											style={{
												backgroundColor: "red",
												outline: "none"
											}}
										>
											{v[2]}
										</span>
									</td>

									<td>
										{v[1] !== 0
											? (parseFloat(v[1] * 100) / (v[1] + v[2])).toFixed(2) +
											  " %"
											: "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Paper>
			</Fragment>
		);
	}
}

PerformanceSnapshot.propTypes = {
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
)(PerformanceSnapshot);
