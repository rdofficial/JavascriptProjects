/*
The main server endpoint file for Thoughts Manager - NodeJS

Note :
1. The application uses express.js framework for better making of an web application.
2. We use the express-session for making a login session for each user.
3. We do not use a database for storing information about an user, instead we use a JSON file and read/write information into it using the 'fs' module.

Author : Rishav Das
*/

// Importing the required modules
const FS = require('fs');  // Using the fs module for the filesystem handling
const EXPRESS = require('express');  // Using the express module for creating the web app with the express backened support
const SESSION = require('express-session');  // For creating a session for a user to use (with authentication + login system)
const BODY_PARSER = require('body-parser');  // For parsing the post request data sent to the application

// Creating an object using the express class
const app = EXPRESS();

// Setting the view engine (templating system) for the express application to the EJS
// Note that the default directory location for the ejs files is 'views/'
app.set('view engine', 'ejs');

// Setting the '/scripts' directory as a static folder for our express powered app
app.use(EXPRESS.static('scripts'));

// Defining some of the properties for the POST requests and other body parser properties
app.use(BODY_PARSER.urlencoded({ extended: true }));
app.use(BODY_PARSER.json());
app.use(SESSION({secret: '15265126735vdfghdsf35hgdfhgsdf53624', resave: true, saveUninitialized: true}));

// DEFINING OTHER FUNCTIONS REQUIRED BY THE APPLICATION TO WORK FLUENTLY AND SECURELY
//
const hash = (password) => {
	/* The function to hashify a string password into a cipher format which can be only decryptable if we know the real password, this is the secure way of storing the passwords in the server databases. */

	// First generating the key for the encryption (hashing)
	let key = 0, n = 0;
	for (let i of password) {
		// Iterating through each characters of the password in order to create the key sum

		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	// Making the key possitive if it is negative ( We simply multiply it by -1 ;-) )
	if (key < 0) {
		key = key * (-1)
	}
	// Adding up the password length to the key integer
	key += password.length

	// Now converting each plain character to the jumbled format
	let hash = ``;
	password.split('').forEach((element, index) => {
		// Shifting the char code
		hash += String.fromCharCode((element.charCodeAt() + key) % 256);
	});

	// Encoding the jumbled character to the base64
	hash = Buffer.from(hash, 'utf-8').toString('base64');

	// Returning back the hashed format of the password
	return hash;
}

// DEFINING THE FUNCTION SERVING THE SPECIFIC ENDPOINTS FOR THE WEB APPLICATION
//
// For Index page
app.get('/', (request, response) => {
	/* The function for serving response when there is a GET request at the '/' URL of the web application. We will first check here that wheter the user is logged in or not, if the user is logged in, then we proceed to the index page, else we redirect the user to the login URL. The user checking function will be done in the EJS file. */

	if (request.session.loggedIn) {
		// If the user is logged in already, then we proceed to the home (index) page

		return response.render('index', {username : request.session.username});
	} else {
		// If the user is not logged in, then we redirect the user to the login URL of the web application

		return response.redirect('/login');
	}
});

// For the Log In page
app.get('/login', (request, response) => {
	/* The function to be served when there is a GET request at the '/login' URL of the web app. We here is display a simple login form (defined in login.ejs). */

	if (request.session.loggedIn) {
		// If the user is logged in, then we send an already logged in error, then we set the error parameter message

		return response.redirect('/')
	} else {
		// If the user is not logged in, then we set the error parameter to null

		return response.render('login');
	}
});
app.post('/login', (request, response) => {
	/* The function to be served when there is a POST request at the '/login' URL of the web app. We here is check the POST request data, and authenticate the user on the basis of the credentials, the user enters. */

	// Checking wheter the current user is already logged in or not
	if (request.session.loggedIn) {
		// If the user is currently logged in then we return an error

		return response.send('error');
	}

	// Getting the POST request data
	let username = request.body.username;
	let password = request.body.password;

	// Hashing the password
	password = hash(password);

	let users;
	try {
		// Reading the /data/users.json file for verification of the data
		users = FS.readFileSync(__dirname + '/data/users.json');
		users = JSON.parse(users);
	} catch(error) {
		// If there are any errors in the process, then we return an error back to the client

		return response.send('error');
	}

	// Checking wheter the user is present or not
	for (let user of users) {
		if (user.username == username) {
			// If the user exists in the /data/users.json file

			if (user.password == password) {
				// If the password matches, then we authenticate the user and log in is granted

				request.session.loggedIn = true;
				request.session.username = username;
				return response.send('success');
			} else {
				// If the user entered password does not matches the given account, then we return an error

				return response.send('incorrect');
			}
		}
	}

	// If the loop exits without doing anything, we can conclude that the requested username was not found in the /data/users.json file, then we return an error stating the username is not available, please sign up
	return response.send('not found');
});

// For the Sign Up Page
app.get('/signup', (request, response) => {
	/* The function to serve the response when there is a GET request at the '/signup' URL of the web app. The function renders the signup.ejs template. But before rendering the template, we will check wheter the user is logged in or not, if logged in then we redirect the user to the index URL, or else we render the signup.ejs template. */

	if (request.session.loggedIn) {
		// If the user accessing the URL is currently logged in, then we redirect the user to the index (/) URL of the web app

		return response.redirect('/');
	} else {
		// If the user is not logged in, then we serve the signup template back to the user

		return response.render('signup');
	}
});
app.post('/signup', (request, response) => {
	/* The function to server the response when there is a POST request at the '/signup' URL of the web app. The function does only one thing and that is it registers a new user account as per the requested username and password. User log in verification is also done here. */

	if (request.session.loggedIn) {
		// If the user accessing the URL is currently logged in, then we return an error

		return response.send('User already logged in');
	}

	// Getting the POST request parameters
	let username = request.body.username;
	let password = request.body.password;

	// Hashing the password before saving it
	password = hash(password);

	try {
		// Accessing the users data at /data/users.json
		let data = FS.readFileSync(__dirname + '/data/users.json');
		data = JSON.parse(data);

		// Checking wheter the same named user exists or not
		for (let user of data) {
			// Iterating through each data items

			if (user.username == username) {
				// If any of the username matches with the user specified username, then we return an error stating that the user already exists

				return response.send('Another user with same username already exists. Please choose any other usename.');
			}
		}
		// If we are outside the loop then we can assume that no user with the same username already exists :-)

		// Appending (using the .push() method) the new user item to the existing item
		data.push({username : username, password : password});

		// Saving the data back to the /data/users.json
		FS.writeFileSync(__dirname + '/data/users.json', JSON.stringify(data));
	} catch(error) {
		// If there are any errors in the process, then we return error back to the client

		return response.send('error');
	}

	// Authenticating the user automatically
	request.session.loggedIn = true;
	request.session.username = username;

	// Returning the success message back to the client (user)
	return response.send('success');
});

// For the log out endpoint
app.get('/logout', (request, response) => {
	/* The function which serves the response when there is a GET request at the /logout URL of the web app. The function first checks wheter the user is logged in or it just an anonymous unlogged user making the request, then proceed to the main process. */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we log the user out

		request.session.loggedIn = false;
		request.session.username = undefined;

		// Redirecting the user to the index page
		return response.redirect('/');
	} else {
		// If the user is not logged in, then we redirect the user to the login page

		return response.redirect('/login');
	}
});

