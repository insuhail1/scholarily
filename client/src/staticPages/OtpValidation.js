import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import styles from "../css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../actions/alert";
import { setMobile } from "../actions/users";
import Spinner from "./Spinner";

class OtpValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      loading: true,
      randomNumber: ""
    };
  }
  componentDidMount() {
    this.getOtp();
    this.setState({ loading: false });
  }

  async onChange(e) {
    const re = /^[0-9\b]+$/;
    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      await this.setState({ [e.target.name]: e.target.value });
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    if (Number(this.state.otp) === Number(this.state.randomNumber)) {
      this.props.setMobile(this.props.location.state.mobile);
      this.props.history.push({
        pathname: "/registerdetails",
        mobile: this.props.location.state.mobile
      });
    } else this.props.setAlert("Wrong OTP", "danger");
  }

  getOtp() {
    var val = Math.floor(1000 + Math.random() * 9000);
    this.setState({ randomNumber: val });
  }

  if(isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  render() {
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div style={{ marginTop: 90 }}>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <Grid container justify="center">
            <Grid md={4}>
              <Paper style={styles.paper}>
                <div class="text-center">
                  <img
                    src="http://www.lastcampus.com/wp-content/uploads/2019/09/scholarily.png"
                    style={{ height: 70 }}
                    alt=""
                  />
                </div>
                <Typography align="center" variant="h5" style={{ padding: 20 }}>
                  Verification step
                </Typography>
                <Typography align="center">
                  We have sent verification OTP to Your mobile no <strong>{this.props.location.state.mobile}</strong>.
                  <br />
                  Please Enter OTP {this.state.randomNumber}
                </Typography>
                <form className="text-center" onSubmit={e => this.onSubmit(e)}>
                  <TextField
                    fullWidth
                    label="OTP"
                    style={styles.textField}
                    margin="normal"
                    name="otp"
                    value={this.state.otp}
                    onChange={e => this.onChange(e)}
                    required
                  />

                  <Button variant="contained" type="submit" value="Login" style={styles.bgPrimaryRoundedButton}>
                    Submit
                  </Button>
                  <br></br>
                  <Typography variant="caption">
                    Click here to{" "}
                    <Typography
                      onClick={() => this.getOtp()}
                      variant="body2"
                      style={{ display: "inline-block", color: "#0077b6" }}
                    >
                      resend otp
                    </Typography>
                    .
                  </Typography>
                </form>
              </Paper>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

OtpValidation.propTypes = {
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  setMobile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setAlert, setMobile }
)(OtpValidation);
