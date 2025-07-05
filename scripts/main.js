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

    // Game button event listeners
    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            if (game === 'blackjack') {
                openBlackjack();
            } else if (game === 'roshambo') {
                openRoshambo();
            }
        });
    });

    // Resume download buttons
    document.querySelectorAll('.download-resume-btn').forEach(button => {
        button.addEventListener('click', downloadResume);
    });

    // Close modal button
    document.getElementById('closeGameBtn').addEventListener('click', closeGameModal);

    // Close modal on overlay click
    document.getElementById('gameModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGameModal();
        }
    });

    // Contact form handling
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Game modal functions
function openGameModal(title, content) {
    document.getElementById('gameTitle').textContent = title;
    document.getElementById('gameContainer').innerHTML = content;
    document.getElementById('gameModal').style.display = 'flex';
}

function closeGameModal() {
    document.getElementById('gameModal').style.display = 'none';
    document.getElementById('gameContainer').innerHTML = '';
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

function openRoshambo() {
    const roshamboHTML = `
        <div id="roshambo-game" style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Ro-Sham-Bo!</h2>
                <p style="font-size: 1.1rem; color: var(--turquoise-light); margin-bottom: 1.5rem;">The computer learns from your choices... Can you outsmart it?</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: var(--granite-medium); padding: 1rem; border-radius: 8px; color: var(--white);">
                        <h3 style="font-weight: 600; font-size: 1.1rem;">You</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--turquoise-light);" id="user-score">0</div>
                    </div>
                    <div style="background: var(--granite-medium); padding: 1rem; border-radius: 8px; color: var(--white);">
                        <h3 style="font-weight: 600; font-size: 1.1rem;">Ties</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--granite-lighter);" id="tie-score">0</div>
                    </div>
                    <div style="background: var(--granite-medium); padding: 1rem; border-radius: 8px; color: var(--white);">
                        <h3 style="font-weight: 600; font-size: 1.1rem;">Computer</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #d32f2f;" id="computer-score">0</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
                    <div style="text-align: center;">
                        <h3 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: var(--white);">Your Choice</h3>
                        <div id="user-choice" style="font-size: 4rem; margin-bottom: 1rem;">❓</div>
                    </div>
                    <div style="text-align: center;">
                        <h3 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: var(--white);">Computer's Choice</h3>
                        <div id="computer-choice" style="font-size: 4rem; margin-bottom: 1rem;">❓</div>
                    </div>
                </div>
                
                <div id="result-message" style="font-size: 1.3rem; font-weight: bold; margin-bottom: 1.5rem; height: 3rem; display: flex; align-items: center; justify-content: center; color: var(--turquoise-light);"></div>
            </div>
            
            <div style="text-align: center;">
                <h3 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: var(--white);">Make Your Choice</h3>
                <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <button onclick="playRound('rock')" style="background: var(--turquoise-medium); color: white; border: none; font-size: 3rem; padding: 1rem; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🪨</button>
                    <button onclick="playRound('paper')" style="background: var(--turquoise-medium); color: white; border: none; font-size: 3rem; padding: 1rem; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">📄</button>
                    <button onclick="playRound('scissors')" style="background: var(--turquoise-medium); color: white; border: none; font-size: 3rem; padding: 1rem; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">✂️</button>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="resetGame()" style="background: var(--granite-light); color: var(--turquoise-light); border: 2px solid var(--turquoise-dark); padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Reset Game</button>
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <details style="background: var(--granite-medium); padding: 1rem; border-radius: 8px; color: var(--white);">
                    <summary style="cursor: pointer; font-weight: 600;">How the AI works</summary>
                    <p style="margin-top: 0.5rem; color: var(--turquoise-light);">The computer analyzes your last 5 moves to predict your next choice, then plays the counter-move 70% of the time. The other 30% is random to keep you guessing!</p>
                </details>
            </div>
        </div>
    `;
    
    openGameModal('Ro-Sham-Bo', roshamboHTML);
    initializeRoshambo();
}

// Contact form handler
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
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
            // Success
            alert('Message sent successfully! I\'ll get back to you soon.');
            form.reset();
        } else {
            // Error from server
            alert(result.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again or contact me directly.');
    } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Resume download function
async function downloadResume() {
    try {
        const response = await fetch('/api/download-resume');
        
        if (response.ok) {
            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Joseph_Mazzini_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to download resume. Please try again.');
        }
    } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Failed to download resume. Please try again or contact me directly.');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});
