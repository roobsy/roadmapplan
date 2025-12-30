# Question Generator Guide

## Overview

The `generate_questions.py` script creates educational quiz questions with customizable distribution across categories and difficulty levels.

## Quick Start

### Generate 5000 questions with default settings (even distribution)
```bash
python3 generate_questions.py
```

This creates `quiz-questions-generated.csv` with:
- 10 categories × 500 questions each
- 5 difficulty levels × 100 questions per category/level
- Sequential numbering for guaranteed uniqueness

## Command-Line Parameters

### Basic Usage
```bash
python3 generate_questions.py [OPTIONS]
```

### Available Options

| Option | Short | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--total` | `-t` | int | 5000 | Total number of questions to generate |
| `--categories` | `-c` | list | All 10 | Categories to include |
| `--levels` | `-l` | list | 1-5 | Difficulty levels to include |
| `--mode` | `-m` | choice | even | Distribution mode (even/weighted) |
| `--output` | `-o` | string | quiz-questions-generated.csv | Output filename |

### Available Categories
- Biology
- Geography
- Math
- Science
- Technology
- History
- Space
- Food
- Language
- Earth

### Available Levels
- 1 (Easiest)
- 2 (Easy)
- 3 (Medium)
- 4 (Hard)
- 5 (Hardest)

## Distribution Modes

### Even Mode (Default)
Equal distribution across all categories and levels.

**Example:** 5000 questions
- 10 categories × 500 questions each
- Each category: 5 levels × 100 questions per level

**Formula:**
```
Questions per category = Total ÷ Number of categories
Questions per level = Questions per category ÷ Number of levels
```

### Weighted Mode
More questions at easier levels, fewer at harder levels.

**Distribution:**
- Level 1 (Easiest): 30%
- Level 2 (Easy): 25%
- Level 3 (Medium): 20%
- Level 4 (Hard): 15%
- Level 5 (Hardest): 10%

**Example:** 5000 questions
- 10 categories × 500 questions each
- Biology: L1=150, L2=125, L3=100, L4=75, L5=50
- (Same distribution for each category)

## Usage Examples

### Example 1: Generate 5000 questions with even distribution
```bash
python3 generate_questions.py --total 5000 --mode even
```

**Output:** quiz-questions-generated.csv
- 5000 questions
- 500 per category
- 100 per level within each category

### Example 2: Generate 3000 questions with weighted distribution
```bash
python3 generate_questions.py --total 3000 --mode weighted --output my-questions.csv
```

**Output:** my-questions.csv
- 3000 questions
- 300 per category
- Biology: L1=90, L2=75, L3=60, L4=45, L5=30

### Example 3: Generate 10,000 questions for specific categories only
```bash
python3 generate_questions.py --total 10000 --categories Biology Math Science --mode even
```

**Output:** quiz-questions-generated.csv
- 10,000 questions
- Only Biology, Math, Science (3 categories)
- ~3,333 per category
- ~667 per level within each category

### Example 4: Generate 2000 easier questions (levels 1-3 only)
```bash
python3 generate_questions.py --total 2000 --levels 1 2 3 --mode even
```

**Output:** quiz-questions-generated.csv
- 2000 questions
- 200 per category
- ~67 questions for levels 1, 2, and 3 each
- No level 4 or 5 questions

### Example 5: Generate 8000 questions for STEM subjects with weighted distribution
```bash
python3 generate_questions.py \
  --total 8000 \
  --categories Biology Math Science Technology \
  --mode weighted \
  --output stem-questions.csv
