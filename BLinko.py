import hashlib
import os
import time
import math
import pygame

# --- Pygame and Color Configuration ---
pygame.init()

# Screen dimensions (pixels)
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (220, 50, 50)
BLUE = (50, 100, 220)
GREY = (128, 128, 128)
PEG_COLOR = (180, 180, 180)
BALL_COLOR = (255, 200, 0)

# Fonts
FONT_MAIN = pygame.font.SysFont('Arial', 24)
FONT_RESULT = pygame.font.SysFont('Arial', 48, bold=True)

# --- Game Physics Configuration ---
BALL_RADIUS = 8
PEG_RADIUS = 5
INITIAL_THROW_SPEED = 2.0
GRAVITY_X = 0.05  # Reduced horizontal gravity
GRAVITY_Y = 0.0  # No vertical gravity
BOUNCE_ENERGY_RETENTION = 0.6  # Much less bouncy
MAX_SPEED = 6.0  # Slower max speed

# --- Game Components ---

class Ball:
    """A simple class to hold the state of the ball."""
    def __init__(self, start_x, start_y):
        self.x = float(start_x)
        self.y = float(start_y)
        self.vx = INITIAL_THROW_SPEED  # Initial horizontal velocity
        self.vy = 0.0  # Start with no vertical velocity

def generate_pegs(rows=15):
    """Creates pegs uniformly filling the 30-60-90 triangle space."""
    pegs = []
    
    # Establish clear triangle boundaries - lower positioning
    point_a_x = 80   # Bottom-left (30-degree angle, start point)
    point_a_y = SCREEN_HEIGHT - 30  # Lower - establish proper base level
    
    point_b_x = SCREEN_WIDTH - 150  # Top-right (90-degree angle)
    point_b_y = 60   # Higher up
    
    # Point C forms the proper 30-60-90 triangle base
    triangle_height = point_a_y - point_b_y
    triangle_base = triangle_height / math.tan(math.radians(30))  # 30-60-90 triangle geometry
    point_c_x = point_a_x + triangle_base  # Bottom-right (60-degree angle)
    point_c_y = point_a_y  # Same height as A
    
    # Simple uniform row generation - no complex logic
    peg_spacing_x = 35
    peg_spacing_y = 30
    
    # Start from top and work down to establish proper base
    current_y = point_b_y + 25
    row = 0
    
    while current_y <= point_a_y - 25:  # Go all the way to base level
        # Calculate triangle width at this Y level
        progress = (current_y - point_b_y) / (point_a_y - point_b_y)
        left_x = point_a_x
        right_x = point_b_x + progress * (point_c_x - point_b_x)
        
        # Alternate row staggering
        offset_x = (peg_spacing_x / 2) if row % 2 == 1 else 0
        
        # Place pegs across the row
        current_x = left_x + peg_spacing_x + offset_x
        while current_x < right_x - 15:
            if is_point_in_triangle(current_x, current_y, point_a_x, point_a_y, point_b_x, point_b_y, point_c_x, point_c_y):
                pegs.append((current_x, current_y))
            current_x += peg_spacing_x
        
        current_y += peg_spacing_y
        row += 1
    
    return pegs

def is_point_in_triangle(px, py, ax, ay, bx, by, cx, cy):
    """Check if point P is inside triangle ABC using barycentric coordinates."""
    denom = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
    if abs(denom) < 1e-10:  # Avoid division by zero
        return False
    
    a = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / denom
    b = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / denom
    c = 1 - a - b
    
    return a >= 0 and b >= 0 and c >= 0

def define_payout_bins():
    """Defines bins for 30-60-90 triangle - higher Y (toward point B) = better payout."""
    point_b_y = 60   # Top-right (90-degree angle, best payout)
    point_a_y = SCREEN_HEIGHT - 30  # Bottom-left (30-degree angle, start point)
    
    bins = [
        # Near Point B (top) - 1000x (hardest to reach)
        {'range': (point_b_y, point_b_y + 90), 'multiplier': 1000, 'label': '1000x', 'color': (255, 215, 0)},
        
        # Upper area - decreasing as we go down toward Point A
        {'range': (point_b_y + 90, point_b_y + 180), 'multiplier': 130, 'label': '130x', 'color': (255, 140, 0)},
        {'range': (point_b_y + 180, point_b_y + 270), 'multiplier': 26, 'label': '26x', 'color': (255, 100, 100)},
        {'range': (point_b_y + 270, point_b_y + 360), 'multiplier': 10, 'label': '10x', 'color': (200, 200, 100)},
        {'range': (point_b_y + 360, point_a_y - 30), 'multiplier': 2, 'label': '2x', 'color': (180, 180, 180)},
        
        # Near Point A (bottom) - lowest multiplier (most common)
        {'range': (point_a_y - 30, SCREEN_HEIGHT), 'multiplier': 0.2, 'label': '0.2x', 'color': (100, 100, 100)}
    ]
    return bins

