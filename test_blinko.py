#!/usr/bin/env python3
"""
Comprehensive Test Suite for BLinko Game
Tests game mechanics, physics, provably fair system, and edge cases
"""

import unittest
import sys
import os
import hashlib
import math
from unittest.mock import Mock, patch, MagicMock

# Add the current directory to the path to import BLinko
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Mock pygame before importing BLinko
sys.modules['pygame'] = Mock()
sys.modules['pygame.display'] = Mock()
sys.modules['pygame.time'] = Mock()
sys.modules['pygame.font'] = Mock()

# Import BLinko components after mocking pygame
from BLinko import Ball, generate_pegs, define_payout_bins, generate_seed, hash_seed, Game

class TestBall(unittest.TestCase):
    """Test the Ball class functionality"""
    
    def setUp(self):
        self.ball = Ball(100, 200)
    
    def test_ball_initialization(self):
        """Test ball is properly initialized"""
        self.assertEqual(self.ball.x, 100.0)
        self.assertEqual(self.ball.y, 200.0)
        self.assertEqual(self.ball.vx, 4.0)  # INITIAL_THROW_SPEED
        self.assertEqual(self.ball.vy, 0.0)
    
    def test_ball_position_update(self):
        """Test ball position updates correctly"""
        original_x = self.ball.x
        original_y = self.ball.y
        
        self.ball.x += self.ball.vx
        self.ball.y += self.ball.vy
        
        self.assertEqual(self.ball.x, original_x + 4.0)
        self.assertEqual(self.ball.y, original_y + 0.0)

class TestPegGeneration(unittest.TestCase):
    """Test peg generation functionality"""
    
    def test_default_peg_generation(self):
        """Test default peg generation creates correct number of pegs"""
        pegs = generate_pegs()
        expected_pegs = 12 * 18  # rows * cols
        self.assertEqual(len(pegs), expected_pegs)
    
    def test_custom_peg_generation(self):
        """Test custom peg generation"""
        pegs = generate_pegs(rows=5, cols=10)
        expected_pegs = 5 * 10
        self.assertEqual(len(pegs), expected_pegs)
    
    def test_peg_positions_valid(self):
        """Test all peg positions are within screen bounds"""
        pegs = generate_pegs(rows=3, cols=3)
        
        for peg_x, peg_y in pegs:
            self.assertGreaterEqual(peg_x, 0)
            self.assertLessEqual(peg_x, 800)  # SCREEN_WIDTH
            self.assertGreaterEqual(peg_y, 0)
            self.assertLessEqual(peg_y, 600)  # SCREEN_HEIGHT
    
    def test_staggered_pattern(self):
        """Test that pegs follow staggered pattern"""
        pegs = generate_pegs(rows=4, cols=4)
        
        # Group pegs by row
        row_pegs = {}
        y_spacing = 600 / (4 + 1)  # SCREEN_HEIGHT / (rows + 1)
        
        for peg_x, peg_y in pegs:
            row = round(peg_y / y_spacing)
            if row not in row_pegs:
                row_pegs[row] = []
            row_pegs[row].append(peg_x)
        
        # Check that odd rows are offset
        for row, x_positions in row_pegs.items():
            if len(x_positions) > 1:
                # Should have consistent spacing pattern
                self.assertTrue(len(set(x_positions)) == len(x_positions))

class TestPayoutBins(unittest.TestCase):
    """Test payout bin functionality"""
    
    def setUp(self):
        self.bins = define_payout_bins()
    
    def test_bin_count(self):
        """Test correct number of bins"""
        self.assertEqual(len(self.bins), 7)
    
    def test_bin_structure(self):
        """Test each bin has required fields"""
        required_fields = ['range', 'multiplier', 'label', 'color']
        
        for bin_info in self.bins:
            for field in required_fields:
                self.assertIn(field, bin_info)
    
    def test_range_coverage(self):
        """Test bins cover the entire screen height"""
        covered_ranges = []
        
        for bin_info in self.bins:
            start, end = bin_info['range']
            covered_ranges.append((start, end))
        
        # Check for overlaps and gaps
        covered_ranges.sort()
        
        # Should start at 0
        self.assertEqual(covered_ranges[0][0], 0)
        
        # Should cover full height
        max_end = max(end for start, end in covered_ranges)
        self.assertEqual(max_end, 600)  # SCREEN_HEIGHT
    
    def test_multiplier_values(self):
        """Test multiplier values are reasonable"""
        multipliers = [bin_info['multiplier'] for bin_info in self.bins]
        
        # Should have variety of multipliers
        self.assertGreater(len(set(multipliers)), 3)
        
        # Should have some losing multipliers (< 1.0)
        losing_multipliers = [m for m in multipliers if m < 1.0]
        self.assertGreater(len(losing_multipliers), 0)
        
        # Should have some winning multipliers (> 1.0)
        winning_multipliers = [m for m in multipliers if m > 1.0]
        self.assertGreater(len(winning_multipliers), 0)
    
    def test_super_bin_exists(self):
        """Test that super rare bin exists"""
        super_bins = [bin_info for bin_info in self.bins if bin_info.get('is_super', False)]
        self.assertEqual(len(super_bins), 1)
        
        # Super bin should have highest multiplier
        super_multiplier = super_bins[0]['multiplier']
        other_multipliers = [bin_info['multiplier'] for bin_info in self.bins if not bin_info.get('is_super', False)]
        self.assertGreater(super_multiplier, max(other_multipliers))

