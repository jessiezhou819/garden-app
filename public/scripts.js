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
    console.log("started function");
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
/**
 * ALL FUNCTIONALITIES RELATED TO WATERING
 */
// Fetches data from joined WateringR1 and WateringR2 table and displays it.
async function fetchAndDisplayWatering() {
    const tableElement = document.getElementById('watering');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/watering', {
        method: 'GET'
    });

    const responseData = await response.json();
    const wateringContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    wateringContent.forEach(watering => {
        const row = tableBody.insertRow();
        watering.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
// Fetches data from WateringR2 and displays it
async function fetchAndDisplayWateringR2() {
    const tableElement = document.getElementById('wateringR2');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/wateringR2', {
        method: 'GET'
    });

    const responseData = await response.json();
    const wateringR2Content = responseData.data;

    if(tableBody) {
        tableBody.innerHTML = '';
    }

    wateringR2Content.forEach(wateringR2 => {
        const row = tableBody.insertRow();
        wateringR2.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
// Fetches data from WateringR1 and displays it
async function fetchAndDisplayWateringR1() {
    const tableElement = document.getElementById('wateringR1');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/wateringR1', {
        method: 'GET'
    });

    const responseData = await response.json();
    const wateringR1Content = responseData.data;

    if(tableBody) {
        tableBody.innerHTML = '';
    }

    wateringR1Content.forEach(wateringR1 => {
        const row = tableBody.insertRow();
        wateringR1.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        })
    })
}
// Insert watering entry into WateringR2 and WateringR1 tables
async function insertWatering(event) {
    event.preventDefault();

    const wateringId = document.getElementById('insertwateringId').value;
    const pH = document.getElementById('insertpH').value;
    const temperature = document.getElementById('inserttemperature').value;
    const wateringDate = document.getElementById('insertwateringDate').value;
    const amount = document.getElementById('insertamount').value;
    const plantId = document.getElementById('insertplantId').value;

    const response = await fetch('/insertWatering', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wateringId: wateringId,
            pH: pH,
            temperature: temperature,
            wateringDate: wateringDate,
            amount: amount,
            plantId: plantId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertWateringResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}
// Delete watering entry through cascading of WateringR1 table
async function deleteWatering(event) {
    event.preventDefault();

    const wateringDate = document.getElementById('deletewateringDate').value;
    const temperature = document.getElementById('deletetemperature').value;
    const pH = document.getElementById('deletepH').value;

    const response = await fetch('/deleteWatering', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wateringDate: wateringDate,
            temperature: temperature,
            pH: pH
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteWateringR1ResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting data!";
    }
}
// Update WateringR2 entry
async function updateWateringR2(event) {
    event.preventDefault();

    const wateringId = document.getElementById('updatewateringId').value;
    const wateringDate = document.getElementById('updatewateringDate').value;
    const temperature = document.getElementById('updatetemperature').value;
    const pH = document.getElementById('updatepH').value;
    const plantId = document.getElementById('updateplantId').value;

    // console.log(wateringId, wateringDate, temperature, pH, plantId);

    const response = await fetch('/updateWateringR2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wateringId: wateringId,
            wateringDate: wateringDate,
            temperature: temperature,
            pH: pH,
            plantId: plantId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateWateringR2ResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating data!";
    }
}

/**
 * TEMPLATE RELATED FUNCTIONS
 */
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
window.onload = function() {
    // GARDEN RELATED FUNCTIONS
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertWatering").addEventListener("submit", insertWatering);
    document.getElementById("deleteWateringR1").addEventListener("submit", deleteWatering);
    document.getElementById("updateWateringR2").addEventListener("submit", updateWateringR2);

    document.getElementById("selectUser").addEventListener("submit", fetchAndDisplayDivision);
    // TEMPLATE RELATED FUNCTIONS
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("deleteDemotable").addEventListener("submit", deleteDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // TEMPLATED RELATED FUNCTIONS
    fetchAndDisplayUsers();
    fetchAndDisplayGarden();
    fetchAndDisplayWorksOn();

    // GARDEN RELATED FUNCTIONS
    fetchAndDisplayHousePeople();
    fetchAndDisplayWatering();
    fetchAndDisplayWateringR2();
    fetchAndDisplayWateringR1();
}
