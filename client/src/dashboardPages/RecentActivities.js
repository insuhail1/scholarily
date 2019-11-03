import React, { Component } from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllCurrentSessionTests, setTestId } from "../actions/tests";
import { Paper, Typography, Divider } from "@material-ui/core/";
class RecentActivities extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}
	async componentWillMount() {
		(await this.props.auth) &&
			this.props.getAllCurrentSessionTests(this.props.auth.user.grade);
		this.setState({ loading: false });
	}

	isGivenTest(sessionTestsId) {
		for (let i = 0; i < this.props.profile.profile.testRecord.length; i++) {
			if (sessionTestsId === this.props.profile.profile.testRecord[i].testId) {
				return true;
			}
		}
	}
	render() {
		let styles = {
			table: {
				minWidth: 650
			}
		};
		return (
			<Paper>
				<div
					style={{
						padding: 10,
						borderTopLeftRadius: 5,
						borderTopRightRadius: 5,
						backgroundImage:
							"url(https://www.freepik.com/blog/wp-content/uploads/2018/06/technology-background-with-gradient-colors_23-2147837710.jpg)",
						color: "white",
						backgroundPosition: "top",
						backgroundSize: "cover"
					}}
				>
					<Typography variant="h6" align="center">
						Your Test List
					</Typography>
				</div>
				<Divider />
				<Table style={styles.table}>
					<TableHead>
						<TableRow>
							<TableCell variant="h1">Test ID</TableCell>
							<TableCell
								variant="caption"
								align="left"
								style={{ fontWeight: 800 }}
							>
								Subject Name
							</TableCell>
							<TableCell
								variant="caption"
								align="left"
								style={{ fontWeight: 800 }}
							>
								Scorecard
							</TableCell>
							<TableCell
								variant="caption"
								align="left"
								style={{ fontWeight: 800 }}
							>
								Analysis
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.tests.sessionTests.map(s => (
							<TableRow key={s._id}>
								<TableCell
									component="th"
									scope="row"
									className="text-capitalize"
								>
									{s.test}
								</TableCell>
								<TableCell
									align="left"
									component="th"
									scope="row"
									className="text-capitalize"
								>
									{s.subject}
								</TableCell>
								<TableCell align="left">
									{this.isGivenTest(s._id) ? (
										<Link
											onClick={e => {
												this.props.setTestId(s._id);
												// this.props.history.push({
												// 	pathname: ,
												// 	// state: { test_id: this.props.tests.test_id }
												// });
											}}
											to={`/scorecard/${this.props.auth.user._id}/${s._id}`}
											style={{ textDecoration: "none", color: "#0077b5" }}
										>
											Score Card
										</Link>
									) : (
										<span> Not attempted </span>
									)}
								</TableCell>

								<TableCell align="left">
									{this.isGivenTest(s._id) ? (
										<Link
											onClick={e => {
												this.props.setTestId(s._id);
												// this.props.history.push({
												// 	pathname: "/analysis"
												// });
											}}
											to="/analysis"
											style={{ textDecoration: "none", color: "#0077b5" }}
										>
											Analysis
										</Link>
									) : (
										<span> - </span>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		);
	}
}
RecentActivities.propTypes = {
	getAllCurrentSessionTests: PropTypes.func.isRequired,
	setTestId: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	tests: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
	tests: state.tests
});

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ getAllCurrentSessionTests, setTestId }
	)
)(RecentActivities);
