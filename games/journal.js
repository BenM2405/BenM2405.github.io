// Global Variables
let undoStack = [];
let selectedMood = null;

// HTML elements
const textEntry = document.getElementById('entry')
const saveButton = document.getElementById('save');
const prevDisplay = document.getElementById('entryDisplay');
const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
const revealBtn = document.getElementById('revealDoodle');
const moodButtons = document.querySelectorAll('.mood-group button');

// Main Functions
function savePiece(){
    const text = textEntry.value;
    if (!selectedMood) {
        alert("Please select a mood before saving.")
        return;
    }

    if (text.trim() === '' || !confirm("Would you like to save?")){
        return;
    }
    const stored = localStorage.getItem('JournalEntries');
    const entries = stored ? JSON.parse(stored) : [];
    const info = {
        date: new Date(), 
        entry: text
    };
    info.mood = selectedMood;


    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    const userDoodle = canvas.toDataURL();
    const blankData = blankCanvas.toDataURL();
    if (userDoodle !== blankData) {
        info.doodle = userDoodle;
    }
    for (let i = entries.length - 1; i >= 0; i--){
        if (isSameDay(new Date(entries[i].date), new Date())) {
            alert("You've already journaled today, take some time to reflect :)")
            return;
        }
    }

    
    entries.push(info);
    localStorage.setItem('JournalEntries', JSON.stringify(entries));
    textEntry.value = '';
    document.querySelector('.container').style.display = 'none';
    displayEntries();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function displayEntries(){
    const stored = localStorage.getItem('JournalEntries');
    const entries = stored ? JSON.parse(stored) : [];
    prevDisplay.innerHTML = ''

    entries.slice().reverse().forEach(entry => {
        const entryContainer = document.createElement('div');


        const dispText = document.createElement('p');
        dispText.textContent = entry.entry;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '1rem';
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '▼';
        toggleBtn.style.fontSize = '1.2rem';
        toggleBtn.style.border = 'none';
        toggleBtn.style.background = 'none';
        toggleBtn.style.cursor = 'pointer';

        header.appendChild(toggleBtn);
        
        const dispDate = document.createElement('h1');
        dispDate.textContent = new Date(entry.date).toLocaleString();
        dispDate.style.margin = 0;
    
        header.appendChild(dispDate);
        

        if (entry.doodle) {
            const img = document.createElement('img');
            img.src = entry.doodle;
            img.alt = "Journal Doodle";
            img.width = 48;
            img.height = 48;
            img.style.border = "1px solid black";
            img.style.borderRadius = "6px";
            header.appendChild(img);
        }
        const moodTag = document.createElement('span');
        moodTag.textContent = `Mood: ${entry.mood || "Unknown"}`;
        moodTag.style.fontWeight = "bold";
        entryContainer.appendChild(moodTag);

        entryContainer.appendChild(header);
        entryContainer.appendChild(dispText);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Entry';
        deleteBtn.style.display = 'none';
        toggleBtn.addEventListener('click', () => {
            toggleBtn.textContent = deleteBtn.style.display === 'none' ? '▲' : '▼';
            deleteBtn.style.display = 
                deleteBtn.style.display === 'none' ? 'inline-block' : 'none';
        });

        
        deleteBtn.addEventListener('click', () => {
            if (!confirm('Are you sure you want to delete? You have to wait until the next day to create a new one...')){
                return;
            }
            const stored = localStorage.getItem('JournalEntries');
            let entries = stored ? JSON.parse(stored) : [];

            entries = entries.filter(e =>
                !(e.date === entry.date && e.entry === entry.entry)
            );

            localStorage.setItem('JournalEntries', JSON.stringify(entries));
            displayEntries();
        });
        entryContainer.appendChild(deleteBtn);
        prevDisplay.appendChild(entryContainer);
});
}




// Helper Functions
function isSameDay(d1, d2){
    return new Date(d1).toLocaleDateString('en-CA') === new Date(d2).toLocaleDateString('en-CA')
}

// Event Listeners
saveButton.addEventListener('click', savePiece);
textEntry.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        savePiece();
    }
});

window.addEventListener('DOMContentLoaded', displayEntries);
document.getElementById('positive').addEventListener('click', () => {
    selectedMood = "😊 Positive"
});
document.getElementById('neutral').addEventListener('click', () => {
    selectedMood = "😐 Neutral"
});
document.getElementById('negative').addEventListener('click', () => {
    selectedMood = "😢 Negative"
});

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMood = btn.textContent;
    });
});

revealBtn.addEventListener('click', () => {
    if (textEntry.value.trim() === '') {
        alert("Please write something first!");
        return;
    }
    const container = document.querySelector('.container');
    
    if (container.style.display === 'block') {
        container.style.display = 'none';
        revealBtn.textContent = 'Add a Doodle';
    } else {
        container.style.display = 'block';
        revealBtn.textContent = 'Close Doodle';
    }
});

document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0){
        const prevState = undoStack.pop();
        ctx.putImageData(prevState, 0, 0);
    }
});

// Journal Doodle
function draw(e) {
    if (!isPainting) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

function startDrawing(x, y) {
    isPainting = true;
    const rect = canvas.getBoundingClientRect();
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 20) undoStack.shift();
}

function drawTouch(x, y) {
    if (!isPainting) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

function endDrawing() {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
}

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
});

toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;

    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 20) undoStack.shift();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x,y);
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

//touchscreen nerds haha
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    drawTouch(touch.clientX, touch.clientY);
}, {passive: false});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    endDrawing();
});