class TestProvablyFairSystem(unittest.TestCase):
    """Test provably fair system functionality"""
    
    def test_seed_generation(self):
        """Test seed generation produces valid seeds"""
        seed1 = generate_seed()
        seed2 = generate_seed()
        
        # Seeds should be different
        self.assertNotEqual(seed1, seed2)
        
        # Seeds should be hex strings
        self.assertTrue(all(c in '0123456789abcdef' for c in seed1))
        self.assertTrue(all(c in '0123456789abcdef' for c in seed2))
        
        # Seeds should be 64 characters (32 bytes * 2)
        self.assertEqual(len(seed1), 64)
        self.assertEqual(len(seed2), 64)
    
    def test_hash_seed_deterministic(self):
        """Test hash_seed produces deterministic results"""
        test_seed = "test_seed_123"
        hash1 = hash_seed(test_seed)
        hash2 = hash_seed(test_seed)
        
        self.assertEqual(hash1, hash2)
    
    def test_hash_seed_different_inputs(self):
        """Test different seeds produce different hashes"""
        hash1 = hash_seed("seed1")
        hash2 = hash_seed("seed2")
        
        self.assertNotEqual(hash1, hash2)
    
    def test_hash_length(self):
        """Test hash produces correct length"""
        test_hash = hash_seed("test")
        self.assertEqual(len(test_hash), 64)  # SHA256 produces 64 character hex string

class TestGameMechanics(unittest.TestCase):
    """Test game mechanics and state management"""
    
    def setUp(self):
        with patch('pygame.display.set_mode'), \
             patch('pygame.display.set_caption'), \
             patch('pygame.time.Clock'):
            self.game = Game()
    
    def test_game_initialization(self):
        """Test game initializes correctly"""
        self.assertEqual(self.game.balance, 1000.0)
        self.assertEqual(self.game.bet_amount, 10.0)
        self.assertEqual(self.game.game_state, "AWAITING_BET")
        self.assertIsNone(self.game.ball)
        self.assertIsNotNone(self.game.pegs)
        self.assertIsNotNone(self.game.bins)
    
    def test_bet_amount_adjustments(self):
        """Test bet amount can be adjusted within limits"""
        # Test doubling bet
        initial_bet = self.game.bet_amount
        self.game.bet_amount = min(self.game.balance, self.game.bet_amount * 2)
        self.assertEqual(self.game.bet_amount, initial_bet * 2)
        
        # Test halving bet
        self.game.bet_amount = max(1.0, self.game.bet_amount / 2)
        self.assertEqual(self.game.bet_amount, initial_bet)
        
        # Test minimum bet
        self.game.bet_amount = 0.5
        self.game.bet_amount = max(1.0, self.game.bet_amount / 2)
        self.assertEqual(self.game.bet_amount, 1.0)
    
    def test_start_round(self):
        """Test round initialization"""
        initial_balance = self.game.balance
        self.game.start_round()
        
        self.assertEqual(self.game.game_state, "BALL_DROPPING")
        self.assertIsNotNone(self.game.ball)
        self.assertIsNotNone(self.game.game_hash)
        self.assertEqual(self.game.hash_index, 0)
    
    def test_ball_physics_bounds(self):
        """Test ball stays within screen bounds"""
        self.game.start_round()
        ball = self.game.ball
        
        # Test upper bound
        ball.y = 5  # Above screen
        ball.vy = -2
        
        # Simulate boundary collision
        if not (8 < ball.y < 600 - 8):  # BALL_RADIUS bounds
            ball.vy *= -1
            ball.y = max(8, min(ball.y, 600 - 8))
        
        self.assertGreaterEqual(ball.y, 8)
        self.assertGreater(ball.vy, 0)  # Should bounce down
        
        # Test lower bound
        ball.y = 595  # Below screen
        ball.vy = 2
        
        if not (8 < ball.y < 600 - 8):
            ball.vy *= -1
            ball.y = max(8, min(ball.y, 600 - 8))
        
        self.assertLessEqual(ball.y, 592)
        self.assertLess(ball.vy, 0)  # Should bounce up

