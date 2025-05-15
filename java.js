const gameBoard = document.getElementById('game');
const movesDisplay = document.getElementById('moves');
const messageDisplay = document.getElementById('message');

const baseSymbols = ['J', 'A', 'S', 'O', 'N', 'W', 'H', 'Y'];

let revealedCards = [];
let matchedPairs = 0;
let moves = 0;
let symbols = [];

document.addEventListener('DOMContentLoaded', () => {
  initGlobalMoves();
  const saved = localStorage.getItem('memoryGameState');

  if (saved) {
    const state = JSON.parse(saved);
    symbols = state.symbols;
    moves = state.moves;
    matchedPairs = state.matchedPairs;
    buildBoard(symbols);

    state.matchedIndices.forEach(index => {
      const card = gameBoard.children[index];
      card.textContent = card.dataset.symbol;
      card.classList.add('flipped');
    });

    revealedCards = state.revealedIndices.map(index => {
      const card = gameBoard.children[index];
      card.textContent = card.dataset.symbol;
      card.classList.add('flipped');
      return card;
    });

    updateMovesDisplay();
  } else {
    symbols = shuffle([...baseSymbols, ...baseSymbols]);
    buildBoard(symbols);
  }
});

function buildBoard(symbols) {
  gameBoard.innerHTML = '';
  symbols.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = '';
    card.dataset.symbol = symbol;

    card.addEventListener('click', () => {
      if (card.classList.contains('flipped') || revealedCards.length === 2) return;

      card.textContent = card.dataset.symbol;
      card.classList.add('flipped');
      revealedCards.push(card);

      if (revealedCards.length === 2) {
        moves++;
        incrementGlobalMoves(); // <-- Update global moves
        updateMovesDisplay();
        const [first, second] = revealedCards;
        const isMatch = first.dataset.symbol === second.dataset.symbol;

        if (isMatch) {
          matchedPairs++;
          revealedCards = [];

          if (matchedPairs === symbols.length / 2) {
            messageDisplay.textContent = `You Win! Total Moves: ${moves}`;
            localStorage.removeItem('memoryGameState');
          }
        } else {
          setTimeout(() => {
            first.textContent = '';
            second.textContent = '';
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            revealedCards = [];
            saveGameState();
          }, 1000);
        }
      }

      saveGameState();
    });

    gameBoard.appendChild(card);
  });
}

function updateMovesDisplay() {
  movesDisplay.textContent = `Moves: ${moves} | Total Moves (All Tabs): ${getGlobalMoves()}`;
}

function saveGameState() {
  const revealedIndices = revealedCards.map(card => Array.from(gameBoard.children).indexOf(card));
  const matchedIndices = Array.from(gameBoard.children)
    .map((card, index) => card.classList.contains('flipped') ? index : null)
    .filter(index => index !== null);

  const state = {
    symbols,
    revealedIndices,
    matchedIndices,
    moves,
    matchedPairs
  };

  localStorage.setItem('memoryGameState', JSON.stringify(state));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// GLOBAL MOVES FUNCTIONS
function initGlobalMoves() {
  if (!localStorage.getItem('globalMoves')) {
    localStorage.setItem('globalMoves', '0');
  }
}

function getGlobalMoves() {
  return parseInt(localStorage.getItem('globalMoves')) || 0;
}

function incrementGlobalMoves() {
  const current = getGlobalMoves() + 1;
  localStorage.setItem('globalMoves', current);
}

// Listen for changes in other tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'globalMoves') {
    updateMovesDisplay();
  }
});
  //

// clear data (for testing)
//if (matchedPairs === symbols.length / 2) {
 // messageDisplay.textContent = `You Win! Total Moves: ${moves}`;
  //localStorage.removeItem('memoryGameState');
//}