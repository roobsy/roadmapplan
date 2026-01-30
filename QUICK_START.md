# QuizClaude - Quick Start Guide

## 🚀 First Time Setup

```cmd
# 1. Clone repository
cd C:\Users\RubenDrong\Google Drive\Ventures\App
git clone YOUR_REPO_URL roadmapplan
cd roadmapplan

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Open browser:** http://localhost:5173

---

## ⚡ Daily Workflow

### Morning: Get Latest Code & Start

```cmd
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude

git pull origin claude/quiz-app-build-D9svp
npm install
npm run dev
```

### Evening: Save Your Work

```cmd
# Save locally only
git add .
git commit -m "feat: Description of what you did"

# OR save to GitHub
git add .
git commit -m "feat: Description of what you did"
git push origin claude/quiz-app-build-D9svp
```

---

## 📋 Essential Commands

### Git Commands

| Command | What It Does |
|---------|--------------|
| `git status` | See what files changed |
| `git pull origin claude/quiz-app-build-D9svp` | Get latest from GitHub |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes locally |
| `git push origin claude/quiz-app-build-D9svp` | Upload to GitHub |
| `git log --oneline` | View commit history |
| `git diff` | See what changed |

### NPM Commands

| Command | What It Does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Question Merger

| Command | What It Does |
|---------|--------------|
| `python merge_question_files.py --input folder --output merged.csv` | Merge XLSX/CSV files |
| `python merge_question_files.py --input folder --debug` | Merge with diagnostics |
| `type merge-log.txt` | View merge log |

---

## 🔄 Sync Workflow

### Pull Latest Changes

```cmd
# Save your work first
git stash

# Get latest
git pull origin claude/quiz-app-build-D9svp

# Restore your work
git stash pop
```

### Push Your Changes

```cmd
git add .
git commit -m "Your message"
git push origin claude/quiz-app-build-D9svp
```

---

## ⏮️ Undo Commands

| Command | What It Does |
|---------|--------------|
| `git reset HEAD~1` | Undo last commit (keep files) |
| `git reset --hard HEAD` | Discard ALL local changes |
| `git checkout -- file.tsx` | Discard changes to one file |
| `git revert HEAD` | Undo last commit (safe, keeps history) |
| `git checkout 0d7ff08` | Go back to specific commit |

---

## 🆘 Emergency Fixes

### App Broken? Start Fresh

```cmd
git fetch origin
git reset --hard origin/claude/quiz-app-build-D9svp
npm install
npm run dev
```

### Wrong Commit Message?

```cmd
git commit --amend -m "Correct message"
```

### Forgot to Add File?

```cmd
git add forgotten-file.tsx
git commit --amend --no-edit
```

---

## 📁 Important Paths

```
Project Root: C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude

Source Code: src/
Build Output: dist/
Questions: Questions_Repo/
```

---

## 🎯 Common Tasks

### Task: Import New Questions

```cmd
# 1. Put XLSX/CSV files in Questions_Repo folder

# 2. Run merger
python merge_question_files.py --input Questions_Repo --output quiz-merged.csv

# 3. Check log
type merge-log.txt

# 4. Import in app
# Open app → Import/Export tab → Choose quiz-merged.csv → Import
```

### Task: Build for Production

```cmd
npm run build
# Output in dist/ folder
```

### Task: Switch Branches

```cmd
# See all branches
git branch -a

# Switch to main
git checkout main

# Switch to dev branch
git checkout claude/quiz-app-build-D9svp
```

---

## ✅ Pre-Push Checklist

Before pushing to GitHub:

- [ ] Code works locally (`npm run dev`)
- [ ] No console errors
- [ ] Commit message is clear
- [ ] Pulled latest changes (`git pull`)
- [ ] No merge conflicts

---

## 🔗 Full Documentation

For complete details, see: `GIT_AND_DEV_COMMANDS.md`
