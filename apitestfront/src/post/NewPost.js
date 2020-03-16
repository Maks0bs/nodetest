 import React, { Component } from 'react';
import {create} from './apiPost'
import {isAuthenticated} from '../auth'
import {Redirect} from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpg'

class NewPost extends Component {
	constructor(){
		super()
		this.state = {
			title: '',
			body: '',
			photo: '',
			error: '',
			user: {},
			fileSize: 0,
			loading: false,
			redirectToProfile: false
		}
	}


	componentDidMount(){
		this.postData = new FormData();
		this.setState({
			user: isAuthenticated().user
		})
	}

	isValid = () => {
		let {title, body, fileSize} = this.state;
		console.log(fileSize);

		if (fileSize > 100000) {
			this.setState({error: "File size should be less than 100kb", loading: false})
			return false;
		}

		if (title.length === 0 || body.length === 0){
			this.setState({error: "All fileds are required", loading: false})
			return false
		}

		return true;
	}

	handleChange = (name) => (event) => {
		// this.setState({})
		let value = name === 'photo' ? event.target.files[0] : event.target.value;
		let fileSize = name === 'photo' ? event.target.files[0].size : 0;
		this.postData.set(name, value);
		this.setState({
			error: "",
			[name]: value,
			fileSize: fileSize
		})
	}

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({loading: true})
		if (this.isValid()){
			let userId = isAuthenticated().user._id;
			let token = isAuthenticated().token;
			create(userId, token, this.postData)
			.then((data) => {
				if (data.error){
					this.setState({
						error: data.error
					})
				}
				else{
					this.setState({
						loading: false,
						title: '',
						body: '',
						photo: '',
						redirectToProfile: true
					})
				}
			})
		}
	}

	newPostForm(title, body){
		return (
			<form>
				<div className="form-group">
					<label className="text-muted">Image</label>
					<input 
						onChange={this.handleChange("photo")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="file" 
						accept="image/*"
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label className="text-muted">Title</label>
					<input 
						onChange={this.handleChange("title")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="text" 
						className="form-control"
						value={title}
					/>
				</div>
				
				<div className="form-group">
					<label className="text-muted">Body</label>
					<textarea 
						onChange={this.handleChange("body")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="text" 
						className="form-control"
						value={body}
					/>
				</div>
				

				<button 
					className="btn btn-raised btn-primary"
					onClick={this.clickSubmit}
				>
					Create post
				</button>
			</form>
		);
	}


	render() {
		//console.log('render');
		let {
			title, 
			body, 
			photo, 
			user,
			error,
			loading,
			redirectToProfile
		} = this.state;

		if (redirectToProfile){
			return (
				<Redirect to={`/user/${user._id}`} />
			)
		}

		// let photoUrl = id ? 
		// 	`${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` :
		// 	DefaultProfile;


		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Create a new post</h2>

				<div 
					className="alert alert-danger"
					style={{display: error ? "" : "none"}}
				>
					{error}
				</div>

				{loading ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
				 	</div>
				) : (
				 	""
				)}

				{/*<img
				 	className="img-thumbnail"
				 	src={photoUrl}
				 	alt={name}
				 	style={{height: "200px", width: 'auto'}}
				 	onError={i => (i.target.src = `${DefaultProfile}`)}
				/>*/}

				{this.newPostForm(title, body)}
			</div>
		);
	}
}

export default NewPost;
