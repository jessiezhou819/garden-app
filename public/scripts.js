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
// Handles form submission for inserting a new user.
// document.getElementById('insertForm').addEventListener('submit', async function (event) {
//     event.preventDefault();

//     // Get form values
//     const username = document.getElementById('username').value;
//     const pass = document.getElementById('password').value;
//     const fullName = document.getElementById('fullName').value;
//     const gender = document.getElementById('gender').value;
//     const gardenRole = document.getElementById('gardenRole').value;
//     const yearsOfExp = document.getElementById('yearsOfExp').value;

//     // Send POST request to insert new user
//     const response = await fetch('/insertHousePerson', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: username,
//             password: pass,
//             fullName: fullName,
//             gender: gender,
//             gardenRole: gardenRole,
//             yearsOfExp: yearsOfExp
//         })
//     });

//     if (response.ok) {
//         // Refresh the table to show the new user
//         fetchAndDisplayHousePeople();
//     } else {
//         alert('Failed to insert user');
//     }

//     // Clear the form
//     document.getElementById('insertForm').reset();
// });

// // Initial fetch and display of house people
// fetchAndDisplayHousePeople();

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

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    console.log(idValue);
    console.log(nameValue);

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Deletes record from demotable.
async function deleteDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('removeId').value;
    const nameValue = document.getElementById('removeName').value;

    const response = await fetch('/delete-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data removed successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error removing data!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    // checkDbConnection();
    fetchTableData();
    // // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("deleteDemotable").addEventListener("submit", deleteDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("insertForm").addEventListener("submit", insertHousePeople);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
    fetchAndDisplayHousePeople();
    // fetchAndDisplayPlant();
}
