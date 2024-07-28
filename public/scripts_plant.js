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
}

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {

    fetchAndDisplayPlant();
}
