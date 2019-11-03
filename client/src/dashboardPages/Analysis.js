import React, { Fragment } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography, Paper } from "@material-ui/core/";
import Box from "@material-ui/core/Box";
import PerformanceSnapshot from "./PerformanceSnapshot";
import { connect } from "react-redux";
import Rank from "./Rank";
import SolutionsAnalysis from "./SolutionsAnalysis";
import LogicalAndAnalytical from "./LogicalAndAnalytical";
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			<Box p={3}>{children}</Box>
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`
	};
}

const FullWidthTabs = props => {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const id = React.useState(props.tests.test_id);
	function handleChange(event, newValue) {
		setValue(newValue);
	}

	function handleChangeIndex(index) {
		setValue(index);
	}

	return (
		<Fragment>
			<div className="row" style={{ marginTop: 80 }}>
				<div className="col-md-12">
					<Paper>
						<AppBar position="static" color="default">
							<Tabs
								value={value}
								onChange={handleChange}
								// indicatorColor="default"
								className="analysis-header"
								// textColor="default"
								variant="fullWidth"
								aria-label="full width tabs example"
							>
								<Tab
									style={{ outline: "none" }}
									label="Rank"
									{...a11yProps(0)}
								/>
								<Tab
									style={{ outline: "none" }}
									label="Performance Snapshot"
									{...a11yProps(1)}
								/>
								<Tab
									style={{ outline: "none" }}
									label="Solutions and Analysis"
									{...a11yProps(2)}
								/>
								<Tab
									style={{ outline: "none" }}
									label="Mental Assessment"
									{...a11yProps(3)}
								/>
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === "rtl" ? "x-reverse" : "x"}
							index={value}
							onChangeIndex={handleChangeIndex}
						>
							<TabPanel value={value} index={0} dir={theme.direction}>
								<Rank id={props.tests.test_id} />
							</TabPanel>
							<TabPanel value={value} index={1} dir={theme.direction}>
								<PerformanceSnapshot id={props.tests.test_id} />
							</TabPanel>
							<TabPanel value={value} index={2} dir={theme.direction}>
								<SolutionsAnalysis id={props.tests.test_id} />
							</TabPanel>
							<TabPanel value={value} index={3} dir={theme.direction}>
								<LogicalAndAnalytical id={props.tests.test_id} />
							</TabPanel>
						</SwipeableViews>
					</Paper>
				</div>
			</div>
		</Fragment>
	);
};
FullWidthTabs.propTypes = {
	tests: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	tests: state.tests
});

export default connect(mapStateToProps)(FullWidthTabs);