# --- Provably Fair System ---
def generate_seed():
    return os.urandom(32).hex()

def hash_seed(seed):
    return hashlib.sha256(seed.encode('utf-8')).hexdigest()

# --- Main Game Class ---

class Game:
    """Manages the entire game state, logic, and rendering with Pygame."""

    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Provably Fair Horizontal Plinko")
        self.clock = pygame.time.Clock()
        
        self.balance = 1000.0
        self.bet_amount = 10.0
        self.pegs = generate_pegs()
        self.bins = define_payout_bins()
        
        self.game_state = "AWAITING_BET" # States: AWAITING_BET, BALL_DROPPING, SHOWING_RESULT
        self.ball = None
        self.game_hash = None
        self.hash_index = 0
        self.result_info = {}
        self.result_display_time = 0

    def handle_input(self):
        """Handles all user input via Pygame events."""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False # Signal to exit the game
            if event.type == pygame.KEYDOWN:
                if self.game_state == "AWAITING_BET":
                    if event.key == pygame.K_SPACE:
                        if self.balance >= self.bet_amount:
                            self.balance -= self.bet_amount
                            self.start_round()
                    elif event.key == pygame.K_UP:
                        self.bet_amount = min(self.balance, self.bet_amount * 2)
                    elif event.key == pygame.K_DOWN:
                        self.bet_amount = max(1.0, self.bet_amount / 2)
                elif self.game_state == "SHOWING_RESULT":
                     if event.key == pygame.K_SPACE:
                        self.game_state = "AWAITING_BET"
        return True

    def start_round(self):
        """Initializes a new round of the game."""
        self.game_state = "BALL_DROPPING"
        server_seed = generate_seed()
        client_seed = generate_seed()
        self.game_hash = hash_seed(server_seed + client_seed)
        self.hash_index = 0
        # Start ball from Point A (bottom-left, 30-degree angle) - updated position
        point_a_x = 80
        point_a_y = SCREEN_HEIGHT - 30
        self.ball = Ball(start_x=point_a_x, start_y=point_a_y)
        # In a real app, you'd show hashed_server_seed and store server_seed for later verification.

    def update(self):
        """Updates the game state each frame."""
        if self.game_state == "BALL_DROPPING" and self.ball:
            self._update_simulation_tick()
            # Ball must travel further right to reach the bins (past all pegs)
            if self.ball.x >= SCREEN_WIDTH - 100:
                self._end_round()

    def _update_simulation_tick(self):
        """Runs a single frame of the physics simulation."""
        # Apply gravity (horizontal acceleration to the right)
        self.ball.vx += GRAVITY_X
        
        # Limit maximum speed
        speed = math.sqrt(self.ball.vx**2 + self.ball.vy**2)
        if speed > MAX_SPEED:
            self.ball.vx = (self.ball.vx / speed) * MAX_SPEED
            self.ball.vy = (self.ball.vy / speed) * MAX_SPEED
        
        # Update position
        self.ball.x += self.ball.vx
        self.ball.y += self.ball.vy

        # Bounce off top and bottom walls
        if not (BALL_RADIUS < self.ball.y < SCREEN_HEIGHT - BALL_RADIUS):
            self.ball.vy *= -0.4  # Much less bounce on walls
            self.ball.y = max(BALL_RADIUS, min(self.ball.y, SCREEN_HEIGHT - BALL_RADIUS))

        # Check collisions with pegs
        for peg_x, peg_y in self.pegs:
            dist_x, dist_y = self.ball.x - peg_x, self.ball.y - peg_y
            distance = math.sqrt(dist_x**2 + dist_y**2)
            
            if distance < BALL_RADIUS + PEG_RADIUS:
                # Use hash for provably fair randomness
                hash_char = self.game_hash[self.hash_index % len(self.game_hash)]
                random_kick = (int(hash_char, 16) - 7.5) / 15.0  # -0.5 to 0.5
                
                # Calculate collision normal
                norm_x, norm_y = dist_x / distance, dist_y / distance
                
                # Reflect velocity off the peg
                dot_product = self.ball.vx * norm_x + self.ball.vy * norm_y
                reflect_vx = self.ball.vx - 2 * dot_product * norm_x
                reflect_vy = self.ball.vy - 2 * dot_product * norm_y
                
                # Apply bounce with energy retention and random kick
                self.ball.vx = reflect_vx * BOUNCE_ENERGY_RETENTION
                self.ball.vy = (reflect_vy + random_kick * 1) * BOUNCE_ENERGY_RETENTION  # Reduced random kick
                self.hash_index += 1
                
                # Push ball away from peg to prevent overlap
                overlap = BALL_RADIUS + PEG_RADIUS - distance
                self.ball.x += overlap * norm_x
                self.ball.y += overlap * norm_y
                break

    def _end_round(self):
        """Calculates winnings and transitions to result state."""
        final_y = self.ball.y
        self.ball = None
        
        for bin_info in self.bins:
            if bin_info['range'][0] <= final_y < bin_info['range'][1]:
                multiplier = bin_info['multiplier']
                winnings = self.bet_amount * multiplier
                self.balance += winnings
                self.result_info = {
                    'label': bin_info['label'],
                    'winnings': winnings
                }
                break
        
        self.game_state = "SHOWING_RESULT"
        self.result_display_time = pygame.time.get_ticks()

    def draw(self):
        """Draws everything to the screen."""
        self.screen.fill(BLACK)

        # Draw bins with labels
        for bin_info in self.bins:
            bin_rect = (SCREEN_WIDTH - 80, bin_info['range'][0], 80, bin_info['range'][1] - bin_info['range'][0])
            pygame.draw.rect(self.screen, bin_info['color'], bin_rect)
            
            # Draw bin label
            label_text = FONT_MAIN.render(bin_info['label'], True, BLACK)
            label_y = bin_info['range'][0] + (bin_info['range'][1] - bin_info['range'][0]) // 2 - label_text.get_height() // 2
            self.screen.blit(label_text, (SCREEN_WIDTH - 75, label_y))

        # Draw pegs
        for peg_x, peg_y in self.pegs:
            pygame.draw.circle(self.screen, PEG_COLOR, (int(peg_x), int(peg_y)), PEG_RADIUS)

        # Draw ball
        if self.ball:
            pygame.draw.circle(self.screen, BALL_COLOR, (int(self.ball.x), int(self.ball.y)), BALL_RADIUS)

        # Draw UI
        balance_text = FONT_MAIN.render(f"Balance: ${self.balance:,.2f}", True, WHITE)
        self.screen.blit(balance_text, (10, 10))
        
        bet_text = FONT_MAIN.render(f"Bet: ${self.bet_amount:,.2f}", True, WHITE)
        self.screen.blit(bet_text, (10, 40))

        if self.game_state == "AWAITING_BET":
            prompt_text = FONT_MAIN.render("Press SPACE to Drop Ball | UP/DOWN to change bet", True, WHITE)
            self.screen.blit(prompt_text, (SCREEN_WIDTH // 2 - prompt_text.get_width() // 2, SCREEN_HEIGHT - 40))
        
        if self.game_state == "SHOWING_RESULT":
            result_label = FONT_RESULT.render(self.result_info.get('label', ''), True, WHITE)
            winnings_label = FONT_MAIN.render(f"You won ${self.result_info.get('winnings', 0):,.2f}!", True, BALL_COLOR)
            
            self.screen.blit(result_label, (SCREEN_WIDTH // 2 - result_label.get_width() // 2, SCREEN_HEIGHT // 2 - 40))
            self.screen.blit(winnings_label, (SCREEN_WIDTH // 2 - winnings_label.get_width() // 2, SCREEN_HEIGHT // 2 + 20))

        pygame.display.flip()

    def run(self):
        """The main game loop."""
        running = True
        while running:
            running = self.handle_input()
            self.update()
            self.draw()
            self.clock.tick(60) # Limit to 60 FPS
        
        pygame.quit()

if __name__ == "__main__":
    game = Game()
    game.run()
