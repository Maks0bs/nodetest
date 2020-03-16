import React from 'react';
import Posts from '../post/Posts'

let Home = () => (//may need to change parenthesis
	<div>
		<div className="jumbotron">
			<h2>Home</h2>
			<p className="lead">Welcome to React Frontend</p>
		</div>

		<div className="container">
			<Posts />
		</div>
	</div>
);

export default Home;