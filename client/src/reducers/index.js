import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import tests from "./tests";

export default combineReducers({
	alert,
	auth,
	profile,
	tests
});
