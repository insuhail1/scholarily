import React, { Fragment, Component } from "react";
import {
	RadioGroup,
	Hidden,
	Radio,
	Paper,
	Typography,
	Grid,
	Button,
	FormControlLabel,
	FormControl
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { getQuestions } from "../actions/tests";
import ScaleLoader from "react-spinners/ScaleLoader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "../css";
class ModelTahir extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questionsArray: [],
			question: [],
			answersArray: [],
			questionNo: 0,
			totalQuestion: 1,
			visited: [0],
			selectedOption: 0,
			isLoading: true,
			error: "",
			timer: 60 * 60
		};
		this.startTimer = this.startTimer.bind(this);
	}
	timeout = 0;
	async startTimer(duration, isSet = false) {
		var timer = duration,
			minutes,
			seconds;
		console.log(isSet);
		this.timeout = setInterval(() => {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			var t = minutes + ":" + seconds;

			if (!isSet) clearInterval(this.interval);
			if (--timer < 0 || !isSet) {
				clearInterval(this.timeout);
				return this.props.history.push({
					pathname: "/result",
					state: {
						questionsArray: this.state.questionArray,
						answersArray: this.state.answersArray
					}
				});
			} else {
				if (isSet === true && document.getElementById("countDown") !== null)
					document.getElementById("countDown").innerHTML = t;
			}
		}, 1000);
	}

	async componentDidMount() {
		if (!this.props.location.state) {
			return <Redirect to="/subjects" />;
		}

		// to prevent user to go back after submmiting exam from results
		window.history.forward(1);
		await this.props.getQuestions(this.props.tests.test_id);

		var data = this.props.tests.questions.questions;
		var dataLength = data.length;
		var zeroArray = new Array(dataLength).fill(0);
		this.setState({
			questionArray: data,
			question: data[this.state.questionNo],
			isLoading: false,
			answersArray: zeroArray,
			totalQuestion: dataLength,
			questionNo: 1
		});

		this.startTimer(this.state.timer, true);
	}

	async pushData(questionNo) {
		if (questionNo < this.state.totalQuestion) {
			await this.setState({
				question: this.state.questionArray[questionNo],
				visited: [...new Set([...this.state.visited, questionNo])],
				selectedOption: this.state.answersArray[questionNo],
				questionNo: questionNo + 1
			});
		} else {
			this.setState({
				questionNo: questionNo
			});
		}
	}
	clearResponse() {
		let cloneArray = this.state.answersArray.slice();
		cloneArray[this.state.questionNo - 1] = 0;
		this.setState({ answersArray: cloneArray, selectedOption: 0 });
	}

	async saveNext() {
		let cloneArray = this.state.answersArray.slice();
		cloneArray[this.state.questionNo - 1] = this.state.selectedOption;
		await this.setState({ answersArray: cloneArray, selectedOption: 0 });
		if (this.state.questionNo < this.state.totalQuestion) {
			this.pushData(this.state.questionNo);
		} else this.pushData(0);
		console.log(this.state.answersArray);
	}

	async SubmitTest() {
		clearInterval(this.timeout);
		await this.startTimer(-2, false);
		await this.props.history.push({
			pathname: "/result",
			state: {
				questionsArray: this.state.questionArray,
				answersArray: this.state.answersArray
			}
		});
	}

	getNoOfGivenAnswer(array) {
		var count = 0;
		array.forEach(element => {
			if (element !== 0) count++;
		});
		return count;
	}

	// to find an element of array
	include(arr, obj) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === obj) return true;
		}
	}

	// to find an element of array
	includeIndex(arr, obj) {
		if (Number(arr[obj]) !== 0) return true;
	}

	render() {
		if (!this.props.location.state) {
			return <Redirect to="/subjects" />;
		}

		const { question } = this.state;

		const questionModel = (
			<Fragment>
				<Hidden only={["xs", "sm"]}>
					<Grid
						direction="row"
						alignItems="flex-end"
						justifyContent="center"
						spacing={2}
						container
					>
						<Grid item md={2}>
							<Paper>
								<Typography
									align="center"
									variant="h3"
									style={{
										backgroundColor: "#E2E5E9",
										color: "#562C4F",
										padding: 20
									}}
								>
									{this.state.questionNo}.
								</Typography>
							</Paper>
						</Grid>

						<Grid item md={9}>
							<Typography variant="h6" component="h6">
								{question.questionTitle}
							</Typography>
						</Grid>
					</Grid>
				</Hidden>
				<Hidden only={["md", "lg"]}>
					<Typography variant="p" style={{ fontWeight: "bold" }}></Typography>
					{this.state.questionNo}. {question.questionTitle}
				</Hidden>
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
							label={"A. " + question.option0}
						/>

						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "B" })}
							value="B"
							control={<Radio />}
							label={"B. " + question.option1}
						/>
						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "C" })}
							value="C"
							control={<Radio />}
							label={"C. " + question.option2}
						/>
						<FormControlLabel
							onClick={() => this.setState({ selectedOption: "D" })}
							value="D"
							control={<Radio />}
							label={"D. " + question.option3}
						/>
					</RadioGroup>
				</FormControl>
			</Fragment>
		);
		return (
			<Fragment>
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
						<div class="row" style={styles.container}>
							<div class="col-md-9">
								<div
									class="text-center p-2"
									style={{ color: "white", backgroundColor: "#0277bd" }}
								>
									Time Left{" "}
									<span
										id="countDown"
										style={{ color: "white", fontSize: 25 }}
									></span>
								</div>
								<Paper style={styles.middleContainerTest}>
									<div>{questionModel}</div>

									<Hidden only={["xs", "sm"]}>
										<Button
											variant="contained"
											className={"bottom"}
											style={{
												backgroundColor: "#e0e0e0",
												color: "#000000",
												outline: "none",
												position: "absolute",
												bottom: 10,
												left: 25
											}}
											onClick={e => this.clearResponse(e)}
										>
											Clear response
										</Button>

										<Button
											variant="contained"
											style={{
												backgroundColor: "#01579b",
												color: "white",
												outline: "none",
												position: "absolute",
												bottom: 10,
												right: 25
											}}
											onClick={e => this.saveNext(e)}
										>
											Save & Next
										</Button>
									</Hidden>
									<Hidden only={["md", "lg"]}>
										<Button
											size="small"
											variant="contained"
											className={"bottom"}
											style={{
												backgroundColor: "#e0e0e0",
												color: "#000000",
												outline: "none",
												position: "absolute",
												bottom: 10,
												left: 25
											}}
											onClick={e => this.clearResponse(e)}
										>
											Clear response
										</Button>

										<Button
											variant="contained"
											size="small"
											style={{
												backgroundColor: "#01579b",
												color: "white",
												outline: "none",
												position: "absolute",
												bottom: 10,
												right: 25
											}}
											onClick={e => this.saveNext(e)}
										>
											Save & Next
										</Button>
									</Hidden>
								</Paper>
							</div>
							<div class="col-md-3">
								<Paper style={styles.rightContainerTest}>
									<div
										class="row text-center"
										style={{ marginTop: 10, marginBottom: 10 }}
									>
										<div class="col-md-6">
											Answered
											<button
												className=" btn-circle-sm shadow-sm button button-round"
												style={{
													backgroundColor: "#4caf50",

													outline: "none"
												}}
											>
												{this.getNoOfGivenAnswer(this.state.answersArray)}
											</button>
										</div>
										<div class="col-md-6">
											Not visited
											<button
												className=" btn-circle-sm shadow-sm button button-round"
												style={{ backgroundColor: "e0e0e0", outline: "none" }}
											>
												{this.state.totalQuestion - this.state.visited.length}
											</button>
										</div>
									</div>

									<Typography
										variant="subtitle1"
										component="h1"
										align="center"
										style={{ marginTop: 15 }}
									>
										Questions Board
									</Typography>
									<hr style={{ marginTop: 5, marginBottom: 10 }} />
									<div
										className="row"
										style={{ height: "340px", overflowY: "scroll" }}
									>
										{this.state.answersArray.map((q, index) => (
											<div
												style={{
													marginBottom: 10
												}}
												className="col-md-5ths"
											>
												<button
													className=" btn-circle-sm shadow-sm button button-round"
													id={index}
													style={
														index === this.state.questionNo - 1
															? styles.active
															: this.includeIndex(
																	this.state.answersArray,
																	index
															  )
															? styles.attempted
															: this.include(this.state.visited, index)
															? styles.visited
															: { backgroundColor: "", outline: "none" }
													}
													onClick={() => this.pushData(index)}
												>
													{index + 1}
												</button>
											</div>
										))}
									</div>
								</Paper>
								<div>
									<Button
										fullWidth
										color="primary"
										variant="contained"
										onClick={() => this.SubmitTest()}
										style={{ backgroundColor: "#0277bd" }}
									>
										Submit Test
									</Button>
								</div>
							</div>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

ModelTahir.propTypes = {
	tests: PropTypes.object.isRequired,
	getQuestions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	tests: state.tests
});

export default connect(
	mapStateToProps,
	{ getQuestions }
)(ModelTahir);
