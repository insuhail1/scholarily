import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map(alert => (
		<div
			// align="center"
			className={`text-center alert alert-${alert.alertType}  fade show `}
			role="alert"
			style={{ marginTop: "80px", position: "relative" }}
		>
			{alert.msg}
			<button
				type="button"
				class="close"
				data-dismiss="alert"
				aria-label="Close"
			></button>
		</div>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
