// Main site functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Game modal functions
function openGameModal(title, content) {
    document.getElementById('game-title').textContent = title;
    document.getElementById('game-content').innerHTML = content;
    document.getElementById('game-modal').classList.remove('hidden');
    document.getElementById('game-modal').classList.add('flex');
}

function closeGameModal() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('game-modal').classList.remove('flex');
}

function openBlackjack() {
    const blackjackHTML = `
        <div id="blackjack-game">
            <div class="game-table">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold mb-2">Blackjack</h2>
                    <div class="flex justify-center space-x-8 text-lg">
                        <div>Balance: $<span id="balance">1000</span></div>
                        <div>Bet: $<span id="current-bet">0</span></div>
                        <div>Wins: <span id="wins">0</span></div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <!-- Dealer Section -->
                    <div class="hand-container">
                        <h3 class="text-xl font-semibold mb-4">Dealer <span id="dealer-value" class="text-turquoise-medium"></span></h3>
                        <div id="dealer-cards" class="flex space-x-2 mb-4"></div>
                    </div>
                    
                    <!-- Player Section -->
                    <div id="player-section">
                        <h3 class="text-xl font-semibold mb-4">Player <span id="player-value" class="text-turquoise-medium"></span></h3>
                        <div id="player-hands-container"></div>
                    </div>
                </div>
                
                <!-- Game Controls -->
                <div class="text-center space-y-4">
                    <div id="betting-controls" class="space-x-4">
                        <button onclick="placeBet(25)" class="btn-secondary">$25</button>
                        <button onclick="placeBet(50)" class="btn-secondary">$50</button>
                        <button onclick="placeBet(100)" class="btn-secondary">$100</button>
                        <button onclick="startGame()" class="btn-primary">Deal</button>
                    </div>
                    
                    <div id="game-controls" class="space-x-4 hidden">
                        <button id="hit-button" class="btn-primary">Hit</button>
                        <button id="stand-button" class="btn-secondary">Stand</button>
                        <button id="doubledown-button" class="btn-secondary">Double</button>
                        <button id="split-button" class="btn-secondary">Split</button>
                    </div>
                    
                    <div id="game-message" class="text-xl font-semibold"></div>
                </div>
            </div>
        </div>
    `;
    
    openGameModal('Blackjack', blackjackHTML);
    initializeBlackjack();
}

function openWordGuess() {
    const roshamboHTML = `
        <div id="roshambo-game" class="max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <h2 class="text-4xl font-bold mb-4">Ro-Sham-Bo!</h2>
                <p class="text-lg text-gray-600 mb-6">The computer learns from your choices... Can you outsmart it?</p>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h3 class="font-semibold text-lg">You</h3>
                        <div class="text-3xl font-bold text-turquoise-medium" id="user-score">0</div>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h3 class="font-semibold text-lg">Ties</h3>
                        <div class="text-3xl font-bold text-gray-600" id="tie-score">0</div>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h3 class="font-semibold text-lg">Computer</h3>
                        <div class="text-3xl font-bold text-red-600" id="computer-score">0</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-8">
                <div class="grid grid-cols-2 gap-8 mb-6">
                    <div class="text-center">
                        <h3 class="text-xl font-semibold mb-4">Your Choice</h3>
                        <div id="user-choice" class="text-8xl mb-4">❓</div>
                    </div>
                    <div class="text-center">
                        <h3 class="text-xl font-semibold mb-4">Computer's Choice</h3>
                        <div id="computer-choice" class="text-8xl mb-4">❓</div>
                    </div>
                </div>
                
                <div id="result-message" class="text-2xl font-bold mb-6 h-16 flex items-center justify-center"></div>
            </div>
            
            <div class="text-center">
                <h3 class="text-xl font-semibold mb-4">Make Your Choice</h3>
                <div class="flex justify-center space-x-4 mb-6">
                    <button onclick="playRound('rock')" class="btn-primary text-6xl p-6 rounded-full hover:scale-110 transition-transform">🪨</button>
                    <button onclick="playRound('paper')" class="btn-primary text-6xl p-6 rounded-full hover:scale-110 transition-transform">📄</button>
                    <button onclick="playRound('scissors')" class="btn-primary text-6xl p-6 rounded-full hover:scale-110 transition-transform">✂️</button>
                </div>
                
                <div class="text-center">
                    <button onclick="resetGame()" class="btn-secondary">Reset Game</button>
                </div>
            </div>
            
            <div class="mt-8 text-center">
                <details class="bg-gray-100 p-4 rounded-lg">
                    <summary class="cursor-pointer font-semibold">How the AI works</summary>
                    <p class="mt-2 text-gray-600">The computer analyzes your last 5 moves to predict your next choice, then plays the counter-move 70% of the time. The other 30% is random to keep you guessing!</p>
                </details>
            </div>
        </div>
    `;
    
    openGameModal('Ro-Sham-Bo', roshamboHTML);
    initializeRoshambo();
}

// Contact form handler
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Thank you for your message! I\'ll get back to you soon.');
            e.target.reset();
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        alert('Sorry, there was an error sending your message. Please try again or email me directly at joseph@mazzlabs.works');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Resume download handler
async function downloadResume() {
    try {
        // Track download with analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'resume',
                'event_label': 'Joseph_Mazzini_Resume.pdf'
            });
        }
        
        // Use the Flask endpoint for download
        window.location.href = '/api/download-resume';
        
    } catch (error) {
        console.error('Resume download error:', error);
        alert('Sorry, there was an error downloading the resume. Please try again.');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});
