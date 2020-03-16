import React, { Component, Fragment} from 'react';
import {comment, uncomment} from './apiPost'
import {isAuthenticated} from '../auth'
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpg'

class Comment extends Component {
	state = {
		text: "",
		error: ""
	}

	handleChange = event => {
		this.setState({
			error: "",
			text: event.target.value
		})
	}

	isValid = () => {
		let {text} = this.state;
		if (!text.length > 0 || text.length > 150){
			this.setState({
				error: "Comment should not be empty and be less than 150 chars long"
			})
			return false;
		}

		return true;
	}

	addComment = (e) => {
		e.preventDefault();

		if (!isAuthenticated()){
			this.setState({
				error: "please sign in to leave a comment"
			})

			return false;
		}

		if (this.isValid()){
			let userId = isAuthenticated().user._id;
			let postId = this.props.postId;
			let token = isAuthenticated().token;

			comment(userId, token, postId, {text: this.state.text})
			.then(data => {
				if (data.error){
					console.log(data.error)
				}
				else{
					this.setState({
						text: ''
					})
					//dispatch fresh list of comments to parent component
					this.props.updateComments(data.comments);
				}
			})
		}
	}

	deleteComment = (comment) => {
		let userId = isAuthenticated().user._id;
		let postId = this.props.postId;
		let token = isAuthenticated().token;

		uncomment(userId, token, postId, comment)
		.then(data => {
			if (data.error){
				console.log(data.error)
			}
			else{
				//dispatch fresh list of comments to parent component
				this.props.updateComments(data.comments);
			}
		})
	}

	deleteConfirmed = (comment) => {
		let answer = window.confirm("Are you sure you want to delete your post?");
		if (answer){
			console.log(this);
			this.deleteComment(comment);
		}
	}

	render() {
		let {comments} = this.props;
		let {error} = this.state;
		console.log(error);
		return (
			<div>
				<h2 className="mt-5 mb-5">Leave a comment</h2>

				<form onSubmit={this.addComment}>
					<div className="form-group">
						<input 
							className="form-control"
							type="text"
							value={this.state.text}
							onChange={this.handleChange}
							placeholder="leave a comment..."
						/>
						<button className="btn btn-raised btn-success mt-2">
							Post
						</button>
					</div>
				</form>

				<div 
					className="alert alert-danger"
					style={{
						display: error ? "" : "none"
					}}
				>
					{error}
				</div>

				<div className="col-md-12">
					<h3 className="text-primary">{comments.length} Comments</h3>
					<hr/>
					{comments.map((comment, i) => {
						return (
							<div key={i}>
								<div>
									<Link to={`/user/${comment.postedBy._id}`}>
										<img
											style={{
												borderRadius: '50%',
												border: '1px solid black'
											}}
											className="float-left mr-2"
											height="30px"
											width="30px"
											src={`${process.env.REACT_APP_API_URL}
												/user/photo/${comment.postedBy._id}`
											} 
											alt={comment.postedBy.name}
											onError={i => 
												(i.target.src=`${DefaultProfile}`)
											}
										/>
									</Link>
									<div>
										<p className="lead">{comment.text}</p>
										<p className="font-italic mark">
											Posted by{" "}
											<Link to={`/user/${comment.postedBy._id}`}>
												{comment.postedBy.name}{" "}
											</Link>
											on {new Date(comment.created).toDateString()}
											<span>
												{isAuthenticated().user && 
													isAuthenticated().user._id === comment.postedBy._id && 
												(
													<Fragment>

														<span 
															className="text-danger float-right mr-1"
															onClick={() => this.deleteConfirmed(comment)}
														>
															Remove
														</span>
													</Fragment>
												)}
											</span>
										</p>
									</div>
								</div>
							
							</div>
						)
					})}
				</div>
			</div>
		);
	}
}

export default Comment