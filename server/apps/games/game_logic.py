"""
Game logic for Blackjack and Rock-Paper-Scissors
"""

import random
from typing import List, Dict, Tuple, Optional

class Card:
    """Represents a playing card"""
    
    SUITS = ['♠', '♥', '♦', '♣']
    RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    
    def __init__(self, suit: str, rank: str):
        self.suit = suit
        self.rank = rank
    
    def __str__(self):
        return f"{self.rank}{self.suit}"
    
    def value(self) -> int:
        """Get card value for blackjack"""
        if self.rank in ['J', 'Q', 'K']:
            return 10
        elif self.rank == 'A':
            return 11  # Aces handled separately
        else:
            return int(self.rank)
    
    def is_red(self) -> bool:
        """Check if card is red"""
        return self.suit in ['♥', '♦']
    
    def to_dict(self) -> Dict:
        """Convert card to dictionary"""
        return {
            'suit': self.suit,
            'rank': self.rank,
            'value': self.value(),
            'is_red': self.is_red()
        }

class Deck:
    """Represents a deck of playing cards"""
    
    def __init__(self):
        self.cards = []
        self.reset()
    
    def reset(self):
        """Reset deck to full 52 cards"""
        self.cards = []
        for suit in Card.SUITS:
            for rank in Card.RANKS:
                self.cards.append(Card(suit, rank))
        self.shuffle()
    
    def shuffle(self):
        """Shuffle the deck"""
        random.shuffle(self.cards)
    
    def deal_card(self) -> Optional[Card]:
        """Deal one card from the deck"""
        if self.cards:
            return self.cards.pop()
        return None
    
    def cards_remaining(self) -> int:
        """Get number of cards remaining"""
        return len(self.cards)

class BlackjackHand:
    """Represents a blackjack hand"""
    
    def __init__(self):
        self.cards = []
    
    def add_card(self, card: Card):
        """Add a card to the hand"""
        self.cards.append(card)
    
    def value(self) -> int:
        """Calculate hand value with ace handling"""
        total = 0
        aces = 0
        
        for card in self.cards:
            if card.rank == 'A':
                aces += 1
                total += 11
            else:
                total += card.value()
        
        # Adjust for aces
        while total > 21 and aces > 0:
            total -= 10
            aces -= 1
        
        return total
    
    def is_bust(self) -> bool:
        """Check if hand is bust"""
        return self.value() > 21
    
    def is_blackjack(self) -> bool:
        """Check if hand is blackjack"""
        return len(self.cards) == 2 and self.value() == 21
    
    def to_dict(self, hide_first: bool = False) -> Dict:
        """Convert hand to dictionary"""
        cards_data = []
        for i, card in enumerate(self.cards):
            if hide_first and i == 0:
                cards_data.append({'hidden': True})
            else:
                cards_data.append(card.to_dict())
        
        return {
            'cards': cards_data,
            'value': self.value() if not hide_first else None,
            'is_bust': self.is_bust(),
            'is_blackjack': self.is_blackjack(),
            'card_count': len(self.cards)
        }

