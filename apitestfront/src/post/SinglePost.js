import React, { Component, Fragment } from 'react';
import {singlePost, remove, like, unlike} from './apiPost'
import {isAuthenticated} from '../auth'
import DefaultPost from '../images/spring.jpg'
import { Link, Redirect } from 'react-router-dom';
import Comment from './Comment'

class SinglePost extends Component {
	state = {
		post: '',
		redirectToHome: false,
		redirectToSignin: false,
		like: false,
		likes: 0,
		comments: []
	}

	checkLike = (likes) => {
		let userId = isAuthenticated() && isAuthenticated().user._id;
		let match = likes.indexOf(userId) !== -1;
		return match;

	}

	//if you hit like button quickly enought consequently, you will be able to put a few likes to a post from 1 

	componentDidMount = () => {
		let postId = this.props.match.params.postId;
		singlePost(postId)
		.then(data => {
			if (data.error){
				console.log(data.error)
			}
			else{
				this.setState({
					post: data,
					likes: data.likes.length,
					like: this.checkLike(data.likes),
					comments: data.comments
				})
			}
		})
	}

	updateComments = (comments) => {
		this.setState({comments: comments});
	}

	likeToggle = () => {
		if (!isAuthenticated()){
			this.setState({
				redirectToSignin: true
			})
			return false
		}
		let callApi = this.state.like ? unlike : like;
		let userId = isAuthenticated().user._id;
		let postId = this.state.post._id
		let token = isAuthenticated().token;
		callApi(userId, token, postId)
		.then(data => {
			if (data.error){
				console.log(data.error);
			}
			else{
				this.setState({
					like: !this.state.like,
					likes: data.likes.length
				})
			}
		})
	}

	deletePost = () => {
		let postId = this.props.match.params.postId;
		let token = isAuthenticated().token;
		remove(postId, token)
		.then(data => {
			if (data.error){
				console.log(data.error)
			}
			else{
				this.setState({
					redirectToHome: true
				})
			}
		})
	}

	deleteConfirmed = () => {
		let answer = window.confirm("Are you sure you want to delete your post?");
		if (answer){
			console.log(this);
			this.deletePost();
		}
	}

	renderPost = (post) => {
		let posterId = post.postedBy ?
			`/user/${post.postedBy._id}` :
			""
		let posterName = post.postedBy ?
			post.postedBy.name :
			"Unknown"

		let {like, likes} = this.state;

		return (
			<div className="card-body">
				<img 
					src={`${process.env.REACT_APP_API_URL}
						/post/photo/${post._id}`} 
					alt={post.title}
					onError={
						i => i.target.src = `${DefaultPost}`
					}
					className="img-thumbnail mb-3"
					style={{
						height: "300px",
						width: '100%',
						objectFit: 'cover'
					}}
				/>

				{like ? (
					<h3 
						onClick={this.likeToggle}
					>
						<i 
							className="fa fa-thumbs-up text-success bg-dark"
							style={{
								padding: '10px',
								borderRadius: '50%'
							}}
						/>
						{likes} Like 
					</h3>
				) : (
					<h3 
						onClick={this.likeToggle}
					>
						<i 
							className="fa fa-thumbs-up text-warning bg-dark"
							style={{
								padding: '10px',
								borderRadius: '50%'
							}}
						/>
						{likes} Like 
					</h3>
				)}

				<p className="card-text">
					{post.body}
				</p>
				<br/>
				<p className="font-italic mark">
					Posted by{" "}
					<Link to={`${posterId}`}>
						{posterName}{" "}
					</Link>
					on {new Date(post.created).toDateString()}
				</p>

				<div className="inline-block">
					<Link 
						to={`/`}
						className="btn btn-raised btn-primary btn-sm mr-5"
					>
						back to posts
					</Link>

					{isAuthenticated().user && 
						isAuthenticated().user._id === post.postedBy._id && 
					(
						<Fragment>
							<Link 
								to={`/post/edit/${post._id}`}
								className="btn btn-raised btn-warning btn-sm mr-5"
							>
								Update post
							</Link>

							<button 
								className="btn btn-raised btn-danger"
								onClick={this.deleteConfirmed}
							>
								Delete post
							</button>
						</Fragment>
					)}

					
				</div>

			</div>
		)
	}

	render() {
		

		let {post, redirectToSignin, redirectToHome, comments} = this.state;
		//console.log(comments);

		if (redirectToHome){
			return <Redirect to={'/'} />
		}



		if (redirectToSignin){
			return <Redirect to={'/signin'} />
		}

		return (
			<div className="container">
				<h2 className="display-2 mt-5 mb-5">
					{post.title}
				</h2>

				{!post ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
				 	</div>
				 ) : (
				 	this.renderPost(post)
				)}

				 <Comment 
				 	postId={post._id} 
				 	comments={comments.reverse()}
				 	updateComments={this.updateComments}
				 />
			</div>
		);
	}
}

export default SinglePost
