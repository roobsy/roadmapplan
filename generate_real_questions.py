#!/usr/bin/env python3
"""
Real Educational Question Generator with Diverse Content
Generates actual educational questions with varied topics and question types
"""

import csv
import argparse
import random
from typing import Dict, List, Tuple

# Educational content database organized by category and level
EDUCATIONAL_CONTENT = {
    "Biology": {
        1: [  # Easy questions
            ("What is DNA?", ["Deoxyribonucleic Acid - genetic material", "A type of protein", "A cell organelle", "A type of sugar", "A mineral"], 0),
            ("What do plants need for photosynthesis?", ["Water only", "Sunlight, water, and carbon dioxide", "Only carbon dioxide", "Only sunlight", "Soil nutrients"], 1),
            ("What is the largest organ in the human body?", ["Heart", "Skin", "Liver", "Brain", "Lungs"], 1),
            ("What are cells?", ["Basic units of life", "Types of atoms", "Minerals", "Proteins", "Vitamins"], 0),
            ("What do herbivores eat?", ["Meat", "Plants", "Both plants and meat", "Only fruits", "Only seeds"], 1),
            ("What is the function of red blood cells?", ["Digest food", "Carry oxygen", "Fight infection", "Store energy", "Build bones"], 1),
            ("How many legs does an insect have?", ["4", "6", "8", "10", "12"], 1),
            ("What is the process of a caterpillar becoming a butterfly called?", ["Evolution", "Metamorphosis", "Photosynthesis", "Reproduction", "Mitosis"], 1),
            ("What gas do humans breathe out?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen", "Helium"], 1),
            ("What is the basic unit of heredity?", ["Cell", "Gene", "Tissue", "Organ", "Chromosome"], 1),
        ],
        2: [  # Medium-easy questions
            ("What is the process by which plants make food?", ["Respiration", "Photosynthesis", "Digestion", "Fermentation", "Transpiration"], 1),
            ("What is the powerhouse of the cell?", ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast", "Vacuole"], 1),
            ("What type of blood vessel carries blood away from the heart?", ["Vein", "Artery", "Capillary", "Lymph vessel", "Aorta only"], 1),
            ("What is the scientific name for the human species?", ["Homo erectus", "Homo sapiens", "Homo habilis", "Homo neanderthalensis", "Primates sapiens"], 1),
            ("Which organ produces insulin?", ["Liver", "Pancreas", "Stomach", "Kidney", "Gallbladder"], 1),
            ("What is the pH of pure water?", ["5", "7", "9", "0", "14"], 1),
            ("What are organisms that break down dead matter called?", ["Producers", "Decomposers", "Consumers", "Predators", "Parasites"], 1),
            ("How many chambers does the human heart have?", ["2", "4", "3", "5", "6"], 1),
            ("What is the green pigment in plants called?", ["Carotene", "Chlorophyll", "Melanin", "Xanthophyll", "Anthocyanin"], 1),
            ("What is the study of plants called?", ["Zoology", "Botany", "Ecology", "Mycology", "Ornithology"], 1),
        ],
        3: [  # Medium questions
            ("What is the difference between mitosis and meiosis?", ["No difference", "Mitosis produces identical cells, meiosis produces sex cells", "Meiosis is faster", "Mitosis only happens in plants", "Meiosis produces 4 identical cells"], 1),
            ("What is an ecosystem?", ["A single organism", "A community of organisms and their environment", "Only plants in an area", "Only animals in an area", "The weather in a region"], 1),
            ("What is the function of ribosomes?", ["DNA replication", "Protein synthesis", "Energy production", "Lipid storage", "Cell division"], 1),
            ("What is natural selection?", ["Random mutation", "Survival and reproduction of the fittest", "Artificial breeding", "Genetic modification", "Extinction"], 1),
            ("What are the building blocks of proteins?", ["Nucleotides", "Amino acids", "Fatty acids", "Glucose molecules", "Lipids"], 1),
            ("What is homeostasis?", ["Cell division", "Maintaining stable internal conditions", "Rapid growth", "Energy production", "Genetic mutation"], 1),
            ("What is the role of ATP in cells?", ["Genetic information", "Energy currency", "Structural support", "Waste removal", "Oxygen transport"], 1),
            ("What is the difference between prokaryotic and eukaryotic cells?", ["Size only", "Prokaryotes lack a nucleus", "Eukaryotes are smaller", "No difference", "Prokaryotes are only in animals"], 1),
            ("What is symbiosis?", ["Competition", "Close relationship between different species", "Predation", "Parasitism only", "Extinction"], 1),
            ("What is the nitrogen cycle?", ["How nitrogen moves through ecosystems", "How plants make nitrogen", "How animals breathe nitrogen", "Nitrogen decay", "Nitrogen photosynthesis"], 0),
        ],
        4: [  # Hard questions
            ("What is the Hardy-Weinberg principle?", ["A law of gravity", "Genetic equilibrium in populations", "Cell division stages", "Protein folding", "DNA replication"], 1),
            ("What is the endosymbiotic theory?", ["Cells eat each other", "Mitochondria and chloroplasts originated from bacteria", "All cells are the same", "Viruses create cells", "Cells spontaneously generate"], 1),
            ("What is gene expression regulation in eukaryotes primarily controlled by?", ["mRNA only", "Transcription factors and chromatin structure", "Ribosomes", "tRNA", "ATP levels"], 1),
            ("What is the role of telomeres?", ["Energy production", "Protect chromosome ends from degradation", "Protein synthesis", "Cell signaling", "Waste removal"], 1),
            ("What is alternative splicing?", ["DNA repair", "One gene producing multiple proteins", "Cell division", "Photosynthesis variation", "Respiration pathway"], 1),
            ("What is epigenetics?", ["DNA sequence changes", "Heritable changes without DNA sequence alteration", "Protein structure", "Cell membrane composition", "Energy metabolism"], 1),
            ("What is the Krebs cycle?", ["Photosynthesis stage", "Cellular respiration stage producing ATP", "DNA replication", "Protein synthesis", "Cell division"], 1),
            ("What are restriction enzymes used for?", ["Energy production", "Cutting DNA at specific sequences", "Protein synthesis", "Cell division", "Lipid metabolism"], 1),
            ("What is PCR (Polymerase Chain Reaction)?", ["Cell division method", "DNA amplification technique", "Protein purification", "Cell culture", "Microscopy technique"], 1),
            ("What is CRISPR-Cas9?", ["A cell type", "Gene editing technology", "A protein", "A disease", "A microscope"], 1),
        ],
        5: [  # Very hard questions
            ("What is the wobble hypothesis in genetics?", ["DNA wobbles during replication", "Third codon position can pair non-standardly", "Proteins wobble in water", "Cells wobble during division", "Chromosomes wobble during meiosis"], 1),
            ("What is RNA interference (RNAi)?", ["RNA breaks down", "Gene silencing mechanism using small RNAs", "RNA transcription", "RNA translation", "RNA replication"], 1),
            ("What is the mechanism of action of competitive inhibition?", ["Enzyme is destroyed", "Inhibitor competes with substrate for active site", "Enzyme changes shape permanently", "Substrate is destroyed", "Product is inhibited"], 1),
            ("What is horizontal gene transfer?", ["Genes pass from parent to offspring", "Genes transfer between organisms non-reproductively", "Genes move within a chromosome", "Genes duplicate", "Genes mutate randomly"], 1),
            ("What is the chemiosmotic theory?", ["Chemical reactions in cells", "ATP synthesis via proton gradient", "DNA replication theory", "Protein folding", "Cell membrane theory"], 1),
            ("What is the signal recognition particle (SRP)?", ["DNA sequence", "Protein targeting mechanism to ER", "Cell signal", "Hormone", "Enzyme"], 1),
            ("What is the difference between C3, C4, and CAM photosynthesis?", ["No difference", "Different carbon fixation pathways", "Different light requirements only", "Different water needs only", "Different chlorophyll types only"], 1),
            ("What is the role of ubiquitin in cells?", ["Energy production", "Protein degradation tagging", "DNA replication", "Lipid synthesis", "Carbohydrate metabolism"], 1),
            ("What is the lac operon?", ["A surgical procedure", "Gene regulation system in bacteria", "A cell type", "A disease", "A microscope part"], 1),
            ("What is transgenerational epigenetic inheritance?", ["DNA mutations passing on", "Epigenetic changes transmitted across generations", "Chromosomal deletions", "Protein inheritance", "RNA-based evolution"], 1),
        ],
    },
    "Geography": {
        1: [
            ("What is the largest ocean on Earth?", ["Atlantic", "Pacific", "Indian", "Arctic", "Southern"], 1),
            ("What is the capital of France?", ["London", "Paris", "Berlin", "Rome", "Madrid"], 1),
            ("How many continents are there?", ["5", "7", "6", "8", "9"], 1),
            ("What is the longest river in the world?", ["Amazon", "Nile", "Mississippi", "Yangtze", "Congo"], 1),
            ("Which country has the largest population?", ["India", "China", "USA", "Indonesia", "Brazil"], 1),
            ("What is the smallest continent?", ["Europe", "Australia", "Antarctica", "South America", "Africa"], 1),
            ("What is the tallest mountain in the world?", ["K2", "Mount Everest", "Kilimanjaro", "Denali", "Matterhorn"], 1),
            ("What is a peninsula?", ["An island", "Land surrounded by water on three sides", "A mountain", "A river", "A desert"], 1),
            ("What causes day and night?", ["Moon's orbit", "Earth's rotation", "Sun's movement", "Earth's revolution", "Tides"], 1),
            ("What is the equator?", ["A country", "Imaginary line around Earth's middle", "A mountain range", "A river", "An ocean current"], 1),
        ],
        2: [
            ("What is latitude?", ["Distance from equator", "Distance from prime meridian", "Height above sea level", "Distance from North Pole", "Ocean depth"], 0),
            ("What causes seasons?", ["Distance from sun", "Earth's tilt and orbit", "Moon phases", "Solar flares", "Ocean currents"], 1),
            ("What is a glacier?", ["A mountain", "A large mass of moving ice", "A lake", "A river", "A desert"], 1),
            ("What is the Ring of Fire?", ["A desert", "Area of volcanic and seismic activity", "A mountain range", "A river", "An ocean current"], 1),
            ("What is the Great Barrier Reef?", ["A wall", "World's largest coral reef system", "A mountain range", "An island", "A river delta"], 1),
            ("What is a delta?", ["A mountain", "Sediment deposit where river meets ocean", "A lake", "A canyon", "A desert"], 1),
            ("What are trade winds?", ["Stock market", "Persistent winds near equator", "Ocean currents", "Mountain breezes", "Storm systems"], 1),
            ("What is the water cycle?", ["Ocean currents", "Continuous movement of water on Earth", "River flow", "Rainfall only", "Ice formation"], 1),
            ("What is a monsoon?", ["A flood", "Seasonal wind pattern bringing rain", "A hurricane", "An earthquake", "A drought"], 1),
            ("What is erosion?", ["Building up land", "Wearing away of land by natural forces", "Volcanic activity", "Earthquake damage", "Flooding"], 1),
        ],
        3: [
            ("What is plate tectonics?", ["Ocean currents", "Theory of moving crustal plates", "Weather patterns", "River systems", "Mountain formation only"], 1),
            ("What is the difference between weather and climate?", ["No difference", "Weather is short-term, climate is long-term patterns", "Weather is global, climate is local", "Climate is predictions", "Weather is temperature only"], 1),
            ("What causes earthquakes?", ["Volcanoes", "Movement of tectonic plates", "Heavy rain", "Wind", "Ocean waves"], 1),
            ("What is desertification?", ["Desert expansion", "Land degradation into desert", "Desert shrinking", "Desert rainfall", "Desert temperature rise"], 1),
            ("What is an aquifer?", ["A river", "Underground water-bearing rock", "A lake", "An ocean", "A glacier"], 1),
            ("What is the Coriolis effect?", ["Ocean warming", "Deflection of moving objects due to Earth's rotation", "Mountain formation", "River flow", "Tidal patterns"], 1),
            ("What is a watershed?", ["A water storage", "Area draining into a common outlet", "A dam", "A river", "An ocean"], 1),
            ("What causes tides?", ["Wind", "Gravitational pull of moon and sun", "Earth's rotation only", "Ocean currents", "Underwater earthquakes"], 1),
            ("What is the greenhouse effect?", ["Plant growth", "Warming due to atmospheric gases trapping heat", "Ocean warming", "Deforestation", "Ice melting"], 1),
            ("What is a fjord?", ["A mountain", "Deep glacial valley flooded by sea", "A lake", "A river", "A desert"], 1),
        ],
        4: [
            ("What is the Intertropical Convergence Zone (ITCZ)?", ["A desert", "Area where trade winds meet near equator", "A mountain range", "An ocean current", "A time zone"], 1),
            ("What is isostasy?", ["Ocean currents", "Equilibrium of Earth's crust on mantle", "Atmospheric pressure", "Magnetic field", "Gravity"], 1),
            ("What is the thermohaline circulation?", ["Atmosphere", "Global ocean current driven by temperature and salinity", "River system", "Wind pattern", "Tidal system"], 1),
            ("What is orographic precipitation?", ["Ocean rain", "Precipitation caused by air rising over mountains", "Desert rain", "Tornado rain", "Hurricane rain"], 1),
            ("What is a subduction zone?", ["Mountain peak", "Area where one tectonic plate slides under another", "Ocean trench only", "Volcanic island", "River delta"], 1),
            ("What is the difference between extrusive and intrusive igneous rocks?", ["Color", "Where they cool (surface vs underground)", "Size only", "Age", "Composition only"], 1),
            ("What is karst topography?", ["Desert landscape", "Landscape formed from dissolved limestone", "Volcanic landscape", "Glacial landscape", "Coastal landscape"], 1),
            ("What is the jet stream?", ["Ocean current", "Fast-flowing air current in upper atmosphere", "River current", "Volcanic gas stream", "Tidal stream"], 1),
            ("What is a halocline?", ["Mountain layer", "Layer in water where salinity changes rapidly", "Atmospheric layer", "Rock layer", "Ice layer"], 1),
            ("What is the difference between magma and lava?", ["Temperature", "Location: magma underground, lava on surface", "Composition", "Color", "Age"], 1),
        ],
        5: [
            ("What is the Milankovitch cycle?", ["Ocean cycle", "Long-term climate changes due to Earth's orbital variations", "Volcanic cycle", "River cycle", "Tidal cycle"], 1),
            ("What is radiometric dating in geology?", ["Measuring radiation", "Determining age using radioactive decay", "Measuring temperature", "Dating using tree rings", "Using fossils only"], 1),
            ("What is the geostrophic wind?", ["Surface wind", "Wind flowing parallel to isobars due to pressure gradient and Coriolis", "Mountain wind", "Ocean wind", "Tornado wind"], 1),
            ("What is seafloor spreading?", ["Ocean widening", "New oceanic crust formation at mid-ocean ridges", "Ocean deepening", "Continental drift", "Tsunami formation"], 1),
            ("What is the Mohorovičić discontinuity?", ["Ocean layer", "Boundary between Earth's crust and mantle", "Atmospheric layer", "River boundary", "Tectonic plate"], 1),
            ("What is the concept of drainage basin morphometry?", ["River depth", "Quantitative analysis of drainage basin characteristics", "Ocean basin depth", "Lake size", "Watershed area only"], 1),
            ("What is the Bergeron process?", ["Mountain formation", "Ice crystal precipitation formation in clouds", "River erosion", "Ocean circulation", "Desert formation"], 1),
            ("What is anastomosing drainage pattern?", ["Single river", "Multiple interconnected channels", "Straight river", "Circular lake", "Mountain stream"], 1),
            ("What is the concept of geomorphic threshold?", ["Mountain height", "Point where landform suddenly changes", "River depth", "Ocean temperature", "Atmospheric pressure"], 1),
            ("What is the Walker Circulation?", ["Mountain air", "Atmospheric circulation over Pacific affecting El Niño", "Ocean current", "River flow", "Desert wind"], 1),
        ],
    },
    "Math": {
        1: [
            ("What is 2 + 2?", ["3", "4", "5", "6", "7"], 1),
            ("What is a square?", ["3-sided shape", "4-sided shape with equal sides", "Circle", "Triangle", "Pentagon"], 1),
            ("What is half of 10?", ["4", "5", "6", "7", "8"], 1),
            ("How many sides does a triangle have?", ["2", "3", "4", "5", "6"], 1),
            ("What is 10 - 3?", ["6", "7", "8", "9", "10"], 1),
            ("What is multiplication?", ["Subtracting numbers", "Adding a number to itself repeatedly", "Dividing numbers", "Finding differences", "Measuring"], 1),
            ("What is the value of a dozen?", ["10", "12", "20", "24", "100"], 1),
            ("What is an even number?", ["Number divisible by 3", "Number divisible by 2", "Odd number", "Prime number", "Negative number"], 1),
            ("What is the area of a shape?", ["Its length", "Space inside the shape", "Its perimeter", "Its weight", "Its height"], 1),
            ("What is a fraction?", ["Whole number", "Part of a whole", "Large number", "Negative number", "Decimal"], 1),
        ],
        2: [
            ("What is the value of pi (π) approximately?", ["2.14", "3.14", "4.14", "5.14", "6.14"], 1),
            ("What is the Pythagorean theorem?", ["a + b = c", "a² + b² = c²", "a × b = c", "a - b = c", "a ÷ b = c"], 1),
            ("What is a prime number?", ["Even number", "Number divisible only by 1 and itself", "Odd number", "Number divisible by 2", "Fraction"], 1),
            ("What is the perimeter of a rectangle with length 5 and width 3?", ["8", "16", "15", "30", "25"], 1),
            ("What is 25% of 100?", ["20", "25", "30", "50", "75"], 1),
            ("What is the sum of angles in a triangle?", ["90°", "180°", "270°", "360°", "120°"], 1),
            ("What is a negative number?", ["Number greater than zero", "Number less than zero", "Zero", "Fraction", "Decimal"], 1),
            ("What is the square root of 64?", ["6", "8", "10", "12", "16"], 1),
            ("What is a parallelogram?", ["Circle", "Quadrilateral with opposite sides parallel", "Triangle", "Pentagon", "Hexagon"], 1),
            ("What is 3/4 as a decimal?", ["0.25", "0.75", "0.50", "0.34", "0.43"], 1),
        ],
        3: [
            ("What is the quadratic formula?", ["ax + b = 0", "x = (-b ± √(b²-4ac)) / 2a", "y = mx + b", "a² + b² = c²", "x + y = z"], 1),
            ("What is the derivative of x²?", ["x", "2x", "x²", "2", "0"], 1),
            ("What is a logarithm?", ["Exponent", "Inverse of exponential function", "Square root", "Fraction", "Prime number"], 1),
            ("What is the slope-intercept form of a line?", ["ax + by = c", "y = mx + b", "y = x²", "x = my + b", "a² + b² = c²"], 1),
            ("What is factorial of 5 (5!)?", ["25", "120", "100", "60", "15"], 1),
            ("What is the value of e (Euler's number) approximately?", ["1.71", "2.71", "3.71", "4.71", "5.71"], 1),
            ("What is an asymptote?", ["Intersection point", "Line that curve approaches but never touches", "Slope", "Y-intercept", "Vertex"], 1),
            ("What is the area of a circle with radius 5?", ["10π", "25π", "5π", "50π", "100π"], 1),
            ("What is a matrix?", ["A number", "Rectangular array of numbers", "A fraction", "A circle", "A line"], 1),
            ("What is the difference between mean and median?", ["No difference", "Mean is average, median is middle value", "Mean is middle, median is average", "Both are the same", "Mean is mode"], 1),
        ],
        4: [
            ("What is the fundamental theorem of calculus?", ["Derivative rule", "Connection between differentiation and integration", "Limit definition", "Chain rule", "Product rule"], 1),
            ("What is a vector space?", ["Set of numbers", "Set with defined addition and scalar multiplication", "Matrix", "Function", "Sequence"], 1),
            ("What is the Binomial Theorem?", ["(a+b)² = a²+2ab+b²", "Expansion of (a+b)ⁿ using combinations", "Pythagorean theorem", "Quadratic formula", "Derivative rule"], 1),
            ("What is a complex number?", ["Large number", "Number with real and imaginary parts", "Negative number", "Fraction", "Prime number"], 1),
            ("What is the limit definition of derivative?", ["f'(x) = f(x+h)", "f'(x) = lim[h→0] (f(x+h)-f(x))/h", "f'(x) = 2x", "f'(x) = ∫f(x)dx", "f'(x) = f(x)"], 1),
            ("What is an eigenvector?", ["Large vector", "Vector that stays in same direction under transformation", "Zero vector", "Unit vector", "Position vector"], 1),
            ("What is Taylor series?", ["Number series", "Function representation as infinite sum of terms", "Arithmetic series", "Geometric series", "Fibonacci sequence"], 1),
            ("What is the Intermediate Value Theorem?", ["All functions are continuous", "Continuous function takes all values between f(a) and f(b)", "Derivatives exist everywhere", "Integrals always converge", "Limits always exist"], 1),
            ("What is a partial derivative?", ["Full derivative", "Derivative with respect to one variable", "No derivative", "Complex derivative", "Matrix derivative"], 1),
            ("What is the divergence of a vector field?", ["Vector", "Scalar measuring field's source strength", "Matrix", "Function", "Constant"], 1),
        ],
        5: [
            ("What is the Riemann Hypothesis about?", ["Prime numbers", "Distribution of zeros of zeta function", "Pi value", "E value", "Infinity"], 1),
            ("What is a Hilbert space?", ["Small space", "Complete inner product space", "Metric space only", "Topological space", "Vector field"], 1),
            ("What is Gödel's Incompleteness Theorem?", ["All theorems provable", "Consistent systems have unprovable truths", "Math is complete", "Logic is perfect", "Axioms prove everything"], 1),
            ("What is the Cauchy-Riemann equations used for?", ["Real functions", "Testing analyticity of complex functions", "Matrix operations", "Vector calculus", "Number theory"], 1),
            ("What is a Banach space?", ["Infinite space", "Complete normed vector space", "Metric space", "Topological space", "Hilbert space"], 1),
            ("What is the Fourier Transform?", ["Matrix operation", "Decomposition of function into frequencies", "Derivative", "Integral", "Limit"], 1),
            ("What is a manifold in topology?", ["Flat surface", "Space locally resembling Euclidean space", "Curved line", "Point set", "Graph"], 1),
            ("What is the Heine-Borel Theorem?", ["All sets are compact", "Subset of Rⁿ is compact iff closed and bounded", "Open sets are compact", "Finite sets are compact", "Infinite sets are compact"], 1),
            ("What is the Stone-Weierstrass Theorem about?", ["Polynomials", "Approximating continuous functions", "Derivatives", "Integrals", "Limits"], 1),
            ("What is a Lie group?", ["Number group", "Group that is also a differentiable manifold", "Matrix group only", "Finite group", "Cyclic group"], 1),
        ],
    },
    # Add more categories...
}

