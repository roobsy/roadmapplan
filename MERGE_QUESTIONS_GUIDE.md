# Question File Merger - Complete Guide

## Overview

`merge_question_files.py` is a professional data validation and merging tool that:
- ✅ Reads multiple XLSX files containing quiz questions
- ✅ Validates data structure and content
- ✅ Merges into a single CSV file
- ✅ Renumbers IDs sequentially
- ✅ Creates comprehensive validation logs
- ✅ Generates detailed error reports

## Installation Requirements

### Required Python Packages

```bash
# Install required packages
pip install pandas openpyxl
```

Or using requirements file:
```bash
# Create requirements.txt
cat > requirements.txt <<EOF
pandas>=2.0.0
openpyxl>=3.1.0
EOF

# Install
pip install -r requirements.txt
```

## Quick Start

### Basic Usage

```bash
# Merge all XLSX files from a folder
python merge_question_files.py --input question_files --output quiz-questions-merged.csv
```

This will:
1. Read all `*.xlsx` files from `question_files/` folder
2. Validate each row
3. Merge valid rows into `quiz-questions-merged.csv`
4. Create `merge-log.txt` with detailed report

## Command-Line Options

### Required Arguments

| Argument | Short | Description |
|----------|-------|-------------|
| `--input` | `-i` | Input folder containing XLSX files (required) |

### Optional Arguments

| Argument | Short | Default | Description |
|----------|-------|---------|-------------|
| `--output` | `-o` | merged-questions.csv | Output CSV filename |
| `--log` | `-l` | merge-log.txt | Log filename |
| `--dry-run` | - | False | Validation only (no output) |

## Usage Examples

### Example 1: Basic Merge
```bash
python merge_question_files.py --input questions --output final-questions.csv
```

### Example 2: Custom Log File
```bash
python merge_question_files.py \
  --input questions \
  --output merged.csv \
  --log detailed-log.txt
```

### Example 3: Validation Only (Dry Run)
```bash
# Check for errors without creating output
python merge_question_files.py --input questions --dry-run
```

### Example 4: Process Specific Folder
```bash
python merge_question_files.py \
  --input /path/to/question_files \
  --output /path/to/output/questions.csv \
  --log /path/to/logs/merge.log
```

## Input File Format

### Required XLSX Structure

Each XLSX file must have these columns (in any order):

| Column | Type | Required | Valid Values |
|--------|------|----------|--------------|
| `id` | Text | ✅ Yes | Any unique identifier |
| `category` | Text | ✅ Yes | Biology, Geography, Math, Science, Technology, History, Space, Food, Language, Earth |
| `level` | Integer | ✅ Yes | 1, 2, 3, 4, 5 |
| `text` | Text | ✅ Yes | Question text (min 5 chars) |
| `answer1` | Text | ✅ Yes | First answer option |
| `answer2` | Text | ✅ Yes | Second answer option |
| `answer3` | Text | ✅ Yes | Third answer option |
| `answer4` | Text | ✅ Yes | Fourth answer option |
| `answer5` | Text | ✅ Yes | Fifth answer option |
| `correctAnswerIndex` | Integer | ✅ Yes | 0, 1, 2, 3, or 4 |
| `hint` | Text | ✅ Yes | Hint text |

### Sample XLSX Content

**File: biology-easy.xlsx**

| id | category | level | text | answer1 | answer2 | answer3 | answer4 | answer5 | correctAnswerIndex | hint |
|----|----------|-------|------|---------|---------|---------|---------|---------|-------------------|------|
| bio-01 | Biology | 1 | What is DNA? | A protein | Genetic material | A cell | A tissue | An organ | 1 | DNA stores genetic info |
| bio-02 | Biology | 1 | What are cells? | Basic units of life | Molecules | Atoms | Tissues | Organs | 0 | Cells are the smallest living units |

**File: geography-easy.xlsx**

| id | category | level | text | answer1 | answer2 | answer3 | answer4 | answer5 | correctAnswerIndex | hint |
|----|----------|-------|------|---------|---------|---------|---------|---------|-------------------|------|
| geo-01 | Geography | 1 | What is the capital of France? | London | Paris | Berlin | Rome | Madrid | 1 | France's capital |
| geo-02 | Geography | 1 | Largest ocean? | Atlantic | Pacific | Indian | Arctic | Southern | 1 | Pacific is largest |

