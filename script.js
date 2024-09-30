const moodForm = document.getElementById('moodForm');
const moodInput = document.getElementById('moodInput');
const moodSelector = document.getElementById('moodSelector');
const activitySelector = document.getElementById('activitySelector');
const moodList = document.getElementById('moodList');
const moodAdvice = document.getElementById('moodAdvice');
const exportBtn = document.getElementById('exportBtn');
const toggleTheme = document.getElementById('toggleTheme');
let entries = [];
let darkTheme = false;

console.log(`Testing console working for SBA-316 DOM`);

moodForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const moodText = moodInput.value;
    const moodLevel = moodSelector.value;
    const activity = activitySelector.value;
    const date = new Date().toLocaleString();

    const entry = { date, moodText, moodLevel, activity };
    entries.push(entry);
    displayEntry(entry);
    provideAdvice(moodLevel);
    resetForm();
});

function displayEntry(entry) {
    const moodEntry = document.createElement('div');
    moodEntry.className = 'mood-entry';
    moodEntry.innerHTML = `<strong>${entry.date}</strong>: ${entry.moodText} (Level: ${entry.moodLevel}, Category: ${entry.activity})`;
    moodList.appendChild(moodEntry);
}

function resetForm() {
    moodInput.value = '';
    moodSelector.value = '';
    activitySelector.value = '';
}

function provideAdvice(level) {
    if (level <= 3) {
        moodAdvice.innerHTML = "<p>It seems like you're feeling down. Consider taking a break or talking to someone.</p>";
    } else {
        moodAdvice.innerHTML = "";
    }
}

exportBtn.addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Mood,Level,Category\n";
    entries.forEach(entry => {
        const row = `${entry.date},${entry.moodText},${entry.moodLevel},${entry.activity}`;
        csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mood_entries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

toggleTheme.addEventListener('click', function() {
    darkTheme = !darkTheme;
    document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
});
