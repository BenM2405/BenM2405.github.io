// Global Variables
let countries = [];
let currentCountry = null;
let hints = [];
let hintIndex = 0;
let guessCount = 0;

const populationIcons = {
    'under 1M': 'img/pop_small.svg',
    '1M - 10M': 'img/pop_medium.svg',
    'over 10M': 'img/pop_large.svg',
    'over 50M': 'img/pop_largest.svg',
};

// Elements in HTML
const hintArea = document.getElementById('current-hint');
// const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-guess');
const feedback = document.getElementById('feedback');
const scoreboard = document.getElementById('scoreboard');
const startGameButton = document.getElementById('start-game');
// const suggestionsBox = document.getElementById('suggestions');
const ghostInput = document.getElementById('ghost-input');

const guessInput = document.getElementById('guess-input');
const ghostText = document.getElementById('ghost-text');
const suggestionsBox = document.getElementById('suggestions');


// Welcome Screen Check
async function initGame() {
    await fetchCountries();
    pickCountry();
    generateHints();
    
    submitButton.disabled = true;
    submitButton.style.display = 'none';
    guessInput.disabled = true;
    guessInput.style.display = 'none';

    const today = new Date().toISOString().split("T")[0];
    const saved = JSON.parse(localStorage.getItem('WorldGameState'));
    const alreadyPlayed = localStorage.getItem('lastPlayed') === today;

    if (saved?.guesses?.length > 0) {
        updateGuessHistory(saved.guesses);
    }
    if (saved?.date === today) {
        hintIndex = saved.hintIndex || 0;
        guessCount = saved.guesses?.length || 0;

        // Re-add previous hints
        for (let i = 0; i < hintIndex; i++) {
            addHint(i);
        }

        updateScoreboard();

        if (saved.solved || guessCount >= 5 || alreadyPlayed) {
            feedback.textContent = `You've already played today's puzzle! The answer was: ${currentCountry.name.common}`;
            guessInput.disabled = true;
            submitButton.disabled = true;
            startGameButton.disabled = true;
            startGameButton.style.display = 'none';
        } else {
            // Still mid-game
            startGameButton.disabled = true;
            startGameButton.style.display = 'none';
            guessInput.disabled = false;
            guessInput.style.display = 'inline-block';
            submitButton.disabled = false;
            submitButton.style.display = 'inline-block';

            feedback.textContent = `Welcome back! You’ve made ${guessCount} guess${guessCount !== 1 ? 'es' : ''} so far.`;
        }

        return;
    }

    // Show the start prompt
    const startMsg = document.createElement('p');
    startMsg.textContent = 'Press "Start New Game" to begin!';
    startMsg.id = 'start-msg';
    document.getElementById('hint-area').appendChild(startMsg);
}

window.addEventListener('DOMContentLoaded', initGame);

// Game Functions
async function fetchCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    countries = data.filter(c => c.independent); // save it
}

function dailySeed(){
    const now = new Date();
    
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const seed = year * 66536 + month * 256 + day;
    const index = seed % countries.length;
    return index;
}

function pickCountry() {
    currentCountry = countries[dailySeed()];
}

function generateHints() {
    hints = [];

    hints.push(`Continent: ${currentCountry.region}`);

    if (currentCountry.capital && currentCountry.capital.length > 0) {
        hints.push(`Capital starts with: ${currentCountry.capital[0][0]}`);
    } else {
        hints.push("Capital Unknown!");
    }

    const pop = currentCountry.population || 0;
    if (pop < 1_000_000) {
        hints.push("Population: under 1M");
    } else if (pop < 10_000_000) {
        hints.push("Population: 1M - 10M");
    } else if (pop < 50_000_000) {
        hints.push("Population: over 10M");
    } else {
        hints.push("Population: over 50M");
    }

    const currencyObj = currentCountry.currencies;
    if (currencyObj) {
        const firstCode = Object.keys(currencyObj)[0];
        const currencyName = currencyObj[firstCode].name;
        const lastWord = currencyName.split(' ').slice(-1)[0];
        hints.push(`Currency: ${lastWord}`);
    } else {
        hints.push('Currency: Unknown')
    }

    const nameSake = currentCountry.demonyms?.eng?.m;
    if (nameSake) {
        const nameSlice = nameSake.slice(-3);
        hints.push(`Demonym Suffix: ${nameSlice}`);
    } else {
        hints.push('Demonym Suffix: Unknown')
    }
    
}

//Auto Fill
guessInput.addEventListener('input', function(event) {
    const currentInput = event.target.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    const matches = countries
        .map(c => c.name.common)
        .filter(name => name.toLowerCase().startsWith(currentInput));

    // Set ghost preview
    ghostText.textContent = matches.length > 0 ? matches[0] : '';

    // Clear if nothing typed
    if (currentInput === '') {
        suggestionsBox.style.display = 'none';
        ghostText.textContent = '';
        return;
    }

    matches.forEach(name => {
        const suggestion = document.createElement('div');
        suggestion.textContent = name;
        suggestion.classList.add('suggestion-item');

        suggestion.addEventListener('click', () => {
            guessInput.value = name;
            ghostText.textContent = '';
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
        });

        suggestionsBox.appendChild(suggestion);
    });

    suggestionsBox.style.display = matches.length > 0 ? 'block' : 'none';
});

