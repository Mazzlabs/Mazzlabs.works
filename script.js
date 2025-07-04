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

// Blackjack Game Class
class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.balance = 1000;
        this.bet = 0;
        this.gameState = 'betting'; // betting, playing, dealer, finished
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
                    <h3>🃏 Blackjack</h3>
                    <div class="balance">Balance: $<span id="balance">${this.balance}</span></div>
                </div>
                <div class="game-output" id="gameOutput">
                    Welcome to Blackjack! Get as close to 21 as possible without going over.
                    Face cards = 10, Aces = 1 or 11
                    
                    Place your bet to start playing!
                </div>
                <div class="game-controls">
                    <input type="number" id="betInput" class="game-input" placeholder="Enter bet amount" min="1" max="${this.balance}">
                    <button id="placeBet" class="game-btn">Place Bet</button>
                    <button id="hit" class="game-btn" disabled>Hit</button>
                    <button id="stand" class="game-btn" disabled>Stand</button>
                    <button id="newGame" class="game-btn">New Game</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.getElementById('placeBet').addEventListener('click', () => this.placeBet());
        document.getElementById('hit').addEventListener('click', () => this.hit());
        document.getElementById('stand').addEventListener('click', () => this.stand());
        document.getElementById('newGame').addEventListener('click', () => this.resetGame());
        
        document.getElementById('betInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.placeBet();
        });
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];
        
        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push({ suit, rank });
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

    displayHand(hand, hideFirst = false) {
        return hand.map((card, index) => {
            if (hideFirst && index === 0) return '[Hidden]';
            return `${card.rank}${card.suit}`;
        }).join(' | ');
    }

    updateDisplay() {
        const output = document.getElementById('gameOutput');
        const balance = document.getElementById('balance');
        
        balance.textContent = this.balance;
        
        let display = '';
        
        if (this.gameState === 'betting') {
            display = `Welcome to Blackjack! Get as close to 21 as possible without going over.
Face cards = 10, Aces = 1 or 11

Place your bet to start playing!`;
        } else {
            display = `Current Bet: $${this.bet}

🎴 YOUR HAND:
   ${this.displayHand(this.playerHand)} = ${this.getHandValue(this.playerHand)}

🎴 DEALER'S HAND:
   ${this.displayHand(this.dealerHand, this.gameState === 'playing')}${this.gameState !== 'playing' ? ` = ${this.getHandValue(this.dealerHand)}` : ''}

`;
            
            if (this.gameState === 'finished') {
                display += this.getGameResult();
            }
        }
        
        output.textContent = display;
    }

    placeBet() {
        const betInput = document.getElementById('betInput');
        const bet = parseInt(betInput.value);
        
        if (isNaN(bet) || bet < 1 || bet > this.balance) {
            this.showMessage('Please enter a valid bet amount!');
            return;
        }
        
        this.bet = bet;
        this.gameState = 'playing';
        this.createDeck();
        this.dealInitialCards();
        this.updateControls();
        this.updateDisplay();
    }

    dealInitialCards() {
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        
        // Check for blackjack
        if (this.getHandValue(this.playerHand) === 21) {
            this.gameState = 'finished';
            this.updateControls();
        }
    }

    hit() {
        if (this.gameState !== 'playing') return;
        
        this.playerHand.push(this.deck.pop());
        
        if (this.getHandValue(this.playerHand) >= 21) {
            this.gameState = 'finished';
            this.updateControls();
        }
        
        this.updateDisplay();
    }

    stand() {
        if (this.gameState !== 'playing') return;
        
        this.gameState = 'dealer';
        this.dealerPlay();
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
            this.updateControls();
            this.updateDisplay();
        }
    }

    getGameResult() {
        const playerValue = this.getHandValue(this.playerHand);
        const dealerValue = this.getHandValue(this.dealerHand);
        
        let result = '';
        
        if (playerValue > 21) {
            result = '💥 BUST! You went over 21!';
            this.balance -= this.bet;
        } else if (dealerValue > 21) {
            result = '🎉 Dealer busted! You win!';
            this.balance += this.bet;
        } else if (playerValue === 21 && this.playerHand.length === 2 && dealerValue !== 21) {
            result = '🎉 BLACKJACK! You win!';
            this.balance += Math.floor(this.bet * 1.5);
        } else if (dealerValue === 21 && this.dealerHand.length === 2 && playerValue !== 21) {
            result = '😞 Dealer has blackjack! You lose!';
            this.balance -= this.bet;
        } else if (playerValue > dealerValue) {
            result = '🎉 You win!';
            this.balance += this.bet;
        } else if (dealerValue > playerValue) {
            result = '😞 Dealer wins!';
            this.balance -= this.bet;
        } else {
            result = '🤝 It\'s a tie!';
        }
        
        return result + `\n\nNew Balance: $${this.balance}`;
    }

    updateControls() {
        const placeBetBtn = document.getElementById('placeBet');
        const hitBtn = document.getElementById('hit');
        const standBtn = document.getElementById('stand');
        const betInput = document.getElementById('betInput');
        
        if (this.gameState === 'betting') {
            placeBetBtn.disabled = false;
            hitBtn.disabled = true;
            standBtn.disabled = true;
            betInput.disabled = false;
        } else if (this.gameState === 'playing') {
            placeBetBtn.disabled = true;
            hitBtn.disabled = false;
            standBtn.disabled = false;
            betInput.disabled = true;
        } else {
            placeBetBtn.disabled = true;
            hitBtn.disabled = true;
            standBtn.disabled = true;
            betInput.disabled = true;
        }
    }

    resetGame() {
        this.gameState = 'betting';
        this.playerHand = [];
        this.dealerHand = [];
        this.bet = 0;
        this.updateControls();
        this.updateDisplay();
    }

    showMessage(message) {
        const output = document.getElementById('gameOutput');
        output.textContent = message;
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
