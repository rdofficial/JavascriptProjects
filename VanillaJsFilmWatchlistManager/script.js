/*
JavaScript file for Film Watchlist Manager - VanillaJS

Author : Rishav Das
*/

const fillData = () => {
	/* The function to fill in the film watchlist data to the HTML code of the web page. Call this function once when the webpage loads itself and once again when the new data is inserted to the watchlist. */

	// Getting the watchlist HTML container element from the main web page
	const watchlistHtmlContainer = document.getElementById('watchlist-container');

	// Fetching the data at the local storage of the web browser
	let data = localStorage.getItem('watchlist');
	if (data == null) {
		// If there is not already saved watchlist data at the web browser's local storage, then we show the user for "No existing data" message

		watchlistHtmlContainer.innerHTML = `<h3 style="color: #fff;">No films added to watchlist</h3>`;
	} else {
		// If there exists some data for the watchlist in the web browser's local storage, then we start filling the data in the watchlistHtmlContainer

		watchlistHtmlContainer.innerHTML = `<h3 style="color: #fff;">Films in the watchlist are : </h3><br>`;
		data = JSON.parse(data);  // Parsing the JSON watchlist data into a array of objects format	
		for (item of data) {
			// Iterating through each of the items in the watchlist data and inserting them to the HTML container

			watchlistHtmlContainer.innerHTML += `<div class="film-card"><span class="film-name">${item.filmName}</span><br><span class="film-datetime">${item.datetime}</span><button class="btn remove-item-btn">Remove</button></div>`;
		}

		// Adding the onclick event listener to all the remove buttons on the film-card
		Array.from(document.getElementsByClassName('remove-item-btn')).forEach((element, index) => {
			element.addEventListener('click', (e) => {
				/* The function to be executed when the user clicks on the "remove" button on each film-card, the function does is it removes the film from the watchlist data for the film which is of the same index */

				e.preventDefault();
				// Removing the specifiied film data
				data.splice(index, 1);

				// Saving the updated data back to the local storage
				localStorage.setItem('watchlist', JSON.stringify(data));
				// Calling the fillData() function again to refresh the HTML container showing the watchlist data
				fillData();
			});
		});
	}
}

const addToWatchlist = (filmName) => {
	/* The function to add up a new film data into the watchlist (Saved at local storage of the web browser) */

	if (/[0-9a-zA-z]{2,30}/.test(filmName)) {
		// If the film name entered by the user is considered valid as per regex /[0-9a-zA-z]{2,50}/, then execute further else return false

		// Creating the object for our new item entry
		let date = new Date();
		date = date.toLocaleString();
		let item = {
			filmName : filmName,
			datetime : date,
		}

		// Extracting the if available data at local storage of the web browser
		let data = localStorage.getItem('watchlist');
		if (data == null) {
			// If there are no earlier saved data at the local storage of the web browser, then we create a new blank array

			data = []
		} else {
			// If there is already a saved data found at the local storage, then we kindly parse it and append the new data to it

			data = JSON.parse(data);
		}

		// Appending the new item to the watchlist data
		data.push(item);

		// Saving the updated data back to the local storage
		localStorage.setItem('watchlist', JSON.stringify(data));
		// Updating the data at the HTML document (calling the fillData() again!)
		fillData();
	} else {
		// If the user entered film name does not gets verified by the regex test, then we raise an error and quit the current process here

		throw SyntaxError('Please enter a proper film name');
	}
}

// Adding the onclick event listener to the add-btn (The button which on clicked, adds the movie to the wordlist)
document.getElementById('add-film-btn').addEventListener('click', (e) => {
	/* The function to be executed when the user clicks on the add-film-btn, the function simply reads the input of the film name from the user and then adds it to the watchlist by calling the function addToWatchlist(). */

	// Getting the user entered film name from the text input box
	const filmName = document.querySelector('input[name="film-name"]').value;
	try {
		addToWatchlist(filmName);
	} catch(error) {
		// If there are any errors, then we display the error to the user via the window.alert function

		alert(error);
	}
});

// When the window loads, then we call the fillData() function by default in order to fill in the already saved data at the local storage of the web browser
fillData();