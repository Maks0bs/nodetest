import React, { Component } from 'react';
import {list} from './apiUser'
import DefaultProfile from '../images/avatar.jpg'
import {Link} from 'react-router-dom'

class Users extends Component {
	constructor(){
		super()
		this.state = {
			users: []
		}
	}

	componentDidMount(){
		list().then(data => {
			if (data.error){
				console.log(data.error)
			}
			else{
				this.setState({
					users: data
				})
			}
		})
	}

	renderUsers = (users) => {
		return(
			<div className="row">
				{users.map((user, i) => (
					<div className="card col-md-4" key={i}>
						<img 
							src={`${process.env.REACT_APP_API_URL || '/api'}/user/photo/
								${user._id}?${new Date().getTime()}`} 
							alt={user.name} 
							className="card-img-top"
							style={{
								width: 'auto', 
								height: '200px'
							}}
							onError={i => (i.target.src = `${DefaultProfile}`)}
						/>
						<div className="card-body">
							<h5 className="card-title">
								{user.name}
							</h5>
							<p className="card-text">
								{user.email}
							</p>
						</div>
						<Link 
							to={`/user/${user._id}`}
							className="btn btn-raised btn-primary btn-sm"
						>
							View profile
						</Link>
					</div>
				))}
			</div>
		);
	}

	render() {
		let {users} = this.state;
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Users</h2>

				{this.renderUsers(users)}
			</div>
		);
	}
}

export default Users
