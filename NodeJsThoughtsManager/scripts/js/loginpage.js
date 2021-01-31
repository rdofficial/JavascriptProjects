/*
JavaScript for the Login Page - Thoughts Manager (NodeJs)

Things done here :
1. Added onclick event listener to the login button, which calls the function which sends a POST request to the backend endpoints of the web application requesting to authenticate the user with the user entered username and password.

Author : Rishav Das
*/

document.getElementById('login-btn').addEventListener('click', (e) => {
	/* The function to be executed when the user clicks on the login button */

	e.preventDefault();

	// Getting the user inputs
	const username = document.querySelector('input[name="username"]');
	const password = document.querySelector('input[name="password"]');

	// Creating a POST request data
	let data = JSON.stringify({username : username.value, password : password.value});

	fetch('/login', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
		/* After the response is returned from the server */

		// Checking the response
		if (response == 'success') {
			// If the response states success, it means that we are successfully logged in, so we redirect the user to the home page

			location.href = '/';
		} else if (response == 'incorrect') {
			// If the response states incorrect password, then we throw an error stating there is incorrect username and password combination

			throw Error(`Incorrect password for the account with username ${username.value}`);
		} else if (response == 'not found') {
			// If the response states not found, it means there is no such user available as per the user requested username

			throw Error(`No such account found with username ${username.value}`);
		} else {
			// If there is an unknown response, we just say error and print the response on the web browser console

			throw Error('There is an error while executing the specified process');
		}
	}).catch(error => alert(error));
});