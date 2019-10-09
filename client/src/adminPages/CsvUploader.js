import React from "react";
const axios = require("axios");

class ReactUploadImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			file: null,
			test_id: ""
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
	}
	onFormSubmit(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append("imageName", "multer-image-" + Date.now());

		formData.append("imageData", this.state.file);
		formData.append("test_id", this.state.test_id);

		const config = {
			headers: {
				"content-type": "multipart/form-data"
			}
		};
		axios
			.post("/csv", formData, config)
			.then(response => {
				if (response.data.success) alert("The file is successfully uploaded");
			})
			.catch(error => {
				// alert(error.message);
			});
	}
	async onFileChange(e) {
		await this.setState({ file: e.target.files[0] });
		console.log(this.state.file);
	}
	onChange(e){
		this.setState({ test_id: e.target.value });
	}

	render() {
		return (
			<form onSubmit={this.onFormSubmit}>
				<h1>File Upload</h1>
				<input
					type="text"
					name="test_id"
					value={this.state.test_id}
					onChange={(e) => this.onChange(e)}
				></input>
				<input type="file" name="myImage" onChange={this.onFileChange} />
				<button type="submit">Upload</button>
			</form>
		);
	}
}

export default ReactUploadImage;
