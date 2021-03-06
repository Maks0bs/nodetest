//let apiPrefix = 'http://localhost:8080'
let apiPrefix;
if (process.env.NODE_ENV === 'production'){
	apiPrefix = '/api'
}
else{
	apiPrefix = 'http://localhost:8080';
}
//change this before deploying


export let signup = (user) => {
	return fetch(`${apiPrefix}/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	})
	.then(response => {
		return response.json()
	})
	.catch(err => console.log(err))
}

export let signin = (user) => {
	return fetch(`${apiPrefix}/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	})
	.then(response => {
		return response.json()
	})
	.catch(err => console.log(err))
}

export let authenticate = (jwt, next) => {
	if (typeof window !== "undefined"){
		localStorage.setItem("jwt", JSON.stringify(jwt));
		next();
	}
}

export let signout = (next) => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("jwt");
		next();
		return fetch(`${apiPrefix}/signout`, {
			method: "GET"
		})
		.then((response) => {
			console.log('signout', response);
			return response.json();
		})
		.catch(err => console.log(err));
	}
}

export let isAuthenticated = () => {
	if (typeof window == "undefined"){
		return false;
	}

	if (localStorage.getItem("jwt")){
		return JSON.parse(localStorage.getItem("jwt"))
	}
	else{
		return false;
	}
}

export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${apiPrefix}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
 
export const resetPassword = resetInfo => {
    return fetch(`${apiPrefix}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const socialLogin = user => {
    return fetch(`${apiPrefix}/social-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
    .then(response => {
            console.log("signin response: ", response);
            return response.json();
    })
    .catch(err => console.log(err));
};