// For the new (thought) endpoint
app.post('/thoughts/new', (request, response) => {
	/* The function which serves the response when there is a POST request on the /thoughts/new URL of the web app. The function first verify wheter the user is authenticated or not, and then it reads the POST request data and saves the contents. */

	// Checking if the user is authenticated (logged in) or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process

		// Getting the POST request data
		let title = request.body.title;
		let content = request.body.content;
		let created_at = request.body.created_at;

		try {
			// Saving the data to the 'data.json' file at the root folder
			let data = FS.readFileSync(__dirname + '/data/thoughts.json');
			data = JSON.parse(data);
			data.push({
				title : title,
				content : content,
				created_at : created_at,
				owner : request.session.username,
			});
			FS.writeFileSync(__dirname + '/data/thoughts.json', JSON.stringify(data));

			// If there are no errors faced until now, then we return success
			return response.send('success');
		} catch(error) {
			// If there are any error in the process, then we return the error back to the user

			return response.send('error');
		}
	} else {
		// If the user is not logged in, then we return an error

		return response.send('User not logged in');
	}
});

// For thoughts/fetch endpoint
app.post('/thoughts/fetch', (request, response) => {
	/* The function which serves the response when there is a POST request on the /thoughts/fetch URL of the web app. The function fetches all the thoughts saved in the server files belonging to the currently logged in user, and then return back it in filtered JSON format. If there are any errors on the way, then the response returned is the string 'error' */

	// Checking if the user is authenticated or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process

		// Reading the thoughts data from the datafiles
		let data;
		try {
			data = FS.readFileSync(__dirname + '/data/thoughts.json');
			data = JSON.parse(data);
		} catch(error) {
			// If there is any error in the process, then we return the error back to the user

			return response.send('error');
		}

		// Searching for the all the thoughts written by the current user
		let filteredData = [];
		for (let item of data) {
			// Iterating through all the existing data

			if (item.owner == request.session.username) {
				filteredData.push(item);
			}
		}

		// After the filtering of the required data, we return back the data to the user
		return response.send(JSON.stringify(filteredData));
	} else {
		// If the user is not logged in, then we return an error back to the user

		return response.send('user not logged in'); // Here do proper error handling in the client javascript part.
	}
});

// Making the application to listen connections at port 8000
app.listen(8000, () => {
	console.log('NodeJsThoughtsManager listening at port 8000');
});