// Advanced Blackjack Game Implementation with Multiple Hands
let gameState = {
    playerBalance: 1000,
    deck: [],
    dealerHand: { cards: [], value: 0, isBust: false },
    playerHands: [], // Array of Hand objects
    activeHandIndex: 0, // Tracks which hand is currently being played
    currentStatus: 'betting', // 'betting', 'player-turn', 'dealer-turn', 'end-round'
    bets: [], // Array to store the bet for each player hand
    wins: 0,
    suits: ['♠', '♥', '♦', '♣'],
    ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
};

// A Hand object
function createHand() {
    return {
        cards: [],
        value: 0,
        isBlackjack: false,
        isBust: false,
        isFinished: false // Flag to know when a hand's turn is over
    };
}

function createDeck() {
    gameState.deck = [];
    for (let suit of gameState.suits) {
        for (let rank of gameState.ranks) {
            gameState.deck.push({ 
                suit, 
                rank, 
                value: getCardValue(rank) 
            });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function getCardValue(rank) {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
}

function dealCard() {
    if (gameState.deck.length === 0) {
        createDeck();
    }
    return gameState.deck.pop();
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand.cards) {
        value += card.value;
        if (card.rank === 'A') aces++;
    }
    
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    hand.value = value;
    hand.isBust = value > 21;
    hand.isBlackjack = value === 21 && hand.cards.length === 2;
    
    return value;
}

// UI Helper Functions
function createCardElement(card, isHidden = false) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card-deck card-deal ${isHidden ? 'card-back' : ''}`;
    
    if (isHidden) {
        cardDiv.innerHTML = '🂠';
    } else {
        const isRed = ['♥', '♦'].includes(card.suit);
        cardDiv.className += isRed ? ' card-red' : ' card-black';
        
        // Create rank element
        const rankDiv = document.createElement('div');
        rankDiv.className = 'card-rank';
        rankDiv.textContent = card.rank;
        
        // Create suit element
        const suitDiv = document.createElement('div');
        suitDiv.className = 'card-suit';
        suitDiv.textContent = card.suit;
        
        // Clear and append elements
        cardDiv.innerHTML = '';
        cardDiv.appendChild(rankDiv);
        cardDiv.appendChild(suitDiv);
    }
    
    return cardDiv;
}

function updateDisplay() {
    // Update balance and stats
    document.getElementById('balance').textContent = gameState.playerBalance;
    document.getElementById('current-bet').textContent = gameState.bets.reduce((sum, bet) => sum + bet, 0);
    document.getElementById('wins').textContent = gameState.wins;

    // Update dealer cards
    const dealerCardsDiv = document.getElementById('dealer-cards');
    dealerCardsDiv.innerHTML = '';
    gameState.dealerHand.cards.forEach((card, index) => {
        const isHidden = index === 1 && gameState.currentStatus === 'player-turn';
        dealerCardsDiv.appendChild(createCardElement(card, isHidden));
    });

    // Update player hands
    const playerHandsContainer = document.getElementById('player-hands-container');
    playerHandsContainer.innerHTML = '';
    
    gameState.playerHands.forEach((hand, handIndex) => {
        const handDiv = document.createElement('div');
        handDiv.className = `hand-container mb-4 ${handIndex === gameState.activeHandIndex ? 'hand-active' : ''}`;
        
        const handHeader = document.createElement('div');
        handHeader.className = 'flex justify-between items-center mb-2';
        handHeader.innerHTML = `
            <span class="font-semibold">Hand ${handIndex + 1} (${hand.value})</span>
            <span class="bg-turquoise text-white px-2 py-1 rounded text-sm">$${gameState.bets[handIndex] || 0}</span>
        `;
        
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'flex space-x-2';
        hand.cards.forEach(card => {
            cardsDiv.appendChild(createCardElement(card));
        });
        
        handDiv.appendChild(handHeader);
        handDiv.appendChild(cardsDiv);
        playerHandsContainer.appendChild(handDiv);
    });

    // Update dealer value display
    const dealerValue = gameState.currentStatus !== 'player-turn' ? `(${gameState.dealerHand.value})` : '';
    document.getElementById('dealer-value').textContent = dealerValue;
}

function showMessage(message) {
    const messageDiv = document.getElementById('game-message');
    messageDiv.innerHTML = message;
    messageDiv.className = 'text-xl font-semibold text-center p-4 rounded-lg bg-gray-100';
}

function showGameControls() {
    document.getElementById('betting-controls').classList.add('hidden');
    document.getElementById('game-controls').classList.remove('hidden');
}

function showBettingControls() {
    document.getElementById('betting-controls').classList.remove('hidden');
    document.getElementById('game-controls').classList.add('hidden');
}

function placeBet(amount) {
    if (gameState.playerBalance >= amount && gameState.currentStatus === 'betting') {
        gameState.bets = [amount]; // Reset to single bet
        gameState.playerBalance -= amount;
        updateDisplay();
        showMessage(`Bet placed: $${amount}`);
    } else {
        showMessage('Insufficient funds or invalid bet!');
    }
}

function startGame() {
    if (gameState.bets.length === 0) {
        showMessage('Please place a bet first!');
        return;
    }

    // Reset game state
    createDeck();
    gameState.dealerHand = { cards: [], value: 0, isBust: false };
    gameState.playerHands = [createHand()];
    gameState.activeHandIndex = 0;
    gameState.currentStatus = 'player-turn';

    // Deal initial cards
    gameState.playerHands[0].cards.push(dealCard());
    gameState.dealerHand.cards.push(dealCard());
    gameState.playerHands[0].cards.push(dealCard());
    gameState.dealerHand.cards.push(dealCard());

    // Calculate initial values
    calculateHandValue(gameState.playerHands[0]);
    calculateHandValue(gameState.dealerHand);

    updateDisplay();
    showGameControls();
    updatePlayerOptions();

    // Check for blackjack
    if (gameState.playerHands[0].isBlackjack) {
        handleStand();
    }
}

function updatePlayerOptions() {
    const currentHand = gameState.playerHands[gameState.activeHandIndex];
    const currentBet = gameState.bets[gameState.activeHandIndex];

    // Standard options
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;

    // Condition for Double Down:
    // 1. It's the first move for this hand (2 cards).
    // 2. Player has enough money to double the bet.
    const canDoubleDown = currentHand.cards.length === 2 && 
                         gameState.playerBalance >= currentBet;
    document.getElementById('doubledown-button').disabled = !canDoubleDown;

    // Condition for Split:
    // 1. It's the first move for this hand (2 cards).
    // 2. Both cards have the same rank (e.g., two '8's or a 'K' and a 'Q').
    // 3. Player has enough money for a second bet.
    const canSplit = currentHand.cards.length === 2 &&
                    currentHand.cards[0].rank === currentHand.cards[1].rank &&
                    gameState.playerBalance >= currentBet;
    document.getElementById('split-button').disabled = !canSplit;
}

function handleHit() {
    if (gameState.currentStatus !== 'player-turn') return;

    const currentHand = gameState.playerHands[gameState.activeHandIndex];
    const newCard = dealCard();
    currentHand.cards.push(newCard);
    
    calculateHandValue(currentHand);
    updateDisplay();

    if (currentHand.isBust) {
        showMessage(`Hand ${gameState.activeHandIndex + 1} busted!`);
        handleStand();
    } else if (currentHand.value === 21) {
        handleStand();
    } else {
        updatePlayerOptions();
    }
}

function handleStand() {
    // Mark the current hand as finished
    gameState.playerHands[gameState.activeHandIndex].isFinished = true;

    // Check if there is another hand to play
    if (gameState.activeHandIndex < gameState.playerHands.length - 1) {
        // Move to the next hand
        gameState.activeHandIndex++;
        showMessage(`Playing hand ${gameState.activeHandIndex + 1}`);
        updateDisplay();
        updatePlayerOptions();
    } else {
        // All player hands are finished, start the dealer's turn
        startDealerTurn();
    }
}

function handleDoubleDown() {
    const bet = gameState.bets[gameState.activeHandIndex];

    // 1. Update balance and bet
    gameState.playerBalance -= bet;
    gameState.bets[gameState.activeHandIndex] += bet;

    // 2. Deal one more card
    const currentHand = gameState.playerHands[gameState.activeHandIndex];
    const newCard = dealCard();
    currentHand.cards.push(newCard);
    calculateHandValue(currentHand);

    // 3. Mark the hand as finished and stand
    currentHand.isFinished = true;
    updateDisplay();
    
    if (currentHand.isBust) {
        showMessage(`Hand ${gameState.activeHandIndex + 1} busted on double down!`);
    }
    
    handleStand();
}

function handleSplit() {
    const handToSplit = gameState.playerHands[gameState.activeHandIndex];
    const originalBet = gameState.bets[gameState.activeHandIndex];

    // 1. Update balance with the new bet
    gameState.playerBalance -= originalBet;

    // 2. Create the new hand
    const newHand = createHand();
    newHand.cards.push(handToSplit.cards.pop()); // Move one card to the new hand

    // 3. Add the new hand and its bet to our game state
    gameState.playerHands.push(newHand);
    gameState.bets.push(originalBet);

    // 4. Deal one new card to EACH hand
    handToSplit.cards.push(dealCard());
    newHand.cards.push(dealCard());

    // 5. Recalculate values for both hands
    calculateHandValue(handToSplit);
    calculateHandValue(newHand);

    updateDisplay();
    updatePlayerOptions();
    showMessage(`Hand split! Playing hand ${gameState.activeHandIndex + 1}`);
}

function startDealerTurn() {
    gameState.currentStatus = 'dealer-turn';
    showMessage('Dealer\'s turn...');
    
    // Hide game controls
    document.getElementById('game-controls').classList.add('hidden');
    
    // Dealer hits until 17 or higher
    setTimeout(() => {
        while (gameState.dealerHand.value < 17) {
            const newCard = dealCard();
            gameState.dealerHand.cards.push(newCard);
            calculateHandValue(gameState.dealerHand);
        }
        
        gameState.currentStatus = 'end-round';
        updateDisplay();
        processPayouts();
    }, 1000);
}

function processPayouts() {
    const dealerHand = gameState.dealerHand;
    let totalWinnings = 0;
    let messages = [];

    gameState.playerHands.forEach((hand, index) => {
        const bet = gameState.bets[index];
        let outcomeMessage = '';

        if (hand.isBust) {
            outcomeMessage = `Hand ${index + 1} busted. You lose $${bet}.`;
            // No change to balance, as bet was already deducted.
        } else if (dealerHand.isBust || hand.value > dealerHand.value) {
            // Player wins
            const winnings = hand.isBlackjack ? bet * 1.5 : bet;
            gameState.playerBalance += bet + winnings; // Return original bet + winnings
            totalWinnings += winnings;
            outcomeMessage = `Hand ${index + 1} wins! You get $${winnings}.`;
            if (hand.isBlackjack) outcomeMessage += ' (Blackjack!)';
        } else if (hand.value < dealerHand.value) {
            // Dealer wins
            outcomeMessage = `Hand ${index + 1} loses to dealer. You lose $${bet}.`;
        } else {
            // Push (tie)
            gameState.playerBalance += bet; // Return original bet
            outcomeMessage = `Hand ${index + 1} is a push. Bet returned.`;
        }
        
        messages.push(outcomeMessage);
    });

    if (totalWinnings > 0) {
        gameState.wins++;
    }

    // Reset for next round
    gameState.currentStatus = 'betting';
    gameState.bets = [];
    
    updateDisplay();
    showBettingControls();
    showMessage(messages.join('<br>'));
}

function initializeBlackjack() {
    // Add event listeners for the new buttons
    document.getElementById('hit-button').addEventListener('click', handleHit);
    document.getElementById('stand-button').addEventListener('click', handleStand);
    document.getElementById('doubledown-button').addEventListener('click', handleDoubleDown);
    document.getElementById('split-button').addEventListener('click', handleSplit);
    
    updateDisplay();
}