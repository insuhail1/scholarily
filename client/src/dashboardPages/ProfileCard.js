import React, { Fragment, Component } from "react";
import { Typography, Paper, Avatar, Button, Fab } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import styles from "../css";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ProfileCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file:
				"https://miro.medium.com/fit/c/256/256/2*yTUBvj9tjLJV1n1ipT6eCg.jpeg"
		};
	}

	render() {
		return (
			<Fragment>
				{this.props.profile.profile && (
					<Paper styles={styles.paper}>
						<div className="row">
							<div className="col-md-12">
								<Button
									style={{ float: "right", backgroundColor: "transparent" }}
									component={Link}
									to={"/editprofile"}
								>
									<EditIcon style={{ color: "white" }} />
								</Button>
								<Paper
									fullWidth
									style={{
										margin: 0,
										height: 120,
										backgroundColor: "rgba(85, 44, 79,0.2)",
										backgroundImage:
											"url(https://www.freepik.com/blog/wp-content/uploads/2018/06/technology-background-with-gradient-colors_23-2147837710.jpg)",
										backgroundPosition: "center",
										backgroundSize: "cover"
									}}
								></Paper>
							</div>
							<div
								className="col-md-12"
								align="center"
								style={{ marginTop: -55 }}
							>
								<div
									style={{
										border: "2px solid #ffffff",
										borderRadius: 50,
										height: 93,
										width: 93
									}}
								>
									<Avatar
										alt="Profile Picture"
										src={
											this.props.profile.profile.photo
												? this.props.profile.profile.photo.toString()
												: "https://miro.medium.com/fit/c/256/256/2*yTUBvj9tjLJV1n1ipT6eCg.jpeg"
										}
										style={styles.bigAvatar}
									/>
								</div>
							</div>
							<div class="col-md-12 text-center" style={{paddingBottom:20}}>
								<Typography variant="h5" align="center">
									{this.props.auth.user.name}
								</Typography>

								<Typography variant="subtitle1" className="text-secondary">
									{this.props.auth.user.grade}th Grade
								</Typography>

								<Typography variant="subtitle1" style={{ marginTop: 10 }}>
									{this.props.profile.profile.college}
								</Typography>

								<Typography variant="subtitle1">
									{this.props.profile.profile.district},{" "}
									{this.props.profile.profile.state}
								</Typography>
							</div>
						</div>
					</Paper>
				)}
			</Fragment>
		);
	}
}

ProfileCard.propTypes = {
	auth: PropTypes.object.isRequired,
	profile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps)(ProfileCard);
