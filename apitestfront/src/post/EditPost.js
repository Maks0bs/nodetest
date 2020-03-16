import React, { Component } from 'react';
import {singlePost, update} from './apiPost'
import {isAuthenticated} from '../auth'
import {Redirect} from 'react-router-dom'
import DefaultPost from '../images/spring.jpg'

class EditPost extends Component {
	constructor(){
		super()
		this.state = {
			id: '',
			title: '',
			body: '',
			redirectToProfile: false,
			error: '',
			fileSize: 0,
			loading: false
		}
	}

	init = (postId) => {
		singlePost(postId)
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
					title: data.title,
					body: data.body,
					error: ""
				})
			}
		})
	}

	isValid = () => {
		let {title, body, fileSize} = this.state;
		//console.log(fileSize);

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

	componentDidMount(){
		this.postData = new FormData();
		let postId = this.props.match.params.postId;
		this.init(postId);
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
			let postId = this.state.id
			let token = isAuthenticated().token;
			update(postId, token, this.postData)
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

	editPostForm(title, body){
		return (
			<form>
				<div className="form-group">
					<label className="text-muted">Post photo</label>
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
					Update post
				</button>
			</form>
		);
	}

	render() {
		let {
			id, 
			title, 
			body, 
			redirectToProfile, 
			error, 
			loading
		} = this.state;
		if (redirectToProfile){
			return <Redirect to={`/user/${isAuthenticated().user._id}`} />
		}
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">{title}</h2>

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
				 	src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
				 	alt={title}
				 	style={{height: "200px", width: 'auto'}}
				 	onError={i => (i.target.src = `${DefaultPost}`)}
				/>

				{this.editPostForm(title, body)}
			</div>
		);
	}
}

export default EditPost