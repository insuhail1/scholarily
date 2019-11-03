import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import {
	TablePagination,
	Typography,
	TableSortLabel
} from "@material-ui/core/";
import { getRank } from "../actions/profile";
import { connect } from "react-redux";
import axios from "axios";
import Spinner from "../staticPages/Spinner";
import {
	Paper,
	FormControl,
	Select,
	MenuItem,
	Divider
} from "@material-ui/core/";

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc"
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy);
}

const headCells = [
	{ id: "rank", numeric: true, disablePadding: false, label: "Rank" },
	{
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Name"
	},
	{ id: "college", numeric: false, disablePadding: true, label: "College" },
	{ id: "score", numeric: true, disablePadding: false, label: "Score" }
];

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<Fragment>
			<thead>
				<tr>
					{headCells.map((headCell, index) => (
						<th
							key={headCell.id}
							// className={
							// 	index === 0 || index === 3
							// 		? "col-md-2 col-sm-2 col-xs-2"
							// 		: "col-md-4 col-sm-4 col-xs-4"
							// }
							align={headCell.numeric ? "center" : "left"}
							padding={headCell.disablePadding ? "none" : "default"}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={order}
								onClick={createSortHandler(headCell.id)}
							>
								<Typography component="h6">
									{headCell.label}
									{orderBy === headCell.id ? (
										<span className={classes.visuallyHidden}>
											{order === "desc"
												? "sorted descending"
												: "sorted ascending"}
										</span>
									) : null}
								</Typography>
							</TableSortLabel>
						</th>
					))}
				</tr>
			</thead>
		</Fragment>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(3)
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	tableWrapper: {
		overflowX: "auto"
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1
	}
}));

function EnhancedTable(props) {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [loading, setLoading] = React.useState(false);
	const [orderBy, setOrderBy] = React.useState("calories");
	const [rowsPerPage, setRowsPerPage] = React.useState(20);
	const [details, setDetails] = React.useState([]);
	const [filter, setFilter] = React.useState("air");
	const [page, setPage] = React.useState(0);
	const getDetails = async () => {
		const res = await axios.put(`/profile/rank/${props.tests.test_id}`);
		setDetails(res.data);
	};

	var rows = [];
	var pageNo = 0;
	for (var j = 0; j < details.length; j++) {
		rows.push({
			_id: details[j].student[0]._id,
			rank: j + 1,
			name: details[j].student[0].name,
			college: details[j].college,
			score: details[j].testRecord[0].score
		});
		if (props.auth.user._id === details[j].student[0]._id) {
			pageNo = j / 20;
		}
	}

	useEffect(() => {
		getDetails();
	}, []);

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === "desc";
		setOrder(isDesc ? "asc" : "desc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const onChange = async e => {
		setLoading(true);
		await setFilter(e.target.value);
		if (e.target.value === "air") {
			const res = await axios.put(`/profile/rank/${props.tests.test_id}`);
			await setDetails(res.data);
		} else if (e.target.value === "state") {
			const res = await axios.put(
				`/profile/rank/${props.tests.test_id}/state/${props.profile.profile.state}`
			);
			await setDetails(res.data);
		} else if (e.target.value === "district") {
			const res = await axios.put(
				`/profile/rank/${props.tests.test_id}/district/${props.profile.profile.district}`
			);
			await setDetails(res.data);
		} else if (e.target.value === "college") {
			const res = await axios.put(
				`/profile/rank/${props.tests.test_id}/college/${props.profile.profile.college}`
			);
			await setDetails(res.data);
		}
		setLoading(false);
	};

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<div className="row">
						<div className="col-md-12 col-sm-12 col-xs-12" align="right">
							<FormControl>
								<Select
									value={filter}
									onChange={e => onChange(e)}
									displayEmpty
									name="filter"
								>
									<MenuItem selected value="air" align="right">
										All India Rank
									</MenuItem>
									<MenuItem value="state">State Wise Rank</MenuItem>
									<MenuItem value="district">District Wise Rank</MenuItem>
									<MenuItem value="college">School Wise Rank</MenuItem>
								</Select>
							</FormControl>
						</div>
					</div>

					<Paper className="shadow-lg rounded">
						<div className={classes.tableWrapper}>
							<table className="table table-hover">
								<EnhancedTableHead
									classes={classes}
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									rowCount={rows.length}
								/>
								<tbody>
									{stableSort(rows, getSorting(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) => {
											return (
												<tr
													className={
														props.auth.user._id === row._id
															? "text-success"
															: ""
													}
												>
													<td>
														<Typography component="p">{row.rank}</Typography>
													</td>
													<td>
														<Typography component="p">{row.name}</Typography>
													</td>
													<td>
														<Typography component="p">{row.college}</Typography>
													</td>
													<td>
														<Typography component="p">{row.score}</Typography>
													</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>
						<TablePagination
							className="text-center"
							rowsPerPageOptions={[20]}
							component="div"
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							backIconButtonProps={{
								"aria-label": "previous page"
							}}
							nextIconButtonProps={{
								"aria-label": "next page"
							}}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</Paper>
				</Fragment>
			)}
		</Fragment>
	);
}

EnhancedTable.propTypes = {
	getRank: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	tests: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
	tests: state.tests
});

export default connect(
	mapStateToProps,
	{ getRank }
)(EnhancedTable);
