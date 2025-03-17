document.addEventListener('DOMContentLoaded', () => {
    const tankstellenList = document.getElementById('tankstellen-list');
    const searchInput = document.getElementById('search');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');
    const tankstellenForm = document.getElementById('tankstellen-form');
    const adresseInput = document.getElementById('adresse');
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-button');
    const createButton = document.getElementById('create-button');
    const formContainer = document.getElementById('form-container');

    let tankstellenData = [];
    let editIndex = null; // To track which item is being edited

    // Load data from local storage when the page loads
    loadTankstellenData();

    // Fetch JSON data (if needed)
    fetch('tankstellen.json') // Make sure the JSON file is in the same folder
        .then(response => response.json())
        .then(data => {
            // Extract relevant data from the JSON
            const initialData = data.features.map(feature => ({
                adresse: feature.attributes.adresse
            }));
            // Merge initial data with existing data (if any)
            tankstellenData = [...tankstellenData, ...initialData];
            saveTankstellenData(); // Save to local storage
            displayTankstellen(tankstellenData);
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));

    // Display tankstellen
    function displayTankstellen(data) {
        tankstellenList.innerHTML = '';
        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item.adresse;

            // Create a container for buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons');

            // Add edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Bearbeiten';
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => {
                editTankstelle(index);
            });

            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Löschen';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                deleteTankstelle(index);
            });

            // Append buttons to the container
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);

            // Append buttons container to the list item
            li.appendChild(buttonsContainer);
            tankstellenList.appendChild(li);
        });
    }

    // Show form and buttons when Create button is clicked
    createButton.addEventListener('click', () => {
        formContainer.style.display = 'block'; // Show the form container
        createButton.style.display = 'none'; // Hide the Create button
        adresseInput.focus(); // Focus on the input field
    });

    // Add or update tankstelle
    tankstellenForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const adresse = adresseInput.value.trim();
        if (adresse) {
            if (editIndex === null) {
                // Add new tankstelle at the top of the list
                tankstellenData.unshift({ adresse });
            } else {
                // Update existing tankstelle
                tankstellenData[editIndex].adresse = adresse;
                editIndex = null; // Reset edit mode
                submitButton.textContent = 'Speichern';
            }
            saveTankstellenData(); // Save to local storage
            displayTankstellen(tankstellenData);
            tankstellenForm.reset();
            formContainer.style.display = 'none'; // Hide form after submission
            createButton.style.display = 'block'; // Show Create button again
        }
    });

    // Edit tankstelle
    function editTankstelle(index) {
        adresseInput.value = tankstellenData[index].adresse;
        editIndex = index;
        submitButton.textContent = 'Aktualisieren';
        formContainer.style.display = 'block'; // Show the form container
        createButton.style.display = 'none'; // Hide the Create button
        adresseInput.focus(); // Focus on the input field
    }

    // Cancel edit or form submission
    cancelButton.addEventListener('click', () => {
        tankstellenForm.reset();
        editIndex = null;
        submitButton.textContent = 'Speichern';
        formContainer.style.display = 'none'; // Hide form
        createButton.style.display = 'block'; // Show Create button
    });

    // Delete tankstelle
    function deleteTankstelle(index) {
        tankstellenData.splice(index, 1);
        saveTankstellenData(); // Save to local storage
        displayTankstellen(tankstellenData);
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = tankstellenData.filter(item =>
            item.adresse.toLowerCase().includes(searchTerm)
        );
        displayTankstellen(filteredData);
    });

    // Sort ascending
    sortAscButton.addEventListener('click', () => {
        const sortedData = [...tankstellenData].sort((a, b) =>
            a.adresse.localeCompare(b.adresse)
        );
        displayTankstellen(sortedData);
    });

    // Sort descending
    sortDescButton.addEventListener('click', () => {
        const sortedData = [...tankstellenData].sort((a, b) =>
            b.adresse.localeCompare(a.adresse)
        );
        displayTankstellen(sortedData);
    });

    // Save data to local storage
    function saveTankstellenData() {
        localStorage.setItem('tankstellenData', JSON.stringify(tankstellenData));
    }

    // Load data from local storage
    function loadTankstellenData() {
        const data = localStorage.getItem('tankstellenData');
        if (data) {
            tankstellenData = JSON.parse(data);
            displayTankstellen(tankstellenData);
        }
    }
});