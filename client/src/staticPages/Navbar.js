import React, { Component, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Typography, IconButton, Button } from "@material-ui/core/";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SchoolIcon from "@material-ui/icons/School";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import MailIcon from "@material-ui/icons/Mail";
import Drawer from "@material-ui/core/Drawer";
import { List, Menu, MenuItem } from "@material-ui/core/";
import NotificationsIcon from "@material-ui/icons/Notifications";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ClassIcon from "@material-ui/icons/Class";
import DashboardIcon from "@material-ui/icons/DashboardRounded";
import AssignmentIndRoundedIcon from "@material-ui/icons/AssignmentIndRounded";
import Avatar from "@material-ui/core/Avatar";
import { Badge, Fab, Hidden } from "@material-ui/core/";
import ListItem from "@material-ui/core/ListItem";
import Popover from "@material-ui/core/Popover";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { logout } from "../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "../actions/auth";
import styles from "../css";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			left: false,
			value: 0,
			anchorEl: null
		};
	}
	async componentWillMount() {
		await this.props.loadUser();
	}
	handleMenu = event => {
		this.setState({ anchorEl: 1 });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	toggleDrawer = (side, open) => () => {
		this.setState({
			[side]: open
		});
	};

	render() {
		// const styles = {
		// 	margin: {
		// 		marginTop: 2,
		// 		marginRight: "10px"
		// 	},

		// };
		const logo = {
			height: "44px",
			marginLeft: 15,
			marginRight: 15
		};

		const sideList = (
			<Drawer open={this.state.left} onClose={this.toggleDrawer("left", false)}>
				<div
					tabIndex={0}
					role="button"
					onClick={this.toggleDrawer("left", false)}
					onKeyDown={this.toggleDrawer("left", false)}
				>
					{" "}
					<div className={styles.list}>
						<List>
							<ListItem button key={"Home"} component={Link} to="/">
								<Typography variant="h6"> Scholarily</Typography>
							</ListItem>
							{/* <ListItem button key={"Home"} component={Link} to={"/"}>
								<ListItemIcon>
									<HomeIcon className={styles.icon} />
								</ListItemIcon>

								<ListItemText primary={"Home"} />
							</ListItem> */}

							{this.props.auth.isAuthenticated ? (
								<Fragment>
									<ListItem
										button
										key={"Dashboard"}
										component={Link}
										to={"/dashboard"}
									>
										<ListItemIcon>
											<DashboardIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Dashboard"} />
									</ListItem>
									<ListItem
										button
										key={"Test Board"}
										component={Link}
										to={"/subjects"}
									>
										<ListItemIcon>
											<SchoolIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Test Board"} />
									</ListItem>
									<ListItem
										button
										key={"Edit Profile"}
										component={Link}
										to={"/editprofile"}
									>
										<ListItemIcon>
											<AssignmentIndRoundedIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Edit Profile"} />
									</ListItem>
									<ListItem button key={"Help"} component={Link} to={"/help"}>
										<ListItemIcon>
											<ClassIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Help"} />
									</ListItem>

									<Divider />
									<ListItem
										button
										key={"Logout"}
										onClick={() => this.props.logout()}
									>
										<ListItemIcon>
											<HighlightOffIcon className={styles.icon} />
										</ListItemIcon>
										<ListItemText primary={"Logout"} />
									</ListItem>
								</Fragment>
							) : (
								<Fragment>
									<ListItem button key={"Help"} component={Link} to={"/help"}>
										<ListItemIcon>
											<ClassIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Help"} />
									</ListItem>
									<Divider />

									<ListItem
										button
										key={"Register"}
										component={Link}
										to={"/register"}
									>
										<ListItemIcon>
											<PersonAddIcon className={styles.icon} />
										</ListItemIcon>

										<ListItemText primary={"Register"} />
									</ListItem>
								</Fragment>
							)}
						</List>
					</div>
				</div>
			</Drawer>
		);

		const navbar_mui = (
			<AppBar
				position="fixed"
				color="inherit"
				style={{ backgroundColor: "#562c4f", zIndex: 999 }}
			>
				<Toolbar>
					<Hidden only={["md", "lg"]}>
						<MenuIcon
							onClick={this.toggleDrawer("left", true)}
							style={{ marginLeft: 20, color: "white" }}
						/>
					</Hidden>

					<Link to="/">
						<img
							src="http://www.lastcampus.com/wp-content/uploads/2019/09/ScholarilyLogo.001-e1568913180761.png"
							style={logo}
							alt=""
						/>
					</Link>

					<div
						style={{
							display: "flex",
							flex: 3,
							flexDirection: "row",
							justifyContent: "center"
						}}
					></div>
					<div
						style={{
							display: "flex",
							flex: 1,
							flexDirection: "row",
							justifyContent: "flex-end"
						}}
					>
						{this.props.auth.isAuthenticated ? (
							<Fragment>
								<Hidden only={["xs", "sm"]}>
									<IconButton
										style={styles.navButton}
										component={Link}
										to="/dashboard"
									>
										<Badge color="secondary">
											<DashboardIcon />
										</Badge>{" "}
										Dashboard
									</IconButton>
									<IconButton
										style={styles.navButton}
										component={Link}
										to="/subjects"
									>
										<Badge color="secondary">
											<MailIcon />
										</Badge>{" "}
										Test Board
									</IconButton>
								</Hidden>

								<IconButton
									style={styles.navButton}
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={e => this.handleMenu(e)}
									color="inherit"
								>
									<Avatar
										alt="Profile"
										src={
											this.props.auth.user && this.props.auth.user.photo
												? this.props.auth.user.photo.toString()
												: "img/user.png"
										}
										style={styles.avatar}
									/>
								</IconButton>
								<Hidden only={["xs", "sm"]}>
									<Menu
										id="menu-appbar"
										anchorEl={this.state.anchorEl}
										style={{
											// top:5
											marginTop: -200
										}}
										anchorOrigin={{
											// vertical: "top",
											horizontal: "right"
										}}
										keepMounted
										transformOrigin={{
											// vertical: "top",
											horizontal: "right"
										}}
										open={this.state.anchorEl}
										onClose={() => this.handleClose()}
									>
										<MenuItem
											component={Link}
											to={"/editprofile"}
											onClick={() => this.handleClose()}
										>
											Edit Profile
										</MenuItem>
										<MenuItem
											onClick={() => {
												this.props.logout();
												this.handleClose();
											}}
										>
											Logout
										</MenuItem>
									</Menu>
								</Hidden>
							</Fragment>
						) : (
							<Button
								component={Link}
								to={"/register"}
								value="Login"
								style={styles.gradientNavButton}
							>
								Login
							</Button>
						)}
					</div>
				</Toolbar>
			</AppBar>
		);

		return (
			<div>
				{navbar_mui}
				{sideList}
			</div>
		);
	}
}

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	loadUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ logout, loadUser }
)(Navbar);