## Output Files

### 1. Merged CSV File

**File:** `merged-questions.csv` (or your specified output)

Features:
- ✅ All valid questions merged
- ✅ IDs renumbered sequentially: `bio-l1-0001`, `bio-l1-0002`, etc.
- ✅ Proper CSV format for QuizClaude import
- ✅ UTF-8 encoding

**Format:**
```csv
id,category,level,text,answer1,answer2,answer3,answer4,answer5,correctAnswerIndex,hint
bio-l1-0001,Biology,1,What is DNA?,A protein,Genetic material,A cell,A tissue,An organ,1,DNA stores genetic info
bio-l1-0002,Biology,1,What are cells?,Basic units of life,Molecules,Atoms,Tissues,Organs,0,Cells are the smallest living units
geo-l1-0003,Geography,1,What is the capital of France?,London,Paris,Berlin,Rome,Madrid,1,France's capital
```

### 2. Detailed Log File

**File:** `merge-log.txt` (or your specified log)

**Log Structure:**

```
================================================================================
QUESTION FILE MERGER - DETAILED LOG
================================================================================
Timestamp: 2024-12-30 18:45:23
Source Folder: questions
Output CSV: merged-questions.csv

================================================================================
1. SOURCE FILES SUMMARY
================================================================================
Total source files found: 50
Successfully read: 50
Failed to read: 0

================================================================================
2. SOURCE FILE DETAILS (MATRIX)
================================================================================
File Name                                Rows     Valid    Invalid  Warnings   Categories
--------------------------------------------------------------------------------
biology-level1.xlsx                      100      100      0        0          Biology
biology-level2.xlsx                      100      98       2        1          Biology
geography-level1.xlsx                    100      100      0        0          Geography
...

================================================================================
3. MERGE OUTPUT SUMMARY
================================================================================
3.1 MERGE STATISTICS:
  Total source rows (all files): 5000
  Merged rows (output file): 4985
  Merge rate: 99.7%

3.2 VALIDATION RESULTS:
  Valid rows: 4985
  Invalid rows (excluded): 15
  Rows with warnings (included): 5

================================================================================
4. DETAILED ERROR REPORT (MATRIX)
================================================================================
#     Source File                    Row#   Error/Warning
--------------------------------------------------------------------------------
1     biology-level2.xlsx            45     ERRORS: 1
      → Invalid level datatype: 'two'. Expected integer 1-5

2     geography-level3.xlsx          78     ERRORS: 2
      → Empty value in column: text
      → Empty answer in answer3

================================================================================
5. DETAILED WARNING REPORT
================================================================================
#     Source File                    Row#   Warnings
--------------------------------------------------------------------------------
1     math-level1.xlsx               23     WARNINGS: 1
      ⚠ Question text too short: 'What?'

================================================================================
FINAL SUMMARY
================================================================================
✓ Successfully merged 4985 questions
✓ Output file: merged-questions.csv
⚠ 15 rows excluded due to errors
================================================================================
```

## Validation Rules

### Critical Errors (Row Excluded)

These cause a row to be **excluded** from output:

1. **Missing columns** - Any of the 11 required columns missing
2. **Empty required fields** - Any required field is empty or null
3. **Invalid level** - Level is not 1, 2, 3, 4, or 5
4. **Invalid level datatype** - Level is not an integer
5. **Invalid correctAnswerIndex** - Not in range 0-4
6. **Invalid correctAnswerIndex datatype** - Not an integer
7. **Empty answers** - Any of answer1-5 is empty

### Warnings (Row Included)

These generate **warnings** but row is still included:

1. **Invalid category** - Category not in predefined list (still included)
2. **Short question text** - Question less than 5 characters
3. **Duplicate answers** - Same text in multiple answer options

## ID Renumbering Logic

### Original IDs (in XLSX files)
```
File 1: bio-001, bio-002, bio-003
File 2: geo-001, geo-002, geo-003
File 3: mat-001, mat-002, mat-003
```

