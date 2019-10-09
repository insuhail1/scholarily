import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Spinner = () => {
	return (
		<div
			className="text-center"
			style={{
				display: "block",
				paddingTop: 250
			}}
		>
			<ScaleLoader sizeUnit={"px"} size={150} color={"#123abc"} />
		</div>
	);
};

export default Spinner;
