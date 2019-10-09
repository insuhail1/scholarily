import { GET_USERS, USERS_ERROR, SET_MOBILE } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

// Get Users
export const getUsers = mobile => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	};
	const body = JSON.stringify({ mobile });

	try {
		const res = await axios.post("/student/exists", body, config);

		dispatch({
			type: GET_USERS,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: USERS_ERROR
		});
	}
};

export const setMobile = mobile => async dispatch => {
	dispatch({
		type: SET_MOBILE,
		payload: mobile
	});
};
