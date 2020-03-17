import React, { Component } from 'react';
import {isAuthenticated} from '../auth'
import {remove} from './apiUser'
import {signout} from '../auth'
import {Redirect} from 'react-router-dom';

class DeleteUser extends Component {
	state = {
		redirect: false
	};

	deleteAccount = () => {
		let token = isAuthenticated().token;
		let userId = this.props.userId
		remove(userId, token)
		.then(data => {
			if (data.error){
				console.log(data.error);
			}
			else{
				signout(() => console.log("User is deleted"));
				this.setState({redirect: true});
			}
		})
	}

	deleteConfirmed = () => {
		let answer = window.confirm("Are you sure you want to delete your account?");
		if (answer){
			console.log(this);
			this.deleteAccount();
		}
	}

	render() {
		if (this.state.redirect){
			return <Redirect to="/" />
		}
		return (
			<button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
				Delete
			</button>
		);
	}
}

export default DeleteUser;
