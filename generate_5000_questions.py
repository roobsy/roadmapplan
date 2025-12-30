#!/usr/bin/env python3
import csv
import random

categories = {
    'Biology': 'bio',
    'Geography': 'geo',
    'Math': 'math',
    'Science': 'sci',
    'Technology': 'tech',
    'History': 'hist',
    'Space': 'space',
    'Food': 'food',
    'Language': 'lang',
    'Earth': 'earth'
}

def generate_biology_q(level, num):
    questions = []
    templates = {
        1: [
            ("What is the basic unit of {concept}?", ["atom", "molecule", "cell", "tissue", "organ"], 2, "smallest functional unit"),
            ("Which organ is responsible for {function}?", ["brain", "heart", "liver", "kidney", "lung"], None, "think about body systems"),
            ("How many {structure} does a human have?", ["1", "2", "3", "4", "5"], None, "count the organs"),
        ],
        2: [
            ("What enzyme breaks down {substrate}?", ["amylase", "lipase", "protease", "lactase", "maltase"], None, "enzyme names end in -ase"),
            ("Which cell organelle performs {function}?", ["nucleus", "mitochondria", "ribosome", "lysosome", "golgi"], None, "cellular compartments"),
        ],
        3: [
            ("What is the product of {process}?", ["ATP", "glucose", "oxygen", "water", "CO2"], None, "metabolic pathway"),
            ("Which hormone regulates {function}?", ["insulin", "thyroxine", "adrenaline", "testosterone", "estrogen"], None, "endocrine system"),
        ],
        4: [
            ("What is the mechanism of {process}?", ["phosphorylation", "methylation", "acetylation", "oxidation", "reduction"], None, "biochemical modification"),
            ("Which pathway is involved in {function}?", ["glycolysis", "krebs cycle", "ETC", "calvin cycle", "urea cycle"], None, "metabolic pathways"),
        ],
        5: [
            ("What genetic mechanism causes {condition}?", ["point mutation", "deletion", "insertion", "translocation", "inversion"], None, "molecular genetics"),
            ("Which protein complex performs {function}?", ["ribosome", "spliceosome", "proteasome", "nucleosome", "replisome"], None, "molecular machinery"),
        ]
    }
    
    for i in range(num):
        qid = f"{categories['Biology']}-l{level}-{i+1:03d}"
        # Create variations
        if level == 1:
            structures = ["bones", "lungs", "kidneys", "eyes", "ears", "hands", "feet"]
            struct = random.choice(structures)
            counts = {"bones": 206, "lungs": 2, "kidneys": 2, "eyes": 2, "ears": 2, "hands": 2, "feet": 2}
            answers = ["1", "2", "3", "4", "206"]
            correct = str(counts.get(struct, 2))
            q = [qid, "Biology", level, f"How many {struct} does an adult human typically have?",
                 answers[0], answers[1], answers[2], answers[3], answers[4],
                 answers.index(correct) if correct in answers else 0,
                 f"Consider human anatomy"]
        elif level == 2:
            substrates = ["starch", "protein", "fat", "lactose", "maltose"]
            enzymes = ["amylase", "protease", "lipase", "lactase", "maltase"]
            idx = i % len(substrates)
            answers_list = ["amylase", "protease", "lipase", "lactase", "maltase"]
            q = [qid, "Biology", level, f"Which enzyme primarily breaks down {substrates[idx]}?",
                 answers_list[0], answers_list[1], answers_list[2], answers_list[3], answers_list[4],
                 idx, "Enzyme names often match their substrate"]
        elif level == 3:
            processes = ["glycolysis", "photosynthesis", "respiration", "fermentation", "protein synthesis"]
            products = ["pyruvate", "glucose", "ATP", "ethanol", "polypeptide"]
            idx = i % len(processes)
            answers_list = ["ATP", "glucose", "pyruvate", "oxygen", "water"]
            correct_map = {"glycolysis": 2, "photosynthesis": 1, "respiration": 0, "fermentation": 3, "protein synthesis": 1}
            q = [qid, "Biology", level, f"What is the primary product of {processes[idx]}?",
                 answers_list[0], answers_list[1], answers_list[2], answers_list[3], answers_list[4],
                 correct_map.get(processes[idx], 0), "Think about the pathway's main output"]
        elif level == 4:
            mechanisms = ["DNA replication", "transcription", "translation", "DNA repair", "recombination"]
            enzymes = ["DNA polymerase", "RNA polymerase", "ribosome", "ligase", "recombinase"]
            idx = i % len(mechanisms)
            answers_list = enzymes
            q = [qid, "Biology", level, f"Which enzyme/complex is primarily responsible for {mechanisms[idx]}?",
                 answers_list[0], answers_list[1], answers_list[2], answers_list[3], answers_list[4],
                 idx, "Match the process with its enzyme"]
        else:  # level 5
            topics = ["CRISPR", "epigenetics", "proteomics", "genomics", "transcriptomics"]
            applications = ["gene editing", "gene regulation study", "protein analysis", "genome sequencing", "RNA expression analysis"]
            idx = i % len(topics)
            answers_list = applications
            q = [qid, "Biology", level, f"What is the primary application of {topics[idx]}?",
                 answers_list[0], answers_list[1], answers_list[2], answers_list[3], answers_list[4],
                 idx, "Modern molecular biology technique"]
        
        questions.append(q)
    return questions

# Generate all questions
output = [['id', 'category', 'level', 'text', 'answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'correctAnswerIndex', 'hint']]

# 100 questions per category per level = 5000 total
for category in categories.keys():
    for level in range(1, 6):
        if category == 'Biology':
            output.extend(generate_biology_q(level, 100))
        # Add similar generators for other categories...

# For now, save what we have
with open('/home/user/roadmapplan/quiz-questions-sample.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(output)

print(f"Generated {len(output)-1} questions")
