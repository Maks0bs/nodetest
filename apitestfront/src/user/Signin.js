import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom'
import {signin, authenticate} from '../auth'
import SocialLogin from "./SocialLogin";

class Signin extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
			error: "",
			redirectToReferer: false,
			loading: false
		}

		//this.renderSigninForm = this.renderSigninForm.bind(this);
	}

	handleChange = (name) => (event) => {
		this.setState({
			error: "",
			[name]: event.target.value
		})
	}

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({
			loading: true
		})
		let {email, password} = this.state;
		let user = {
			email: email,
			password: password
		}

		signin(user)
		.then((data) => {
			if (data.error){
				this.setState({
					error: data.error,
					loading: false
				})
			}
			else{
				//authenticate user and redirect
				authenticate(data, () => {
					//looks like pushing to history is the same as using <Redirect />
					//this.props.history.push('/');
					this.setState({
						
						redirectToReferer: true //,loading: false
					})
				})
			}
		})
	}

	

	renderSigninForm(email, password){
		return (
			<form>
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
					Submit
				</button>
			</form>
		);
	}

	render(){
		let {email, password, error, redirectToReferer, loading} = this.state;
		if (redirectToReferer){
			/*this.props.history.push('/');
			return null;*/
			return <Redirect to="/" />
		}
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Sign In</h2>
 
				<hr />
				   <SocialLogin />
				<hr />
				<h2 className="mt-5 mb-5">Sign in</h2>

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

				{this.renderSigninForm(email, password)}

				<p>
				   <Link to="/forgot-password" className="text-danger">
				       {" "}
				       Forgot Password
				   </Link>
				</p>
			</div>
		);
	}
}

export default Signin;