class BlackjackGame:
    """Blackjack game logic"""
    
    def __init__(self):
        self.deck = Deck()
        self.player_hand = BlackjackHand()
        self.dealer_hand = BlackjackHand()
        self.game_over = False
        self.winner = None
        self.player_wins = 0
        self.dealer_wins = 0
        self.ties = 0
    
    def start_new_game(self) -> Dict:
        """Start a new game"""
        # Reset if deck is low
        if self.deck.cards_remaining() < 10:
            self.deck.reset()
        
        # Clear hands
        self.player_hand = BlackjackHand()
        self.dealer_hand = BlackjackHand()
        self.game_over = False
        self.winner = None
        
        # Deal initial cards
        self.player_hand.add_card(self.deck.deal_card())
        self.dealer_hand.add_card(self.deck.deal_card())
        self.player_hand.add_card(self.deck.deal_card())
        self.dealer_hand.add_card(self.deck.deal_card())
        
        # Check for blackjacks
        if self.player_hand.is_blackjack() or self.dealer_hand.is_blackjack():
            self.game_over = True
            self._determine_winner()
        
        return self.get_game_state()
    
    def hit(self) -> Dict:
        """Player hits"""
        if not self.game_over:
            self.player_hand.add_card(self.deck.deal_card())
            
            if self.player_hand.is_bust():
                self.game_over = True
                self.winner = 'dealer'
                self.dealer_wins += 1
        
        return self.get_game_state()
    
    def stand(self) -> Dict:
        """Player stands, dealer plays"""
        if not self.game_over:
            # Dealer hits on 16, stands on 17
            while self.dealer_hand.value() < 17:
                self.dealer_hand.add_card(self.deck.deal_card())
            
            self.game_over = True
            self._determine_winner()
        
        return self.get_game_state()
    
    def _determine_winner(self):
        """Determine the winner"""
        player_value = self.player_hand.value()
        dealer_value = self.dealer_hand.value()
        
        if self.player_hand.is_bust():
            self.winner = 'dealer'
            self.dealer_wins += 1
        elif self.dealer_hand.is_bust():
            self.winner = 'player'
            self.player_wins += 1
        elif self.player_hand.is_blackjack() and not self.dealer_hand.is_blackjack():
            self.winner = 'player'
            self.player_wins += 1
        elif self.dealer_hand.is_blackjack() and not self.player_hand.is_blackjack():
            self.winner = 'dealer'
            self.dealer_wins += 1
        elif player_value > dealer_value:
            self.winner = 'player'
            self.player_wins += 1
        elif dealer_value > player_value:
            self.winner = 'dealer'
            self.dealer_wins += 1
        else:
            self.winner = 'tie'
            self.ties += 1
    
    def get_game_state(self) -> Dict:
        """Get current game state"""
        return {
            'player_hand': self.player_hand.to_dict(),
            'dealer_hand': self.dealer_hand.to_dict(hide_first=not self.game_over),
            'game_over': self.game_over,
            'winner': self.winner,
            'stats': {
                'player_wins': self.player_wins,
                'dealer_wins': self.dealer_wins,
                'ties': self.ties
            },
            'cards_remaining': self.deck.cards_remaining()
        }

class RoshamboGame:
    """Rock-Paper-Scissors game logic"""
    
    CHOICES = ['rock', 'paper', 'scissors']
    CHOICE_EMOJIS = {
        'rock': '🗿',
        'paper': '📄',
        'scissors': '✂️'
    }
    
    def __init__(self):
        self.player_wins = 0
        self.computer_wins = 0
        self.ties = 0
        self.history = []
    
    def play_round(self, player_choice: str) -> Dict:
        """Play one round"""
        if player_choice not in self.CHOICES:
            raise ValueError(f"Invalid choice. Must be one of: {self.CHOICES}")
        
        computer_choice = random.choice(self.CHOICES)
        winner = self._determine_winner(player_choice, computer_choice)
        
        # Update stats
        if winner == 'player':
            self.player_wins += 1
        elif winner == 'computer':
            self.computer_wins += 1
        else:
            self.ties += 1
        
        # Add to history
        round_data = {
            'player_choice': player_choice,
            'computer_choice': computer_choice,
            'winner': winner,
            'round_number': len(self.history) + 1
        }
        self.history.append(round_data)
        
        return {
            'round': round_data,
            'stats': self.get_stats(),
            'choices': {
                'player': {
                    'choice': player_choice,
                    'emoji': self.CHOICE_EMOJIS[player_choice]
                },
                'computer': {
                    'choice': computer_choice,
                    'emoji': self.CHOICE_EMOJIS[computer_choice]
                }
            }
        }
    
    def _determine_winner(self, player: str, computer: str) -> str:
        """Determine round winner"""
        if player == computer:
            return 'tie'
        
        winning_combinations = {
            'rock': 'scissors',
            'paper': 'rock',
            'scissors': 'paper'
        }
        
        if winning_combinations[player] == computer:
            return 'player'
        else:
            return 'computer'
    
    def get_stats(self) -> Dict:
        """Get game statistics"""
        total_games = self.player_wins + self.computer_wins + self.ties
        
        return {
            'player_wins': self.player_wins,
            'computer_wins': self.computer_wins,
            'ties': self.ties,
            'total_games': total_games,
            'win_percentage': round((self.player_wins / total_games * 100) if total_games > 0 else 0, 1)
        }
    
    def reset_game(self) -> Dict:
        """Reset game statistics"""
        self.player_wins = 0
        self.computer_wins = 0
        self.ties = 0
        self.history = []
        
        return {
            'message': 'Game reset successfully',
            'stats': self.get_stats()
        }
