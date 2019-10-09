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
			file: ""
		};
	}

	async onChange(e) {
		const re = /^[0-9\b]+$/;
		// if value is not blank, then test the regex

		if (e.target.value === "" || re.test(e.target.value)) {
			await this.setState({ [e.target.name]: e.target.value });
		}
	}
	onSubmit(e) {
		e.preventDefault();
		this.props.history.push({
			pathname: "/otpvalidation",
			state: {
				mobile: this.state.mobile
			}
		});
	}

	render() {
		if (this.props.auth.isAuthenticated) {
			return <Redirect to="/subjects" />;
		}
		return (
			<Grid container justify="center" style={{ marginTop: 90 }}>
				<Grid md={4}>
					<Paper style={styles.paper}>
						<div class="text-center">
							<img
								src="http://www.lastcampus.com/wp-content/uploads/2019/09/scholarily.png"
								style={{ height: 70 }}
								alt=""
							/>
						</div>

						<Typography
							variant="h6"
							align="center"
							style={{ marginBottom: 30 }}
						>
							Let's get started
						</Typography>
						<Typography
							align="center"
							variant="subtitle1"
							style={{ paddingTop: 20 }}
						>
							Enter your 10 digit mobile no.
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
							{Number(this.state.mobile.length) !== 10 ? (
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									type="submit"
									value="Login"
									disabled="true"
									style={styles.bgPrimaryRoundedButton}
								>
									Register
								</Button>
							) : (
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									type="submit"
									value="Login"
									style={styles.bgPrimaryRoundedButton}
								>
									Register
								</Button>
							)}
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
