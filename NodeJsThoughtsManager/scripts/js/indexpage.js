/*
JavaScript for the Index page - Thoughts Manager (NodeJs)

Author : Rishav Das
*/

// Getting the add new button on the HTML doc
const addNewDataBtn = document.getElementById('add-new-data');

// Adding an onclick event listener to the addNewDataBtn
addNewDataBtn.addEventListener('click', (e) => {
	/* The function to be called when the user clicks on the addNewDataBtn, the function simply reads the user input and sends a POST request to the backend asking to save the new data */

	// Reading the user inputs
	const title = document.querySelector('input[name="thought-title"]');
	const content = document.querySelector('textarea[name="thought-content"]');

	// Verifying the user input before sending them
	if (title.value.length < 3 || content.value.length < 10) {
		// If the user entered data is very less in amount, then it is considered invalid input of data, and we raise an alert

		alert('Please enter correct data entries for the new thought entry.');
	} else {
		// If the user entered data is a bit valid, then we continue the process

		// Creating the timestamp
		let date = new Date();

		// Creating the data for the POST request
		let data = JSON.stringify({title : title.value, content : content.value, created_at : date.valueOf()});

		// Sending the POST request
		fetch('/thoughts/new', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
			/* The function to be executed post the response has been recieved from the server */

			// Checking the response from the server
			if (response == 'error') {
				// If the response from the server states that there might be error, then we show it to the user

				throw Error(`The task has been failed to execute, and the operation resulted in an error.`);
			} else if (response == 'success') {
				// If the response from the server states success, then we say it to the user

				alert('New data has been added successfully!');
				location.reload();
			} else {
				// If the response from the server states anything else, then we raise an error

				throw Error(`Unknown response from the server. Response is "${response}"`);
			}
		}).catch(error => alert(error));
	}
});

// Fetching the already written thoughts from the server and writting them into the HTML doc
fetch('/thoughts/fetch', {method : 'post'}).then(response => response.text()).then(response => {
	/**/

	// Checking the response from the server
	if (response == 'error') {
		// If there is any other error response from the server

		throw Error('There is an internal error in the server, clearly talking failed to load the previous data.');
	} else if (response == 'user not logged in') {
		// If the response from the server states that the user is not currently logged in then we display this error

		throw Error('User is not logged in. Please log in to continue the process.');
	} else {
		// If there is anything else response from the server, then we can assume that it is the JSON formatted data

		// Parsing the JSON formatted data
		response = JSON.parse(response);
		response = response.reverse();

		// Inserting the data into the HTML container
		let html = ``;
		for (let item of response) {
			// Iterating through each data item

			html += `<div class="card my-2 mx-2" style="width: 18rem;">
			<div class="card-body">
			<h5 class="card-title">${item.title}</h5>
			<p class="card-text">${item.content}</p>
			<small class="card-link">${Date(item.created_at)}</small>
			</div>
			</div>`;
		}

		// Setting the data into the thoughts-container
		document.getElementById('thoughts-container').innerHTML = html;
	}
}).catch(error => alert(error));