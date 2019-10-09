import {
	GET_SUBJECTS,
	SUBJECTS_ERROR,
	SET_TEST_ID,
	GET_QUESTIONS,
	QUESTIONS_ERROR,
	SESSION_ERROR,
	GET_SESSION
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";


// get all subjects of a grade within timeline
export const getSubjects = grade => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const body = JSON.stringify({ grade });
		console.log(body);
		const res = await axios.put("/category/grade/current", body, config);

		console.log(res.data);

		dispatch({
			type: GET_SUBJECTS,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: SUBJECTS_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// get all tests subject wise of current session
export const getAllCurrentSessionTests = grade => async dispatch => {
	try {
		const res = await axios.put(`/category/grade/currentsession/${grade}`);
		console.log(res.data);

		dispatch({
			type: GET_SESSION,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: SESSION_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const setTestId = test_id => async dispatch => {
	dispatch({
		type: SET_TEST_ID,
		payload: test_id
	});
};

export const getQuestions = test_id => async dispatch => {
	try {
		const res = await axios.get(`/test/${test_id}`);
		console.log(res.data);

		dispatch({
			type: GET_QUESTIONS,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: QUESTIONS_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};
