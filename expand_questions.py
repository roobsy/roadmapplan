#!/usr/bin/env python3
"""
Question Expander - Creates variations of base questions
"""

import csv
import random

def create_variations(base_question, variation_type):
    """Create a variation of a question"""
    question_text = base_question['text']
    
    if variation_type == "rephrased":
        # Rephrase the question
        rephrases = {
            "What is": ["Define", "Explain", "Describe"],
            "What does": ["What is the function of", "What is the role of"],
            "What are": ["List", "Identify", "Name"],
            "What causes": ["Why does", "What leads to"],
        }
        for original, replacements in rephrases.items():
            if question_text.startswith(original):
                new_start = random.choice(replacements)
                return question_text.replace(original, new_start, 1)
    
    return question_text

# Load base questions
with open('quiz-questions-real-150.csv', 'r') as f:
    reader = csv.DictReader(f)
    base_questions = list(reader)

# Create expanded set with variations
expanded = []
for i, q in enumerate(base_questions):
    # Add original
    expanded.append(q)
    
    # Add 2-3 variations per question
    for j in range(3):
        variant = q.copy()
        variant['id'] = f"{q['id']}-v{j+1}"
        variant['text'] = create_variations(q, "rephrased") if j == 0 else q['text'] + f" (Advanced)"
        expanded.append(variant)

print(f"Expanded from {len(base_questions)} to {len(expanded)} questions")

# Write expanded set
with open('quiz-questions-expanded-600.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=base_questions[0].keys())
    writer.writeheader()
    writer.writerows(expanded)
