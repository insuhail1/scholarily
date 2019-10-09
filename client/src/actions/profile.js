import axios from "axios";
import { setAlert } from "./alert";
import { loadUser } from "./auth";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
	try {
		const res = await axios.get("/profile/me");

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// Create or update profile
export const createProfile = ({
	state,
	college,
	district,
	gender,
	grade
}) => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const body = JSON.stringify({ state, college, district, gender, grade });
		console.log(body);

		const res = await axios.post("/profile", body, config);

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});

		dispatch(setAlert("Profile Updated", "success"));
		dispatch(loadUser());
	} catch (err) {
		console.log(err);

		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// get rank of user for a test
export const getRank = test_id => async dispatch => {
	try {
		const res = await axios.put(`/profile/rank/${test_id}`);

		console.log(res.data);
		// dispatch({
		// 	type: GET_PROFILE,
		// 	payload: res.data
		// });

		// dispatch(setAlert("Profile Updated", "success"));
		// dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		// dispatch({
		// 	type: PROFILE_ERROR,
		// 	payload: { msg: err.response.statusText, status: err.response.status }
		// });
	}
};
