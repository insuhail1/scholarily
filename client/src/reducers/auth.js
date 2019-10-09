import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	GET_USERS,
	SET_MOBILE,
	USERS_ERROR
} from "../actions/types";

const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: null,
	loading: true,
	user: null,
	mobile: "",
	users: []
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_MOBILE:
			return {
				...state,
				isAuthenticated: false,
				loading: false,
				mobile: payload
			};
		case GET_USERS:
			return {
				...state,
				isAuthenticated: false,
				loading: false,
				users: payload
			};
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload,
				users: []
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem("token", payload.token);
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			};
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case USERS_ERROR:
		case LOGOUT:
			localStorage.removeItem("token");
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null
			};
		default:
			return state;
	}
}
