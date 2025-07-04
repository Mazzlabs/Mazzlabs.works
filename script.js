// Portfolio JavaScript - ES6
class Portfolio {
    constructor() {
        this.initializeEventListeners();
        this.initializeScrollEffects();
        this.initializeContactForm();
        this.games = {
            blackjack: new BlackjackGame(),
            roshambo: new RoshamboGame()
        };
    }

    initializeEventListeners() {
        // Resume download buttons
        const downloadBtns = document.querySelectorAll('.download-resume-btn, .footer-resume-btn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', () => this.downloadResume());
        });

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Modal close functionality
        const modal = document.getElementById('gameModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeGame();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGame();
            }
        });
    }

    initializeScrollEffects() {
        // Add scroll event listener for header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(44, 44, 44, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, var(--granite-dark) 0%, var(--granite-medium) 100%)';
                header.style.backdropFilter = 'none';
            }
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.project-card, .game-card, .skill-category');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e);
            });
        }
    }

    async handleContactSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: 'var(--success-green)',
            error: 'var(--danger-red)',
            info: 'var(--turquoise-medium)'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    downloadResume() {
        // Create a temporary link to download the resume
        const link = document.createElement('a');
        link.href = '/download-resume';
        link.download = 'Joseph_Mazzini_Resume.pdf';
        link.click();
    }

    openGame(gameType) {
        const modal = document.getElementById('gameModal');
        const gameTitle = document.getElementById('gameTitle');
        const gameContainer = document.getElementById('gameContainer');

        // Set game title
        const titles = {
            blackjack: 'Blackjack',
            roshambo: 'Adaptive Rock-Paper-Scissors'
        };
        gameTitle.textContent = titles[gameType];

        // Initialize game
        if (this.games[gameType]) {
            gameContainer.innerHTML = '';
            this.games[gameType].initialize(gameContainer);
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGame() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Advanced Blackjack Game Class
class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHands = [[]]; // Array of hands to support splitting
        this.dealerHand = [];
        this.balance = 1000;
        this.bets = [0]; // Array of bets for each hand
        this.gameState = 'betting'; // betting, playing, dealer, finished
        this.currentHandIndex = 0;
        this.canSplit = false;
        this.canDoubleDown = false;
        this.handResults = [];
        this.container = null;
    }

    initialize(container) {
        this.container = container;
        this.createGameHTML();
        this.attachEventListeners();
        this.resetGame();
    }

    createGameHTML() {
        this.container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🃏 Advanced Blackjack</h3>
                    <div class="balance">Balance: $<span id="balance">${this.balance}</span></div>
                </div>
                <div class="game-output" id="gameOutput">
                    <div class="dealer-section">
                        <h4>🎴 Dealer's Hand</h4>
                        <div id="dealerHand" class="hand-display"></div>
                        <div id="dealerValue" class="hand-value"></div>
                    </div>
                    <div class="player-section">
                        <h4>🎯 Your Hand(s)</h4>
                        <div id="playerHands" class="hands-container"></div>
                    </div>
                    <div id="gameMessage" class="game-message">
                        Welcome to Advanced Blackjack!<br>
                        Features: Split pairs, Double down, Insurance<br>
                        Place your bet to start playing!
                    </div>
                </div>
                <div class="betting-controls" id="bettingControls">
                    <div class="bet-display">Current Bet: $<span id="currentBet">0</span></div>
                    <div class="bet-buttons">
                        <button id="doubleBet" class="bet-btn">×2</button>
                        <button id="halveBet" class="bet-btn">÷2</button>
                        <button id="maxBet" class="bet-btn">Max</button>
                        <button id="minBet" class="bet-btn">Min</button>
                    </div>
                    <button id="placeBet" class="game-btn primary">Deal Cards</button>
                </div>
                <div class="game-controls" id="gameControls" style="display: none;">
                    <button id="hit" class="game-btn">Hit</button>
                    <button id="stand" class="game-btn">Stand</button>
                    <button id="split" class="game-btn" disabled>Split</button>
                    <button id="doubleDown" class="game-btn" disabled>Double Down</button>
                    <button id="newGame" class="game-btn secondary">New Game</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Betting controls
        document.getElementById('doubleBet').addEventListener('click', () => this.adjustBet('double'));
        document.getElementById('halveBet').addEventListener('click', () => this.adjustBet('halve'));
        document.getElementById('maxBet').addEventListener('click', () => this.adjustBet('max'));
        document.getElementById('minBet').addEventListener('click', () => this.adjustBet('min'));
        document.getElementById('placeBet').addEventListener('click', () => this.placeBet());
        
        // Game controls
        document.getElementById('hit').addEventListener('click', () => this.hit());
        document.getElementById('stand').addEventListener('click', () => this.stand());
        document.getElementById('split').addEventListener('click', () => this.split());
        document.getElementById('doubleDown').addEventListener('click', () => this.doubleDown());
        document.getElementById('newGame').addEventListener('click', () => this.resetGame());
    }

    adjustBet(action) {
        const currentBet = this.bets[0] || 10;
        let newBet = currentBet;
        
        switch(action) {
            case 'double':
                newBet = Math.min(currentBet * 2, this.balance);
                break;
            case 'halve':
                newBet = Math.max(Math.floor(currentBet / 2), 10);
                break;
            case 'max':
                newBet = this.balance;
                break;
            case 'min':
                newBet = 10;
                break;
        }
        
        this.bets[0] = newBet;
        document.getElementById('currentBet').textContent = newBet;
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];
        
        // Create multiple decks for more realistic casino experience
        for (let deckCount = 0; deckCount < 6; deckCount++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    this.deck.push({ suit, rank });
                }
            }
        }
        
        // Shuffle deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.rank)) return 10;
        if (card.rank === 'A') return 11;
        return parseInt(card.rank);
    }

    getHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (const card of hand) {
            value += this.getCardValue(card);
            if (card.rank === 'A') aces++;
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }

    displayCard(card, hidden = false) {
        if (hidden) {
            return '<div class="card card-back">🂠</div>';
        }
        
        const isRed = ['♥', '♦'].includes(card.suit);
        const colorClass = isRed ? 'red' : 'black';
        
        return `<div class="card ${colorClass}">
                    <span class="card-rank">${card.rank}</span>
                    <span class="card-suit">${card.suit}</span>
                </div>`;
    }

    displayHand(hand, hideFirst = false) {
        return hand.map((card, index) => {
            if (hideFirst && index === 0) return this.displayCard(card, true);
            return this.displayCard(card);
        }).join('');
    }

    updateDisplay() {
        // Update balance
        document.getElementById('balance').textContent = this.balance;
        
        // Update dealer hand
        const dealerHand = document.getElementById('dealerHand');
        const dealerValue = document.getElementById('dealerValue');
        
        dealerHand.innerHTML = this.displayHand(this.dealerHand, this.gameState === 'playing');
        
        if (this.gameState !== 'playing') {
            dealerValue.textContent = `Value: ${this.getHandValue(this.dealerHand)}`;
        } else {
            dealerValue.textContent = 'Value: ?';
        }
        
        // Update player hands
        const playerHandsContainer = document.getElementById('playerHands');
        playerHandsContainer.innerHTML = '';
        
        this.playerHands.forEach((hand, index) => {
            const handDiv = document.createElement('div');
            handDiv.className = `player-hand ${index === this.currentHandIndex ? 'active' : ''}`;
            handDiv.innerHTML = `
                <div class="hand-header">
                    <span>Hand ${index + 1}</span>
                    <span class="bet-amount">Bet: $${this.bets[index] || 0}</span>
                </div>
                <div class="hand-cards">${this.displayHand(hand)}</div>
                <div class="hand-value">Value: ${this.getHandValue(hand)}</div>
                ${this.handResults[index] ? `<div class="hand-result">${this.handResults[index]}</div>` : ''}
            `;
            playerHandsContainer.appendChild(handDiv);
        });
        
        this.updateGameControls();
    }

    updateGameControls() {
        const bettingControls = document.getElementById('bettingControls');
        const gameControls = document.getElementById('gameControls');
        
        if (this.gameState === 'betting') {
            bettingControls.style.display = 'block';
            gameControls.style.display = 'none';
        } else {
            bettingControls.style.display = 'none';
            gameControls.style.display = 'block';
        }
        
        // Update game control buttons
        if (this.gameState === 'playing') {
            const currentHand = this.playerHands[this.currentHandIndex];
            const handValue = this.getHandValue(currentHand);
            
            // Can split if first two cards have same rank and player has enough money for additional bet
            this.canSplit = currentHand.length === 2 && 
                           this.getCardValue(currentHand[0]) === this.getCardValue(currentHand[1]) &&
                           this.balance >= this.bets[this.currentHandIndex] &&
                           this.playerHands.length < 4; // Max 4 hands
            
            // Can double down if first two cards and player has enough money for additional bet
            this.canDoubleDown = currentHand.length === 2 && 
                               this.balance >= this.bets[this.currentHandIndex];
            
            document.getElementById('split').disabled = !this.canSplit;
            document.getElementById('doubleDown').disabled = !this.canDoubleDown;
            document.getElementById('hit').disabled = handValue > 21; // Only disable if busted
            document.getElementById('stand').disabled = false;
        } else {
            document.getElementById('split').disabled = true;
            document.getElementById('doubleDown').disabled = true;
            document.getElementById('hit').disabled = true;
            document.getElementById('stand').disabled = true;
        }
    }

    placeBet() {
        const bet = this.bets[0] || 10;
        console.log('Placing bet - Current balance:', this.balance, 'Bet amount:', bet);
        
        if (bet < 10 || bet > this.balance) {
            this.showMessage('Invalid bet amount!');
            return;
        }
        
        // Deduct the initial bet from balance
        this.balance -= bet;
        console.log('After placing bet - Balance:', this.balance);
        
        this.gameState = 'playing';
        this.createDeck();
        this.dealInitialCards();
        this.updateDisplay();
    }

    dealInitialCards() {
        // Deal two cards to player and dealer
        this.playerHands[0] = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        
        // Check for blackjack
        if (this.getHandValue(this.playerHands[0]) === 21) {
            this.stand(); // Auto-stand on blackjack
        }
    }

    hit() {
        if (this.gameState !== 'playing') return;
        
        const currentHand = this.playerHands[this.currentHandIndex];
        currentHand.push(this.deck.pop());
        
        const handValue = this.getHandValue(currentHand);
        
        // Only move to next hand if busted (over 21)
        if (handValue > 21) {
            this.nextHand();
        }
        // If exactly 21, player can still choose to stand
        
        this.updateDisplay();
    }

    stand() {
        if (this.gameState !== 'playing') return;
        this.nextHand();
    }

    split() {
        if (!this.canSplit) return;
        
        const currentHand = this.playerHands[this.currentHandIndex];
        const splitCard = currentHand.pop();
        const additionalBet = this.bets[this.currentHandIndex];
        
        // Check if player has enough balance for the additional bet
        if (this.balance < additionalBet) {
            this.showMessage('Insufficient balance to split!');
            return;
        }
        
        // Deduct additional bet from balance
        this.balance -= additionalBet;
        
        // Create new hand with the split card
        this.playerHands.push([splitCard]);
        this.bets.push(additionalBet);
        
        // Deal new cards to both hands
        currentHand.push(this.deck.pop());
        this.playerHands[this.playerHands.length - 1].push(this.deck.pop());
        
        this.updateDisplay();
    }

    doubleDown() {
        if (!this.canDoubleDown) {
            console.log('Cannot double down - canDoubleDown:', this.canDoubleDown);
            return;
        }
        
        const additionalBet = this.bets[this.currentHandIndex];
        console.log('Double down - Current balance:', this.balance, 'Additional bet:', additionalBet);
        
        // Check if player has enough balance for the additional bet
        if (this.balance < additionalBet) {
            this.showMessage('Insufficient balance to double down!');
            console.log('Insufficient balance for double down');
            return;
        }
        
        // Deduct additional bet from balance and double the bet
        this.balance -= additionalBet;
        this.bets[this.currentHandIndex] *= 2;
        console.log('After double down - Balance:', this.balance, 'New bet:', this.bets[this.currentHandIndex]);
        
        // Hit once and automatically stand
        this.hit();
        if (this.gameState === 'playing') {
            this.stand();
        }
    }

    nextHand() {
        this.currentHandIndex++;
        
        if (this.currentHandIndex >= this.playerHands.length) {
            // All hands played, now dealer plays
            this.gameState = 'dealer';
            this.dealerPlay();
        } else {
            // Move to next hand
            this.updateDisplay();
        }
    }

    dealerPlay() {
        const dealerValue = this.getHandValue(this.dealerHand);
        
        if (dealerValue < 17) {
            setTimeout(() => {
                this.dealerHand.push(this.deck.pop());
                this.updateDisplay();
                this.dealerPlay();
            }, 1000);
        } else {
            this.gameState = 'finished';
            this.calculateResults();
            this.updateDisplay();
        }
    }

    calculateResults() {
        const dealerValue = this.getHandValue(this.dealerHand);
        const dealerBusted = dealerValue > 21;
        const dealerBlackjack = dealerValue === 21 && this.dealerHand.length === 2;
        
        this.handResults = [];
        
        this.playerHands.forEach((hand, index) => {
            const playerValue = this.getHandValue(hand);
            const playerBusted = playerValue > 21;
            const playerBlackjack = playerValue === 21 && hand.length === 2;
            const bet = this.bets[index];
            
            let result = '';
            let winnings = 0;
            
            if (playerBusted) {
                result = '💥 BUST!';
                winnings = 0; // Already lost the bet
            } else if (dealerBusted) {
                result = '🎉 WIN! (Dealer Bust)';
                winnings = bet * 2; // Get bet back + winnings
            } else if (playerBlackjack && !dealerBlackjack) {
                result = '🎉 BLACKJACK!';
                winnings = bet + Math.floor(bet * 1.5); // Get bet back + 1.5x winnings
            } else if (dealerBlackjack && !playerBlackjack) {
                result = '😞 LOSE (Dealer Blackjack)';
                winnings = 0; // Already lost the bet
            } else if (playerValue > dealerValue) {
                result = '🎉 WIN!';
                winnings = bet * 2; // Get bet back + winnings
            } else if (dealerValue > playerValue) {
                result = '😞 LOSE';
                winnings = 0; // Already lost the bet
            } else {
                result = '🤝 PUSH';
                winnings = bet; // Get bet back
            }
            
            const netWinnings = winnings - bet; // Net gain/loss for display
            this.handResults.push(`${result} ${netWinnings > 0 ? '+' : netWinnings < 0 ? '' : ''}$${Math.abs(netWinnings)}`);
            this.balance += winnings;
        });
        
        this.showMessage(`Game Over! New Balance: $${this.balance}`);
    }

    resetGame() {
        this.gameState = 'betting';
        this.playerHands = [[]];
        this.dealerHand = [];
        this.bets = [10];
        this.currentHandIndex = 0;
        this.handResults = [];
        document.getElementById('currentBet').textContent = '10';
        this.updateDisplay();
        this.showMessage('Welcome to Advanced Blackjack!<br>Features: Split pairs, Double down<br>Place your bet to start playing!');
    }

    showMessage(message) {
        document.getElementById('gameMessage').innerHTML = message;
    }
}

