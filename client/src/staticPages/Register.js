import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import styles from "../css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: "",
			file: "",
			mobileError: false
		};
	}

	async onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
		if (e.target.value.match(/^[0-9]*$/)) {
			this.setState({ mobileError: false });
		} else this.setState({ mobileError: true });
	}
	onSubmit(e) {
		e.preventDefault();
		if (this.state.mobile.length !== 10) {
			this.setState({ mobileError: true });
		} else {
			this.setState({ mobileError: false });
			this.props.history.push({
				pathname: "/otpvalidation",
				state: {
					mobile: this.state.mobile
				}
			});
		}
	}

	render() {
		if (this.props.auth.isAuthenticated) {
			return <Redirect to="/subjects" />;
		}
		return (
			<Grid container justify="center" className="center">
				<Grid md={4}>
					<Paper style={styles.paper} className="shadow-lg bg-white rounded ">
						<div class="text-center">
							<img
								src="http://www.lastcampus.com/wp-content/uploads/2019/09/scholarily.png"
								style={{ height: 70 }}
								alt=""
							/>
						</div>

						<Typography variant="h5" align="center" style={{ marginTop: 10 }}>
							Let's get started
						</Typography>
						<Typography align="center" style={{ paddingTop: 10 }}>
							Enter your 10 digit mobile no to Sign up / Sign in to your
							Scholarily account.
						</Typography>
						<form className="form" onSubmit={e => this.onSubmit(e)}>
							<TextField
								fullWidth
								margin="dense"
								name="mobile"
								style={{ paddingBottom: 20 }}
								value={this.state.mobile}
								onChange={e => this.onChange(e)}
								required
							/>
							{this.state.mobileError && (
								<p className="text-danger" style={{ fontSize: 14 }}>
									Enter correct 10 digits of Mobile No.
								</p>
							)}

							<Button
								fullWidth
								variant="contained"
								color="secondary"
								type="submit"
								value="Login"
								disabled={this.state.mobileError}
								style={styles.bgPrimaryRoundedButton}
							>
								Register
							</Button>
						</form>
					</Paper>
				</Grid>
			</Grid>
		);
	}
}
Register.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Register);
