#!/usr/bin/env python3
"""
Quick validation script for BLinko fixes
"""

import sys
import os

# Mock pygame before importing
sys.modules['pygame'] = type(sys)('pygame')
sys.modules['pygame.display'] = type(sys)('pygame.display') 
sys.modules['pygame.time'] = type(sys)('pygame.time')
sys.modules['pygame.font'] = type(sys)('pygame.font')

from BLinko import generate_pegs, define_payout_bins

def test_payout_bins():
    """Test that payout bins don't overlap and cover full range"""
    print("Testing Payout Bins...")
    bins = define_payout_bins()
    
    # Sort bins by start position
    sorted_bins = sorted(bins, key=lambda x: x['range'][0])
    
    print(f"Number of bins: {len(bins)}")
    
    # Check for overlaps
    overlaps = []
    for i in range(len(sorted_bins) - 1):
        current_end = sorted_bins[i]['range'][1]
        next_start = sorted_bins[i+1]['range'][0]
        
        if current_end > next_start:
            overlaps.append((sorted_bins[i]['label'], sorted_bins[i+1]['label']))
        
        print(f"{sorted_bins[i]['label']:12} | Range: {sorted_bins[i]['range'][0]:3}-{sorted_bins[i]['range'][1]:3} | Multiplier: {sorted_bins[i]['multiplier']:6}")
    
    if len(sorted_bins) > 0:
        print(f"{sorted_bins[-1]['label']:12} | Range: {sorted_bins[-1]['range'][0]:3}-{sorted_bins[-1]['range'][1]:3} | Multiplier: {sorted_bins[-1]['multiplier']:6}")
    
    if overlaps:
        print(f"❌ OVERLAPS FOUND: {overlaps}")
        return False
    else:
        print("✅ NO OVERLAPS FOUND")
        return True

def test_peg_staggering():
    """Test that pegs are properly staggered"""
    print("\nTesting Peg Staggering...")
    pegs = generate_pegs(rows=4, cols=4)
    
    # Group pegs by approximate row
    y_spacing = 600 / (4 + 1)  # SCREEN_HEIGHT / (rows + 1)
    rows = {}
    
    for peg_x, peg_y in pegs:
        row = round(peg_y / y_spacing)
        if row not in rows:
            rows[row] = []
        rows[row].append(peg_x)
    
    print(f"Generated {len(pegs)} pegs in {len(rows)} rows")
    
    # Check staggering pattern
    staggered_correctly = True
    for row_num, x_positions in rows.items():
        if len(x_positions) > 1:
            x_positions.sort()
            spacings = [x_positions[i+1] - x_positions[i] for i in range(len(x_positions)-1)]
            avg_spacing = sum(spacings) / len(spacings) if spacings else 0
            print(f"Row {row_num}: {len(x_positions)} pegs, avg spacing: {avg_spacing:.1f}")
    
    # Check that even and odd rows are offset
    even_rows = [x for row, x_list in rows.items() if row % 2 == 0 for x in x_list]
    odd_rows = [x for row, x_list in rows.items() if row % 2 == 1 for x in x_list]
    
    if even_rows and odd_rows:
        even_avg = sum(even_rows) / len(even_rows)
        odd_avg = sum(odd_rows) / len(odd_rows)
        offset = abs(even_avg - odd_avg)
        print(f"Even row avg X: {even_avg:.1f}")
        print(f"Odd row avg X: {odd_avg:.1f}")
        print(f"Offset: {offset:.1f}")
        
        if offset > 10:  # Should have noticeable offset
            print("✅ STAGGERING WORKING")
            return True
        else:
            print("❌ INSUFFICIENT STAGGERING")
            return False
    else:
        print("❌ MISSING ROW DATA")
        return False

def test_bin_coverage():
    """Test that bins cover entire screen height"""
    print("\nTesting Bin Coverage...")
    bins = define_payout_bins()
    
    # Find min and max coverage
    min_y = min(bin_info['range'][0] for bin_info in bins)
    max_y = max(bin_info['range'][1] for bin_info in bins)
    
    print(f"Coverage: {min_y} to {max_y} (should be 0 to 600)")
    
    if min_y == 0 and max_y == 600:
        print("✅ FULL COVERAGE")
        return True
    else:
        print("❌ INCOMPLETE COVERAGE")
        return False

def test_payout_examples():
    """Test specific payout examples"""
    print("\nTesting Payout Examples...")
    bins = define_payout_bins()
    
    test_cases = [
        (5, "GRAND SLAM", 1500),
        (25, "HOME RUN", 50),
        (150, "Double", 5),
        (300, "Fly Out", 0.5)
    ]
    
    all_passed = True
    
    for y_pos, expected_label, expected_multiplier in test_cases:
        # Find matching bin
        matching_bin = None
        for bin_info in bins:
            if bin_info['range'][0] <= y_pos < bin_info['range'][1]:
                matching_bin = bin_info
                break
        
        if matching_bin:
            actual_label = matching_bin['label']
            actual_multiplier = matching_bin['multiplier']
            
            if actual_label == expected_label and actual_multiplier == expected_multiplier:
                print(f"✅ Y={y_pos:3}: {actual_label} (x{actual_multiplier})")
            else:
                print(f"❌ Y={y_pos:3}: Expected {expected_label} (x{expected_multiplier}), got {actual_label} (x{actual_multiplier})")
                all_passed = False
        else:
            print(f"❌ Y={y_pos:3}: No matching bin found")
            all_passed = False
    
    return all_passed

if __name__ == "__main__":
    print("=" * 50)
    print("BLinko Validation Script")
    print("=" * 50)
    
    results = []
    results.append(test_payout_bins())
    results.append(test_peg_staggering())
    results.append(test_bin_coverage())
    results.append(test_payout_examples())
    
    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! BLinko is ready for showcase!")
    else:
        print("⚠️  Some issues remain to be fixed")
    
    print("=" * 50)
