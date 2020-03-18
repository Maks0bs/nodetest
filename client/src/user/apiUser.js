//let apiPrefix = 'http://localhost:8080'
let apiPrefix;
if (process.env.NODE_ENV === 'production'){
	apiPrefix = '/api'
}
else{
	apiPrefix = 'http://localhost:8080';
}
//change this before deploying

export let read = (userId, token) => {
	console.log('making fetcht to');
	console.log(`${apiPrefix}/user/${userId}`);
	return fetch(`${apiPrefix}/user/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		}
	})
	.then(response => {
		console.log('got response');
		console.log(response);
		return response.json();
	})
	.catch(err => console.log(err))

}

export let update = (userId, token, user) => {
	//console.log("USER DATA UPDATE", user);
	return fetch(`${apiPrefix}/user/${userId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`
		},
		body: user
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let remove = (userId, token) => {
	return fetch(`${apiPrefix}/user/${userId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		}
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))
}

export let list = () => {
	console.log(apiPrefix)
	return fetch(`${apiPrefix}/users`, {
		method: "GET"
	})
	.then(response => {
		console.log('response');
		console.log(response);
		return response.json();
	})
	.catch(err => console.log(err))

}

export let updateUser = (user, next) => {
	if(typeof window !== 'undefined') {
		if (localStorage.getItem('jwt')){
			let auth = JSON.parse(localStorage.getItem('jwt'));
			auth.user = user
			localStorage.setItem('jwt', JSON.stringify(auth));
			next();
		}
	}
}

export let follow = (userId, token, followId) => {
	return fetch(`${apiPrefix}/user/follow`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, followId})
	})
	.then(response => {
		console.log(response);
		return response.json();
	})
	.catch(err => console.log(err))

}

export let unfollow = (userId, token, unfollowId) => {
	return fetch(`${apiPrefix}/user/unfollow`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, unfollowId})
	})
	.then(response => {
		console.log(response);
		return response.json();
	})
	.catch(err => console.log(err))

}

export let findPeople = (userId, token) => {
	return fetch(`${apiPrefix}/user/findpeople/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
	})
	.then(response => {
		console.log(response);
		return response.json();
	})
	.catch(err => console.log(err))

}