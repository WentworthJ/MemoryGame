const gameBoard = document.getElementById('game');
const movesDisplay = document.getElementById('moves');
const messageDisplay = document.getElementById('message');


//const symbols = ['I', 'k', 'I', 'k'];
const baseSymbols = ['J', 'A', 'S', 'O', 'N', 'W', 'H', 'Y'];

const symbols = shuffle([...baseSymbols, ...baseSymbols]);


let revealedCards = []; // Track flipped cards
let matchedPairs = 0;
let moves = 0;

symbols.forEach(symbol => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.textContent = ''; // Start hidden
  card.dataset.symbol = symbol;

  gameBoard.appendChild(card); //  one place in your code where you manipulated the DOM with Javascript

  // make cards clikable

  card.addEventListener('click', () => { //one place in your code where you either added listening to an event or you handled an event.
    // Ignore if already flipped or two cards are revealed
    if (card.classList.contains('flipped') || revealedCards.length === 2) return;

    // reveal card
    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
    revealedCards.push(card);

    // check for card match
    if (revealedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;

      const [first, second] = revealedCards; // point out one place in your code where you used an ES6 feature.
      const isMatch = first.dataset.symbol === second.dataset.symbol;

      if (isMatch) {
        matchedPairs++;
        // Leave them flipped
        revealedCards = [];

        //check for win
        if (matchedPairs === symbols.length / 2) {
            messageDisplay.textContent = `You Win! Total Moves: ${moves}`;
          }
      } else {
        // delay and flip hidden again
        setTimeout(() => {
          first.textContent = '';
          second.textContent = '';
          first.classList.remove('flipped');
          second.classList.remove('flipped');
          revealedCards = [];
        }, 1000);
      }
    }
  });
});

//Functional programming concept 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
