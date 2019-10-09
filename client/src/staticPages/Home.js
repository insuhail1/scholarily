import React, { Component } from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Button, Paper } from "@material-ui/core/";
import styles from "../css";
import { Redirect } from "react-router-dom";
import Typist from "react-typist";
import Typewriter from "typewriter-effect";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Home extends Component {
	render() {
		if (this.props.auth.isAuthenticated) {
			return <Redirect to="/subjects" />;
		}
		return (
			<div>
				<div className="row header">
					<div
						className="col-md-12 text-center"
						style={{
							padding: 40,
							paddingTop: 80,
							paddingBottom: 120,
							marginTop: 150,
							color: "white"
						}}
					>
						<Typography
							variant="h3"
							component="h3"
							style={{
								fontWeight: "bold"
							}}
						>
							Half Yearly Test Begins
						</Typography>

						<Typography
							variant="h4"
							style={{
								fontWeight: "bold"
							}}
						>
							Test your ability around the
							<span style={{ color: "#e0b2a6" }}>
								<Typewriter
									style={{ display: "inline" }}
									options={{
										strings: ["country.", "state.", "city.", "school."],
										autoStart: true,
										loop: true
									}}
								/>
							</span>
						</Typography>

						<Button
							variant="contained"
							color="default"
							style={styles.gradientButton}
							component={Link}
							to={"/subjects"}
						>
							<Typography variant="p" component="p">
								Take test
							</Typography>
						</Button>
					</div>
				</div>
				<div align="center" style={{ marginTop: 50, marginBottom: 50 }}>
					<Typography component="h1" variant="h4">
						Our Services
					</Typography>
					<div className="row container" style={{ marginTop: 20 }}>
						<div className="col-md-4">
							<Paper align="center" style={{ padding: 40 }}>
								<img
									src="https://learn.byjus.com/static/media/takeTestNew.70dc7fef.svg"
									alt="take test"
								/>
								<Typography variant="h6" component="h6">
									All India Tests
								</Typography>
								<p>Test your ability around the country.</p>
								<Button variant="contained" color="primary">
									Take Test
								</Button>
							</Paper>
						</div>
						<div className="col-md-4">
							<Paper align="center" style={{ padding: 40 }}>
								<img
									src="https://learn.byjus.com/static/media/takeTestNew.70dc7fef.svg"
									alt="take test"
								/>
								<Typography variant="h6" component="h6">
									Sectional Test
								</Typography>
								<p>Test your ability around the country.</p>
								<Button variant="contained" color="primary">
									Join Now
								</Button>
							</Paper>
						</div>
						<div className="col-md-4">
							<Paper align="center" style={{ padding: 40 }}>
								<img
									src="https://learn.byjus.com/static/media/takeTestNew.70dc7fef.svg"
									alt="take test"
								/>
								<Typography variant="h6" component="h6">
									Subject Wise Test
								</Typography>
								<p>Test your ability around the country.</p>
								<Button variant="contained" color="primary">
									Join Now
								</Button>
							</Paper>
						</div>
					</div>
				</div>
				<div align="center" style={{ marginTop: 200, marginBottom: 200 }}>
					<div className="row container">
						<div className="col-md-4 text-center">
							<img
								src="/img/MappedtotheSyllabus.jpg"
								style={{
									width: "100%"
								}}
								alt="campus_icon..."
							/>
						</div>
						<div className="col-md-2"></div>
						<div className="col-md-6">
							<Typography variant="h4" component="h4" style={styles.title}>
								Personalized Learning Journeys
							</Typography>
							<Typography variant="p" component="p">
								Every student has a Knowledge Graph based on their learning need
								& speed. This links different concepts and helps students
								identify their strengths & areas for improvement.
							</Typography>
							<div className="text-center">
								<Button style={styles.gradientButton}>
									<Typography variant="p" component="p">
										View more
									</Typography>
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div align="center" style={{ marginTop: 200, marginBottom: 200 }}>
					<div className="row container">
						<div className="col-md-6 text-center">
							<Typography variant="h4" component="h4" style={styles.title}>
								Personalized Learning Journeys
							</Typography>
							<Typography variant="p" component="p">
								Every student has a Knowledge Graph based on their learning need
								& speed. This links different concepts and helps students
								identify their strengths & areas for improvement.
							</Typography>
							<div className="text-center">
								<Button style={styles.gradientButton}>
									<Typography variant="p" component="p">
										View more
									</Typography>
								</Button>
							</div>
						</div>

						<div className="col-md-2"></div>
						<div className="col-md-4 text-center">
							<img
								src="/img/MappedtotheSyllabus.jpg"
								style={{
									width: "100%"
								}}
								alt="campus_icon..."
							/>
						</div>
					</div>
				</div>
				<div style={{ backgroundColor: "#562C4F" }}>
					<Typography
						variant="p"
						component="p"
						align="center"
						style={{ padding: 20, color: "white" }}
					>
						CampusBabu © 2019 ℗LastCampus Education Pvt. Ltd.
					</Typography>
				</div>
			</div>
		);
	}
}

Home.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Home);
