/*
JavaScript for the Sign Up page - Thoughts Manager (NodeJs)

Things done here :
1. Added the onclick event listener to the sign up button, which calls the functions which sends a POST request to the backend system and requests for creating a new user account

Author : Rishav Das
*/

// Fetching the Signup Button HTML element
const signupBtn = document.getElementById('signup-btn');

// Adding an event listener to the sign up button
signupBtn.addEventListener('click', (e) => {
	/* The function to be executed after the user clicks on the signup button. First we will get the user entered details and verify them, later on continuing to send the post request with the appropriate data. */

	e.preventDefault();

	// Getting the user inputs (username input text, password and confirm passwords)
	let username = document.querySelector('input[name="username"]');
	let password = document.querySelector('input[name="password"]');
	let confirmPassword = document.querySelector('input[name="confirm-password"]');

	// Checking the username validity
	if (/[a-zA-Z0-9]{5,25}/.test(username.value)) {
		// If the regex is succedded then we continue the process

		// Verifying the passwords and confirm passwords
		if (password.value == confirmPassword.value) {
			// If the user entered password and confirm passwords are matched, then we will continue the process

			// Creating the data for POST value
			let data = JSON.stringify({username : username.value, password : password.value});

			// Sending the POST request using the fetch method
			fetch('/signup', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
				/* After fetching the response, this function is executed, where we will check the type of the response from the server. */

				if (response == 'success') {
					// If the response from the server states success in creation of the new user, then we redirect the user to the home (index /) page

					alert('User creation success! Now, you can log in using the username and password combination.');
					location.href = '/';
				} else {
					// If the response from the server states anything else than succes, then we return an error stating the user failed to be registered and also we display an error message (we throw just an custom error with the response as the error message)

					throw Error(response);
				}
			}).catch(error => alert(error));
		} else {
			// If the user entered password and confirm password field's values does not matches, then we raise an error

			alert('Passwords do not match');
			return 0;
		}
	} else {
		// If the regex test resulted in false, then we raise an error through window.alert function

		alert('Please enter a proper username with atleast 5 or more alphabets and number combinations.');
		return 0;
	}
});