# Which CSV File to Use?

## ✅ USE THIS FILE

**File:** `quiz-questions.csv`
**Size:** 1.7MB
**Questions:** 5000
**Generated:** Latest (parameterized generator)
**Format:** Clean, no parenthetical text

### Sample Question Format:
```
Question #602: What educational concepts in Geography are relevant at difficulty level 2?
```

**How to use:**
1. Import this file into QuizClaude app
2. Use "Import Full" to replace entire database
3. Or use "Incremental" to add only new questions

---

## 📁 Old Files (Archived)

All previous CSV files have been moved to `old_generated_csvs/` folder to avoid confusion.

### Why the old files had "(Level X, Question Y)"?

**Reason:** The older `generate_5000_final.py` script used a fallback generator that added parenthetical text like "(Level 2, Question 1)" to ensure uniqueness when it couldn't create enough variations from educational facts.

**Example from old file:**
```
What are important concepts in Biology? (Level 2, Question 1)
```

**Problem:** This parenthetical text is not user-friendly and shouldn't be shown to quiz takers.

**Solution:** The new `generate_questions.py` script uses sequential numbering (#1, #2, #3...) which guarantees uniqueness WITHOUT adding parenthetical suffixes.

---

## File Comparison

| File | Questions | Parenthetical Text? | Use? |
|------|-----------|---------------------|------|
| **quiz-questions.csv** | 5000 | ❌ No (Clean) | ✅ **YES - Use this!** |
| old_generated_csvs/quiz-questions-5000-FINAL-UNIQUE.csv | 5300 | ✅ Yes (rows 602+) | ❌ No (archived) |
| old_generated_csvs/quiz-questions-5000-CLEAN.csv | 5000 | Partial | ❌ No (archived) |
| quiz-questions-sample.csv | ~100 | ❌ No | ⚠️ Only for testing |

---

## Verification Commands

### Check if file has parenthetical text:
```bash
grep -c "(Level.*Question.*)" quiz-questions.csv
# Should output: 0
```

### View sample questions:
```bash
# Rows 600-610
sed -n '600,610p' quiz-questions.csv | cut -d',' -f1-4
```

### Check last few questions:
```bash
tail -n 5 quiz-questions.csv | cut -d',' -f1-4
```

---

## Summary

- ✅ **Use:** `quiz-questions.csv` (1.7MB, 5000 questions, clean format)
- ❌ **Don't use:** Files in `old_generated_csvs/` (archived versions)
- 📚 **Reference:** See `QUESTION_GENERATOR_GUIDE.md` for how to generate new custom sets

The new file has clean question texts without any parenthetical suffixes, making it perfect for displaying to quiz users.
