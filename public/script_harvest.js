async function fetchAndDisplayHarvest() {

    const tableElement = document.getElementById('harvest');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/harvest', {
        method: 'GET'
    });

    const responseData = await response.json();
    const harvestContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    harvestContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function filterHarvest(event) {
    event.preventDefault();

    const plantid = document.getElementById('plantID').value;
    const harvestid = document.getElementById('harvestID').value;
    const qty = document.getElementById('qty').value;
    const compare = document.getElementById('comparison').value;
    const harvestDate = document.getElementById('harvestDate').value;

    const response = await fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            plantid: plantid,
            harvestid: harvestid,
            qty: qty,
            compare: compare,
            harvestDate: harvestDate 
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('filterResultMsg');

    const tableElement = document.getElementById('filterResultTable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (responseData.success) {
        messageElement.textContent = "Found Record!";

        const filterContent = responseData.data;

        filterContent.forEach(user => {
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

window.onload = function () {
    // GARDEN RELATED FUNCTIONS
    fetchTableData();
    document.getElementById("harvestForm").addEventListener("submit", filterHarvest);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // GARDEN RELATED FUNCTIONS
    fetchAndDisplayHarvest();
}