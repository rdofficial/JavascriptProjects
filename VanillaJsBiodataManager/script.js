/*
JavaScript for Biodata Manager - VanillaJS

Author : Rishav Das
*/

const fillData = () => {
	/* The function to extract the existing data at localStorage and fill them up in the HTML elements. Just call this function and it fetches all the items in localStorage under the key named 'biodata'. */

	// Getting the 'data-container' HTML container
	const dataContainer = document.getElementById('data-container');

	// Getting the data from the web browser's localStorage
	let data = localStorage.getItem('biodata');
	if (data == null) {
		// If the data in the localStorage does not exists then we just insert the message 'No saved data found' in the dataContainer

		dataContainer.innerHTML = `<h3 style="color: #fff>No saved data found</h3>`;
	} else {
		// If there exists some already saved data in the localStorage of the web browser, then we set those data

		data = JSON.parse(data);  // Parsing the JSON data to an object / array
		let html = `<h3 style="color: #fff">Existing data :</h3>`;  // Creating the blank HTML text where we will fill the filtered data
		for (let item of data) {
			// Iterating through each item in order to fill the HTML elements up

			// Adding the overlook HTML element for each data item
			html += `<div class="overlook-data"><b>${item.firstName} ${item.lastName}</b><button class="btn show-btn">Show</button><div class="complete-data"><b>First Name :</b> ${item.firstName}<br><b>Last Name :</b> ${item.lastName}<br><b>Address :</b> ${item.address}<br><b>Frameworks :</b> ${item.frameworks.join(', ')}<br><b>Programming Languages :</b> ${item.programmingLanguages.join(', ')}<br></div></div>`;
		}
		dataContainer.innerHTML = html;  // Setting the HTML contents of the dataContainer to our filtered information format
	}

	// Adding the functionality to the overlook-data and complete-data HTML elements
	Array.from(document.getElementsByClassName('show-btn')).forEach((element, index) => {
		/* Iterating over each button and adding the onlick event listener to each one of them. */

		// let completeDataDiv = Array.from(document.getElementsByClassName('overlook-data'))[index];
		element.addEventListener('click', (e) => {
			/* The function to be executed when the user clicks on the show-btn buttons on the overlook-data HTML div */

			e.preventDefault();
			Array.from(document.getElementsByClassName('complete-data')).forEach((element1, index1) => {
				/* Iterating through each of the HTML div elements in order to plain hide all rest and just display the one with the same index */

				if (index1 == index) {
					element1.style.display = 'block';
				} else {
					element1.style.display = 'none';
				}
			});
		});
	});
}

const addData = (firstName, lastName, programmingLanguages = [], frameworks = [], address = '') => {
	/* The function to add another item in the existing data and save it to the local storage. */

	if (firstName.length == 0 || lastName.length == 0 || programmingLanguages.length == 0 || frameworks.length == 0 || address.length < 3) {
		// If the user specified data for the new biodata form is not valid then we throw an Syntax error

		throw SyntaxError('Please mention proper data for all fields for the biodata');
	} else {
		// If all the data fields are valid, then we continue to fill in the specified data into the localStorage

		// Creating the data item's object for the people
		let item = {
			firstName : firstName,
			lastName : lastName,
			programmingLanguages : programmingLanguages,
			frameworks : frameworks,
			address : address,
		}

		// Filling the data to the localStorage
		let data = localStorage.getItem('biodata');
		if (data == null) {
			// If the data does not exists in the localStorage, then we create a blank array for the data

			data = [];
		} else {
			// If the data does exists in the localStorage, then we parse the JSON object back to the array form

			data = JSON.parse(data);
		}
		data.push(item);  // Appending the newly created item to the data array
		localStorage.setItem('biodata', JSON.stringify(data));  // Saving the array with added information back to the localStorage of the web browser.
		fillData();  // Calling the fillData function to update the HTML elements
	}
}

// Getting the add data button
const addItemBtn = document.getElementById('add-item-btn');

// Adding the onclick event listener to the addItemBtn
addItemBtn.addEventListener('click', (e) => {
	/* The function to be called when the user clicks on the addItemBtn, the function reads the inputs from the user and, then appends those data to the localStorage. */

	// Getting the input from the user
	let firstName = document.querySelector('input[name="first-name"]').value;
	let lastName = document.querySelector('input[name="last-name"]').value;
	let address = document.querySelector('input[name="address"]').value;
	let programmingLanguages = document.querySelector('input[name="programming-languages"]').value;
	let frameworks = document.querySelector('input[name="frameworks"]').value;

	// Breaking the programmingLanguages and frameworks inputs to arrays
	programmingLanguages = programmingLanguages.split(';');
	frameworks = frameworks.split(';');

	// Calling the addData() with the specific parameters
	try {
		addData(firstName, lastName, programmingLanguages, frameworks, address);
	} catch(error) {
		// Calling the window alert function with showing the error message to the user

		alert(error);
	}
});

// When the window loads, then also we fill in the data by default
fillData();