// Rock-Paper-Scissors Game Class
class RoshamboGame {
    constructor() {
        this.playerHistory = [];
        this.scores = { player: 0, computer: 0, tie: 0 };
        this.historySize = 5;
        this.container = null;
    }

    initialize(container) {
        this.container = container;
        this.createGameHTML();
        this.attachEventListeners();
        this.updateDisplay();
    }

    createGameHTML() {
        this.container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🪨📄✂️ Adaptive Rock-Paper-Scissors</h3>
                    <div class="score">
                        Player: <span id="playerScore">0</span> | 
                        Computer: <span id="computerScore">0</span> | 
                        Ties: <span id="tieScore">0</span>
                    </div>
                </div>
                <div class="game-output" id="roshamboOutput">
                    Welcome to Adaptive Rock-Paper-Scissors!
                    
                    The computer learns from your choices and adapts its strategy.
                    Can you outsmart the AI?
                    
                    Choose your move below!
                </div>
                <div class="game-controls">
                    <button id="rock" class="game-btn">🪨 Rock</button>
                    <button id="paper" class="game-btn">📄 Paper</button>
                    <button id="scissors" class="game-btn">✂️ Scissors</button>
                    <button id="resetGame" class="game-btn">Reset Game</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.getElementById('rock').addEventListener('click', () => this.playRound('rock'));
        document.getElementById('paper').addEventListener('click', () => this.playRound('paper'));
        document.getElementById('scissors').addEventListener('click', () => this.playRound('scissors'));
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
    }

