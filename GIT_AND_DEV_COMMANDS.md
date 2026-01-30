# QuizClaude - Complete Git & Development Command Guide

## Table of Contents
1. [Getting Latest Changes from GitHub](#1-getting-latest-changes-from-github)
2. [Building the App](#2-building-the-app)
3. [Running the App](#3-running-the-app)
4. [Git Workflow - Local vs Remote](#4-git-workflow---local-vs-remote)
5. [Syncing Between Local and Git](#5-syncing-between-local-and-git)
6. [Restoring Previous Versions](#6-restoring-previous-versions)
7. [Complete Workflow Examples](#7-complete-workflow-examples)

---

## 1. Getting Latest Changes from GitHub

### First Time Setup (Clone Repository)

```cmd
# Navigate to your projects folder
cd C:\Users\RubenDrong\Google Drive\Ventures\App

# Clone the repository
git clone https://github.com/YOUR_USERNAME/roadmapplan.git

# Enter the project folder
cd roadmapplan

# Check current branch
git branch
```

### Pull Latest Changes (Existing Repository)

```cmd
# Navigate to project folder
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude

# Check current status
git status

# See which branch you're on
git branch

# Fetch latest changes from remote (doesn't apply them yet)
git fetch origin

# Pull latest changes from current branch
git pull origin claude/quiz-app-build-D9svp

# Or pull from main branch
git pull origin main

# If you have local changes, stash them first:
git stash
git pull origin claude/quiz-app-build-D9svp
git stash pop
```

### Switch Between Branches

```cmd
# List all branches
git branch -a

# Switch to development branch
git checkout claude/quiz-app-build-D9svp

# Switch to main branch
git checkout main

# Create and switch to new branch
git checkout -b my-new-feature
```

---

## 2. Building the App

### Install Dependencies (First Time or After Updates)

```cmd
# Navigate to project root
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude

# Install Node.js dependencies
npm install

# Or if using yarn
yarn install
```

### Build for Development

```cmd
# Development build (faster, with source maps)
npm run dev

# This starts development server at http://localhost:5173
# Hot reload enabled - changes appear automatically
```

### Build for Production

```cmd
# Production build (optimized, minified)
npm run build

# Output goes to dist/ folder
# Files are optimized and compressed
```

### Preview Production Build

```cmd
# After building, preview the production version
npm run preview

# This starts server at http://localhost:4173
```

---

## 3. Running the App

### Development Mode (Recommended for Development)

**Order of Commands:**

```cmd
# Step 1: Navigate to project
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude

# Step 2: Install dependencies (if first time or package.json changed)
npm install

# Step 3: Start development server
npm run dev

# Server starts at: http://localhost:5173
# Press Ctrl+C to stop
```

**What Happens:**
- ✅ Vite dev server starts
- ✅ Hot Module Replacement (HMR) enabled
- ✅ TypeScript compilation
- ✅ React Fast Refresh
- ✅ Instant updates when you save files

### Production Mode

```cmd
# Step 1: Build production version
npm run build

# Step 2: Preview production build
npm run preview

# Or deploy dist/ folder to web server
```

### No Additional Services Needed

**Important:** QuizClaude is a frontend-only app:
- ❌ No database server needed (uses localStorage)
- ❌ No backend API server needed
- ❌ No authentication server needed
- ✅ Just the Vite dev server or static file server

---

## 4. Git Workflow - Local vs Remote

### Understanding Local vs Remote

**Local Changes (Your Computer):**
- Working Directory: Files you're editing
- Staging Area: Files marked to commit (`git add`)
- Local Repository: Committed changes (`git commit`)

**Remote Changes (GitHub):**
- Remote Repository: Changes pushed to GitHub (`git push`)

### Save Changes Locally Only

```cmd
# 1. Check what files changed
git status

# 2. Stage specific files
git add src/components/ImportExport.tsx
git add src/services/csvService.ts

# Or stage all changed files
git add .

# 3. Commit locally (NOT pushed to GitHub yet)
git commit -m "Your commit message describing changes"

# Changes are now saved locally
# But NOT yet on GitHub
```

### Save Changes to GitHub (Remote)

```cmd
# After committing locally, push to GitHub
git push origin claude/quiz-app-build-D9svp

# Or push to main branch
git push origin main

# First time pushing a new branch:
git push -u origin claude/quiz-app-build-D9svp
```

### Check Differences Before Committing

```cmd
# See what changed in working directory
git diff

# See what's staged for commit
git diff --cached

# See changes in specific file
git diff src/components/ImportExport.tsx

# See commit history
git log

# See commit history with graph
git log --oneline --graph --all
```

---

## 5. Syncing Between Local and Git

### Pull Changes from GitHub to Local

```cmd
# Method 1: Pull (fetch + merge)
git pull origin claude/quiz-app-build-D9svp

# Method 2: Fetch then merge manually
git fetch origin
git merge origin/claude/quiz-app-build-D9svp

# Method 3: Pull with rebase (cleaner history)
git pull --rebase origin claude/quiz-app-build-D9svp
```

### Handle Conflicts During Pull

```cmd
# If you have local changes when pulling:

# Option A: Stash your changes temporarily
git stash                              # Hide your changes
git pull origin claude/quiz-app-build-D9svp  # Pull updates
git stash pop                          # Restore your changes

# Option B: Commit your changes first
git add .
git commit -m "WIP: Save local changes"
git pull origin claude/quiz-app-build-D9svp
```

### Sync Fork with Upstream (If Using Fork)

```cmd
# Add upstream remote (one-time setup)
git remote add upstream https://github.com/ORIGINAL_OWNER/roadmapplan.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes to your branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 6. Restoring Previous Versions

### Restore Git Version (From GitHub)

#### View Available Versions

```cmd
# See commit history
git log --oneline

# Output example:
# 0d7ff08 fix: Add case-insensitive column mapping
# 34003ec feat: Add diagnostic features to question merger
# 090d967 feat: Add CSV file support to question merger
# 684d753 feat: Add professional question file merger

# See commits for specific file
git log -- src/components/ImportExport.tsx

# See branches
git branch -a
```

#### Restore Specific Commit

```cmd
# Method 1: Checkout specific commit (detached HEAD state)
git checkout 0d7ff08

# Look around, test the old version
# Return to current version:
git checkout claude/quiz-app-build-D9svp

# Method 2: Create new branch from old commit
git checkout -b restore-from-old-version 0d7ff08

# Method 3: Reset to specific commit (DESTRUCTIVE!)
git reset --hard 0d7ff08
# ⚠️ WARNING: This deletes all commits after 0d7ff08

# Method 4: Revert specific commit (creates new commit)
git revert 0d7ff08
# ✅ SAFE: Keeps history, creates new commit that undoes changes
```

#### Restore Specific File from Commit

```cmd
# Restore one file from specific commit
git checkout 0d7ff08 -- src/components/ImportExport.tsx

# Restore file from previous commit
git checkout HEAD~1 -- src/components/ImportExport.tsx

# Restore file from main branch
git checkout main -- src/components/ImportExport.tsx
```

#### Restore All Files from Remote

```cmd
# Discard ALL local changes and match remote exactly
git fetch origin
git reset --hard origin/claude/quiz-app-build-D9svp

# ⚠️ WARNING: This deletes ALL local uncommitted changes!
```

### Restore Local Version (Before Pushing)

#### Undo Last Commit (Keep Changes)

```cmd
# Undo last commit, keep files staged
git reset --soft HEAD~1

# Undo last commit, keep files unstaged
git reset HEAD~1

# Undo last commit, discard all changes
git reset --hard HEAD~1
```

#### Discard Uncommitted Changes

```cmd
# Discard changes to specific file
git checkout -- src/components/ImportExport.tsx

# Discard all unstaged changes
git checkout -- .

# Remove all untracked files
git clean -fd

# Discard everything (staged + unstaged)
git reset --hard HEAD
git clean -fd
```

#### Restore Deleted File

```cmd
# Find when file was deleted
git log -- path/to/deleted/file.tsx

# Restore from commit before deletion
git checkout COMMIT_HASH~1 -- path/to/deleted/file.tsx
```

### Create Backup Before Major Changes

```cmd
# Create backup branch
git branch backup-before-major-change

# Or create with current commit
git branch backup-$(date +%Y%m%d) HEAD

# List backups
git branch | grep backup
```

---

## 7. Complete Workflow Examples

### Example 1: Daily Development Workflow

```cmd
# Morning: Start work
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude
git status
git pull origin claude/quiz-app-build-D9svp
npm install                    # If package.json changed
npm run dev                    # Start dev server

# Work on features...
# Edit files in VS Code

# Evening: Save work
git status                     # Check what changed
git add .                      # Stage all changes
git commit -m "feat: Add new import feature"
git push origin claude/quiz-app-build-D9svp

# Or save locally without pushing:
git add .
git commit -m "WIP: In progress work"
# (Don't push yet)
```

### Example 2: Pull Latest Changes and Build

```cmd
# Get latest code
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude
git stash                      # Save local changes temporarily
git pull origin claude/quiz-app-build-D9svp
git stash pop                  # Restore local changes

# Rebuild
npm install                    # Update dependencies
npm run build                  # Production build

# Test
npm run preview                # Test production build
```

### Example 3: Fix Merge Conflict

```cmd
# Pull fails with conflict
git pull origin claude/quiz-app-build-D9svp
# CONFLICT: Merge conflict in src/components/ImportExport.tsx

# Option A: Use their version
git checkout --theirs src/components/ImportExport.tsx
git add src/components/ImportExport.tsx
git commit -m "Merge: Accept remote changes"

# Option B: Use your version
git checkout --ours src/components/ImportExport.tsx
git add src/components/ImportExport.tsx
git commit -m "Merge: Keep local changes"

# Option C: Manually resolve
# 1. Open file in VS Code
# 2. Look for conflict markers:
#    <<<<<<< HEAD
#    Your changes
#    =======
#    Their changes
#    >>>>>>> branch-name
# 3. Edit to resolve
# 4. Remove markers
# 5. Save file
git add src/components/ImportExport.tsx
git commit -m "Merge: Manually resolved conflicts"
```

### Example 4: Emergency Rollback

```cmd
# Oh no! The app is broken after last commit

# Quick fix: Undo last commit
git reset --hard HEAD~1

# If already pushed to GitHub:
git revert HEAD                # Creates new commit that undoes last commit
git push origin claude/quiz-app-build-D9svp

# Nuclear option: Reset to specific good commit
git log --oneline             # Find last good commit
git reset --hard 684d753      # Reset to that commit
git push -f origin claude/quiz-app-build-D9svp  # Force push (DANGEROUS!)
```

### Example 5: Create Feature Branch

```cmd
# Create feature branch from current branch
git checkout -b feature/new-quiz-mode

# Work on feature
# ... make changes ...

# Commit to feature branch
git add .
git commit -m "feat: Add timed quiz mode"

# Push feature branch to GitHub
git push -u origin feature/new-quiz-mode

# Switch back to main branch
git checkout claude/quiz-app-build-D9svp

# Later: Merge feature into main
git merge feature/new-quiz-mode

# Delete feature branch
git branch -d feature/new-quiz-mode
git push origin --delete feature/new-quiz-mode
```

### Example 6: Python Question Merger Workflow

```cmd
# Get latest merger script
git pull origin claude/quiz-app-build-D9svp

# Install Python dependencies (first time)
pip install pandas openpyxl

# Run merger
python merge_question_files.py --input "C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude\Questions_Repo" --output quiz-questions-merged.csv

# Check log
type merge-log.txt

# Import merged file into app
# Use QuizClaude UI: Import/Export tab → Choose CSV → Import
```

---

## Quick Reference Cheat Sheet

### Most Common Commands

```cmd
# GET LATEST CODE
git pull origin claude/quiz-app-build-D9svp

# SEE WHAT CHANGED
git status
git diff

# SAVE CHANGES LOCALLY
git add .
git commit -m "Description of changes"

# PUSH TO GITHUB
git push origin claude/quiz-app-build-D9svp

# START DEV SERVER
npm run dev

# BUILD PRODUCTION
npm run build

# UNDO LAST COMMIT (keep files)
git reset HEAD~1

# DISCARD ALL LOCAL CHANGES
git reset --hard HEAD
git clean -fd

# CREATE BACKUP
git branch backup-$(date +%Y%m%d)
```

### Emergency Commands

```cmd
# APP BROKEN - START FRESH
git fetch origin
git reset --hard origin/claude/quiz-app-build-D9svp
npm install
npm run dev

# ACCIDENTALLY DELETED FILES
git checkout HEAD -- .

# WRONG COMMIT MESSAGE
git commit --amend -m "New message"

# FORGOT TO ADD FILES TO COMMIT
git add forgotten-file.tsx
git commit --amend --no-edit
```

---

## File Locations Reference

### Project Structure

```
C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude\
├── src/                           # Source code
│   ├── components/                # React components
│   ├── services/                  # Business logic
│   ├── contexts/                  # React contexts
│   └── App.tsx                    # Main app
├── public/                        # Static files
├── dist/                          # Production build (generated)
├── node_modules/                  # Dependencies (generated)
├── package.json                   # Node dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── merge_question_files.py        # Question merger tool
├── generate_real_questions.py     # Question generator
└── README.md                      # Documentation
```

### Generated Files (Don't Commit)

```
node_modules/           # Dependencies (npm install)
dist/                   # Build output (npm run build)
*.log                   # Log files
.env.local              # Local environment variables
test-*.csv              # Test files
merge-log.txt           # Merge logs
```

---

## Troubleshooting

### "fatal: not a git repository"

```cmd
cd C:\Users\RubenDrong\Google Drive\Ventures\App\QuizClaude
git status
# If error, you're in wrong folder or need to clone
```

### "Your branch is behind"

```cmd
git pull origin claude/quiz-app-build-D9svp
```

### "You have unstaged changes"

```cmd
# Save changes
git add .
git commit -m "Save changes"

# Or discard changes
git reset --hard HEAD
```

### "npm: command not found"

```cmd
# Install Node.js from https://nodejs.org/
# Restart terminal after installation
node --version
npm --version
```

### "Permission denied" on Git Push

```cmd
# Check authentication
git config --global user.name
git config --global user.email

# Set credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Best Practices

✅ **DO:**
- Pull before starting work each day
- Commit frequently with clear messages
- Test before pushing to GitHub
- Create feature branches for big changes
- Keep commits small and focused
- Use meaningful commit messages

❌ **DON'T:**
- Force push (`git push -f`) to shared branches
- Commit `node_modules/` or `dist/`
- Work directly on `main` branch
- Make huge commits with many unrelated changes
- Forget to pull before pushing
- Use vague commit messages like "fix stuff"

---

## Getting Help

```cmd
# Git help
git --help
git pull --help
git commit --help

# NPM help
npm help

# View this guide
type GIT_AND_DEV_COMMANDS.md
```

---

**Last Updated:** 2025-12-31
**Branch:** claude/quiz-app-build-D9svp
**Node Version:** 18+ recommended
**Git Version:** 2.40+ recommended
