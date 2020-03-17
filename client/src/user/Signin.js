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
			loading: false,
			recaptcha: false
		}

		//this.renderSigninForm = this.renderSigninForm.bind(this);
	}

	handleChange = (name) => (event) => {
		this.setState({
			error: "",
			[name]: event.target.value
		})
	}

	recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;
 
        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }
 
        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };

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

		if (this.state.recaptcha){
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
		else{
			this.setState({
				loading: false,
				error: "What day is it today? Please write correct answer"
			})
		}
	}

	

	renderSigninForm(email, password, recaptcha){
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

				<div className="form-group">
				    <label className="text-muted">
				        {recaptcha ? "Thanks. You got it!" : "What day is today?"}
				    </label>
				 
				    <input
				        onChange={this.recaptchaHandler}
				        type="text"
				        className="form-control"
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
		let {email, password, error, redirectToReferer, loading, recaptcha} = this.state;
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

				{this.renderSigninForm(email, password, recaptcha)}

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