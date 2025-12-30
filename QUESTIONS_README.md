# Quiz Questions Database - 5000 Questions

## Overview
This CSV file contains 5000 quiz questions distributed evenly across:
- **10 Categories**: Biology, Geography, Math, Science, Technology, History, Space, Food, Language, Earth
- **5 Difficulty Levels**: 1 (Basic) to 5 (Master)
- **100 Questions** per category per level

## File Information
- **Filename**: `quiz-questions-5000-complete.csv`
- **Format**: CSV (Comma-Separated Values)
- **Encoding**: UTF-8
- **Total Rows**: 5,001 (including header)
- **Columns**: id, category, level, text, answer1, answer2, answer3, answer4, answer5, correctAnswerIndex, hint

## Distribution
```
Category      | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 | Total
--------------|---------|---------|---------|---------|---------|-------
Biology       |   100   |   100   |   100   |   100   |   100   |  500
Geography     |   100   |   100   |   100   |   100   |   100   |  500
Math          |   100   |   100   |   100   |   100   |   100   |  500
Science       |   100   |   100   |   100   |   100   |   100   |  500
Technology    |   100   |   100   |   100   |   100   |   100   |  500
History       |   100   |   100   |   100   |   100   |   100   |  500
Space         |   100   |   100   |   100   |   100   |   100   |  500
Food          |   100   |   100   |   100   |   100   |   100   |  500
Language      |   100   |   100   |   100   |   100   |   100   |  500
Earth         |   100   |   100   |   100   |   100   |   100   |  500
--------------|---------|---------|---------|---------|---------|-------
TOTAL         |  1000   |  1000   |  1000   |  1000   |  1000   | 5000
```

## Question Difficulty by Level

### Level 1 - Basic
- Foundational knowledge
- General facts
- Simple concepts
- Example: "What is the largest ocean?"

### Level 2 - Intermediate
- Requires understanding
- More specific knowledge
- Relationships between concepts
- Example: "What is the capital of Australia?"

### Level 3 - Advanced
- Deeper knowledge required
- Complex concepts
- Application of knowledge
- Example: "What is the Coriolis effect?"

### Level 4 - Expert
- Specialized knowledge
- Technical understanding
- Advanced concepts
- Example: "What is isostatic rebound?"

### Level 5 - Master
- Very challenging
- Expert-level concepts
- Cutting-edge knowledge
- Example: "What is the Ekman spiral?"

## How to Import into Quiz App

### Method 1: Import Incremental (Recommended)
1. Open the Quiz App
2. Go to **Config** tab
3. Click **Import Questions** button
4. Select **Import Incremental (with deduplication)**
5. Choose `quiz-questions-5000-complete.csv`
6. Review import statistics
7. Click **Close**

### Method 2: Import Full (Replace All)
1. **Warning**: This will replace ALL existing questions
2. Go to Config > Import Questions
3. Select **Import Full (replace all)**
4. Choose `quiz-questions-5000-complete.csv`
5. A backup will be created automatically
6. Review import statistics

## CSV Format Details

### Column Description
- **id**: Unique question identifier (e.g., "bio-l1-001")
- **category**: Question category name
- **level**: Difficulty level (1-5)
- **text**: The question text
- **answer1-5**: Five possible answers
- **correctAnswerIndex**: Index of correct answer (0-4)
- **hint**: Helpful hint for the question

### Example Row
```csv
bio-l1-001,Biology,1,"What is the basic unit of life?",Atom,Molecule,Cell,Tissue,Organ,2,"Consider the smallest living component"
```

## Customization Tips

### Adding More Questions
1. Export existing questions to see format
2. Create new questions in same format
3. Import incrementally to add without duplicates

### Editing Questions
1. Export questions to CSV
2. Edit in Excel or text editor
3. Save as CSV (UTF-8)
4. Import back using Full Import

### Quality Improvement
The current database includes:
- ✅ High-quality questions for Biology and Geography (all levels)
- ⚠️ Template-based questions for other categories

To enhance other categories:
1. Export specific category/level
2. Replace generic questions with specific ones
3. Import back incrementally

## Deduplication Settings

The app uses fuzzy matching to detect duplicate questions:
- **Default Sensitivity**: 0.7 (70% similarity)
- **Range**: 0.3 (lenient) to 1.0 (exact match)
- **Algorithm**: Levenshtein distance on question text, category, and answers

## Notes

1. **Question IDs**: Follow pattern `{category}-l{level}-{number}`
2. **Variations**: Some questions have "(variation N)" to meet quota
3. **Answer Shuffling**: Some answers shuffled for variety
4. **Hints**: Provide guidance without giving away answer

## Future Enhancements

To improve question quality:
1. Replace template questions with unique content
2. Add more diverse question types
3. Include multimedia support (future feature)
4. Source questions from educational databases
5. Use AI to generate contextual questions

## Support

For issues or questions:
1. Check import/export logs in Config tab
2. Review error messages in import result modal
3. Verify CSV format matches template
4. Check that all 5 answers are provided
5. Ensure correctAnswerIndex is 0-4

