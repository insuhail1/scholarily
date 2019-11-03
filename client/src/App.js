import React, { Fragment } from "react";
import Register from "./staticPages/Register";
import RegisterDetails from "./staticPages/RegisterDetails";
import OtpValidation from "./staticPages/OtpValidation";
import CsvUploader from "./adminPages/CsvUploader";
import EditProfile from "./staticPages/EditProfile";
import "./App.css";
import Dashboard from "./dashboardPages/Dashboard";
import Navbar from "./staticPages/Navbar";
import Alert from "./staticPages/Alert";
import Home from "./staticPages/Home";
import LogoSpinner from "./staticPages/LogoSpinner";
import Container from "@material-ui/core/Container";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Notfound from "./staticPages/Notfound";
import Model from "./testPages/Model";
import Subjects from "./testPages/Subjects";
import Rules from "./testPages/Rules";
import Result from "./testPages/Result";
import Analysis from "./dashboardPages/Analysis";
import ScoreCard from "./dashboardPages/ScoreCard";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import PrivateRoute from "./routing/PrivateRoute";

// Redux
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import { PersistGate } from "redux-persist/lib/integration/react";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    store.dispatch(loadUser());
    this.setState({ loading: false });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <ThemeProvider theme={theme}>
              {this.state.loading ? (
                <LogoSpinner />
              ) : (
                <Fragment>
                  <Navbar />
                  <div style={{ marginTop: "60px" }}>
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <PrivateRoute exact path="/model" component={Model} />

                      <Container>
                        <Alert style={{ marginTop: "30px" }} />

                        <Route exact path="/register" component={Register} />
                        <Route exact path="/csv" component={CsvUploader} />
                        <Route exact path="/registerdetails" component={RegisterDetails} />
                        <Route exact path="/otpvalidation" component={OtpValidation} />
                        <Route exact path="/scorecard/:userID/:testID" component={ScoreCard} />

                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRoute exact path="/editprofile" component={EditProfile} />
                        <PrivateRoute exact path="/subjects" component={Subjects} />
                        <PrivateRoute exact path="/result" component={Result} />
                        <PrivateRoute exact path="/analysis" component={Analysis} />
                        <PrivateRoute exact path="/rules" component={Rules} />
                        {/* <Route path="/404" exact={true} component={Notfound} /> */}
                        {/* <Redirect to="/404" /> */}
                      </Container>
                    </Switch>
                  </div>
                </Fragment>
              )}
            </ThemeProvider>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