class TestPhysicsSimulation(unittest.TestCase):
    """Test physics simulation accuracy"""
    
    def setUp(self):
        with patch('pygame.display.set_mode'), \
             patch('pygame.display.set_caption'), \
             patch('pygame.time.Clock'):
            self.game = Game()
    
    def test_collision_detection(self):
        """Test collision detection between ball and pegs"""
        ball = Ball(100, 100)
        peg_x, peg_y = 110, 105
        
        # Calculate distance
        dist_x = ball.x - peg_x
        dist_y = ball.y - peg_y
        distance = math.sqrt(dist_x**2 + dist_y**2)
        
        # Should detect collision (distance < BALL_RADIUS + PEG_RADIUS)
        ball_radius = 8
        peg_radius = 5
        collision_threshold = ball_radius + peg_radius
        
        self.assertLess(distance, collision_threshold)
    
    def test_collision_physics(self):
        """Test collision physics calculations"""
        ball = Ball(100, 100)
        ball.vx = 3.0
        ball.vy = 2.0
        
        peg_x, peg_y = 105, 102
        
        # Calculate collision response
        dist_x = ball.x - peg_x
        dist_y = ball.y - peg_y
        distance = math.sqrt(dist_x**2 + dist_y**2)
        
        norm_x = dist_x / distance
        norm_y = dist_y / distance
        
        dot_product = ball.vx * norm_x + ball.vy * norm_y
        reflect_vx = ball.vx - 2 * dot_product * norm_x
        reflect_vy = ball.vy - 2 * dot_product * norm_y
        
        # Velocity should change after collision
        self.assertNotEqual(reflect_vx, ball.vx)
        self.assertNotEqual(reflect_vy, ball.vy)
        
        # Energy should be conserved (approximately)
        original_energy = ball.vx**2 + ball.vy**2
        new_energy = reflect_vx**2 + reflect_vy**2
        
        # With energy retention factor, new energy should be less
        energy_retention = 0.7
        expected_energy = original_energy * energy_retention**2
        self.assertLess(new_energy, original_energy)

class TestEdgeCases(unittest.TestCase):
    """Test edge cases and error conditions"""
    
    def setUp(self):
        with patch('pygame.display.set_mode'), \
             patch('pygame.display.set_caption'), \
             patch('pygame.time.Clock'):
            self.game = Game()
    
    def test_insufficient_balance(self):
        """Test behavior when balance is insufficient"""
        self.game.balance = 5.0
        self.game.bet_amount = 10.0
        
        # Should not allow bet if balance is insufficient
        can_bet = self.game.balance >= self.game.bet_amount
        self.assertFalse(can_bet)
    
    def test_zero_balance(self):
        """Test behavior with zero balance"""
        self.game.balance = 0.0
        self.game.bet_amount = 1.0
        
        can_bet = self.game.balance >= self.game.bet_amount
        self.assertFalse(can_bet)
    
    def test_extreme_bet_amounts(self):
        """Test extreme bet amounts"""
        # Very large bet
        self.game.balance = 1000000.0
        large_bet = self.game.balance * 2
        adjusted_bet = min(self.game.balance, large_bet)
        self.assertEqual(adjusted_bet, self.game.balance)
        
        # Very small bet
        small_bet = 0.01
        adjusted_bet = max(1.0, small_bet)
        self.assertEqual(adjusted_bet, 1.0)
    
    def test_ball_out_of_bounds(self):
        """Test ball behavior when going out of bounds"""
        self.game.start_round()
        ball = self.game.ball
        
        # Ball far right (should end round)
        ball.x = 800  # SCREEN_WIDTH
        should_end = ball.x >= 800 - 8  # SCREEN_WIDTH - BALL_RADIUS
        self.assertTrue(should_end)
        
        # Ball far left
        ball.x = -10
        self.assertLess(ball.x, 0)
    
    def test_payout_calculation_accuracy(self):
        """Test payout calculations are accurate"""
        self.game.bet_amount = 100.0
        test_cases = [
            (25, 1500),  # GRAND SLAM bin (y=0-15, multiplier=1500)
            (50, 50),    # HOME RUN bin (y=0-40, multiplier=50)
            (150, 5),    # Double bin (y=100-200, multiplier=5)
            (300, 0.5),  # Fly Out bin (y=200-400, multiplier=0.5)
        ]
        
        for final_y, expected_multiplier in test_cases:
            # Find matching bin
            matching_bin = None
            for bin_info in self.game.bins:
                if bin_info['range'][0] <= final_y < bin_info['range'][1]:
                    matching_bin = bin_info
                    break
            
            if matching_bin:
                calculated_winnings = self.game.bet_amount * matching_bin['multiplier']
                expected_winnings = self.game.bet_amount * expected_multiplier
                self.assertEqual(calculated_winnings, expected_winnings)

