import React, {Component} from 'react';
import {signup} from '../auth'
import {Link} from 'react-router-dom'

class Signup extends Component {
	constructor(props){
		super(props);

		this.state = {
			name: "",
			email: "",
			password: "",
			error: "",
			open: false,
			recaptcha: false
		}

		//this.renderSignupForm = this.renderSignupForm.bind(this);
	}

	//why does this work!!!?
	handleChange = (name) => (event) => {
		console.log(name);
		console.log(event);
		this.setState({
			error: "",
			[name]: event.target.value
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
		let {name, email, password, recaptcha} = this.state;
		let user ={
			name: name,
			email: email,
			password: password
		}

		if (recaptcha){
			signup(user)
			.then((data) => {
				if (data.error){
					this.setState({
						error: data.error
					})
				}
				else{
					this.setState({
						name: "",
						email: "",
						password: "",
						error: "",
						open: true
					})
				}
			})
		}
		else{
			this.setState({
				error: "What day is it today? Please write correct answer"
			})
		}
	}

	renderSignupForm(name, email, password, recaptcha){
		return (
			<form>
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
		let {name, email, password, error, open, recaptcha} = this.state;
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Signup</h2>

				<div 
					className="alert alert-danger"
					style={{display: error ? "" : "none"}}
				>
					{error}
				</div>

				<div 
					className="alert alert-info"
					style={{display: open ? "" : "none"}}
				>
					New account is successfully created. <Link to="/signin">Please sign in.</Link>
				</div>

				{this.renderSignupForm(name, email, password, recaptcha)}
			</div>
		);
	}
}

export default Signup;