### Renumbered IDs (in merged CSV)
```
Row 1: bio-l1-0001  (category: Biology, level: 1, sequential: 0001)
Row 2: bio-l1-0002  (category: Biology, level: 1, sequential: 0002)
Row 3: geo-l1-0003  (category: Geography, level: 1, sequential: 0003)
Row 4: mat-l1-0004  (category: Math, level: 1, sequential: 0004)
```

**Format:** `{category-prefix}-l{level}-{sequential-number}`

**Category Prefixes:**
- Biology → bio
- Geography → geo
- Math → mat
- Science → sci
- Technology → tec
- History → his
- Space → spa
- Food → foo
- Language → lan
- Earth → ear

## Common Workflows

### Workflow 1: First-Time Merge

```bash
# Step 1: Organize your files
mkdir question_files
# Copy all XLSX files to question_files/

# Step 2: Dry run to check for errors
python merge_question_files.py --input question_files --dry-run

# Step 3: Review log file
cat merge-log.txt

# Step 4: Fix errors in source files

# Step 5: Final merge
python merge_question_files.py \
  --input question_files \
  --output final-questions.csv \
  --log final-merge.log
```

### Workflow 2: Incremental Addition

```bash
# You have existing merged file and want to add new questions

# Step 1: Put new XLSX files in a separate folder
mkdir new_questions

# Step 2: Merge new questions
python merge_question_files.py \
  --input new_questions \
  --output new-batch.csv

# Step 3: Combine with existing
# (You'll need to do this manually or create another script)
cat final-questions.csv new-batch.csv > combined.csv
# (Then remove duplicate header row)
```

### Workflow 3: Quality Control

```bash
# Step 1: Merge with detailed logging
python merge_question_files.py \
  --input questions \
  --output merged.csv \
  --log quality-check.log

# Step 2: Review errors
grep "ERRORS:" quality-check.log

# Step 3: Review warnings
grep "WARNINGS:" quality-check.log

# Step 4: Fix and re-merge
python merge_question_files.py \
  --input questions \
  --output merged-v2.csv \
  --log quality-check-v2.log
```

## Troubleshooting

### Error: "No XLSX files found"

**Problem:** Script can't find any XLSX files in the input folder.

**Solution:**
```bash
# Check folder contents
ls -la question_files/

# Ensure files have .xlsx extension (not .xls)
file question_files/*.xlsx

# Check you're pointing to correct folder
python merge_question_files.py --input correct_folder_name
```

### Error: "Missing column: X"

**Problem:** One or more XLSX files missing required columns.

**Solution:**
1. Check log file to see which source file has the issue
2. Open that XLSX file
3. Ensure all 11 required columns exist
4. Check for typos in column names (case-sensitive)

### Error: "Invalid level datatype"

**Problem:** Level column contains text instead of numbers.

**Solution:**
```
# Bad:
level: "one", "two", "three"

# Good:
level: 1, 2, 3
```

### Warning: "Invalid category"

**Problem:** Category not in predefined list.

**Solution:**
```
# Valid categories:
Biology, Geography, Math, Science, Technology,
History, Space, Food, Language, Earth

# Check for typos:
"Biologie" → "Biology"
"Math " → "Math" (extra space)
```

### Many Rows Excluded

**Problem:** Log shows many invalid rows.

**Solution:**
1. Review "DETAILED ERROR REPORT" section in log
2. Common issues:
   - Empty cells in required fields
   - Wrong data types (text in number fields)
   - Missing columns
3. Fix source files and re-run

## Advanced Usage

### Custom Validation Rules

To modify validation rules, edit the `QuestionValidator` class in `merge_question_files.py`:

```python
# Example: Add custom category
VALID_CATEGORIES = [
    'Biology', 'Geography', 'Math', 'Science', 'Technology',
    'History', 'Space', 'Food', 'Language', 'Earth',
    'YourCustomCategory'  # Add here
]

# Example: Change level range
VALID_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # Extend to 10 levels
```

### Batch Processing

Process multiple folders:

