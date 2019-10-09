import React, { Fragment, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styles from "../css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../actions/alert";

const Rules = props => {
	const [state, setState] = useState({
		checked: false
	});
	const handleChange = name => event => {
		setState({ ...state, [name]: event.target.checked });
	};
	// check if already given test by student
	const textgiven = async () => {
		if (props.profile.profile === null) {
			props.setAlert(
				"Please complete your profile before continue to test",
				"warning"
			);
			// alert();
			return props.history.push({
				pathname: "/editprofile",
				state: { from: "subject" }
			});
		}
		for (let i = 0; i < props.profile.profile.testRecord.length; i++) {
			if (props.tests.test_id === props.profile.profile.testRecord[i].testId) {
				props.setAlert("You have submitted this test, Already!", "warning");

				// alert("");
				return props.history.push({ pathname: "/subjects" });
			}
		}
	};
	useEffect(() => {
		textgiven();
	}, []);

	return (
		<Fragment>
			<div style={{ marginTop: 100 }}>
				<Paper style={styles.paper}>
					<Typography variant="h5" align="center">
						Test Rules
					</Typography>
					<Grid
						container
						justify="center"
						direction="row"
						alignItems="center"
						style={{ marginTop: 20 }}
					>
						<Grid item lg={12}>
							<Paper style={{ backgroundColor: "#f9f9f9", padding: 20 }}>
								<Typography variant="h5" component="h5">
									Instructions
								</Typography>
								<Grid item>
									<ul style={{ marginTop: 10 }}>
										<li>
											This test contains multiple choice questions. Every
											correct question will award
											<strong> +4 marks </strong>and no marks for unattempted
											questions.
										</li>
										<li>
											There is a{" "}
											<strong>negative marking of -1 mark (i.e. 25%) </strong>
											for every wrong answer you mark.
										</li>
									</ul>
								</Grid>

								<Grid item>
									<Typography variant="h6" component="h6">
										Number of Questions: 50
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="h6" component="h6">
										Time Limit: 60 mins.
									</Typography>
								</Grid>
							</Paper>
						</Grid>
					</Grid>{" "}
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Grid item sm={12}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.checked}
											onChange={handleChange("checked")}
											value="checked"
										/>
									}
									label="I have read all the instructions."
								/>
							</FormGroup>
						</Grid>
						<Grid
							item
							lg={2}
							md={12}
							xs={12}
							sm={12}
							style={
								!state.checked ? { display: "none" } : { display: "block" }
							}
						>
							{/* <Link to="/model" style={{ textDecoration: "none" }}> */}
							<Button
								fullWidth
								variant="contained"
								color="secondary"
								type="submit"
								onClick={e =>
									props.history.push({
										pathname: "/model",
										state: { test_id: props.tests.test_id }
									})
								}
								value="Start Test"
								style={styles.bgPrimaryRoundedButton}
							>
								Start Test
							</Button>
							{/* </Link> */}
						</Grid>
					</Grid>
				</Paper>
			</div>
		</Fragment>
	);
};

Rules.propTypes = {
	profile: PropTypes.object.isRequired,
	setAlert: PropTypes.func.isRequired,
	tests: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	tests: state.tests
});

export default connect(
	mapStateToProps,
	{ setAlert }
)(Rules);