    predictPlayerMove() {
        if (this.playerHistory.length === 0) return null;
        
        const recent = this.playerHistory.slice(-this.historySize);
        const frequency = { rock: 0, paper: 0, scissors: 0 };
        
        recent.forEach(move => frequency[move]++);
        
        return Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
        );
    }

    getComputerMove() {
        const prediction = this.predictPlayerMove();
        const counter = { rock: 'paper', paper: 'scissors', scissors: 'rock' };
        
        // 70% chance to counter predicted move, 30% random
        if (prediction && Math.random() < 0.7) {
            return counter[prediction];
        }
        
        const moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * moves.length)];
    }

    determineWinner(playerMove, computerMove) {
        if (playerMove === computerMove) return 'tie';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerMove] === computerMove ? 'player' : 'computer';
    }

    playRound(playerMove) {
        const computerMove = this.getComputerMove();
        const winner = this.determineWinner(playerMove, computerMove);
        
        this.playerHistory.push(playerMove);
        this.scores[winner]++;
        
        this.displayResult(playerMove, computerMove, winner);
        this.updateScores();
    }

    displayResult(playerMove, computerMove, winner) {
        const output = document.getElementById('roshamboOutput');
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
        
        let result = `Round Result:
        
You chose: ${emojis[playerMove]} ${playerMove}
Computer chose: ${emojis[computerMove]} ${computerMove}

`;
        
        if (winner === 'tie') {
            result += "It's a tie! 🤝";
        } else {
            const rules = {
                rock: { scissors: 'crushes' },
                paper: { rock: 'covers' },
                scissors: { paper: 'cuts' }
            };
            
            const winnerMove = winner === 'player' ? playerMove : computerMove;
            const loserMove = winner === 'player' ? computerMove : playerMove;
            const action = rules[winnerMove][loserMove];
            
            result += `${winnerMove} ${action} ${loserMove}. ${winner === 'player' ? 'You win!' : 'Computer wins!'} ${winner === 'player' ? '🎉' : '😞'}`;
        }
        
        if (this.playerHistory.length > 3) {
            result += `\n\nThe computer is learning from your patterns...`;
        }
        
        output.textContent = result;
    }

    updateScores() {
        document.getElementById('playerScore').textContent = this.scores.player;
        document.getElementById('computerScore').textContent = this.scores.computer;
        document.getElementById('tieScore').textContent = this.scores.tie;
    }

    updateDisplay() {
        const output = document.getElementById('roshamboOutput');
        output.textContent = `Welcome to Adaptive Rock-Paper-Scissors!

The computer learns from your choices and adapts its strategy.
Can you outsmart the AI?

Choose your move below!`;
    }

    resetGame() {
        this.playerHistory = [];
        this.scores = { player: 0, computer: 0, tie: 0 };
        this.updateScores();
        this.updateDisplay();
    }
}

// Global functions for game controls
function openGame(gameType) {
    portfolio.openGame(gameType);
}

function closeGame() {
    portfolio.closeGame();
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Portfolio, BlackjackGame, RoshamboGame };
}
