import React, { Component } from 'react';
import {read, update, updateUser} from './apiUser'
import {isAuthenticated} from '../auth'
import {Redirect} from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpg'

class EditProfile extends Component {
	constructor(){
		super()
		this.state = {
			id: "",
			name: "",
			email: "",
			password: "",
			redirectToProfile: false,
			error: "",
			fileSize: 0,
			loading: false,
			about: ""
		}
	}

	init = (userId) => {
		let token = isAuthenticated().token;
		read(userId, token)
		.then((data) => {
			//TODO:
			//check when this error occurs!!!
			if (data.error){
				this.setState({
					redirectToProfile: true
				})
			}
			else {
				this.setState({
					id: data._id,
					name: data.name,
					email: data.email,
					error: "",
					about: data.about
				})
			}
		})
	}

	componentDidMount(){
		this.userData = new FormData();
		let userId = this.props.match.params.userId;
		this.init(userId);
	}

	isValid = () => {
		let {name, email, password, fileSize} = this.state;
		console.log(fileSize);

		if (fileSize > 100000) {
			this.setState({error: "File size should be less than 100kb", loading: false})
			return false;
		}

		if (name.length == 0){
			this.setState({error: "Name is required", loading: false})
			return false
		}

		if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/.test(email)){
			this.setState({error: "A valid email is required", loading: false})
			return false
		}

		if (password.length >= 1 && password.length <= 5){
			this.setState({error: "Password must be at least 6 chars long", loading: false})
			return false;
		}

		return true;
	}

	handleChange = (name) => (event) => {
		let value = name === 'photo' ? event.target.files[0] : event.target.value;
		let fileSize = name === 'photo' ? event.target.files[0].size : 0;
		this.userData.set(name, value);
		this.setState({
			error: "",
			[name]: value,
			fileSize: fileSize
		})
	}

	/*handleChange(name, event){
		console.log(name);
		console.log(event.target.value);
		this.setState({
			error: "",
			[name]: event.target.value
		})
	}*/

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({loading: true})
		if (this.isValid()){
			let userId = this.props.match.params.userId;
			let token = isAuthenticated().token;
			update(userId, token, this.userData)
			.then((data) => {
				if (data.error){
					this.setState({
						error: data.error
					})
				}
				else if (isAuthenticated().user.role === "admin"){
					this.setState({
						redirectToProfile: true
					})
				}
				else{
					updateUser(data, () => {
						this.setState({
							redirectToProfile: true
						})
					})
					
				}
			})
		}
	}

	renderSignupForm(name, email, password, about){
		return (
			<form>
				<div className="form-group">
					<label className="text-muted">Profile photo</label>
					<input 
						onChange={this.handleChange("photo")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="file" 
						accept="image/*"
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label className="text-muted">Name</label>
					<input 
						onChange={this.handleChange("name")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="text" 
						className="form-control"
						value={name}
					/>
				</div>
				<div className="form-group">
					<label className="text-muted">Email</label>
					<input
						onChange={this.handleChange("email")}
						type="email"
						className="form-control"
						value={email}
					/>
				</div>
				<div className="form-group">
					<label className="text-muted">About</label>
					<textarea 
						onChange={this.handleChange("about")/*can be changed to this.handleChane.bind(this, "name")*/} 
						type="text" 
						className="form-control"
						value={about}
					/>
				</div>
				<div className="form-group">
					<label className="text-muted">Password</label>
					<input 
						onChange={this.handleChange("password")}
						type="password" 
						className="form-control"
						value={password}
					/>
				</div>

				<button 
					className="btn btn-raised btn-primary"
					onClick={this.clickSubmit}
				>
					Update
				</button>
			</form>
		);
	}


	render() {
		console.log('render');
		let {id, 
			name, 
			email, 
			password, 
			redirectToProfile, 
			error, 
			loading,
			about
		} = this.state;

		if (redirectToProfile){
			return (
				<Redirect to={`/user/${id}`} />
			)
		}

		let photoUrl = id ? 
			`${process.env.REACT_APP_API_URL  || '/api'}/user/photo/${id}?${new Date().getTime()}` :
			DefaultProfile;


		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Edit Profile </h2>

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

				<img
				 	className="img-thumbnail"
				 	src={photoUrl}
				 	alt={name}
				 	style={{height: "200px", width: 'auto'}}
				 	onError={i => (i.target.src = `${DefaultProfile}`)}
				/>

				{isAuthenticated().user.role === "admin" ||
				    (isAuthenticated().user._id === id &&
				    this.renderSignupForm(name, email, password, about))}
			</div>
		);
	}
}

export default EditProfile;
