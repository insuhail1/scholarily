import React, { Component, Fragment } from "react";
import { Typography } from "@material-ui/core";
import RecentActivities from "./RecentActivities";
import ProfileCard from "./ProfileCard";
import { setAlert } from "../actions/alert";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../actions/profile";
import Spinner from "../staticPages/Spinner";
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	async componentDidMount() {
		if (this.props.profile.profile === null) {
			this.props.setAlert(
				"Please complete your profile before continue to test.",
				"danger"
			);
			return this.props.history.push({ pathname: "/editprofile" });
		}
		await this.props.getCurrentProfile();
		this.setState({ loading: false });
	}
	render() {
		return (
			<Fragment>
				{this.state.loading ? (
					<Spinner />
				) : (
					<div style={{ marginTop: 100 }}>
						<Typography variant="h5" component="h5" align="center">
							Dashboard
						</Typography>
						<div className="row" style={{ marginTop: 20 }}>
							<div class="col-md-3">
								<ProfileCard />
							</div>
							<div class="col-md-9">
								<RecentActivities history={this.props.history} />
							</div>
						</div>
					</div>
				)}
			</Fragment>
		);
	}
}
Dashboard.propTypes = {
	setAlert: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile, setAlert }
)(Dashboard);
