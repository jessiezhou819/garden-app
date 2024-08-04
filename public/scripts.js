/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}
// Fetches data from the housepeople table and displays it.
async function fetchAndDisplayHousePeople() {
    const tableElement = document.getElementById('housepeople');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/housepeople', {
        method: 'GET'
    });

    const responseData = await response.json();
    const housepeopleContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    housepeopleContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertHousePeople(event) {
    event.preventDefault();
    console.log("HOUSE PEOPLE")
    // Get form values
    const username = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const gender = document.getElementById('gender').value;
    const gardenRole = document.getElementById('gardenRole').value;
    const yearsOfExp = document.getElementById('yearsOfExp').value;

    // Send POST request to insert new user
    const response = await fetch('/insertHousePerson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: pass,
            fullName: fullName,
            gender: gender,
            gardenRole: gardenRole,
            yearsOfExp: yearsOfExp
        })
    });

    if (response.ok) {
        // Refresh the table to show the new user
        fetchAndDisplayHousePeople();
    } else {
        alert('Failed to insert user');
    }
}

// Fetches data from the garden table and displays it.
async function fetchAndDisplayGarden() {
    const tableElement = document.getElementById('garden');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/garden', {
        method: 'GET'
    });

    const responseData = await response.json();
    const housepeopleContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    housepeopleContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the WorksOn table and displays it.
async function fetchAndDisplayWorksOn() {
    const tableElement = document.getElementById('workson');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/workson', {
        method: 'GET'
    });

    const responseData = await response.json();
    const housepeopleContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    housepeopleContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayDivision(event) {
    event.preventDefault();
    const username = document.getElementById('inputUsername').value;

    const response = await fetch('/division', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('divisionMsg');

    const tableElement = document.getElementById('divisiontable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (responseData.success) {
        messageElement.textContent = "Found User!";

        const divisionContent = responseData.data;

        divisionContent.forEach(user => {
            const row = tableBody.insertRow();
            user.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } else {
        messageElement.textContent = "Error finding data!";
    }
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the housepeople table and displays it.
async function fetchAndDisplayPlant() {
    const tableElement = document.getElementById('plant');
    const tableBody = tableElement.querySelector('tbody');

    console.log("HEREEEEE");
    const response = await fetch('/plant', {
        method: 'GET'
    });

    const responseData = await response.json();
    const plantContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    plantContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    // checkDbConnection();
    fetchTableData();
    document.getElementById("insertForm").addEventListener("submit", insertHousePeople);
    document.getElementById("selectUser").addEventListener("submit", fetchAndDisplayDivision);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayGarden();
    fetchAndDisplayWorksOn();
    fetchAndDisplayHousePeople();

}
