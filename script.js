document.addEventListener('DOMContentLoaded', () => {
    const moodForm = document.getElementById('moodForm');
    const moodInput = document.getElementById('moodInput');
    const moodSelector = document.getElementById('moodSelector');
    const activitySelector = document.getElementById('activitySelector');
    const moodList = document.getElementById('moodList');
    const todoList = document.getElementById('todoList');
    const uploadCsvInput = document.getElementById('uploadCsvInput');
    const exportBtn = document.getElementById('exportBtn');
    const toggleTheme = document.getElementById('toggleTheme');

    document.getElementById('uploadCsvBtn').addEventListener('click', () => {
        document.getElementById('uploadCsvInput').click();
    });

    let entries = [];
    let darkTheme = false;

    moodForm.addEventListener('submit', handleFormSubmit);
    exportBtn.addEventListener('click', exportToCSV);
    toggleTheme.addEventListener('click', toggleDarkTheme);
    uploadCsvInput.addEventListener('change', importFromCSV);

    loadEntriesFromLocalStorage(); // Load entries on page load
    loadTheme(); // Load saved theme

    function handleFormSubmit(event) {
        event.preventDefault();
        const entry = createEntry();
        entries.push(entry);
        displayEntry(entry, entries.length - 1);
        resetForm();
        saveEntriesToLocalStorage(); // Save to local storage
    }

    function createEntry() {
        const moodText = moodInput.value;
        const moodLevel = moodSelector.value;
        const activity = activitySelector.value;
        const date = new Date().toLocaleString();
        const isTodo = document.getElementById('todoCheckbox').checked;
        return { date, moodText, moodLevel, activity, isTodo };
    }

    function displayEntry(entry, index) {
        const entryFragment = document.createDocumentFragment();
        const entryContainer = document.createElement('div');
        entryContainer.className = 'mood-entry';
        entryContainer.innerHTML = `
            <strong>${entry.date}</strong>: <span class="mood-text">${entry.moodText}</span>
            ${entry.moodLevel ? `(Level: ${entry.moodLevel})` : ''}
            ${entry.activity ? `(Category: ${entry.activity})` : ''}
            <button class="edit-entry" data-index="${index}">Edit</button>
            <button class="delete-entry" data-index="${index}">Delete</button>
        `;
        entryFragment.appendChild(entryContainer);
        if (entry.isTodo) {
            todoList.appendChild(entryFragment);
        } else {
            moodList.appendChild(entryFragment);
        }

        // Button listeners
        entryContainer.querySelector('.edit-entry').addEventListener('click', () => editEntry(index));
        entryContainer.querySelector('.delete-entry').addEventListener('click', () => deleteEntry(index));
    }

    function editEntry(index) {
        const entry = entries[index];
        moodInput.value = entry.moodText;
        moodSelector.value = entry.moodLevel;
        activitySelector.value = entry.activity;
        document.getElementById('todoCheckbox').checked = entry.isTodo;
        deleteEntry(index); // Remove to save updated entry later
    }

    function deleteEntry(index) {
        entries.splice(index, 1);
        updateDisplay();
    }

    function updateDisplay() {
        moodList.innerHTML = '';
        todoList.innerHTML = '';
        entries.forEach((entry, index) => displayEntry(entry, index));
        saveEntriesToLocalStorage();
    }

    function exportToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,Date,Mood,Level,Category,To-Do\n";
        entries.forEach(entry => {
            const row = `${entry.date},${entry.moodText},${entry.moodLevel},${entry.activity},${entry.isTodo}`;
            csvContent += row + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'mood_entries.csv');
        link.click();
    }

    function importFromCSV(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const rows = e.target.result.split("\n");
            rows.slice(1).forEach(row => {
                const [date, moodText, moodLevel, activity, isTodo] = row.split(',');
                if (moodText && moodLevel) { // Simple validation
                    const entry = { date, moodText, moodLevel, activity, isTodo: isTodo === 'true' };
                    entries.push(entry);
                    displayEntry(entry, entries.length - 1);
                }
            });
        };
        reader.readAsText(file);
    }

    function toggleDarkTheme() {
        darkTheme = !darkTheme;
        document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', darkTheme ? 'dark' : 'light'); // Save to localStorage
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            darkTheme = savedTheme === 'dark';
            document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
        }
    }

    function saveEntriesToLocalStorage() {
        localStorage.setItem('moodEntries', JSON.stringify(entries));
    }

    function loadEntriesFromLocalStorage() {
        const savedEntries = localStorage.getItem('moodEntries');
        if (savedEntries) {
            entries = JSON.parse(savedEntries);
            entries.forEach((entry, index) => displayEntry(entry, index));
        }
    }

    // Input validation
    moodInput.addEventListener('input', () => {
        if (moodInput.value.trim() === '') {
            moodInput.setCustomValidity('Mood text cannot be empty');
        } else {
            moodInput.setCustomValidity('');
        }
    });

    moodSelector.addEventListener('change', () => {
        if (moodSelector.value === '') {
            moodSelector.setCustomValidity('Please select an importance level');
        } else {
            moodSelector.setCustomValidity('');
        }
    });
});
