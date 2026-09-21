import { StudyNote } from '../types';

export const INITIAL_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note-cs-101',
    title: 'Data Structures & Big-O Algorithmic Complexity Guide',
    subject: 'Computer Science',
    courseCode: 'CS 106B',
    category: 'Cheat Sheet',
    format: 'markdown',
    fileName: 'data_structures_big_o.md',
    fileSize: 4200,
    author: 'Alex Chen',
    semester: 'Fall 2024',
    createdAt: '2024-10-14T09:30:00.000Z',
    updatedAt: '2024-10-14T09:30:00.000Z',
    isFavorite: true,
    viewsCount: 142,
    tags: ['Algorithms', 'Big-O', 'Data Structures', 'Binary Trees', 'Graphs'],
    content: `# Data Structures & Algorithmic Complexity

Comprehensive cheat sheet covering fundamental data structures, worst vs. average case asymptotic time complexities, and key operations.

## 1. Asymptotic Complexity Reference

| Data Structure | Access | Search | Insertion | Deletion | Space Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Dynamic Array** | O(1) | O(n) | O(1) amortized | O(n) | O(n) |
| **Singly Linked List** | O(n) | O(n) | O(1) at head | O(1) with ref | O(n) |
| **Hash Table** | N/A | O(1) avg / O(n) worst | O(1) avg | O(1) avg | O(n) |
| **Binary Search Tree** | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) |
| **Red-Black / AVL Tree** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **Min/Max Binary Heap** | O(1) peek | O(n) | O(log n) push | O(log n) pop | O(n) |

## 2. Tree Traversal Quick Invariants
- **In-Order (Left, Root, Right)**: Produces strictly sorted ascending order in a Binary Search Tree (BST).
- **Pre-Order (Root, Left, Right)**: Ideal for cloning/serializing tree hierarchies.
- **Post-Order (Left, Right, Root)**: Ideal for deleting/freeing memory nodes and evaluating postfix expressions.
- **Level-Order (Breadth-First Search)**: Uses a FIFO queue to visit nodes level by level.

## 3. Graph Traversal Comparison
- **BFS (Breadth-First Search)**:
  - Queue-based implementation.
  - Guaranteed to discover the shortest unweighted path between two nodes.
  - Memory footprint: O(V) where V is the vertex count.
- **DFS (Depth-First Search)**:
  - Stack / recursive recursion frame.
  - Suited for topological sorting, cycle detection, and strongly connected components (Tarjan's or Kosaraju's).

## 4. Key Exam Pitfalls
- Hash collisions degrade hash map lookups to O(n) when all keys hash to the same bucket.
- An unbalanced BST degrades to a linked list with O(n) search time.
- Amortized O(1) array doubling cost occurs because n resizes cost 2n operations over all pushes.`,
    aiSummary: `### Executive Summary
A comprehensive reference sheet for core computer science data structures. It systematically catalogs asymptotic time and space complexities for arrays, linked lists, hash tables, balanced search trees, and heaps, alongside graph algorithms and tree traversal mechanics.

### Key Takeaways
- **Hash Table Efficiency**: Average O(1) lookups rely on a uniform distribution; worst-case collapses to O(n) under heavy clustering or malicious collisions.
- **BST Invariant**: In-order traversal of any BST guarantees sorted element output.
- **BFS vs DFS**: BFS provides optimal shortest-path discovery on unweighted topologies; DFS is best suited for topological sorting and dependency resolution.`,
    flashcards: [
      {
        id: 'fc-1',
        front: 'What is the worst-case time complexity of lookup in an unbalanced Binary Search Tree?',
        back: 'O(n) — if inserted in sorted order, it degrades into a degenerate singly linked list.',
      },
      {
        id: 'fc-2',
        front: 'Which tree traversal order yields sorted output in a Binary Search Tree?',
        back: 'In-order traversal: Left child -> Root node -> Right child.',
      },
      {
        id: 'fc-3',
        front: 'Why does Dynamic Array insertion have amortized O(1) complexity instead of worst-case O(1)?',
        back: 'Because resizing (capacity doubling) requires copying all elements to new memory in O(n) time, but happens infrequently enough that the average cost per append is constant.',
      },
      {
        id: 'fc-4',
        front: 'What data structure is used to implement Breadth-First Search (BFS)?',
        back: 'A FIFO (First-In, First-Out) Queue.',
      },
    ],
    quiz: [
      {
        id: 'qz-1',
        question: 'Which of the following guarantees O(log n) worst-case search time?',
        options: ['Binary Search Tree', 'AVL / Red-Black Tree', 'Hash Map', 'Singly Linked List'],
        answerIndex: 1,
        explanation: 'AVL and Red-Black trees are self-balancing BSTs that maintain logarithmic height invariants even in the worst case.',
      },
      {
        id: 'qz-2',
        question: 'What is the space complexity of an adjacency matrix for a graph with V vertices?',
        options: ['O(V + E)', 'O(V)', 'O(V²)', 'O(E log V)'],
        answerIndex: 2,
        explanation: 'An adjacency matrix stores a V x V grid, consuming O(V²) space regardless of how few edges exist.',
      },
    ],
  },
  {
    id: 'note-bio-201',
    title: 'Cellular Respiration, Glycolysis & Mitochondrial ATP Synthesis',
    subject: 'Biology & Medicine',
    courseCode: 'BIO 201',
    category: 'Lecture Notes',
    format: 'text',
    fileName: 'cellular_respiration_lecture.txt',
    fileSize: 3800,
    author: 'Maya Lin',
    semester: 'Spring 2024',
    createdAt: '2024-11-02T14:15:00.000Z',
    updatedAt: '2024-11-02T14:15:00.000Z',
    isFavorite: true,
    viewsCount: 98,
    tags: ['Biochemistry', 'Metabolism', 'Mitochondria', 'Glycolysis', 'Krebs Cycle'],
    content: `Cellular Respiration & Bioenergetics: Lecture 7 Notes

Professor: Dr. Angela Morales | Course: BIO 201 Foundations of Biochemistry
Primary Objective: Tracking glucose oxidation through ATP generation.

Overall Chemical Equation:
C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ~30-32 ATP (Net energy yield)

Stage 1: Glycolysis (Location: Cytoplasm / Cytosol)
- Anaerobic process: does not require molecular oxygen.
- Energy Investment Phase: 2 ATP molecules are consumed (catalyzed by Hexokinase and Phosphofructokinase-1 / PFK-1).
  * CRITICAL REGULATION: PFK-1 is the committed rate-limiting step, allosterically inhibited by high ATP and citrate, activated by AMP and Fructose-2,6-bisphosphate.
- Energy Payoff Phase: Produces 4 ATP (via substrate-level phosphorylation) and 2 NADH.
- Net Output per Glucose: 2 Pyruvate + 2 ATP + 2 NADH + 2 H2O.

Stage 2: Pyruvate Oxidation / Link Reaction (Location: Mitochondrial Matrix)
- Pyruvate translocates across inner mitochondrial membrane via pyruvate translocase symporter.
- Pyruvate dehydrogenase complex (PDC) decarboxylates 3-carbon pyruvate into 2-carbon Acetyl-CoA.
- Byproducts: 1 CO2 released and 1 NADH produced per pyruvate (2 CO2 and 2 NADH per glucose).

Stage 3: Citric Acid Cycle / Krebs Cycle (Location: Mitochondrial Matrix)
- 2-carbon Acetyl-CoA combines with 4-carbon Oxaloacetate to form 6-carbon Citrate (Citrate synthase).
- In two full turns of the cycle (one per acetyl-CoA):
  * 4 CO2 released as metabolic waste
  * 6 NADH generated
  * 2 FADH2 generated
  * 2 ATP/GTP generated via substrate-level phosphorylation

Stage 4: Oxidative Phosphorylation & Electron Transport Chain (Location: Inner Mitochondrial Membrane)
- Complex I (NADH dehydrogenase): Accepts electrons from NADH, pumps 4 H+ across membrane into intermembrane space.
- Complex II (Succinate dehydrogenase): Accepts electrons from FADH2; does NOT pump protons!
- Coenzyme Q (Ubiquinone) shuttles electrons to Complex III (cytochrome bc1 complex, pumps 4 H+).
- Cytochrome c delivers electrons to Complex IV (cytochrome c oxidase, pumps 2 H+).
- Terminal Electron Acceptor: Molecular Oxygen (O2), which accepts 4 electrons and 4 H+ to generate 2 water molecules (H2O).
- Chemiosmosis: Electrochemical proton-motive force drives H+ back down its gradient through ATP Synthase (F0F1 complex), synthesizing ATP via rotary catalysis.
- P/O Ratios: ~2.5 ATP per NADH, ~1.5 ATP per FADH2.`,
    aiSummary: `### Executive Summary
Detailed biochemistry lecture on eukaryotic cellular respiration. Explains the four continuous stages converting glucose into metabolic energy (ATP) under aerobic conditions, highlighting enzymic control points and electron flow.

### Key Takeaways
- **Committed Step**: Phosphofructokinase-1 (PFK-1) controls glycolytic flux based on intracellular energy charge (ATP/AMP ratio).
- **Proton Pumps**: Complexes I, III, and IV pump protons into the mitochondrial intermembrane space; Complex II generates no proton gradient.
- **Oxygen Role**: O2 acts as the final electron acceptor in Complex IV, forming metabolic water.`,
    flashcards: [
      {
        id: 'fc-bio-1',
        front: 'What enzyme catalyzes the rate-limiting committed step of glycolysis?',
        back: 'Phosphofructokinase-1 (PFK-1).',
      },
      {
        id: 'fc-bio-2',
        front: 'Which complex in the Electron Transport Chain does NOT pump protons across the inner membrane?',
        back: 'Complex II (Succinate dehydrogenase).',
      },
      {
        id: 'fc-bio-3',
        front: 'What is the final electron acceptor in aerobic respiration, and what molecule does it produce?',
        back: 'Molecular oxygen (O2), producing water (H2O).',
      },
    ],
    quiz: [
      {
        id: 'qz-bio-1',
        question: 'Where does the citric acid cycle (Krebs cycle) physically occur in eukaryotic cells?',
        options: ['Cytosol', 'Mitochondrial Matrix', 'Intermembrane Space', 'Cristae lumen'],
        answerIndex: 1,
        explanation: 'The citric acid cycle takes place in the soluble mitochondrial matrix where all cycle enzymes (except succinate dehydrogenase) are located.',
      },
    ],
  },
  {
    id: 'note-math-152',
    title: 'Calculus II: Series Convergence Tests & Taylor Expansions',
    subject: 'Mathematics',
    courseCode: 'MATH 152',
    category: 'Summary Sheet',
    format: 'markdown',
    fileName: 'calculus_series_convergence.md',
    fileSize: 3100,
    author: 'Samir Patel',
    semester: 'Fall 2024',
    createdAt: '2024-11-20T16:45:00.000Z',
    updatedAt: '2024-11-20T16:45:00.000Z',
    isFavorite: false,
    viewsCount: 76,
    tags: ['Calculus', 'Taylor Series', 'Convergence', 'Power Series', 'Sequences'],
    content: `# Calculus II: Infinite Series & Convergence Decision Tree

A rapid verification blueprint for determining the convergence or divergence of infinite series \\sum a_n.

## 1. Step-by-Step Decision Hierarchy

1. **Divergence Test (n-th Term Test)**:
   - Compute \\lim_{n \\to \\infty} a_n.
   - If \\lim_{n \\to \\infty} a_n \\neq 0 (or does not exist), the series **DIVERGES**.
   - If the limit equals 0, the test is strictly inconclusive!

2. **Geometric Series**:
   - Form: \\sum c \\cdot r^n
   - Converges if and only if |r| < 1 to the exact sum S = a / (1 - r).
   - Diverges if |r| \\ge 1.

3. **p-Series Test**:
   - Form: \\sum 1 / n^p
   - Converges if p > 1.
   - Diverges if p \\le 1 (including the harmonic series when p = 1).

4. **Ratio Test**:
   - Compute L = \\lim_{n \\to \\infty} |a_{n+1} / a_n|.
   - If L < 1: Absolutely converges.
   - If L > 1: Diverges.
   - If L = 1: Inconclusive (switch to Integral, Comparison, or Raabe's test).
   - Best used on factorials (n!), powers (a^n), and products.

5. **Alternating Series Test (Leibniz Rule)**:
   - For \\sum (-1)^n b_n where b_n > 0:
   - Converges if:
     1. b_{n+1} \\le b_n for all n (monotonically non-increasing).
     2. \\lim_{n \\to \\infty} b_n = 0.

## 2. Standard Maclaurin Expansions (Centered at x = 0)
- e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\dots \\quad (R = \\infty)
- \\sin(x) = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!} = x - \\frac{x^3}{3!} + \\dots \\quad (R = \\infty)
- \\cos(x) = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n}}{(2n)!} = 1 - \\frac{x^2}{2!} + \\dots \\quad (R = \\infty)
- \\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n = 1 + x + x^2 + \\dots \\quad (|x| < 1)
- \\ln(1+x) = \\sum_{n=1}^{\\infty} (-1)^{n-1} \\frac{x^n}{n} \\quad (-1 < x \\le 1)`,
    aiSummary: `### Executive Summary
A concise, exam-focused reference for evaluating infinite series and finding power series representations in second-semester calculus. Outlines the optimal order to apply convergence tests.

### Key Takeaways
- Always apply the n-th term divergence test first: if the limit does not equal zero, you are done.
- The Ratio Test is the most effective tool when expressions contain factorials or geometric exponentials.
- Harmonic series (1/n) has a zero limit but still diverges logarithmically.`,
    flashcards: [
      {
        id: 'fc-math-1',
        front: 'If lim(n -> inf) a_n = 0, does the series sum(a_n) converge?',
        back: 'Not necessarily! The test is inconclusive. Example: The harmonic series sum(1/n) has terms tending to 0, but the series diverges.',
      },
      {
        id: 'fc-math-2',
        front: 'What condition on p ensures that the p-series sum(1/n^p) converges?',
        back: 'p must be strictly greater than 1 (p > 1).',
      },
    ],
  },
  {
    id: 'note-econ-101',
    title: 'Microeconomics: Price Elasticity, Market Welfare & Taxation',
    subject: 'Economics & Finance',
    courseCode: 'ECON 101',
    category: 'Exam Prep',
    format: 'markdown',
    fileName: 'microeconomics_welfare_elasticity.md',
    fileSize: 2900,
    author: 'Elena Rostova',
    semester: 'Fall 2024',
    createdAt: '2024-12-01T11:20:00.000Z',
    updatedAt: '2024-12-01T11:20:00.000Z',
    isFavorite: false,
    viewsCount: 65,
    tags: ['Economics', 'Elasticity', 'Consumer Surplus', 'Deadweight Loss', 'Taxes'],
    content: `# Microeconomics: Price Elasticity & Market Efficiency

Key definitions, midpoint elasticity equations, and graphical welfare impacts for the introductory microeconomics midterm.

## 1. Price Elasticity of Demand (PED)
- **Midpoint Formula**:
  $$\\epsilon_d = \\frac{(Q_2 - Q_1) / [(Q_1 + Q_2)/2]}{(P_2 - P_1) / [(P_1 + P_2)/2]}$$
- **Elasticity Classifications**:
  - |PED| > 1: Elastic (consumers are price sensitive; total revenue moves opposite to price).
  - |PED| = 1: Unit elastic (total revenue maximized).
  - |PED| < 1: Inelastic (consumers have few substitutes; raising price increases total revenue).
  - PED = 0: Perfectly inelastic (vertical demand curve, e.g., essential life-saving medicine).
  - PED = -\\infty: Perfectly elastic (horizontal demand curve).

## 2. Consumer Surplus (CS) & Producer Surplus (PS)
- **Consumer Surplus**: Area below the demand curve and above the market price up to quantity traded. Represents consumer willingness-to-pay minus actual price paid.
- **Producer Surplus**: Area above the supply curve and below the market price up to quantity traded. Represents revenue received minus marginal production cost.
- **Total Social Welfare**: CS + PS (+ Government Revenue from taxation).

## 3. Tax Incidence & Deadweight Loss (DWL)
- **Tax Incidence Invariant**: The legal assignment of a tax (whether levied on buyers or sellers) does NOT affect the economic burden of the tax.
- **Economic Burden Rule**: The tax burden falls most heavily on the side of the market that is **MORE INELASTIC** (less able to adjust behavior or find substitutes).
- **Deadweight Loss (Harberger's Triangle)**: The reduction in total economic surplus resulting from a tax distortion that prevents mutually beneficial trades from occurring.`,
    aiSummary: `### Executive Summary
Synthesizes the core microeconomic principles of price elasticity of demand and supply, total surplus analysis, and tax incidence. Demonstrates how elasticity governs market adjustments and deadweight loss.

### Key Takeaways
- **Total Revenue Test**: When demand is inelastic (|PED| < 1), increasing prices raises total seller revenue.
- **Tax Incidence**: The more inelastic market participant absorbs the largest share of the tax burden.`,
    flashcards: [
      {
        id: 'fc-econ-1',
        front: 'If demand is price inelastic (|PED| < 1), what happens to total revenue when the price increases?',
        back: 'Total revenue increases, because the percentage decrease in quantity demanded is smaller than the percentage increase in price.',
      },
      {
        id: 'fc-econ-2',
        front: 'Who bears the primary economic burden of an excise tax?',
        back: 'Whichever side of the market (buyers or sellers) is relatively more inelastic.',
      },
    ],
  },
  {
    id: 'note-psyc-210',
    title: 'Cognitive Psychology: Working Memory & Encoding Strategies',
    subject: 'Psychology & Sociology',
    courseCode: 'PSYC 210',
    category: 'Lecture Notes',
    format: 'text',
    fileName: 'cognitive_psych_memory_models.txt',
    fileSize: 3400,
    author: 'Jordan Washington',
    semester: 'Fall 2024',
    createdAt: '2024-12-10T15:00:00.000Z',
    updatedAt: '2024-12-10T15:00:00.000Z',
    isFavorite: true,
    viewsCount: 84,
    tags: ['Cognitive Science', 'Working Memory', 'Neuroscience', 'Baddeley', 'Spaced Repetition'],
    content: `Cognitive Psychology 210: Human Memory Architecture

Instructor: Prof. Sterling | Topic: Multi-Store Model & Baddeley's Working Memory

1. The Atkinson-Shiffrin Model (Modal Model)
- Sensory Memory:
  * Iconic (visual, lasts ~250-500ms, high capacity)
  * Echoic (auditory, lasts 3-4 seconds, prevents dialogue cutoff)
- Short-Term Memory (STM):
  * Capacity: George Miller's classic 7 +/- 2 items (modern estimates by Cowan suggest ~4 chunks).
  * Duration: 15-30 seconds without active rehearsal (demonstrated by Brown-Peterson task).
- Long-Term Memory (LTM):
  * Theoretically unlimited capacity, permanent or semi-permanent storage.

2. Baddeley & Hitch Multicomponent Working Memory Model
Working memory is an active, multi-component workspace rather than a passive holding dock.
A. Central Executive:
   - Attention controller, coordinates slave systems, suppresses automatic habitual responses.
B. Phonological Loop:
   - Phonological store ("inner ear", passive retention).
   - Articulatory rehearsal process ("inner voice", active refreshing).
   - Phonological similarity effect: rhyming words are harder to maintain in immediate recall.
C. Visuospatial Sketchpad:
   - "Inner eye", maintains mental imagery and spatial manipulation (Shepard & Metzler mental rotation experiments).
D. Episodic Buffer:
   - Added in 2000; binds multidimensional representations (visual, phonological, semantic) into unified chronological chunks.

3. Long-Term Memory Taxonomy
- Explicit / Declarative (Conscious recall; Hippocampus & Medial Temporal Lobe):
  * Episodic: Autobiographical events tied to a specific time and spatial context.
  * Semantic: General knowledge, vocabulary, facts decoupled from context.
- Implicit / Non-declarative (Expressed without conscious awareness):
  * Procedural (motor skills, basal ganglia & cerebellum).
  * Priming (neocortex).
  * Classical conditioning (amygdala for fear, cerebellum for motor reflexes).

4. High-Yield Study & Encoding Techniques
- Spacing Effect (Distributed Practice): Spacing study sessions over time dramatically slows Ebbinghaus forgetting curve decay compared to massed cramming.
- Testing Effect (Retrieval Practice): Actively retrieving information strengthens neural synaptic pathways far more than passive re-reading or highlighting.
- Elaborative Rehearsal: Craik & Lockhart's Levels of Processing showed that semantic (deep) encoding produces superior memory traces compared to structural or phonemic analysis.`,
    aiSummary: `### Executive Summary
A comprehensive review of human memory architecture, detailing the progression from the Atkinson-Shiffrin modal model to Baddeley's four-component working memory framework and long-term memory taxonomy.

### Key Takeaways
- Working memory contains distinct phonological and visuospatial subsystems managed by the central executive.
- Active retrieval practice and spaced repetition produce significantly stronger neural traces than passive re-reading.`,
    flashcards: [
      {
        id: 'fc-psyc-1',
        front: 'What are the four components of Baddeley and Hitch’s working memory model?',
        back: '1. Central Executive\n2. Phonological Loop\n3. Visuospatial Sketchpad\n4. Episodic Buffer',
      },
      {
        id: 'fc-psyc-2',
        front: 'What is the Testing Effect in cognitive psychology?',
        back: 'The phenomenon where actively retrieving information from memory via quizzes or flashcards produces far better long-term retention than passive study.',
      },
    ],
  },
];
