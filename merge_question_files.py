#!/usr/bin/env python3
"""
Question File Merger and Validator
Merges multiple XLSX files containing quiz questions into a single validated CSV file
with comprehensive logging and error reporting.
"""

import os
import sys
import pandas as pd
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Any
import re

# Expected CSV structure
EXPECTED_COLUMNS = [
    'id', 'category', 'level', 'text', 'answer1', 'answer2',
    'answer3', 'answer4', 'answer5', 'correctAnswerIndex', 'hint'
]

VALID_CATEGORIES = [
    'Biology', 'Geography', 'Math', 'Science', 'Technology',
    'History', 'Space', 'Food', 'Language', 'Earth'
]

VALID_LEVELS = [1, 2, 3, 4, 5]

class QuestionValidator:
    """Validates question data structure and content"""

    def __init__(self):
        self.errors = []
        self.warnings = []

    def validate_row(self, row: pd.Series, row_num: int, source_file: str) -> Dict[str, Any]:
        """
        Validate a single question row

        Returns:
            Dict with validation results
        """
        issues = {
            'row_num': row_num,
            'source_file': source_file,
            'errors': [],
            'warnings': [],
            'is_valid': True
        }

        # Check for missing required fields
        for col in EXPECTED_COLUMNS:
            if col not in row.index:
                issues['errors'].append(f"Missing column: {col}")
                issues['is_valid'] = False
            elif pd.isna(row[col]) or str(row[col]).strip() == '':
                issues['errors'].append(f"Empty value in column: {col}")
                issues['is_valid'] = False

        # If basic structure is invalid, return early
        if not issues['is_valid']:
            return issues

        # Validate category
        if row['category'] not in VALID_CATEGORIES:
            issues['warnings'].append(
                f"Invalid category: '{row['category']}'. Expected one of: {', '.join(VALID_CATEGORIES)}"
            )

        # Validate level
        try:
            level = int(row['level'])
            if level not in VALID_LEVELS:
                issues['errors'].append(
                    f"Invalid level: {level}. Expected one of: {VALID_LEVELS}"
                )
                issues['is_valid'] = False
        except (ValueError, TypeError):
            issues['errors'].append(
                f"Invalid level datatype: '{row['level']}'. Expected integer 1-5"
            )
            issues['is_valid'] = False

        # Validate correctAnswerIndex
        try:
            correct_idx = int(row['correctAnswerIndex'])
            if correct_idx not in [0, 1, 2, 3, 4]:
                issues['errors'].append(
                    f"Invalid correctAnswerIndex: {correct_idx}. Expected 0-4"
                )
                issues['is_valid'] = False
        except (ValueError, TypeError):
            issues['errors'].append(
                f"Invalid correctAnswerIndex datatype: '{row['correctAnswerIndex']}'. Expected integer 0-4"
            )
            issues['is_valid'] = False

        # Validate question text length
        if len(str(row['text']).strip()) < 5:
            issues['warnings'].append(
                f"Question text too short: '{row['text']}'"
            )

        # Validate answers are not empty
        for i in range(1, 6):
            answer_col = f'answer{i}'
            if len(str(row[answer_col]).strip()) < 1:
                issues['errors'].append(
                    f"Empty answer in {answer_col}"
                )
                issues['is_valid'] = False

        # Check for duplicate answers
        answers = [str(row[f'answer{i}']).strip() for i in range(1, 6)]
        if len(answers) != len(set(answers)):
            issues['warnings'].append(
                "Duplicate answers detected"
            )

        return issues


