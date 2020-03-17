export let create = (userId, token, post) => {
	//console.log("USER DATA UPDATE", user);
	return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`
		},
		body: post
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))
}

export let list = (page) => {
	return fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
		method: "GET"
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let singlePost = (postId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
		method: "GET"
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let listByUser = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
		method: "GET",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let remove = (postId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

export let update = (postId, token, post) => {
	//console.log("USER DATA UPDATE", user);
	return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`
		},
		body: post
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let like = (userId, token, postId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, postId})
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let unlike = (userId, token, postId) => {
	//console.log("USER DATA UPDATE", user);
	return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, postId})
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let comment = (userId, token, postId, comment) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, postId, comment})
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}

export let uncomment = (userId, token, postId, comment) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({userId, postId, comment})
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err))

}