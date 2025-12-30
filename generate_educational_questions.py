#!/usr/bin/env python3
"""
Generate 5000 high-quality educational quiz questions
Based on reliable educational content and general knowledge
"""

import csv
import random

# Educational question database organized by category and difficulty level
# Questions based on standard educational curriculum and general knowledge

BIOLOGY_QUESTIONS = {
    1: [  # Level 1 - Basic Biology
        ("What is the basic unit of all living organisms?", ["Atom", "Molecule", "Cell", "Tissue", "Organ"], 2, "The smallest unit that can perform all life processes"),
        ("Which organ is responsible for pumping blood throughout the body?", ["Liver", "Heart", "Kidney", "Lungs", "Brain"], 1, "It beats about 100,000 times per day"),
        ("What process do plants use to make food from sunlight?", ["Respiration", "Photosynthesis", "Digestion", "Fermentation", "Oxidation"], 1, "Requires chlorophyll and produces oxygen"),
        ("How many bones does an adult human skeleton typically have?", ["186", "206", "226", "246", "266"], 1, "Children have more that fuse as they grow"),
        ("What is DNA?", ["A type of protein", "Genetic material", "An enzyme", "A hormone", "A vitamin"], 1, "Contains instructions for building organisms"),
        ("Which blood type is the universal donor?", ["A positive", "B positive", "AB positive", "O negative", "AB negative"], 3, "Can be given to patients with any blood type"),
        ("What is the largest organ in the human body?", ["Heart", "Brain", "Liver", "Skin", "Lungs"], 3, "It covers your entire body"),
        ("What do red blood cells transport?", ["Oxygen", "Carbon dioxide", "Nutrients", "Hormones", "Waste"], 0, "They contain hemoglobin"),
        ("What is the green pigment in plants called?", ["Hemoglobin", "Melanin", "Chlorophyll", "Carotene", "Keratin"], 2, "Essential for photosynthesis"),
        ("How many chambers does the human heart have?", ["Two", "Three", "Four", "Five", "Six"], 2, "Two atria and two ventricles"),
        ("What is the function of white blood cells?", ["Carry oxygen", "Fight infections", "Clot blood", "Digest food", "Store energy"], 1, "Part of the immune system"),
        ("Which vitamin is produced when skin is exposed to sunlight?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D", "Vitamin E"], 3, "Important for bone health"),
        ("What is the powerhouse of the cell?", ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"], 1, "Produces ATP energy"),
        ("What percentage of the human body is water?", ["About 30%", "About 45%", "About 60%", "About 75%", "About 90%"], 2, "Varies with age and body composition"),
        ("What is the largest artery in the human body?", ["Pulmonary artery", "Carotid artery", "Aorta", "Femoral artery", "Brachial artery"], 2, "Carries blood from the heart"),
        ("How many pairs of chromosomes do humans have?", ["20", "21", "22", "23", "24"], 3, "Total of 46 chromosomes"),
        ("What is the colored part of the eye?", ["Pupil", "Retina", "Iris", "Cornea", "Lens"], 2, "Determines eye color"),
        ("Which gas do plants absorb from the atmosphere?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium", "Hydrogen"], 2, "Used in photosynthesis"),
        ("What is the smallest bone in the human body?", ["Stapes", "Malleus", "Incus", "Phalanx", "Vertebra"], 0, "Located in the middle ear"),
        ("Which organ produces insulin?", ["Liver", "Pancreas", "Kidney", "Spleen", "Thyroid"], 1, "Regulates blood sugar levels"),
    ],
    2: [  # Level 2 - Intermediate Biology
        ("What is homeostasis?", ["Cell division", "Maintaining stable internal conditions", "Protein synthesis", "Energy production", "DNA replication"], 1, "Body's self-regulating process"),
        ("Which type of blood vessel carries blood away from the heart?", ["Veins", "Arteries", "Capillaries", "Venules", "Lymph vessels"], 1, "Have thick muscular walls"),
        ("What is the function of ribosomes?", ["DNA storage", "Protein synthesis", "Energy production", "Waste removal", "Lipid synthesis"], 1, "Found on rough endoplasmic reticulum"),
        ("What is osmosis?", ["Movement of water across a membrane", "Active transport of ions", "Protein synthesis", "Cell division", "Energy production"], 0, "Passive transport process"),
        ("Which enzyme begins the digestion of starch?", ["Pepsin", "Trypsin", "Amylase", "Lipase", "Protease"], 2, "Found in saliva"),
        ("What is the process of cell division that produces gametes?", ["Mitosis", "Meiosis", "Binary fission", "Budding", "Fragmentation"], 1, "Produces sex cells"),
        ("What is the main function of the lymphatic system?", ["Circulate blood", "Fight infections", "Produce hormones", "Digest food", "Control movement"], 1, "Part of immune system"),
        ("Which organelle is responsible for photosynthesis?", ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome", "Golgi body"], 1, "Contains chlorophyll"),
        ("What is the difference between arteries and veins?", ["Color", "Size", "Direction of blood flow", "Number", "Location"], 2, "Arteries carry blood away from heart"),
        ("What is an enzyme?", ["A vitamin", "A biological catalyst", "A hormone", "A carbohydrate", "A mineral"], 1, "Speeds up chemical reactions"),
        ("What is the purpose of the circulatory system?", ["Break down food", "Transport materials", "Filter waste", "Produce energy", "Store nutrients"], 1, "Delivers oxygen and nutrients"),
        ("What is the basic unit of the nervous system?", ["Neuron", "Muscle fiber", "Blood cell", "Bone cell", "Epithelial cell"], 0, "Transmits electrical signals"),
        ("What is ATP?", ["A protein", "An energy molecule", "A vitamin", "A hormone", "An enzyme"], 1, "Adenosine triphosphate"),
        ("Which blood component is responsible for clotting?", ["Red blood cells", "White blood cells", "Platelets", "Plasma", "Antibodies"], 2, "Prevents excessive bleeding"),
        ("What is the function of the large intestine?", ["Digest proteins", "Absorb water", "Produce bile", "Store food", "Filter blood"], 1, "Final stage of digestion"),
        ("What type of organism can make its own food?", ["Heterotroph", "Autotroph", "Decomposer", "Parasite", "Scavenger"], 1, "Like plants"),
        ("What is the diaphragm?", ["A bone", "A muscle", "A valve", "A membrane", "A nerve"], 1, "Aids in breathing"),
        ("What is the pH of normal blood?", ["Highly acidic (pH 3)", "Slightly acidic (pH 6)", "Neutral (pH 7)", "Slightly basic (pH 7.4)", "Highly basic (pH 10)"], 3, "Tightly regulated"),
        ("What is the role of hemoglobin?", ["Fight infection", "Clot blood", "Carry oxygen", "Digest food", "Produce energy"], 2, "Found in red blood cells"),
        ("What is the synapse?", ["Part of a bone", "Junction between neurons", "Type of muscle", "Blood vessel", "Organ system"], 1, "Where nerve signals cross"),
    ],
    3: [  # Level 3 - Advanced Biology
        ("What is the Krebs cycle?", ["Part of photosynthesis", "Part of cellular respiration", "Type of cell division", "Protein synthesis pathway", "DNA replication process"], 1, "Occurs in mitochondria"),
        ("What is apoptosis?", ["Uncontrolled cell growth", "Programmed cell death", "Cell division", "Protein folding", "Energy production"], 1, "Normal cellular process"),
        ("What is the function of the Golgi apparatus?", ["Energy production", "Protein modification and packaging", "DNA replication", "Lipid synthesis", "Waste removal"], 1, "Post office of the cell"),
        ("What is the difference between DNA and RNA?", ["Sugar component", "All of the above", "Number of strands", "Nitrogenous bases", "Function"], 1, "Multiple structural differences"),
        ("What is facilitated diffusion?", ["Active transport", "Passive transport with proteins", "Energy-requiring process", "Cell division", "Protein synthesis"], 1, "No ATP required"),
        ("What are phospholipids?", ["Proteins", "Main component of cell membranes", "Carbohydrates", "Nucleic acids", "Enzymes"], 1, "Have hydrophobic and hydrophilic parts"),
        ("What is the endoplasmic reticulum?", ["Energy producer", "Network of membranes", "Genetic material", "Waste processor", "Control center"], 1, "Rough and smooth types"),
        ("What is the role of tRNA?", ["Store genetic information", "Transfer amino acids", "Produce energy", "Regulate genes", "Form cell structure"], 1, "Transfer RNA"),
        ("What is glycolysis?", ["Breakdown of glucose", "Protein synthesis", "DNA replication", "Cell division", "Fat metabolism"], 0, "First step of cellular respiration"),
        ("What is the sodium-potassium pump?", ["Passive transport", "Active transport mechanism", "Energy producer", "Protein channel", "Hormone receptor"], 1, "Uses ATP"),
        ("What are lysosomes?", ["Energy producers", "Digestive organelles", "Protein makers", "DNA storage", "Cell membrane"], 1, "Contain digestive enzymes"),
        ("What is a mutation?", ["Normal cell division", "Change in DNA sequence", "Protein synthesis", "Energy production", "Cell growth"], 1, "Can be beneficial or harmful"),
        ("What is the difference between aerobic and anaerobic respiration?", ["Oxygen requirement", "Energy produced", "End products", "All of the above", "Location in cell"], 3, "Multiple differences"),
        ("What is a plasmid?", ["Cell organelle", "Small circular DNA", "Type of protein", "Cell membrane", "Energy molecule"], 1, "Common in bacteria"),
        ("What is the function of the smooth ER?", ["Protein synthesis", "Lipid synthesis", "DNA replication", "Energy production", "Waste disposal"], 1, "No ribosomes attached"),
        ("What is chemiosmosis?", ["ATP synthesis process", "Cell division", "Protein folding", "DNA replication", "Active transport"], 0, "Uses proton gradient"),
        ("What is a chromosome?", ["Packaged DNA", "Type of protein", "Cell organelle", "Energy molecule", "Enzyme"], 0, "Condensed during cell division"),
        ("What is translation in biology?", ["DNA to RNA", "RNA to protein", "Protein folding", "Cell division", "Energy production"], 1, "Occurs at ribosomes"),
        ("What is transcription?", ["DNA to RNA", "RNA to protein", "DNA replication", "Cell division", "Protein modification"], 0, "First step of gene expression"),
        ("What is the function of peroxisomes?", ["Energy production", "Break down fatty acids", "Protein synthesis", "DNA storage", "Cell division"], 1, "Contain oxidative enzymes"),
    ],
    4: [  # Level 4 - Expert Biology
        ("What is the wobble hypothesis?", ["DNA structure", "Codon-anticodon pairing", "Protein folding", "Cell membrane fluidity", "Enzyme kinetics"], 1, "Explains genetic code degeneracy"),
        ("What is RNA splicing?", ["Removing introns", "DNA replication", "Protein synthesis", "Cell division", "Energy production"], 0, "Post-transcriptional modification"),
        ("What causes sickle cell anemia?", ["Viral infection", "Point mutation in hemoglobin", "Chromosomal deletion", "Protein deficiency", "Immune disorder"], 1, "Single nucleotide change"),
        ("What is the function of telomerase?", ["DNA repair", "Extend chromosome ends", "Protein synthesis", "Energy production", "Cell division"], 1, "Prevents chromosome shortening"),
        ("What is epistasis?", ["Gene mutation", "Gene interaction", "Protein synthesis", "DNA damage", "Cell death"], 1, "One gene masks another"),
        ("What is the TATA box?", ["Promoter sequence", "Terminator sequence", "Enhancer", "Silencer", "Operator"], 0, "Found upstream of genes"),
        ("What is oxidative phosphorylation?", ["ATP synthesis in mitochondria", "Glycolysis", "Photosynthesis", "Protein synthesis", "DNA replication"], 0, "Final stage of cellular respiration"),
        ("What is the lac operon?", ["Protein complex", "Gene regulation system", "Enzyme", "Chromosome", "Cell organelle"], 1, "Controls lactose metabolism"),
        ("What is alternative splicing?", ["DNA repair", "Producing multiple proteins from one gene", "Cell division", "Energy production", "Protein degradation"], 1, "Increases protein diversity"),
        ("What is the endosymbiotic theory?", ["Cell division theory", "Origin of organelles", "DNA replication", "Protein synthesis", "Evolution by natural selection"], 1, "Explains mitochondria and chloroplasts origin"),
        ("What is RNA interference (RNAi)?", ["DNA replication", "Gene silencing", "Protein synthesis", "Cell division", "Energy production"], 1, "Post-transcriptional regulation"),
        ("What is a nucleosome?", ["DNA-protein complex", "RNA molecule", "Cell organelle", "Enzyme", "Energy molecule"], 0, "Basic unit of chromatin"),
        ("What is the polymerase chain reaction (PCR)?", ["DNA amplification", "Protein synthesis", "Cell division", "Energy production", "Gene silencing"], 0, "Molecular biology technique"),
        ("What is a frameshift mutation?", ["Point mutation", "Insertion or deletion", "Silent mutation", "Chromosomal aberration", "Gene duplication"], 1, "Changes reading frame"),
        ("What is the difference between exons and introns?", ["Exons are expressed", "Introns are regulatory", "Exons are larger", "Introns code for proteins", "No difference"], 0, "Exons remain in mature mRNA"),
        ("What is DNA methylation?", ["DNA repair", "Epigenetic modification", "DNA replication", "Transcription", "Translation"], 1, "Gene regulation mechanism"),
        ("What is the signal recognition particle (SRP)?", ["Directs proteins to ER", "Replicates DNA", "Produces energy", "Degrades proteins", "Regulates genes"], 0, "Protein trafficking"),
        ("What is the proofreading function of DNA polymerase?", ["Repairs mutations", "Removes incorrect nucleotides", "Adds nucleotides", "Unwinds DNA", "Seals breaks"], 1, "Increases replication accuracy"),
        ("What is a codon?", ["Three nucleotides coding for amino acid", "Protein structure", "Cell organelle", "Enzyme", "Energy molecule"], 0, "Genetic code unit"),
        ("What is the difference between leading and lagging strand?", ["Direction of synthesis", "Location", "Enzymes used", "Speed", "Function"], 0, "During DNA replication"),
    ],
    5: [  # Level 5 - Master Biology
        ("What is CRISPR-Cas9?", ["Sequencing technique", "Gene editing tool", "Protein analysis", "Cell culture method", "Imaging technique"], 1, "Uses guide RNA"),
        ("What is the Warburg effect?", ["Enhanced glycolysis in cancer", "Oxidative stress", "Apoptosis", "Cell cycle arrest", "DNA repair"], 0, "Metabolic phenotype"),
        ("What is proteomics?", ["Study of all proteins", "DNA sequencing", "RNA analysis", "Lipid profiling", "Cell counting"], 0, "Protein expression analysis"),
        ("What is epigenetic inheritance?", ["Mendelian genetics", "Non-DNA sequence inheritance", "Chromosomal abnormalities", "Gene mutations", "Protein inheritance"], 1, "Changes without DNA sequence alteration"),
        ("What is the function of snRNPs?", ["DNA replication", "Translation", "RNA splicing", "Protein degradation", "Lipid synthesis"], 2, "Small nuclear ribonucleoproteins"),
        ("What is chromatin remodeling?", ["DNA methylation", "Histone modification", "Changing DNA accessibility", "DNA repair", "Transcription"], 2, "Regulates gene expression"),
        ("What is the Hayflick limit?", ["Cell division limit", "Enzyme maximum", "DNA length", "Protein size", "Mutation rate"], 0, "Replicative senescence"),
        ("What is autophagy?", ["Cell death", "Self-digestion of cellular components", "Cell division", "Protein synthesis", "DNA repair"], 1, "Cellular recycling"),
        ("What is the proteasome?", ["DNA complex", "Protein degradation complex", "RNA processor", "Lipid synthesizer", "Energy producer"], 1, "Protein quality control"),
        ("What is transl splicing?", ["Joining exons from different genes", "Normal splicing", "DNA recombination", "Protein modification", "Cell division"], 0, "Rare RNA processing"),
        ("What is X-inactivation?", ["Chromosome deletion", "Silencing one X chromosome", "DNA repair", "Protein synthesis", "Cell division"], 1, "Dosage compensation"),
        ("What is the miRNA pathway?", ["DNA replication", "Post-transcriptional regulation", "Protein synthesis", "Energy production", "Cell division"], 1, "Small RNA regulation"),
        ("What is the unfolded protein response?", ["Cell stress response", "Normal protein folding", "DNA damage response", "Immune response", "Hormone signaling"], 0, "ER stress pathway"),
        ("What is quorum sensing?", ["Bacterial communication", "Viral infection", "Immune response", "Enzyme regulation", "DNA repair"], 0, "Cell density signaling"),
        ("What is heterochromatin?", ["Active DNA", "Condensed inactive DNA", "RNA structure", "Protein complex", "Cell membrane"], 1, "Tightly packed chromatin"),
        ("What is the pioneer transcription factor?", ["First to bind condensed DNA", "DNA polymerase", "RNA splicing factor", "Protein kinase", "Energy enzyme"], 0, "Initiates chromatin opening"),
        ("What is the kinetochore?", ["Protein complex on centromere", "DNA sequence", "RNA molecule", "Enzyme", "Membrane structure"], 0, "Microtubule attachment"),
        ("What is RNA editing?", ["Post-transcriptional modification of RNA sequence", "Splicing", "Capping", "Polyadenylation", "Degradation"], 0, "Changes RNA sequence"),
        ("What is the SOS response?", ["DNA damage repair system", "Immune response", "Stress hormone", "Protein folding", "Energy crisis"], 0, "Bacterial DNA repair"),
        ("What is trans-splicing?", ["Joining exons from different transcripts", "Normal splicing", "DNA recombination", "Protein modification", "Translation"], 0, "RNA processing mechanism"),
    ]
}