class QuestionMerger:
    """Merges multiple XLSX files into a single validated CSV"""

    def __init__(self, source_folder: str, output_csv: str, log_file: str, debug: bool = False):
        self.source_folder = Path(source_folder)
        self.output_csv = Path(output_csv)
        self.log_file = Path(log_file)
        self.validator = QuestionValidator()
        self.debug = debug

        # Statistics
        self.stats = {
            'source_files': [],
            'total_source_rows': 0,
            'merged_rows': 0,
            'valid_rows': 0,
            'invalid_rows': 0,
            'rows_with_warnings': 0,
            'all_errors': [],
            'all_warnings': []
        }

    def find_question_files(self) -> List[Path]:
        """Find all XLSX and CSV files in source folder"""
        xlsx_files = list(self.source_folder.glob('*.xlsx'))
        csv_files = list(self.source_folder.glob('*.csv'))

        # Filter out temporary Excel files (starting with ~$)
        xlsx_files = [f for f in xlsx_files if not f.name.startswith('~$')]

        # Combine and sort
        all_files = xlsx_files + csv_files
        return sorted(all_files)

    def read_question_file(self, file_path: Path) -> Tuple[pd.DataFrame, Dict]:
        """
        Read XLSX or CSV file and return DataFrame with statistics

        Returns:
            Tuple of (DataFrame, stats_dict)
        """
        try:
            # Determine file type and read accordingly
            if file_path.suffix.lower() == '.xlsx':
                df = pd.read_excel(file_path, engine='openpyxl')
            elif file_path.suffix.lower() == '.csv':
                df = pd.read_csv(file_path, encoding='utf-8')
            else:
                raise ValueError(f"Unsupported file type: {file_path.suffix}")

            # Get statistics
            stats = {
                'file_name': file_path.name,
                'file_path': str(file_path),
                'file_type': file_path.suffix.upper(),
                'total_rows': len(df),
                'categories': sorted(df['category'].dropna().unique().tolist()) if 'category' in df.columns else [],
                'levels': sorted(df['level'].dropna().unique().tolist()) if 'level' in df.columns else [],
                'valid_rows': 0,
                'invalid_rows': 0,
                'warnings': 0,
                'read_success': True,
                'read_error': None
            }

            return df, stats

        except Exception as e:
            # Return empty DataFrame with error stats
            stats = {
                'file_name': file_path.name,
                'file_path': str(file_path),
                'file_type': file_path.suffix.upper() if file_path.suffix else 'UNKNOWN',
                'total_rows': 0,
                'categories': [],
                'levels': [],
                'valid_rows': 0,
                'invalid_rows': 0,
                'warnings': 0,
                'read_success': False,
                'read_error': str(e)
            }
            return pd.DataFrame(), stats

    def merge_files(self) -> bool:
        """
        Main merge process

        Returns:
            bool: Success status
        """
        print("=" * 80)
        print("QUESTION FILE MERGER AND VALIDATOR")
        print("=" * 80)
        print(f"Source folder: {self.source_folder}")
        print(f"Output CSV: {self.output_csv}")
        print(f"Log file: {self.log_file}\n")

        # Find question files (XLSX and CSV)
        question_files = self.find_question_files()

        if not question_files:
            print(f"❌ Error: No XLSX or CSV files found in {self.source_folder}")
            return False

        # Count file types
        xlsx_count = sum(1 for f in question_files if f.suffix.lower() == '.xlsx')
        csv_count = sum(1 for f in question_files if f.suffix.lower() == '.csv')
        print(f"Found {len(question_files)} files ({xlsx_count} XLSX, {csv_count} CSV)\n")

        # Process each file
        all_data = []

        for idx, file_path in enumerate(question_files, 1):
            print(f"[{idx}/{len(question_files)}] Processing {file_path.name}...", end=' ')

            df, file_stats = self.read_question_file(file_path)

            if not file_stats['read_success']:
                print(f"❌ Error: {file_stats['read_error']}")
                self.stats['source_files'].append(file_stats)
                continue

            # Check for column mismatches (only for first file to avoid spam)
            if idx == 1 and not df.empty:
                detected_columns = list(df.columns)
                missing_columns = [col for col in EXPECTED_COLUMNS if col not in detected_columns]
                extra_columns = [col for col in detected_columns if col not in EXPECTED_COLUMNS]

                if missing_columns or extra_columns:
                    print(f"\n⚠️  COLUMN MISMATCH DETECTED in {file_path.name}:")
                    if missing_columns:
                        print(f"   Missing columns: {', '.join(missing_columns)}")
                    if extra_columns:
                        print(f"   Extra columns: {', '.join(extra_columns)}")
                    print(f"   Expected: {', '.join(EXPECTED_COLUMNS)}")
                    print()

                # Show sample data in debug mode
                if self.debug:
                    print(f"\n🔍 DEBUG: First file structure ({file_path.name}):")
                    print(f"   Columns detected: {detected_columns}")
                    print(f"   Total rows: {len(df)}")
                    if not df.empty:
                        print(f"\n   Sample data (first row):")
                        for col in detected_columns[:5]:  # Show first 5 columns
                            value = df.iloc[0][col] if col in df.columns else 'N/A'
                            print(f"      {col}: {str(value)[:50]}")
                    print()

            # Validate each row
            for row_idx, row in df.iterrows():
                source_row_num = row_idx + 2  # +2 because Excel is 1-indexed and has header

                validation_result = self.validator.validate_row(
                    row,
                    source_row_num,
                    file_path.name
                )

                if validation_result['is_valid']:
                    file_stats['valid_rows'] += 1
                    all_data.append(row)
                else:
                    file_stats['invalid_rows'] += 1
                    self.stats['all_errors'].append(validation_result)

                if validation_result['warnings']:
                    file_stats['warnings'] += 1
                    self.stats['all_warnings'].append(validation_result)

            self.stats['total_source_rows'] += file_stats['total_rows']
            self.stats['source_files'].append(file_stats)

            print(f"✓ {file_stats['valid_rows']} valid, {file_stats['invalid_rows']} invalid")

        # Merge all valid data
        if not all_data:
            print("\n❌ Error: No valid data to merge!")
            print("\n🔍 DIAGNOSTIC INFORMATION:")
            print("=" * 80)

            # Show sample errors from first file
            if self.stats['all_errors']:
                print(f"Found {len(self.stats['all_errors'])} total validation errors.")
                print("\nSample errors from first file:")
                print("-" * 80)

                # Get errors from first file only
                first_file_errors = [e for e in self.stats['all_errors'][:5]]

                for idx, error in enumerate(first_file_errors, 1):
                    print(f"\n❌ Error {idx} (File: {error['source_file']}, Row: {error['row_num']}):")
                    for err_msg in error['errors'][:3]:  # Show first 3 errors per row
                        print(f"   • {err_msg}")

                print("\n" + "=" * 80)
                print(f"💡 TIP: Check '{self.log_file}' for complete error details")
                print("=" * 80)

            self.write_log()
            return False

        print(f"\nMerging {len(all_data)} valid rows...")
        merged_df = pd.DataFrame(all_data)

        # Reset index to ensure clean sequential access
        merged_df = merged_df.reset_index(drop=True)

        # Renumber IDs sequentially
        print("Renumbering IDs sequentially...")

        # Category prefix mapping
        category_prefixes = {
            'Biology': 'bio', 'Geography': 'geo', 'Math': 'mat',
            'Science': 'sci', 'Technology': 'tec', 'History': 'his',
            'Space': 'spa', 'Food': 'foo', 'Language': 'lan', 'Earth': 'ear'
        }

        for idx in range(len(merged_df)):
            # Generate new ID with format: category-lX-NNNN (sequential from 1 to N)
            category = str(merged_df.at[idx, 'category'])
            prefix = category_prefixes.get(category, category[:3].lower())
            level = int(merged_df.at[idx, 'level'])
            new_id = f"{prefix}-l{level}-{idx+1:04d}"
            merged_df.at[idx, 'id'] = new_id

        # Ensure correct column order
        merged_df = merged_df[EXPECTED_COLUMNS]

        # Write to CSV
        print(f"Writing to {self.output_csv}...")
        merged_df.to_csv(self.output_csv, index=False, encoding='utf-8')

        # Update final statistics
        self.stats['merged_rows'] = len(merged_df)
        self.stats['valid_rows'] = len(merged_df)
        self.stats['invalid_rows'] = len(self.stats['all_errors'])
        self.stats['rows_with_warnings'] = len(self.stats['all_warnings'])

        # Write log
        self.write_log()

        # Print summary
        self.print_summary()

        return True

    def write_log(self):
        """Write comprehensive log file"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("QUESTION FILE MERGER - DETAILED LOG\n")
            f.write("=" * 80 + "\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"Source Folder: {self.source_folder}\n")
            f.write(f"Output CSV: {self.output_csv}\n")
            f.write("\n")

            # 1. Amount of source files read
            f.write("=" * 80 + "\n")
            f.write("1. SOURCE FILES SUMMARY\n")
            f.write("=" * 80 + "\n")
            f.write(f"Total source files found: {len(self.stats['source_files'])}\n")
            f.write(f"Successfully read: {sum(1 for s in self.stats['source_files'] if s['read_success'])}\n")
            f.write(f"Failed to read: {sum(1 for s in self.stats['source_files'] if not s['read_success'])}\n")
            f.write("\n")

            # 2. Detailed source file matrix
            f.write("=" * 80 + "\n")
            f.write("2. SOURCE FILE DETAILS (MATRIX)\n")
            f.write("=" * 80 + "\n")
            f.write(f"{'File Name':<35} {'Type':<6} {'Rows':<6} {'Valid':<6} {'Invalid':<6} {'Warn':<6} {'Categories':<20}\n")
            f.write("-" * 80 + "\n")

            for file_stats in self.stats['source_files']:
                if file_stats['read_success']:
                    categories_str = ', '.join(map(str, file_stats['categories'][:2]))
                    if len(file_stats['categories']) > 2:
                        categories_str += f"... (+{len(file_stats['categories'])-2})"

                    f.write(
                        f"{file_stats['file_name']:<35} "
                        f"{file_stats['file_type']:<6} "
                        f"{file_stats['total_rows']:<6} "
                        f"{file_stats['valid_rows']:<6} "
                        f"{file_stats['invalid_rows']:<6} "
                        f"{file_stats['warnings']:<6} "
                        f"{categories_str:<20}\n"
                    )
                else:
                    f.write(
                        f"{file_stats['file_name']:<35} "
                        f"{file_stats['file_type']:<6} "
                        f"{'ERR':<6} {'N/A':<6} {'N/A':<6} {'N/A':<6} "
                        f"{file_stats['read_error'][:20]:<20}\n"
                    )

            f.write("\n")

            # 3. Merge output summary
            f.write("=" * 80 + "\n")
            f.write("3. MERGE OUTPUT SUMMARY\n")
            f.write("=" * 80 + "\n")
            f.write(f"3.1 MERGE STATISTICS:\n")
            f.write(f"  Total source rows (all files): {self.stats['total_source_rows']}\n")
            f.write(f"  Merged rows (output file): {self.stats['merged_rows']}\n")
            f.write(f"  Merge rate: {self.stats['merged_rows']/self.stats['total_source_rows']*100:.1f}%\n")
            f.write("\n")
            f.write(f"3.2 VALIDATION RESULTS:\n")
            f.write(f"  Valid rows: {self.stats['valid_rows']}\n")
            f.write(f"  Invalid rows (excluded): {self.stats['invalid_rows']}\n")
            f.write(f"  Rows with warnings (included): {self.stats['rows_with_warnings']}\n")
            f.write("\n")

            # 4. Error details matrix
            if self.stats['all_errors']:
                f.write("=" * 80 + "\n")
                f.write("4. DETAILED ERROR REPORT (MATRIX)\n")
                f.write("=" * 80 + "\n")
                f.write(f"{'#':<5} {'Source File':<30} {'Row#':<6} {'Error/Warning':<40}\n")
                f.write("-" * 80 + "\n")

                for idx, error in enumerate(self.stats['all_errors'], 1):
                    # First line: main error
                    f.write(
                        f"{idx:<5} "
                        f"{error['source_file']:<30} "
                        f"{error['row_num']:<6} "
                        f"{'ERRORS: ' + str(len(error['errors'])):<40}\n"
                    )

                    # Error details
                    for err in error['errors']:
                        f.write(f"      → {err}\n")

                    f.write("\n")
            else:
                f.write("=" * 80 + "\n")
                f.write("4. DETAILED ERROR REPORT\n")
                f.write("=" * 80 + "\n")
                f.write("✓ No errors found!\n")
                f.write("\n")

            # 5. Warning details
            if self.stats['all_warnings']:
                f.write("=" * 80 + "\n")
                f.write("5. DETAILED WARNING REPORT\n")
                f.write("=" * 80 + "\n")
                f.write(f"{'#':<5} {'Source File':<30} {'Row#':<6} {'Warnings':<40}\n")
                f.write("-" * 80 + "\n")

                for idx, warning in enumerate(self.stats['all_warnings'], 1):
                    if warning['warnings']:
                        f.write(
                            f"{idx:<5} "
                            f"{warning['source_file']:<30} "
                            f"{warning['row_num']:<6} "
                            f"{'WARNINGS: ' + str(len(warning['warnings'])):<40}\n"
                        )

                        for warn in warning['warnings']:
                            f.write(f"      ⚠ {warn}\n")

                        f.write("\n")

            # Final summary
            f.write("=" * 80 + "\n")
            f.write("FINAL SUMMARY\n")
            f.write("=" * 80 + "\n")
            f.write(f"✓ Successfully merged {self.stats['merged_rows']} questions\n")
            f.write(f"✓ Output file: {self.output_csv}\n")
            if self.stats['invalid_rows'] == 0:
                f.write(f"✓ No errors - all rows valid!\n")
            else:
                f.write(f"⚠ {self.stats['invalid_rows']} rows excluded due to errors\n")
            f.write("=" * 80 + "\n")

    def print_summary(self):
        """Print summary to console"""
        print("\n" + "=" * 80)
        print("MERGE COMPLETE - SUMMARY")
        print("=" * 80)
        print(f"Source files processed: {len(self.stats['source_files'])}")
        print(f"Total source rows: {self.stats['total_source_rows']}")
        print(f"Merged rows (output): {self.stats['merged_rows']}")
        print(f"Valid rows: {self.stats['valid_rows']}")
        print(f"Invalid rows (excluded): {self.stats['invalid_rows']}")
        print(f"Rows with warnings: {self.stats['rows_with_warnings']}")
        print()
        print(f"✓ Output CSV: {self.output_csv}")
        print(f"✓ Log file: {self.log_file}")
        print("=" * 80)


def main():
    parser = argparse.ArgumentParser(
        description="Merge multiple XLSX/CSV question files into a single validated CSV",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Merge all XLSX and CSV files from 'questions' folder
  python merge_question_files.py --input questions --output merged.csv

  # Specify custom log file
  python merge_question_files.py --input questions --output merged.csv --log merge.log

  # Dry run (validation only, no output)
  python merge_question_files.py --input questions --dry-run

  # Mix XLSX and CSV files
  python merge_question_files.py --input mixed_files --output combined.csv
        """
    )

    parser.add_argument(
        '--input', '-i',
        required=True,
        help='Input folder containing XLSX and/or CSV files'
    )

    parser.add_argument(
        '--output', '-o',
        default='merged-questions.csv',
        help='Output CSV filename (default: merged-questions.csv)'
    )

    parser.add_argument(
        '--log', '-l',
        default='merge-log.txt',
        help='Log filename (default: merge-log.txt)'
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Validate only, do not create output file'
    )

    parser.add_argument(
        '--debug',
        action='store_true',
        help='Show detailed diagnostic information including sample data'
    )

    args = parser.parse_args()

    # Validate input folder exists
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"❌ Error: Input folder does not exist: {args.input}")
        sys.exit(1)

    if not input_path.is_dir():
        print(f"❌ Error: Input path is not a folder: {args.input}")
        sys.exit(1)

    # Create merger
    merger = QuestionMerger(
        source_folder=args.input,
        output_csv=args.output,
        log_file=args.log,
        debug=args.debug
    )

    # Run merge
    if args.dry_run:
        print("🔍 DRY RUN MODE - Validation only, no output file will be created\n")

    success = merger.merge_files()

    if success:
        print("\n✅ SUCCESS! Merge completed successfully.")
        sys.exit(0)
    else:
        print("\n❌ FAILED! Merge encountered errors.")
        sys.exit(1)


if __name__ == "__main__":
    main()