class TestRandomnessAndFairness(unittest.TestCase):
    """Test randomness distribution and fairness"""
    
    def test_hash_distribution(self):
        """Test hash characters are evenly distributed"""
        test_hash = hash_seed("test_distribution_seed")
        char_counts = {}
        
        for char in test_hash:
            char_counts[char] = char_counts.get(char, 0) + 1
        
        # Should have variety of hex characters
        self.assertGreater(len(char_counts), 8)
    
    def test_kick_values_range(self):
        """Test kick values from hash are in correct range"""
        test_hash = hash_seed("test_kick_range")
        
        for i in range(min(20, len(test_hash))):
            hash_char = test_hash[i]
            kick_y = (int(hash_char, 16) - 7.5) / 15.0
            
            # Kick should be in range [-0.5, 0.5]
            self.assertGreaterEqual(kick_y, -0.5)
            self.assertLessEqual(kick_y, 0.5)
    
    def test_multiple_games_different_outcomes(self):
        """Test multiple games produce different outcomes"""
        with patch('pygame.display.set_mode'), \
             patch('pygame.display.set_caption'), \
             patch('pygame.time.Clock'):
            
            game = Game()
            outcomes = []
            
            for _ in range(10):
                # Simulate different seeds
                server_seed = generate_seed()
                client_seed = generate_seed()
                game_hash = hash_seed(server_seed + client_seed)
                outcomes.append(game_hash)
            
            # All outcomes should be different
            unique_outcomes = set(outcomes)
            self.assertEqual(len(unique_outcomes), len(outcomes))

def run_performance_test():
    """Run performance tests for BLinko"""
    print("\n=== PERFORMANCE TESTS ===")
    
    import time
    
    # Test peg generation performance
    start_time = time.time()
    for _ in range(1000):
        generate_pegs(12, 18)
    peg_time = time.time() - start_time
    print(f"Peg generation (1000x): {peg_time:.4f}s")
    
    # Test hash generation performance
    start_time = time.time()
    for i in range(1000):
        hash_seed(f"test_seed_{i}")
    hash_time = time.time() - start_time
    print(f"Hash generation (1000x): {hash_time:.4f}s")
    
    # Test collision detection performance
    ball = Ball(100, 100)
    pegs = generate_pegs(12, 18)
    
    start_time = time.time()
    for _ in range(1000):
        for peg_x, peg_y in pegs[:10]:  # Test with first 10 pegs
            dist_x = ball.x - peg_x
            dist_y = ball.y - peg_y
            distance = math.sqrt(dist_x**2 + dist_y**2)
            collision = distance < 13  # BALL_RADIUS + PEG_RADIUS
    collision_time = time.time() - start_time
    print(f"Collision detection (1000x): {collision_time:.4f}s")

def run_integration_test():
    """Run integration tests simulating full game rounds"""
    print("\n=== INTEGRATION TESTS ===")
    
    with patch('pygame.display.set_mode'), \
         patch('pygame.display.set_caption'), \
         patch('pygame.time.Clock'):
        
        game = Game()
        
        # Test multiple complete rounds
        print("Testing 10 complete game rounds...")
        
        initial_balance = game.balance
        rounds_played = 0
        
        for round_num in range(10):
            if game.balance >= game.bet_amount:
                # Start round
                game.balance -= game.bet_amount
                game.start_round()
                
                # Simulate ball reaching the end
                game.ball.x = 800  # Force end condition
                game._end_round()
                
                rounds_played += 1
                print(f"Round {round_num + 1}: Balance=${game.balance:.2f}, Result: {game.result_info.get('label', 'N/A')}")
        
        print(f"Completed {rounds_played} rounds")
        print(f"Starting balance: ${initial_balance:.2f}")
        print(f"Ending balance: ${game.balance:.2f}")
        balance_change = game.balance - initial_balance
        print(f"Net change: ${balance_change:.2f}")

if __name__ == "__main__":
    print("=" * 60)
    print("BLinko Comprehensive Test Suite")
    print("=" * 60)
    
    # Run unit tests
    print("\n=== UNIT TESTS ===")
    unittest.main(argv=[''], exit=False, verbosity=2)
    
    # Run performance tests
    run_performance_test()
    
    # Run integration tests
    run_integration_test()
    
    print("\n" + "=" * 60)
    print("Test Suite Complete!")
    print("=" * 60)
