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


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    // checkDbConnection();
    fetchTableData();
    document.getElementById("insertForm").addEventListener("submit", insertHousePeople);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayHousePeople();

}
