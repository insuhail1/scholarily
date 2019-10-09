import React, { Fragment, Component } from "react";
import {
	Paper,
	Typography,
	FormControlLabel,
	FormControl,
	RadioGroup,
	Radio,
	Button,
	Fab,
	Grid,
	Divider
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { getQuestions } from "../actions/tests";
import ScaleLoader from "react-spinners/ScaleLoader";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../actions/profile";
import { connect } from "react-redux";
import styles from "../css";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
class ModelTahir extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questionsArray: [],
			question: [],
			questionNo: 0,
			givenTestDetails: null,
			totalQuestion: 1,
			selectedOption: 0,
			isLoading: true,
			showDesc: false,
			showAnswer: false
		};
	}

	async componentWillMount() {
		await this.props.getCurrentProfile();
		for (let i = 0; i < this.props.profile.profile.testRecord.length; i++) {
			if (
				this.props.tests.test_id ===
				this.props.profile.profile.testRecord[i].testId
			) {
				await this.setState({
					givenTestDetails: this.props.profile.profile.testRecord[i]
				});
			}
		}
		await this.props.getQuestions(this.props.tests.test_id);

		var data = this.props.tests.questions.questions;
		var dataLength = data.length;
		this.setState({
			questionArray: data,
			question: data[this.state.questionNo],
			selectedOption: this.state.givenTestDetails.answersArray[0],
			isLoading: false,
			totalQuestion: dataLength,
			questionNo: 1
		});
	}

	async pushData(questionNo) {
		if (questionNo < this.state.totalQuestion) {
			await this.setState({
				selectedOption: this.state.givenTestDetails.answersArray[questionNo],
				question: this.state.questionArray[questionNo],
				questionNo: questionNo + 1,
				showAnswer: false,
				showDesc: false
			});
		} else {
			this.setState({
				questionNo: questionNo
			});
		}
	}

	render() {
		const { question } = this.state;

		const questionModel = (
			<Fragment>
				<Grid
					direction="row"
					alignItems="flex-end"
					justifyContent="center"
					spacing={3}
					container
				>
					<Grid item md={2} xs={12}>
						<Paper style={{ backgroundColor: "#E2E5E9" }}>
							<Typography
								align="center"
								variant="h4"
								style={{ color: "#0077b6", padding: 30 }}
							>
								{this.state.questionNo}
							</Typography>
						</Paper>
					</Grid>

					<Grid item md={10}>
						<Typography variant="h5" component="h5">
							{question.questionTitle}
						</Typography>
					</Grid>
				</Grid>
				<hr />
				<FormControl component="fieldset">
					<RadioGroup
						aria-label="question"
						value={this.state.selectedOption}
						name="question"
						onChange={e =>
							this.setState({
								selectedOption: e.target.value
							})
						}
					>
						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "A" })}
							value="A"
							control={<Radio />}
							label={"a. " + question.option0}
						/>

						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "B" })}
							value="B"
							control={<Radio />}
							label={"b. " + question.option1}
						/>
						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "C" })}
							value="C"
							control={<Radio />}
							label={"c. " + question.option2}
						/>
						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "D" })}
							value="D"
							control={<Radio />}
							label={"d. " + question.option3}
						/>
					</RadioGroup>
				</FormControl>
			</Fragment>
		);
		return (
			<Fragment>
				<div>
					{this.state.isLoading ? (
						<div
							style={{
								display: "block",
								marginTop: "20%",
								marginLeft: "48%"
							}}
						>
							<ScaleLoader sizeUnit={"px"} size={150} color={"#123abc"} />
						</div>
					) : (
						<Fragment>
							<div class="row">
								<div class="col-md-12">
									<div class="row">
										{this.state.questionArray.map((q, index) => (
											<div
												style={{
													flex: 1,
													flexBasis: "4%",
													marginBottom: 6
												}}
											>
												<button
													className=" btn-circle-sm shadow-sm button button-rounded-corner"
													id={index}
													style={
														this.state.givenTestDetails.answersArray[index] ===
														q.correct
															? styles.attempted
															: this.state.givenTestDetails.answersArray[
																	index
															  ] !== 0
															? styles.visited
															: { outline: "none" }
													}
													onClick={() => this.pushData(index)}
												>
													{index + 1}
												</button>
											</div>
										))}
									</div>
									{/* <div>
											<Button
												fullWidth
												variant="contained"
												color="primary"
												onClick={e => this.pushData(this.state.questionNo)}
											>
												Next
											</Button>
										</div> */}
									<hr />
								</div>
								<div class="col-md-12">
									{questionModel}
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between"
										}}
									>
										<div>
											<Button
												variant="outlined"
												style={{ outline: "none" }}
												color="primary"
												onClick={async () =>
													await this.setState({
														showAnswer: !this.state.showAnswer
													})
												}
											>
												See Right Answer
											</Button>
											{this.state.showAnswer && (
												<Paper fullWidth style={styles.paper}>
													{this.state.givenTestDetails.answersArray[
														this.state.questionNo - 1
													] === question.correct ? (
														<div className="alert alert-success">
															<CheckCircleOutlineIcon /> Your given answer is
															correct.
														</div>
													) : (
														<Fragment>
															<div className="alert alert-success">
																<CheckCircleOutlineIcon /> Right answer is
																Option
																{question.correct}
															</div>
															<div className="alert alert-danger">
																{this.state.givenTestDetails.answersArray[
																	this.state.questionNo - 1
																] == 0 ? (
																	"Not attempted Question"
																) : (
																	<Fragment>
																		<HighlightOffIcon /> Your answer was option{" "}
																		{
																			this.state.givenTestDetails.answersArray[
																				this.state.questionNo - 1
																			]
																		}
																	</Fragment>
																)}
															</div>
														</Fragment>
													)}
												</Paper>
											)}

											<Button
												aria-describedby={1}
												variant="outlined"
												color="primary"
												style={{ outline: "none" }}
												onClick={async () =>
													await this.setState({
														showDesc: !this.state.showDesc
													})
												}
											>
												See Description
											</Button>
											{this.state.showDesc && (
												<Paper fullWidth style={styles.paper}>
													{question.description}
												</Paper>
											)}
										</div>
									</div>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			</Fragment>
		);
	}
}

ModelTahir.propTypes = {
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
)(ModelTahir);