```bash
#!/bin/bash
# merge_all.sh

folders=("biology" "geography" "math" "science")

for folder in "${folders[@]}"; do
    echo "Processing $folder..."
    python merge_question_files.py \
        --input "questions/$folder" \
        --output "output/${folder}-merged.csv" \
        --log "logs/${folder}-log.txt"
done

# Combine all outputs
cat output/*-merged.csv > final-all-questions.csv
# (Remove duplicate headers manually)
```

## Performance

### Expected Performance

| Files | Rows/File | Total Rows | Processing Time |
|-------|-----------|------------|-----------------|
| 10 | 100 | 1,000 | ~2-3 seconds |
| 50 | 100 | 5,000 | ~5-10 seconds |
| 100 | 100 | 10,000 | ~10-20 seconds |
| 50 | 1000 | 50,000 | ~30-60 seconds |

*Times vary based on system performance and validation complexity*

### Memory Usage

- Small datasets (<10k rows): <100 MB
- Medium datasets (10-50k rows): 100-500 MB
- Large datasets (>50k rows): 500 MB - 2 GB

## Integration with QuizClaude App

### After Merging

```bash
# 1. Merge your questions
python merge_question_files.py --input questions --output final-questions.csv

# 2. Import into QuizClaude app
# - Open QuizClaude
# - Go to Import/Export tab
# - Select "Choose CSV File"
# - Choose final-questions.csv
# - Click "Import Full" or "Incremental"

# 3. Verify import
# - Check import log in app
# - Review any duplicates detected
# - Test quiz functionality
```

## Best Practices

### 1. Organize Source Files

```
question_files/
├── biology-level1.xlsx (100 questions)
├── biology-level2.xlsx (100 questions)
├── geography-level1.xlsx (100 questions)
├── geography-level2.xlsx (100 questions)
└── ...
```

### 2. Use Consistent Naming

```
# Good:
biology-level1.xlsx
biology-level2.xlsx
geography-level1.xlsx

# Avoid:
Bio L1.xlsx
geography_questions.xlsx
MATH-EASY.xlsx
```

### 3. Validate Before Bulk Creation

```bash
# Create 1-2 test files first
python merge_question_files.py --input test_questions --dry-run

# Review log for issues
# Fix template/process
# Then create all 50 files
```

### 4. Keep Backups

```bash
# Always backup before merge
cp -r question_files question_files_backup_$(date +%Y%m%d)

# Keep merge logs
mkdir logs
python merge_question_files.py \
  --input questions \
  --output merged.csv \
  --log logs/merge_$(date +%Y%m%d_%H%M%S).log
```

### 5. Version Control

```bash
# Track merged outputs
git add merged-questions.csv
git commit -m "Merged 5000 questions from 50 source files"

# Tag versions
git tag -a v1.0-5000questions -m "First complete 5000 question set"
```

## FAQ

### Q: Can I use XLS files instead of XLSX?

**A:** No, only XLSX format is supported. Convert XLS to XLSX:
```bash
# Using LibreOffice (command-line)
libreoffice --headless --convert-to xlsx *.xls
```

### Q: What if I have more than 11 columns?

**A:** Extra columns are ignored. Only the 11 required columns are processed.

### Q: Can I merge CSV files?

**A:** Currently only XLSX. To merge CSV files, convert to XLSX first or modify the script to support CSV input.

### Q: How do I handle duplicate questions across files?

**A:** The script doesn't detect semantic duplicates. You should:
1. Use dedupe logic in your XLSX creation process
2. Or use the app's "Incremental Import" to detect duplicates

### Q: Can I customize the ID format?

**A:** Yes, edit the ID generation section in `merge_question_files.py`:

```python
# Current format: bio-l1-0001
new_id = f"{category}-l{level}-{idx+1:04d}"

# Custom format: BIOLOGY_L1_Q0001
new_id = f"{category.upper()}_L{level}_Q{idx+1:04d}"
```

## Summary

This tool provides a **professional-grade solution** for merging multiple question files with:
- ✅ Comprehensive validation
- ✅ Detailed error reporting
- ✅ Sequential ID renumbering
- ✅ Quality assurance logging

Perfect for creating large-scale question databases from distributed sources!
