// Ro-Sham-Bo Game with Predictive AI
class RoshamboGame {
    constructor(historySize = 5) {
        this.scores = { user: 0, computer: 0, tie: 0 };
        this.history = [];
        this.historySize = historySize;
        this.rules = {
            'rock': { 'scissors': 'crushes', emoji: '🪨' },
            'paper': { 'rock': 'covers', emoji: '📄' },
            'scissors': { 'paper': 'cuts', emoji: '✂️' }
        };
        this.counters = {
            'rock': 'paper',
            'paper': 'scissors', 
            'scissors': 'rock'
        };
        this.choices = ['rock', 'paper', 'scissors'];
        this.aiEdge = 0.7; // 70% chance to use prediction
    }

    predictUserMove() {
        if (this.history.length === 0) return null;
        
        // Count frequency of each choice in recent history
        const frequency = {};
        this.choices.forEach(choice => frequency[choice] = 0);
        
        this.history.forEach(choice => {
            frequency[choice]++;
        });
        
        // Return the most frequent choice
        return Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
        );
    }

    getComputerChoice() {
        const prediction = this.predictUserMove();
        
        // Use prediction-based strategy with some randomness
        if (prediction && Math.random() < this.aiEdge) {
            return this.counters[prediction];
        }
        
        // Random choice for unpredictability
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    determineWinner(userChoice, computerChoice) {
        if (userChoice === computerChoice) return 'tie';
        return computerChoice in this.rules[userChoice] ? 'user' : 'computer';
    }

    playRound(userChoice) {
        const computerChoice = this.getComputerChoice();
        
        // Add to history (maintain size limit)
        this.history.push(userChoice);
        if (this.history.length > this.historySize) {
            this.history.shift();
        }

        const winner = this.determineWinner(userChoice, computerChoice);
        this.scores[winner]++;

        this.updateDisplay(userChoice, computerChoice, winner);
        this.displayResult(userChoice, computerChoice, winner);
    }

    updateDisplay(userChoice, computerChoice, winner) {
        // Update choices display
        document.getElementById('user-choice').textContent = this.rules[userChoice].emoji;
        document.getElementById('computer-choice').textContent = this.rules[computerChoice].emoji;
        
        // Update scores
        document.getElementById('user-score').textContent = this.scores.user;
        document.getElementById('computer-score').textContent = this.scores.computer;
        document.getElementById('tie-score').textContent = this.scores.tie;
    }

    displayResult(userChoice, computerChoice, winner) {
        const resultDiv = document.getElementById('result-message');
        
        if (winner === 'tie') {
            resultDiv.innerHTML = `<span class="text-gray-600">It's a tie!</span>`;
        } else {
            const winningChoice = winner === 'user' ? userChoice : computerChoice;
            const losingChoice = winner === 'user' ? computerChoice : userChoice;
            const verb = this.rules[winningChoice][losingChoice];
            const winnerName = winner === 'user' ? 'You' : 'Computer';
            
            const colorClass = winner === 'user' ? 'text-green-600' : 'text-red-600';
            resultDiv.innerHTML = `
                <span class="${colorClass}">
                    ${winningChoice.charAt(0).toUpperCase() + winningChoice.slice(1)} ${verb} ${losingChoice}! ${winnerName} win!
                </span>
            `;
        }
        
        // Add some animation
        resultDiv.classList.add('animate-pulse');
        setTimeout(() => {
            resultDiv.classList.remove('animate-pulse');
        }, 1000);
    }

    reset() {
        this.scores = { user: 0, computer: 0, tie: 0 };
        this.history = [];
        
        // Reset display
        document.getElementById('user-choice').textContent = '❓';
        document.getElementById('computer-choice').textContent = '❓';
        document.getElementById('user-score').textContent = '0';
        document.getElementById('computer-score').textContent = '0';
        document.getElementById('tie-score').textContent = '0';
        document.getElementById('result-message').textContent = '';
    }
}

// Global game instance
let roshamboGame;

function initializeRoshambo() {
    roshamboGame = new RoshamboGame();
}

function playRound(userChoice) {
    roshamboGame.playRound(userChoice);
}

function resetGame() {
    roshamboGame.reset();
}
