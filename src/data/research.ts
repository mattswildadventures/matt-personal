type ResearchPaper = {
  title: string;
  timeline: string;
  description: string;
  remark?: string;
  findings?: string[];
  methodology?: string | string[];
  links?: any;
};

// Research Papers Data Structure
// 
// This file contains all research paper data in an easily editable format.
// You can add, modify, or remove research papers by editing the objects below.
// 
// Structure:
// - Each category contains an array of research papers
// - Each paper has: title, timeline, description, remark, findings, methodology, links
// - Links use placeholder variables ($1, $2, etc.) that are defined in the links object
//
const research: Record<string, ResearchPaper[]> = {
  "Mindset Overview": [
    {
      title: "About",
      timeline: "2024 – Present",
      description:
        "Foundational research into how mindsets are formed, structured and transformed through internal language, belief systems and lived experience.",
      remark:
        "This paper introduces a multi-layered model for understanding mindset construction, combining cognitive science, systems thinking and chaos theory. It proposes that mindset is an emergent architecture shaped by recursive language patterns, environmental conditioning and feedback loops.",
      findings: [
        "Developed the 'Model of Fractal Mindset Construction' based on Iceberg and Systems Thinking frameworks.",
        "Established a recursive pattern framework for beliefs, values and principles to scale cognitive structures.",
        "Defined the 'Antifragile Mindset' as a practical outcome of principle-stacking and adaptive self-talk.",
        "Introduced the concept of 'Fractal Linguistics' as a lens to decode mindset formation and transformation.",
      ],
      methodology: [
        "Iterative personal experimentation and field application",
        "Qualitative synthesis of neuroscience, psychology, systems theory and chaos metaphors",
        "Framework development through double-loop and triple-loop learning cycles",
      ],
      links: {
        $1: ["Overview Deck", "#"],
        $2: ["Fractal Linguistics Primer", "#"],
      },
    },
    {
      title: "Why this interest?",
      timeline: "2022 – 2023",
      description:
        "An exploration into how fixed mindsets are unconsciously formed through early conditioning and how growth-oriented frameworks can enable transformation.",
      remark:
        "This section reflects on personal patterns, education systems and societal structures that unconsciously shape mindset and identity. It examines the role of language and belief as hidden drivers of life decisions, emotional states and patterns of disempowerment.",
      findings: [
        "Mapped language patterns from negative core beliefs and reframed them using principle-based reconstruction.",
        "Explored education-induced mindset shaping via the 'Order of Learning' and 'Expectation Entropy' models.",
        "Linked early childhood environments to recursive cognitive patterns using chaos theory metaphors.",
        "Validated growth mindset construction through 'Iterative Learning' and 'Parallel Reconstruction' theories.",
      ],
      methodology: [
        "Autoethnographic reflection and linguistic analysis",
        "Theoretical model development using constructivist principles",
        "Synthesis of therapeutic practices (CBT, EMDR, Iceberg Model)",
      ],
      links: {
        $1: ["Conditioning Theories", "#"],
        $2: ["Mindset Reflection Tools", "#"],
      },
    },
    {
      title: "How it got started?",
      timeline: "2022 – 2023",
      description:
        "Origin story and early working theories behind mindset formation, self-talk structures and the role of belief in navigating struggle and growth.",
      remark:
        "This paper began as a personal investigation into repeated mental patterns during moments of high pressure, chaos and disorder. Over time, it evolved into a formal system for mapping, measuring and reconstructing mindset through structured language and feedback.",
      findings: [
        "Recognized language as a proxy for underlying belief architecture.",
        "Discovered the power of principle stacking in navigating extreme endurance events.",
        "Linked entropy and internal disorder to emotional overwhelm and identity fragmentation.",
        "Introduced the idea of 'Language Resilience', where coherent belief structures prevent collapse under stress.",
      ],
      methodology: [
        "Narrative pattern recognition across lived experiences",
        "Rapid prototyping of mental models in high-stakes environments",
        "Cross-disciplinary reading across chaos theory, neuroscience and linguistics",
      ],
      links: {
        $1: ["Antifragile Mindset Case Study", "#"],
        $2: ["Narrative Language Templates", "#"],
      },
    },
  ],

  "Components": [
    {
      title: "Fractal Linguistics",
      timeline: "2023 – Present",
      description:
        "A new model for decoding mindset using recursive language structures and chaos theory principles. Treats language as a fractal architecture for internal cognitive systems.",
      remark:
        "This model reframes mindset through 8 linguistic principles like emergence, feedback loops and self-similarity. It provides a framework to zoom in and out of personal narrative, belief systems and emotion using the same underlying structure.",
      findings: [
        "Created the 'Scalable Model of Cognition' from Chaos → Neuroscience → Psychology → Narrative.",
        "Identified recursive language patterns tied to fixed vs. growth mindsets.",
        "Defined the DIKW-informed 'Parallel Reconstruction' method for language healing.",
        "Proposed 'Inside-Out Language' as the final transformation goal for narrative coherence.",
      ],
      methodology: [
        "Linguistic analysis",
        "Model mapping using systems thinking and fractal geometry",
        "Experiential testing across emotional and cognitive states",
      ],
      links: {
        $1: ["Fractal Linguistics Principles", "#"],
        $2: ["Cognition Scaling Model", "#"],
      },
    },
    {
      title: "Holarchy",
      timeline: "2023 – Present",
      description:
        "Application of nested systems theory to internal mindset architecture, where beliefs, values and principles form layered structures that operate at different levels of decision-making.",
      remark:
        "Holarchy is used as a vertical structuring tool to organize how small truths scale into larger adaptive systems. It enables recursive interpretation of experiences through nested feedback loops.",
      findings: [
        "Defined belief-value-principle-action-goal-result hierarchy using holarchical structure.",
        "Mapped recursive feedback between micro (personal) and macro (social/environmental) systems.",
        "Positioned each mindset component as both part and whole (holon) in cognitive architecture.",
        "Demonstrated alignment between chaos theory attractors and holarchical identity systems.",
      ],
      methodology: [
        "System architecture modeling",
        "Recursive self-reflection frameworks",
        "Application of Ken Wilber’s Integral Theory and Arthur Koestler’s Holon model",
      ],
      links: {
        $1: ["Holarchy Structure Map", "#"],
        $2: ["Belief Stack Guide", "#"],
      },
    },
    {
      title: "Antifragile Mindset",
      timeline: "2024 – Present",
      description:
        "A lived case study and applied prototype demonstrating how mindsets can strengthen through exposure to uncertainty, struggle and unknowns.",
      remark:
        "Rooted in endurance event preparation, this model applies principle stacking to navigate the 'Edge of Chaos.' The antifragile mindset is not reactive but adaptive. Designed to grow stronger through mental feedback and emotional calibration.",
      findings: [
        "Introduced breath-based feedback loops for pacing and emotion regulation.",
        "Developed mental rehearsal tools for pre-event and in-event cognitive stability.",
        "Demonstrated that language precision directly correlates with resilience in chaos.",
        "Positioned antifragility as the outcome of coherent, internally guided systems.",
      ],
      methodology: [
        "Case study methodology (ultra-endurance training)",
        "Principle stacking and reflective journaling",
        "Chaos pattern metaphor mapping (e.g., hysteresis, bifurcation, attractors)",
      ],
      links: {
        $1: ["Antifragile Keynote Slides", "#"],
        $2: ["Principle Stacking Toolkit", "#"],
      },
    },
  ],
  "Roadmap": [
    {
      title: "Draft 3",
      timeline: "2021 - 2022",
      description: "Historical analysis and future predictions for JavaScript framework development and adoption",
      remark:
        "A comprehensive study tracking the evolution of JavaScript frameworks from jQuery to modern solutions, analyzing adoption patterns, community growth and technological innovations.",
      findings: [
        "Analyzed adoption patterns across 1000+ companies",
        "Identified key innovation cycles in framework development",
        "Predicted emergence of edge computing frameworks",
        "Created framework selection decision matrix",
      ],
      methodology: "Historical analysis, Survey research, Trend analysis, Predictive modeling",
      links: {
        $1: ["Full Report", "#"],
        $2: ["Framework Decision Matrix", "#"],
      },
    },
  ],
};

export default research;