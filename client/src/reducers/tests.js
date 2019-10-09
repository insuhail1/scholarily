import {
	GET_SUBJECTS,
	SUBJECTS_ERROR,
	SET_TEST_ID,
	GET_QUESTIONS,
	QUESTIONS_ERROR,
	SESSION_ERROR,
	LOGOUT,
	GET_SESSION
} from "../actions/types";

const initialState = {
	subjects: [],
	questions: [],
	errors: [],
	sessionTests: [],
	test_id: null,
	loading: true
};

export default function(state = initialState, action) {
	let { type, payload } = action;
	switch (type) {
		case GET_SUBJECTS:
			return {
				...state,
				subjects: payload,
				loading: false
			};
		case GET_SESSION:
			return {
				...state,
				sessionTests: payload,
				loading: false
			};
		case SET_TEST_ID:
			return {
				...state,
				test_id: payload,
				loading: false
			};
		case GET_QUESTIONS:
			return {
				...state,
				questions: payload,
				loading: false
			};
		case SUBJECTS_ERROR:
		case QUESTIONS_ERROR:
		case SESSION_ERROR:
			return {
				...state,
				errors: payload,
				loading: false
			};
		case LOGOUT:
			return {
				...state,
				subjects: [],
				questions: [],
				errors: [],
				sessionTests: [],
				test_id: null
			};
		default:
			return state;
	}
}