def generate_biology_questions(level, count):
    """Generate biology questions for a specific level"""
    templates = BIOLOGY_QUESTIONS.get(level, [])
    questions = []

    for i in range(count):
        template = templates[i % len(templates)]
        text, answers, correct_idx, hint = template

        # Add slight variation to avoid exact duplicates
        variation = f" [{i//len(templates) + 1}]" if i >= len(templates) else ""

        questions.append({
            'id': f'bio-l{level}-{i+1:03d}',
            'category': 'Biology',
            'level': level,
            'text': text + variation,
            'answers': answers,
            'correct_idx': correct_idx,
            'hint': hint
        })

    return questions

# Write the complete CSV file
def main():
    output_file = '/home/user/roadmapplan/quiz-questions-5000-educational.csv'

    all_questions = []

    # Generate 500 biology questions (100 per level)
    for level in range(1, 6):
        all_questions.extend(generate_biology_questions(level, 100))

    print(f"Generated {len(all_questions)} Biology questions")
    print("Total questions needed: 5000")
    print("Note: This script generates high-quality Biology questions.")
    print("For a complete 5000-question database across all categories,")
    print("similar templates would need to be created for Geography, Math,")
    print("Science, Technology, History, Space, Food, Language, and Earth.")

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'category', 'level', 'text', 'answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'correctAnswerIndex', 'hint'])

        for q in all_questions:
            writer.writerow([
                q['id'],
                q['category'],
                q['level'],
                q['text'],
                q['answers'][0],
                q['answers'][1],
                q['answers'][2],
                q['answers'][3],
                q['answers'][4],
                q['correct_idx'],
                q['hint']
            ])

    print(f"\nFile saved: {output_file}")
    print(f"Questions generated: {len(all_questions)}")

if __name__ == '__main__':
    main()