# Question templates for variety
QUESTION_TEMPLATES = {
    "definition": [
        "What is {topic}?",
        "Define {topic}.",
        "What does {topic} mean?",
        "Explain {topic}.",
        "What is meant by {topic}?",
    ],
    "function": [
        "What is the function of {topic}?",
        "What does {topic} do?",
        "What is the role of {topic}?",
        "What is the purpose of {topic}?",
        "How does {topic} work?",
    ],
    "comparison": [
        "What is the difference between {topic1} and {topic2}?",
        "How does {topic1} differ from {topic2}?",
        "Compare {topic1} and {topic2}.",
        "What distinguishes {topic1} from {topic2}?",
    ],
    "cause": [
        "What causes {topic}?",
        "Why does {topic} occur?",
        "What leads to {topic}?",
        "What is the reason for {topic}?",
    ],
    "calculation": [
        "What is {calculation}?",
        "Calculate {calculation}.",
        "Find {calculation}.",
        "Solve for {calculation}.",
    ],
}


def generate_questions_from_content(total: int, categories: List[str], levels: List[int],
                                    mode: str, output_file: str) -> None:
    """Generate questions from educational content database"""

    # Filter available content
    available_categories = [cat for cat in categories if cat in EDUCATIONAL_CONTENT]

    if not available_categories:
        print(f"❌ Error: No content available for categories: {categories}")
        print(f"Available categories: {list(EDUCATIONAL_CONTENT.keys())}")
        return

    # Calculate distribution
    questions_per_category = total // len(available_categories)

    if mode == "even":
        questions_per_level = questions_per_category // len(levels)
        distribution = {
            cat: {level: questions_per_level for level in levels}
            for cat in available_categories
        }
    else:  # weighted
        weights = {1: 0.30, 2: 0.25, 3: 0.20, 4: 0.15, 5: 0.10}
        distribution = {
            cat: {level: int(questions_per_category * weights.get(level, 0.20)) for level in levels}
            for cat in available_categories
        }

    # Display plan
    print("=" * 70)
    print("REAL QUESTION GENERATION PLAN")
    print("=" * 70)
    print(f"Total questions to generate: {total}")
    print(f"Categories: {len(available_categories)}")
    print(f"Difficulty levels: {levels}")
    print(f"Distribution mode: {mode}\n")

    # Generate questions
    all_questions = []
    question_id = 1
    category_prefixes = {
        "Biology": "bio", "Geography": "geo", "Math": "mat",
        "Science": "sci", "Technology": "tec", "History": "his",
        "Space": "spa", "Food": "foo", "Language": "lan", "Earth": "ear"
    }

    for category in available_categories:
        print(f"\nGenerating {category}...")
        prefix = category_prefixes.get(category, category[:3].lower())

        for level in levels:
            count = distribution[category][level]

            # Get content for this category/level
            if level in EDUCATIONAL_CONTENT[category]:
                content_pool = EDUCATIONAL_CONTENT[category][level]
            else:
                print(f"  ⚠️ No content for {category} Level {level}, skipping...")
                continue

            # Generate questions (repeat pool if needed)
            for i in range(count):
                content_index = i % len(content_pool)
                question_text, answers, correct_idx = content_pool[content_index]

                # If we need more questions than content, add variation
                if i >= len(content_pool):
                    question_text = f"{question_text} (Variant {i // len(content_pool) + 1})"

                row = {
                    'id': f"{prefix}-l{level}-{question_id:04d}",
                    'category': category,
                    'level': level,
                    'text': question_text,
                    'answer1': answers[0],
                    'answer2': answers[1],
                    'answer3': answers[2],
                    'answer4': answers[3],
                    'answer5': answers[4],
                    'correctAnswerIndex': correct_idx,
                    'hint': f"This is a {category} question at difficulty level {level}"
                }
                all_questions.append(row)
                question_id += 1

            print(f"  Level {level}: {count} questions")

    # Write to CSV
    print(f"\nWriting to {output_file}...")
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'id', 'category', 'level', 'text', 'answer1', 'answer2',
            'answer3', 'answer4', 'answer5', 'correctAnswerIndex', 'hint'
        ])
        writer.writeheader()
        writer.writerows(all_questions)

    # Verify uniqueness
    unique_texts = len(set(q['text'] for q in all_questions))

    print("\n" + "=" * 70)
    print("✅ SUCCESS!")
    print("=" * 70)
    print(f"Generated: {len(all_questions)} questions")
    print(f"Unique texts: {unique_texts}")
    print(f"Output file: {output_file}")
    if unique_texts < len(all_questions):
        print(f"⚠️ Warning: {len(all_questions) - unique_texts} repeated questions (due to limited content)")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(
        description="Generate REAL educational quiz questions with actual content"
    )
    parser.add_argument('--total', '-t', type=int, default=500,
                       help='Total number of questions (default: 500, limited by available content)')
    parser.add_argument('--categories', '-c', nargs='+',
                       default=['Biology', 'Geography', 'Math'],
                       help='Categories to include')
    parser.add_argument('--levels', '-l', nargs='+', type=int,
                       default=[1, 2, 3, 4, 5],
                       help='Difficulty levels')
    parser.add_argument('--mode', '-m', choices=['even', 'weighted'],
                       default='even',
                       help='Distribution mode')
    parser.add_argument('--output', '-o', default='quiz-questions-real.csv',
                       help='Output filename')

    args = parser.parse_args()

    # Warn about content limitations
    print("\n⚠️ NOTE: This generator uses a curated educational content database.")
    print("   Each category/level has ~10 unique questions.")
    print("   Generating more will result in repeated questions with variant labels.\n")

    generate_questions_from_content(
        args.total,
        args.categories,
        args.levels,
        args.mode,
        args.output
    )


if __name__ == "__main__":
    main()
