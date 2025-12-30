import type { Question } from '../types';

export const initialQuestions: Question[] = [
  // Biology Questions - Level 1
  {
    id: 'bio-001',
    category: 'Biology',
    text: 'Which term matches this description: Helps carry and use genetic information to make proteins?',
    answers: ['DNA', 'RNA', 'Proteins', 'Carbohydrates', 'Lipids'],
    correctAnswerIndex: 1,
    hint: 'Think about which molecule acts as a messenger between DNA and proteins.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'bio-002',
    category: 'Biology',
    text: 'What is the powerhouse of the cell?',
    answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correctAnswerIndex: 1,
    hint: 'This organelle generates most of the cell\'s supply of ATP.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'bio-003',
    category: 'Biology',
    text: 'What process do plants use to convert sunlight into energy?',
    answers: ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion', 'Transpiration'],
    correctAnswerIndex: 1,
    hint: 'This process requires chlorophyll and produces oxygen as a byproduct.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Geography Questions - Level 1
  {
    id: 'geo-001',
    category: 'Geography',
    text: 'What is the largest ocean on Earth?',
    answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'Southern Ocean'],
    correctAnswerIndex: 3,
    hint: 'It covers more than 30% of the Earth\'s surface.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'geo-002',
    category: 'Geography',
    text: 'Which continent is the largest by land area?',
    answers: ['Africa', 'Asia', 'North America', 'South America', 'Europe'],
    correctAnswerIndex: 1,
    hint: 'It contains countries like China, India, and Russia.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'geo-003',
    category: 'Geography',
    text: 'What is the capital of France?',
    answers: ['London', 'Berlin', 'Paris', 'Madrid', 'Rome'],
    correctAnswerIndex: 2,
    hint: 'Known as the "City of Light" and home to the Eiffel Tower.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Math Questions - Level 1
  {
    id: 'math-001',
    category: 'Math',
    text: 'What is 15 + 27?',
    answers: ['40', '41', '42', '43', '44'],
    correctAnswerIndex: 2,
    hint: 'Break it down: 15 + 25 = 40, then add 2 more.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'math-002',
    category: 'Math',
    text: 'What is the square root of 64?',
    answers: ['6', '7', '8', '9', '10'],
    correctAnswerIndex: 2,
    hint: 'What number multiplied by itself equals 64?',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'math-003',
    category: 'Math',
    text: 'What is 12 × 8?',
    answers: ['84', '88', '92', '96', '100'],
    correctAnswerIndex: 3,
    hint: 'Think of 12 × 8 as (10 × 8) + (2 × 8).',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Science Questions - Level 1
  {
    id: 'sci-001',
    category: 'Science',
    text: 'What is the chemical symbol for water?',
    answers: ['H2O', 'O2', 'CO2', 'H2O2', 'HO'],
    correctAnswerIndex: 0,
    hint: 'It contains 2 hydrogen atoms and 1 oxygen atom.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'sci-002',
    category: 'Science',
    text: 'At what temperature does water boil at sea level?',
    answers: ['90°C', '95°C', '100°C', '105°C', '110°C'],
    correctAnswerIndex: 2,
    hint: 'This is also 212°F.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'sci-003',
    category: 'Science',
    text: 'How many planets are in our solar system?',
    answers: ['6', '7', '8', '9', '10'],
    correctAnswerIndex: 2,
    hint: 'Pluto is no longer classified as a planet.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Technology Questions - Level 1
  {
    id: 'tech-001',
    category: 'Technology',
    text: 'What does CPU stand for?',
    answers: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Processor Unit', 'Computer Processing Unit'],
    correctAnswerIndex: 1,
    hint: 'It\'s the brain of the computer.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'tech-002',
    category: 'Technology',
    text: 'What does WWW stand for in a website address?',
    answers: ['World Web Wide', 'World Wide Web', 'Wide World Web', 'Web World Wide', 'World Web World'],
    correctAnswerIndex: 1,
    hint: 'It\'s the system of interlinked hypertext documents accessed via the Internet.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'tech-003',
    category: 'Technology',
    text: 'Which company developed the iPhone?',
    answers: ['Samsung', 'Google', 'Apple', 'Microsoft', 'Nokia'],
    correctAnswerIndex: 2,
    hint: 'The same company that makes Mac computers.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // History Questions - Level 1
  {
    id: 'hist-001',
    category: 'History',
    text: 'In which year did World War II end?',
    answers: ['1943', '1944', '1945', '1946', '1947'],
    correctAnswerIndex: 2,
    hint: 'It ended the same year the atomic bombs were dropped on Japan.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'hist-002',
    category: 'History',
    text: 'Who was the first President of the United States?',
    answers: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin', 'Abraham Lincoln'],
    correctAnswerIndex: 1,
    hint: 'His face is on the one-dollar bill.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'hist-003',
    category: 'History',
    text: 'In which year did the Titanic sink?',
    answers: ['1910', '1911', '1912', '1913', '1914'],
    correctAnswerIndex: 2,
    hint: 'It sank on its maiden voyage in April.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Space Questions - Level 1
  {
    id: 'space-001',
    category: 'Space',
    text: 'What is the name of Earth\'s natural satellite?',
    answers: ['Mars', 'Moon', 'Sun', 'Venus', 'Jupiter'],
    correctAnswerIndex: 1,
    hint: 'We can see it at night.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'space-002',
    category: 'Space',
    text: 'Which planet is known as the Red Planet?',
    answers: ['Venus', 'Mars', 'Jupiter', 'Saturn', 'Mercury'],
    correctAnswerIndex: 1,
    hint: 'It\'s named after the Roman god of war.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'space-003',
    category: 'Space',
    text: 'What is the largest planet in our solar system?',
    answers: ['Earth', 'Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctAnswerIndex: 2,
    hint: 'It has a Great Red Spot that is actually a giant storm.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Food Questions - Level 1
  {
    id: 'food-001',
    category: 'Food',
    text: 'What fruit is known for keeping the doctor away?',
    answers: ['Orange', 'Banana', 'Apple', 'Pear', 'Grape'],
    correctAnswerIndex: 2,
    hint: 'There\'s a famous saying about eating one per day.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'food-002',
    category: 'Food',
    text: 'Which country is famous for pizza and pasta?',
    answers: ['France', 'Spain', 'Italy', 'Greece', 'Germany'],
    correctAnswerIndex: 2,
    hint: 'It\'s shaped like a boot on the map.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'food-003',
    category: 'Food',
    text: 'What is the main ingredient in guacamole?',
    answers: ['Tomato', 'Avocado', 'Pepper', 'Onion', 'Lime'],
    correctAnswerIndex: 1,
    hint: 'It\'s a green fruit that\'s high in healthy fats.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Language Questions - Level 1
  {
    id: 'lang-001',
    category: 'Language',
    text: 'What is the opposite of "hot"?',
    answers: ['Warm', 'Cool', 'Cold', 'Freezing', 'Chilly'],
    correctAnswerIndex: 2,
    hint: 'It\'s the most direct opposite.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'lang-002',
    category: 'Language',
    text: 'How many letters are in the English alphabet?',
    answers: ['24', '25', '26', '27', '28'],
    correctAnswerIndex: 2,
    hint: 'From A to Z.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'lang-003',
    category: 'Language',
    text: 'What is a word that reads the same backward as forward called?',
    answers: ['Synonym', 'Antonym', 'Palindrome', 'Homophone', 'Metaphor'],
    correctAnswerIndex: 2,
    hint: 'Examples include "racecar" and "level".',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },

  // Earth Questions - Level 1
  {
    id: 'earth-001',
    category: 'Earth',
    text: 'What percentage of Earth is covered by water?',
    answers: ['50%', '60%', '70%', '80%', '90%'],
    correctAnswerIndex: 2,
    hint: 'It\'s more than two-thirds.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'earth-002',
    category: 'Earth',
    text: 'What is the deepest ocean trench on Earth?',
    answers: ['Tonga Trench', 'Java Trench', 'Mariana Trench', 'Puerto Rico Trench', 'Peru-Chile Trench'],
    correctAnswerIndex: 2,
    hint: 'It\'s located in the Pacific Ocean near Guam.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
  {
    id: 'earth-003',
    category: 'Earth',
    text: 'What is the largest desert in the world?',
    answers: ['Sahara Desert', 'Arabian Desert', 'Gobi Desert', 'Antarctic Desert', 'Kalahari Desert'],
    correctAnswerIndex: 3,
    hint: 'Deserts are defined by lack of precipitation, not temperature.',
    level: 1,
    stats: { timesUsed: 0, timesCorrect: 0, timesWrong: 0 }
  },
];

export const defaultCategories = [
  'Biology',
  'Geography',
  'Math',
  'Science',
  'Technology',
  'History',
  'Space',
  'Food',
  'Language',
  'Earth'
];
