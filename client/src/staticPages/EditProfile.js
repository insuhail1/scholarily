import React, { Fragment, Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Tab, TextField, Button, Typography } from "@material-ui/core";
import { setAlert } from "../actions/alert";
import { getCurrentProfile, createProfile } from "../actions/profile";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FileBase from "react-file-base64";
import ScaleLoader from "react-spinners/ClipLoader";
import { loadUser } from "../actions/auth";
import {
	Paper,
	Grid,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
	Avatar
} from "@material-ui/core/";
import axios from "axios";
import styles from "../css";
import { withTheme } from "@material-ui/styles";
class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			state: "",
			college: "",
			district: "",
			loading: true,
			gender: "female",
			grade: "",
			file: "img/user.png",
			isImageLoading: false,
			isUpdating: false,
			states: "",
			cities: []
		};
	}

	async getdetails() {
		await this.props.getCurrentProfile();
		await this.props.loadUser();

		if (this.props.profile.profile !== null) {
			await this.setState({
				state: this.props.profile.profile.state,
				college: this.props.profile.profile.college,

				gender: this.props.profile.profile.gender
			});

			const cities = await axios.get(
				`/city/${this.props.profile.profile.state}`
			);
			await this.setState({ cities: cities.data });
			await this.setState({ district: this.props.profile.profile.district });
		}

		await this.setState({ grade: this.props.auth.user.grade });

		this.props.auth.user.photo &&
			(await this.setState({
				file: this.props.auth.user.photo.toString()
			}));

		const states = await axios.get("/city/states");
		this.setState({ states: states.data });
	}

	async componentDidMount() {
		await this.getdetails();

		this.setState({ loading: false });
	}

	async onSubmit(e) {
		this.setState({ isUpdating: true });

		e.preventDefault();
		let { state, college, district, gender, grade } = this.state;
		await this.props.createProfile({ state, college, district, gender, grade });

		await this.setState({ isUpdating: false });

		if (this.props.location.state)
			this.props.history.push({ pathname: "/rules" });
	}

	async uploadHandler(files) {
		await this.setState({ isImageLoading: true });
		console.log(files);
		let imageFormObj = new FormData();
		imageFormObj.append("imageName", "image-" + Date.now());
		imageFormObj.append("imageData", files.base64.toString());
		imageFormObj.append("student", this.props.auth.user._id);

		axios
			.post(`/image/user`, imageFormObj)
			.then(async data => {
				if (data.data.success) {
					await this.setState({ file: files.base64, isImageLoading: false });
					this.getdetails();
				}
			})
			.catch(err => {
				alert(err.message);
			});
	}

	async onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<Fragment>
						<div className="row">
							<div className="col-md-4"></div>
							<div className="col-md-4">
								<div style={{ marginTop: 20 }}>
									<form onSubmit={e => this.onSubmit(e)}>
										<Paper
											style={{ paddingBottom: 20 }}
											className="shadow-lg  mb-5 bg-white rounded "
										>
											<Paper
												fullWidth
												style={{
													padding: 10,
													letterSpacing: 2,
													fontWeight: "bold",
													color: "white",
													margin: 0,
													height: 80,
													backgroundColor: "#2C6AB6",
													backgroundImage:
														"url(https://www.freepik.com/blog/wp-content/uploads/2018/06/technology-background-with-gradient-colors_23-2147837710.jpg)",

													backgroundPosition: "center",
													backgroundSize: "cover"
												}}
											>
												<Typography variant="h6"> Edit Profile</Typography>
											</Paper>
											<Grid item align="center" style={{ marginTop: -55 }}>
												<div
													className="upload-btn-wrapper"
													style={{
														position: "absolute",
														float: "right",
														marginLeft: 30,
														marginTop: 60
													}}
												>
													<Button
														style={{
															backgroundColor: "transparent"
														}}
													>
														{this.state.isImageLoading ? (
															<ScaleLoader
																sizeUnit={"px"}
																size={20}
																color={"#123abc"}
															/>
														) : (
															<CloudUploadIcon />
														)}
													</Button>
													<FileBase
														type="file"
														multiple={false}
														onDone={this.uploadHandler.bind(this)}
													/>
												</div>

												<Avatar
													alt="Profile Picture"
													src={this.state.file}
													style={styles.bigAvatar}
												/>
											</Grid>

											<Grid
												container
												direction="column"
												justify="center"
												alignItems="center"
												style={{ padding: 30 }}
											>
												<FormControl style={styles.textField}>
													<InputLabel>Gender</InputLabel>
													<Select
														id="standard-search"
														fullWidth
														style={styles.textField}
														required
														value={this.state.gender}
														onChange={e => this.onChange(e)}
														displayEmpty
														name="gender"
													>
														<MenuItem value="male">Male</MenuItem>
														<MenuItem value="female">Female</MenuItem>
													</Select>
												</FormControl>
												<FormControl style={styles.textField}>
													<InputLabel>Grade</InputLabel>
													<Select
														id="standard-search"
														label="Name"
														fullWidth
														style={styles.textField}
														value={this.state.grade}
														onChange={e => this.onChange(e)}
														displayEmpty
														name="grade"
													>
														<MenuItem value={5}>5 Grade</MenuItem>
														<MenuItem value={6}>6 Grade</MenuItem>
														<MenuItem value={7}>7 Grade</MenuItem>
														<MenuItem value={8}>8 Grade</MenuItem>
														<MenuItem value={9}>9 Grade</MenuItem>
													</Select>
												</FormControl>
												<TextField
													fullWidth
													id="standard-search"
													label="School"
													type="search"
													style={styles.textField}
													margin="normal"
													required
													name="college"
													value={this.state.college}
													onChange={e =>
														this.setState({
															[e.target.name]: e.target.value.toUpperCase()
														})
													}
												/>
												<FormControl style={styles.textField}>
													<InputLabel>State</InputLabel>
													<Select
														id="standard-search"
														fullWidthblue
														style={styles.textField}
														value={this.state.state}
														onChange={async e => {
															this.setState({ state: e.target.value });
															const cities = await axios.get(
																`/city/${e.target.value}`
															);
															await this.setState({ cities: cities.data });
														}}
														displayEmpty
														required
														name="state"
													>
														{this.state.states.map(state => (
															<MenuItem value={state._id}>{state._id}</MenuItem>
														))}
													</Select>
												</FormControl>
												<FormControl style={styles.textField}>
													<InputLabel>District</InputLabel>
													<Select
														id="standard-search"
														fullWidthblue
														style={styles.textField}
														value={this.state.district}
														onChange={e => this.onChange(e)}
														required
														displayEmpty
														name="district"
													>
														{this.state.cities.map(city => (
															<MenuItem value={city._id}>{city._id}</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>

											<Grid
												container
												direction="column"
												alignItems="center"
												justify="center"
											>
												<Grid item xs={12} lg={6}>
													<Button
														variant="contained"
														fullWidth
														type="submit"
														style={styles.gradientButton}
													>
														{this.state.isUpdating ? (
															<Fragment>
																Updating
																<ScaleLoader
																	sizeUnit={"px"}
																	size={25}
																	color="white"
																/>
															</Fragment>
														) : (
															"Submit"
														)}
													</Button>
												</Grid>
											</Grid>
										</Paper>
									</form>
								</div>
							</div>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

EditProfile.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	loadUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	setAlert: PropTypes.func.isRequired,
	createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile, setAlert, createProfile, loadUser }
)(EditProfile);
