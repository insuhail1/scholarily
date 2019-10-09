import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Spinner = () => {
	const logo = {
		height: "44px",
		marginLeft: 15,
		marginRight: 15
	};
	return (
		<div
			className="text-center"
			style={{
				display: "block",
				paddingTop: 250
			}}
		>
			<img
				src="http://www.lastcampus.com/wp-content/uploads/2019/09/ScholarilyLogo.001-e1568913180761.png"
				style={logo}
				alt=""
			/>
		</div>
	);
};

export default Spinner;
