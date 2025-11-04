
// helpers
function adjustBottomBar() {
	const canvas = document.getElementById('canvas');
	const bottom_bar = document.getElementById('bottom-bar');

	const canvasRect = canvas.getBoundingClientRect();
	bottom_bar.style.top = `${canvasRect.bottom + 30}px`


}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

// *****************************************

// createWord takes in a string and adds it to the canvas 
function createWord(word) {
    const canvas = document.getElementById('words');
    const new_word = document.createElement('div');

	word = word.slice(1, word.length - 1);

    new_word.textContent = word;
    new_word.className = "word";

    canvas.appendChild(new_word);
	new_word.style.width = `${new_word.offsetWidth + 10}px`;

    interact(new_word).draggable({
        // inertia: true, // Enable inertial throwing
        autoScroll: true, // Enable autoScroll
        onmove: dragMoveListener, // Call this function on every dragmove event
    });
}

// Drag move listener function
function dragMoveListener(event) {
    const target = event.target;

    // Update the position based on drag
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Apply translation
    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Daily words functionality
async function loadDailyWords() {
    try {
        const response = await fetch('/api/daily-words');
        const data = await response.json();
        
        if (data.success) {
            // Clear existing words
            const wordsContainer = document.getElementById('words');
            wordsContainer.innerHTML = '';
            
            // Update header with theme
            document.getElementById('header_title').textContent = `Today's Theme: ${data.theme}`;
            
            // Add the daily words to the canvas
            data.words.forEach(word => {
                createWord(`"${word}"`);
            });
            
            console.log(`Loaded ${data.words.length} daily words for theme: ${data.theme}`);
        } else {
            console.error('Failed to load daily words:', data.error);
            alert('Failed to generate daily words. Please try again.');
        }
    } catch (error) {
        console.error('Error loading daily words:', error);
        alert('Error connecting to word generator. Please check your connection.');
    }
}

// Event listener for daily words button
document.getElementById('daily-words-btn').addEventListener('click', loadDailyWords);

adjustBottomBar();
window.addEventListener('resize', adjustBottomBar);


fetch('./words/words.csv') 
	.then(response => response.text())
	.then(text => {
		const rows = text.split('\n');
		console.log(rows);

		for (i = 0; i < 20; ++i) {
			getRndInteger(1, 466550);
			createWord(rows[i]);

		}
	})

	