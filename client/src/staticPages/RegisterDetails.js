import React, { Fragment, Component } from "react";
import {
	Typography,
	Avatar,
	TextField,
	Grid,
	Button,
	Paper,
	MenuItem,
	FormControl,
	Select,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails
} from "@material-ui/core/";
import { Redirect } from "react-router-dom";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getUsers } from "../actions/users";
import styles from "../css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../actions/alert";
import { register, login } from "../actions/auth";
import Spinner from "../staticPages/Spinner";

class RegisterDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: props.auth.mobile,
			loading: true,
			name: "",
			grade: "5",
			nameError: false
		};
	}
	async componentDidMount() {
		await this.props.getUsers(this.props.auth.mobile);
		await this.setState({ loading: false });
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
		console.log([e.target.name]);
	}

	async onSubmit(e) {
		e.preventDefault();
		let { name, grade, mobile } = this.state;
		!this.state.nameError &&
			(await this.props.register({ name, grade, mobile }));
	}

	render() {
		if (this.props.auth.isAuthenticated) {
			return <Redirect to="/subjects" />;
		}

		const newStudent = (
			<form className="form" onSubmit={e => this.onSubmit(e)} align="center">
				<TextField
					fullWidth
					label="Full Name"
					style={styles.textField}
					margin="normal"
					name="name"
					value={this.state.name}
					onChange={e => {
						this.setState({
							[e.target.name]: e.target.value.toUpperCase()
						});
						if (e.target.value.match(/^[a-zA-Z ]*$/)) {
							this.setState({ nameError: false });
						} else this.setState({ nameError: true });
					}}
					required
				/>
				{this.state.nameError && (
					<label className="text-danger text-left" style={{ fontSize: 14 }}>
						Only characters are allowed.
					</label>
				)}
				<FormControl style={styles.textField} align="left">
					<Select
						id="standard-search"
						label="Grade"
						fullWidth
						style={styles.textField}
						value={this.state.grade}
						onChange={e => this.onChange(e)}
						name="grade"
					>
						<MenuItem value={5}>5 Grade</MenuItem>
						<MenuItem value={6}>6 Grade</MenuItem>
						<MenuItem value={7}>7 Grade</MenuItem>
						<MenuItem value={8}>8 Grade</MenuItem>
						<MenuItem value={9}>9 Grade</MenuItem>
					</Select>
				</FormControl>

				<Button
					variant="contained"
					type="submit"
					value="Login"
					style={styles.bgPrimaryRoundedButton}
				>
					Register
				</Button>

				<p>
					Please select class 6 while registering. Because Right now, tests are
					available for 6 class only.
				</p>
			</form>
		);

		const registeredStudents = (
			<div style={{ paddingTop: 20 }}>
				<Typography align="center">Continue scholarily as a</Typography>
				{this.props.auth.users.map(user => (
					<Paper
						style={{
							marginTop: 7,
							borderRadius: 7,
							backgroundColor: "#f9f9f9",

							"&:hover": {
								backgroundColor: "#0077b5"
							}
						}}
						onClick={() => {
							this.setState({ loading: true });
							this.props.login(user._id);
						}}
					>
						<Grid
							container
							justify="center"
							alignItems="center"
							direction="row"
						>
							<Grid item xs={3}>
								<Avatar
									alt="Scholarily User"
									style={styles.primaryAvatar}
									src={
										user.photo
											? user.photo
											: "https://image.freepik.com/free-vector/teacher-school-with-children-avatar-character_24877-1534.jpg"
									}
								></Avatar>
							</Grid>
							<Grid item xs={9}>
								<Typography component={Button} variant="subtitle1">
									{user.name}
								</Typography>
								<Typography
									variant="subtitle1"
									color="textSecondary"
									style={{ marginLeft: 8 }}
								>
									Grade: {user.grade}
								</Typography>
							</Grid>
						</Grid>
					</Paper>
				))}

				<div style={styles.grid}>
					<Typography align="center">Or</Typography>
				</div>
				<ExpansionPanel
					style={{ marginTop: 7, borderRadius: 7, backgroundColor: "#f9f9f9" }}
				>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography style={{ fontSize: "15" }}> Add new user</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ marginTop: -30 }}>
						<Fragment>{newStudent}</Fragment>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
		);
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<div style={{ marginTop: 90 }}>
						<Grid container justify="center">
							<Grid md={4}>
								<Paper
									style={styles.paper}
									className="shadow-lg p-3 bg-white rounded"
								>
									<div class="text-center">
										<img
											src="http://www.lastcampus.com/wp-content/uploads/2019/09/scholarily.png"
											style={{ height: 70 }}
											alt=""
										/>
									</div>

									{this.props.auth.users.length > 0 ? (
										<Fragment>{registeredStudents}</Fragment>
									) : (
										<Fragment>{newStudent}</Fragment>
									)}
								</Paper>
							</Grid>
						</Grid>
					</div>
				)}
			</Fragment>
		);
	}
}

RegisterDetails.propTypes = {
	getUsers: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	login: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getUsers, setAlert, register, login }
)(RegisterDetails);