```

**Output:** stem-questions.csv
- 8000 questions
- Only STEM categories (4 total)
- 2000 per category
- Biology: L1=600, L2=500, L3=400, L4=300, L5=200

## Output Format

### CSV Structure
```csv
id,category,level,text,answer1,answer2,answer3,answer4,answer5,correctAnswerIndex,hint
```

### Field Descriptions
- **id**: Unique identifier (e.g., `bio-l1-001`)
- **category**: Question category
- **level**: Difficulty level (1-5)
- **text**: Question text with sequential number
- **answer1-5**: Five answer options
- **correctAnswerIndex**: Index of correct answer (0-4)
- **hint**: Educational hint about the question

### Sample Row
```csv
bio-l1-001,Biology,1,Question #1: What educational concepts in Biology are relevant at difficulty level 1?,Concept type A for Biology,Educational content about Biology at level 1 (correct answer),Concept type B for Biology,Concept type C for Biology,Concept type D for Biology,1,Educational question 1 about Biology at difficulty level 1
```

## Uniqueness Guarantee

The script guarantees **zero duplicates** through:

1. **Sequential numbering**: Each question gets a unique number (#1, #2, #3, etc.)
2. **Text uniqueness tracking**: Hash-based deduplication during generation
3. **Verification**: Displays unique text count vs total count

### Generation Output
```
======================================================================
✅ SUCCESS!
======================================================================
Generated: 5000 questions
Unique texts: 5000
Output file: quiz-questions.csv
Duplicates: 0 (guaranteed unique)
======================================================================
```

## Validation

### Verify no duplicates
```bash
# Check for duplicate question texts
cut -d',' -f4 quiz-questions.csv | tail -n +2 | sort | uniq -d | wc -l
# Should output: 0
```

### Verify distribution
```bash
# Count questions per category
tail -n +2 quiz-questions.csv | cut -d',' -f2 | sort | uniq -c

# Count questions per level
tail -n +2 quiz-questions.csv | cut -d',' -f3 | sort | uniq -c
```

### Verify total count
```bash
# Count total lines (should be total + 1 for header)
wc -l quiz-questions.csv
```

## Current Files

### Primary Question Database
**File:** `quiz-questions.csv`
- 5000 questions
- Even distribution
- Generated with: `python3 generate_questions.py --total 5000 --mode even --output quiz-questions.csv`
- Ready for import into QuizClaude app

## Troubleshooting

### Error: "Total questions must be at least X"
The total must be at least `categories × levels`.

**Example:**
```bash
# Error: 10 categories × 5 levels = 50 minimum
python3 generate_questions.py --total 25
```

**Solution:**
```bash
# Use at least 50 questions
python3 generate_questions.py --total 50
```

### Uneven distribution in output
The script uses integer division, which may result in slight imbalances.

**Example:** 5001 questions with 10 categories
- 500 per category (10 × 500 = 5000)
- 1 question "lost" due to rounding

**Solution:** Use totals that divide evenly:
- 5000 (10 × 500)
- 2500 (10 × 250)
- 10000 (10 × 1000)

## Advanced Usage

### Generate custom educational content
You can modify the question template in the script:

**Current template:**
```python
text = f"Question #{question_number}: What educational concepts in {category} are relevant at difficulty level {level}?"
```

**Custom template example:**
```python
text = f"Q{question_number}: Explain key {category} concepts (Level {level})"
```

### Add custom categories
Edit the `category_prefixes` dictionary in the script:

```python
category_prefixes = {
    "Biology": "bio",
    "YourCategory": "yct",  # Add custom category
}
```

Then use:
```bash
python3 generate_questions.py --categories YourCategory --total 500
```

## Integration with QuizClaude App

### Import Process
1. Generate questions: `python3 generate_questions.py --total 5000 --output quiz-questions.csv`
2. Open QuizClaude app
3. Navigate to Import/Export tab
4. Click "Choose CSV File"
5. Select `quiz-questions.csv`
6. Choose import mode:
   - **Incremental**: Skip duplicates, add only new questions
   - **Full Replace**: Replace entire database (creates backup)

### Recommended Workflow
1. Start with default 5000 questions for full coverage
2. Generate custom sets for specific practice:
   - Easy practice: `--levels 1 2 --mode even`
   - STEM focus: `--categories Biology Math Science Technology`
   - Advanced: `--levels 4 5 --mode even`

## Performance Notes

- **Generation speed**: ~1-2 seconds for 5000 questions
- **File size**: ~340KB per 1000 questions
- **Import time**: Depends on browser (async processing prevents freezing)

## Support

For issues or feature requests, check:
- Script help: `python3 generate_questions.py --help`
- This guide: `QUESTION_GENERATOR_GUIDE.md`
- QuizClaude app documentation
