import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";

import styles from "../css";
class NotFound extends Component {

	render() {
		return (
			<div className="row" align="center" style={{ marginTop: 50 }}>
				<div className="col-md-4"></div>

				<div className="col-md-4">
					<Paper style={styles.paper}>
						<img
							src="http://www.lastcampus.com/wp-content/uploads/2019/09/scholarily.png"
							style={{ height: 70 }}
							alt=""
						/>

						<Typography
							variant="h1"
							align="center"
							style={{ marginBottom: 10 }}
						>
							Oops!
						</Typography>
						<Typography
							variant="h6"
							align="center"
							style={{ marginBottom: 10 }}
						>
							404 - Page Not Found!
						</Typography>

						<Typography
							variant="p"
							className="text-center"
							style={{ marginBottom: 10, alignContent: "center" }}
						>
							The page you are looking for might have been removed or its name
							changed or temporarily unavailable
						</Typography>
						<div className="text-center">
							<Button style={styles.gradientButton} component={Link} to="/">
								<Typography variant="p" component="p">
									Go To Home Page
								</Typography>
							</Button>
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

export default NotFound;
