import axios from "axios";
import { setAlert } from "./alert";
import {
   REGISTER_SUCCESS,
   REGISTER_FAIL,
   USER_LOADED,
   AUTH_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOGOUT,
   CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
   if (localStorage.token) {
      setAuthToken(localStorage.token);
   }

   try {
      const res = await axios.get("/student/auth");

      dispatch({
         type: USER_LOADED,
         payload: res.data
      });
   } catch (err) {
      dispatch({
         type: AUTH_ERROR
      });
   }
};

// Register User
export const register = ({ name, grade, mobile }) => async dispatch => {
   const config = {
      headers: {
         "Content-Type": "application/json"
      }
   };

   const body = JSON.stringify({ name, grade, mobile });

   try {
      const res = await axios.post("/student", body, config);

      dispatch({
         type: REGISTER_SUCCESS,
         payload: res.data
      });

      dispatch(loadUser());
   } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
         errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
         type: REGISTER_FAIL
      });
   }
};

// Login User
export const login = _id => async dispatch => {
   const config = {
      headers: {
         "Content-Type": "application/json"
      }
   };

   const body = JSON.stringify({ _id });
   console.log(body);

   try {
      const res = await axios.post("/student/auth", body, config);

      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data
      });

      dispatch(loadUser());
   } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
         errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
         type: LOGIN_FAIL
      });
   }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
   dispatch({ type: CLEAR_PROFILE });
   dispatch({ type: LOGOUT });
};
