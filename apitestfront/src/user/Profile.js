import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {Redirect, Link} from 'react-router-dom'
import {read} from './apiUser'
import DefaultProfile from '../images/avatar.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import {listByUser} from '../post/apiPost'


class Profile extends Component {
	constructor(){
		super()
		//console.log('constructor');
		//console.log(this);
		this.state = {
			user: {following: [], followers: []},
			redirectToSignin: false,
			following: false,
			error: "",
			posts: []
		}
	}

	checkFollow = (user) => {
		let jwt = isAuthenticated();
		let match = user.followers.find((follower) => {
			return follower._id === jwt.user._id
		})

		return match;
	}

	clickFollowButton = callApi => {
		let userId = isAuthenticated().user._id;
		let token = isAuthenticated().token;
		callApi(userId, token, this.state.user._id)
		.then(data => {
			if (data.error){
				this.setState({
					error: data.error
				})
			}
			else{

				this.setState({
					user: data,
					following: !this.state.following
				})
			}
		})
	}

	init = (userId) => {
		let token = isAuthenticated().token;
		read(userId, token)
		.then((data) => {
			//TODO:
			//check when this error occurs!!!
			if (data.error){
				this.setState({
					redirectToSignin: true
				})
			}
			else {
				let following = this.checkFollow(data);
				this.setState({
					user: data,
					following: following
				})
				this.loadPosts(data._id);
			}
		})
	}

	loadPosts = (userId) => {
		let token = isAuthenticated().token;
		listByUser(userId, token)
		.then(data => {
			if (data.error) {
				console.log(data.error);
			}
			else{
				this.setState({
					posts: data
				})
			}
		})
	}

	componentDidMount(){
		let userId = this.props.match.params.userId;
		this.init(userId);
	}

	componentWillReceiveProps(props){
		let userId = props.match.params.userId;
		this.init(userId);
	}

	render() {
		let {redirectToSignin, user, posts} = this.state;
		//console.log(this.state);
		if (redirectToSignin){
			return <Redirect to="/signin" />
		}

		let photoUrl = user._id ? 
			`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` :
			DefaultProfile

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Profile</h2>
				<div className="row">
					<div className="col-md-4">
				
						<img 
							src={photoUrl} 
							alt={user.name} 
							className="card-img-top"
							style={{
								width: 'auto', 
								height: '200px'
							}}
							onError={i => (i.target.src = `${DefaultProfile}`)}
						/>


						
					</div>

					<div className="col-md-8">
						<div className="lead mt-2">
							<p>Hello {user.name}</p>
							<p>Email: {user.email}</p>
							<p>{`Joined ${new Date(user.created).toDateString()}`}</p>
						</div>

						{isAuthenticated().user && 
							isAuthenticated().user._id === user._id ? (
								<div className="d-inline-block">
									<Link 
										className="btn btn-raised btn-info mr-5"
										to={`/post/create/`}
									>
										Create post
									</Link>

									<Link 
										className="btn btn-raised btn-success mr-5"
										to={`/user/edit/${user._id}`}
									>
										Edit profile
									</Link>
									<DeleteUser userId = {user._id}/>
									
								</div>
							) : (
								<FollowProfileButton 
									following={this.state.following}
									onButtonClick={this.clickFollowButton}
								/>
							)
						}

						
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mt-5 mb-5">
						<hr/>
						<p className="lead">{user.about}</p>
						<hr/>

						<ProfileTabs
							followers={user.followers}
							following={user.following}
							posts={posts}
						/>
					</div>
				</div>
			</div>
		);
	}
}
 
export default Profile