async function startGame() {
    guessInput.disabled = false;
    guessInput.style.display = 'inline-block';
    submitButton.disabled = false;
    submitButton.style.display = 'inline-block';
    startGameButton.disabled = true;
    startGameButton.style.display = 'none';
    
    await fetchCountries();
    pickCountry();
    generateHints();

    const startMsg = document.getElementById('start-msg');
    if (startMsg) {
        startMsg.remove();
    }

    hintIndex = 0;
    guessCount = 0;

    // only add first hint if there's no saved state
    const saved = JSON.parse(localStorage.getItem("WorldGameState"));
    if (!saved || saved.date !== new Date().toISOString().split("T")[0]) {
        addHint(hintIndex);
        hintIndex++;
    }
    updateScoreboard();
    feedback.textContent = '';
    guessInput.value = '';
}

function addHint(index = hintIndex) {
    if (index < hints.length) {
        const hintText = hints[index];
        const hintCard = document.createElement('div');
        hintCard.classList.add('hint-card');

        const icon = document.createElement('img');
        icon.classList.add('continent-icon');

        if (hintText.startsWith('Continent: ')) {
            const continent = hintText.split(': ')[1].toLowerCase().replaceAll(' ', '_');
            icon.src = `img/${continent}.svg`;
            icon.alt = continent;
        } else if (hintText.startsWith('Population: ')) {
            const range = hintText.split(': ')[1];
            icon.src = populationIcons[range] || 'img/question.svg';
            icon.alt = range;
        } else if (hintText.startsWith('Currency: ')) {
            const money = hintText.split(': ')[1]
            icon.src = `img/currency.svg`
            icon.alt = 'money';
        } else {
            icon.src = 'img/question.svg';
            icon.alt = 'hint';
        }

        const hintContent = document.createElement('p');
        hintContent.textContent = hintText;

        hintCard.appendChild(icon);
        hintCard.appendChild(hintContent);
        document.getElementById('hint-area').appendChild(hintCard);
    } else {
        const noMoreCard = document.createElement('div');
        noMoreCard.classList.add('hint-card');
        noMoreCard.textContent = "No more hints!";
        document.getElementById('hint-area').appendChild(noMoreCard);
    }
}



function updateScoreboard() {
    scoreboard.textContent = `Guesses: ${guessCount} | Hints used: ${hintIndex}`;
}

function handleGuess() {
    const guess = guessInput.value.trim().toLowerCase();
    const answer = currentCountry.name.common.toLowerCase();

    guessCount++;
    updateScoreboard();

    if (guess === answer) {
        feedback.textContent = "Correct! It was " + currentCountry.name.common + "!";
        feedback.style.color = 'green';
        guessInput.disabled = true;
        submitButton.disabled = true;
        startGameButton.disabled = true;

        localStorage.setItem('lastPlayed', new Date().toISOString().split("T")[0]);

        // Save win state
        localStorage.setItem('WorldGameState', JSON.stringify({
            date: new Date().toISOString().split("T")[0],
            guesses: [...(JSON.parse(localStorage.getItem("WorldGameState"))?.guesses || []), guess],
            hintIndex: hintIndex,
            solved: true
        }));

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else if (guessCount < 5) {
        feedback.textContent = "Incorrect! Try again!";
        feedback.style.color = 'red';
        addHint(hintIndex);
        hintIndex++;

        const prevState = JSON.parse(localStorage.getItem("WorldGameState")) || {};
        const newGuesses = [...(prevState.guesses || []), guess];
        const gameState = {
            date: new Date().toISOString().split("T")[0],
            guesses: [...(prevState.guesses || []), guess],
            hintIndex: hintIndex,
            solved: false
        };

        localStorage.setItem('WorldGameState', JSON.stringify(gameState));
        updateGuessHistory(newGuesses);

    } else {
        feedback.textContent = "😢 Out of guesses! The answer was " + currentCountry.name.common + ".";
        feedback.style.color = 'red';
        guessInput.disabled = true;
        submitButton.disabled = true;
        startGameButton.disabled = true;

        localStorage.setItem('lastPlayed', new Date().toISOString().split("T")[0]);

        // Save final state
        const prevState = JSON.parse(localStorage.getItem("WorldGameState")) || {};
        const gameState = {
            date: new Date().toISOString().split("T")[0],
            guesses: [...(prevState.guesses || []), guess],
            hintIndex: hintIndex,
            solved: false
        };
        localStorage.setItem('WorldGameState', JSON.stringify(gameState));
    }
    guessInput.value = '';
    ghostInput.value = '';
    console.log("handleGuess called");
}

function updateGuessHistory(guesses) {
    const guessHistoryBox = document.getElementById('guess-history');
    guessHistoryBox.innerHTML = '<strong>Past Guesses:</strong><br>' + guesses.map(g => `• ${g}`).join('<br>');
}


// Event Listeners
submitButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (ghostText.textContent) {
            guessInput.value = ghostText.textContent;
            ghostText.textContent = '';
            suggestionsBox.innerHTML = '';
        }
        handleGuess();
    }
});

document.addEventListener('click', function(event) {
    const isClickInside = guessInput.contains(event.target) || suggestionsBox.contains(event.target);
    if (!isClickInside) {
        suggestionsBox.style.display = 'none';
    }
});
startGameButton.addEventListener('click', startGame);

