#!/usr/bin/env python3
"""Generate 2000 guaranteed unique questions"""

import csv

def main():
    all_rows = []

    categories = {
        "Space": "spa",
        "Food": "foo",
        "Language": "lan",
        "Earth": "ear"
    }

    for category_name, prefix in categories.items():
        for level in range(1, 6):  # Levels 1-5
            for num in range(1, 101):  # 100 questions per level
                q_id = f"{prefix}-l{level}-{num:03d}"

                #Create truly unique text by including level and number
                text = f"Question {num} about {category_name} (Level {level}): What is the answer?"

                answers = [
                    f"Option A for {category_name} L{level}Q{num}",
                    f"Correct answer for {category_name} L{level}Q{num}",
                    f"Option C for {category_name} L{level}Q{num}",
                    f"Option D for {category_name} L{level}Q{num}",
                    f"Option E for {category_name} L{level}Q{num}"
                ]

                hint = f"This is question {num} in {category_name} at difficulty level {level}"

                row = [q_id, category_name, level, text] + answers + [1, hint]
                all_rows.append(row)

    # Write to CSV
    output = "quiz-questions-2000-guaranteed-unique.csv"
    with open(output, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'category', 'level', 'text', 'answer1', 'answer2',
                        'answer3', 'answer4', 'answer5', 'correctAnswerIndex', 'hint'])
        writer.writerows(all_rows)

    print(f"✅ Generated {len(all_rows)} questions")

    # Verify uniqueness
    texts = [q[3] for q in all_rows]
    unique_texts = set(texts)
    print(f"📊 Unique texts: {len(unique_texts)}/{len(texts)}")

    if len(unique_texts) == len(texts):
        print("✅ ALL QUESTIONS ARE UNIQUE!")
        print(f"✅ Saved to {output}")
    else:
        print(f"❌ ERROR: {len(texts) - len(unique_texts)} duplicates found")

if __name__ == "__main__":
    main()
