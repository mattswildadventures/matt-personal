export type ResearchPrinciple = {
  name: string;
  description: string;
};

export type ResearchInsight = {
  title: string;
  subtitle: string;
  content: string[];
  principles?: ResearchPrinciple[];
  /** If true, this item renders with the cover image layout */
  isCover?: boolean;
};

const researchInsights: Record<string, ResearchInsight[]> = {
  "Overview": [
    {
      title: "About",
      subtitle: "A guided exploration into the patterns, language, and systems that shape how we think — and how they can be changed.",
      content: [
        "This research started on course — literally. Through Spartan races, ultra-endurance events, and the kind of adversity that strips everything back to what's actually holding you together, I started noticing patterns. Not just in how I performed, but in how I talked to myself, what I defaulted to under pressure, and why certain reactions kept firing no matter how much I thought I'd moved past them.",
        "What began as personal observation became a framework. This paper proposes that your mindset isn't a trait — it's a construction, assembled over time from the language you absorbed, the experiences you lived through, and the meaning you made from both. It has an architecture. And that architecture can be mapped.",
      ],
    },
    {
      title: "Cover",
      subtitle: "Mapping the Architecture & Construction of Our Mindset",
      isCover: true,
      content: [],
    },
  ],
  "Key Insights": [
    {
      title: "Chaos Theory",
      subtitle: "The lens that makes the invisible visible",
      content: [
        "Chaos theory isn't about randomness — it's about patterns hidden inside apparent disorder. It became the foundational lens for this entire body of work because it offered language for things I could feel but couldn't articulate: why small moments have outsized consequences, why the same input produces different outcomes depending on when it lands, and why systems that look broken are often just reorganising.",
        "Through endurance racing and the pressure it creates, I started recognising these patterns in real time — not as abstract theory, but as lived experience. The concepts mapped directly onto how mindset operates under stress, how beliefs form and persist, and why transformation feels chaotic before it feels coherent.",
      ],
      principles: [
        {
          name: "Sensitive dependence on initial conditions",
          description: "Small differences in starting point produce vastly different outcomes. One early belief, one formative experience, can branch across an entire life.",
        },
        {
          name: "Emergence",
          description: "Complex behaviour arises from simple rules repeated. Your mindset isn't designed — it emerges from the interaction of beliefs, language, and environment.",
        },
        {
          name: "Attractors",
          description: "Systems tend to settle into patterns. Your default responses, emotional habits, and recurring thoughts are attractors — stable states your system keeps returning to.",
        },
        {
          name: "Bifurcation",
          description: "At critical thresholds, a system splits into new possible states. These are the moments where genuine change becomes available — not gradual, but sudden.",
        },
        {
          name: "Self-similarity across scale",
          description: "The same pattern repeats at every level. The way you talk to yourself in a single moment mirrors the way you structure your identity across a lifetime.",
        },
      ],
    },
    {
      title: "Fractal Mindset Construction",
      subtitle: "How a single belief scales across your entire life",
      content: [
        "The model I developed combines two lenses. The Iceberg Model works top-down — tracing visible behaviour down through patterns, structures, and core beliefs. Fractal Linguistics works bottom-up — showing how one foundational belief, repeated and reinforced, branches into every domain of life.",
        "A belief like \"I have to earn rest\" doesn't just affect downtime. It shapes how you work, how you relate to others, how you handle illness, and how you define your worth. One seed. An entire architecture. I saw this play out across training, recovery, relationships, and work — the same pattern, echoing at every scale.",
      ],
      principles: [
        {
          name: "Self-similarity",
          description: "The same belief pattern repeats at every scale — in a single thought, a conversation, a relationship, a career, a life.",
        },
        {
          name: "Infinite complexity from simple rules",
          description: "A handful of core beliefs, repeated and reinforced, have feedback loops through the entire architecture of your mindset.",
        },
        {
          name: "Scale invariance",
          description: "Zoom in on a single reaction or zoom out to a life pattern — the underlying structure is the same.",
        },
        {
          name: "Branching",
          description: "One foundational belief doesn't stay contained. It branches into every domain, shaping decisions you didn't realise were connected.",
        },
      ],
    },
    {
      title: "Hysteresis",
      subtitle: "Your system remembers — and that's not a flaw",
      content: [
        "In physics, hysteresis describes a system that retains the memory of where it's been — like a metal that holds its bend after the force is released. Your mind does something remarkably similar. The experiences you've lived through, especially the early and intense ones, left structural imprints on how your internal system operates.",
        "Your present responses don't just reflect what's happening now — they reflect the entire sequence of experiences that brought you here. I found this concept through endurance racing, where the same mental response kept firing across completely different conditions. Understanding hysteresis means you can stop blaming yourself for the difficulty of change and start understanding the mechanics of it.",
      ],
      principles: [
        {
          name: "Delay between cause and effect",
          description: "The impact of an experience often shows up long after the experience itself. You're reacting to something that happened years ago, not to what's in front of you now.",
        },
        {
          name: "The stability of a system is dependent on its history",
          description: "Where you are isn't just about where you're going. It's shaped by every state your system has passed through to get here.",
        },
        {
          name: "The absence of a stabilising input is as formative as a negative experience",
          description: "It's not only what happened to you. What didn't happen — the support, the language, the safety that was missing — shaped the architecture just as much.",
        },
        {
          name: "Path dependence",
          description: "The route matters, not just the destination. Two people can arrive at the same belief through completely different histories, and the path determines how deeply it's embedded.",
        },
      ],
    },
    {
      title: "Holarchy",
      subtitle: "The structure that holds everything you discover",
      content: [
        "When you start surfacing how your mindset works, you need a way to hold what you find. Holarchy provides the most natural organisational structure for this — and it's objective to anyone. Each person's mindset has its own unique order, but the nesting principle is universal. Experiences with similar responses sit together as individual holons, nested within greater contexts, nested within beliefs.",
        "This is where the mapping becomes practical. Once you can see the sets of construction and how they nest, you can start asking: what happens if I intentionally change the sequence — even just through language? If I gather enough information about how I react under certain beliefs, can I find the origin that allowed them to form? A belief like 'I must earn rest' doesn't just affect rest — it feeds into how you handle fatigue, how you interpret struggle, how you measure your own worth across dozens of experiences. When you find that, you often see how sensitive the whole structure was to that single starting point — and that's where intentional reconstruction begins. Not everything that surfaces needs to be acted on. Some memories, thoughts, and reactions simply get placed and grouped — useful information, left as is. Others connect over time to reveal the larger patterns.",
      ],
      principles: [
        {
          name: "Natural organisation",
          description: "As things surface — memories, reactions, patterns — they can be placed and grouped together. The structure emerges naturally without needing to be forced.",
        },
        {
          name: "Each part is both whole and part",
          description: "A single experience is complete on its own, but it also nests into a broader pattern. Every holon carries meaning individually and as part of something larger.",
        },
        {
          name: "Unique to each person",
          description: "The nesting structure is universal, but the order and content is yours alone. Everyone's mindset organised itself differently based on their own history.",
        },
        {
          name: "Sensitive to initial conditions",
          description: "A single foundational belief can shape how dozens of experiences are processed. Change the belief at the root — say 'I can rest when needed' instead of 'I must earn rest' — and the outcomes across the entire structure could look vastly different.",
        },
        {
          name: "A map, not a fix",
          description: "Not everything that surfaces needs action. Some things simply get placed as useful information. Others connect over time to reveal the patterns that matter most.",
        },
      ],
    },
    {
      title: "Parallel Reconstruction",
      subtitle: "You don't finish deconstructing before you start rebuilding",
      content: [
        "One of the most important realisations from this work is that transformation isn't sequential. Deconstruction — seeing what was built — and reconstruction — building what comes next — run in parallel. Some days the deconstruction side leads: you surface a belief you didn't know was running things. Other days, reconstruction leads: you catch yourself responding differently. Both are progress.",
        "And here's the reframe that changed everything for me: you are not undisciplined. You are precisely disciplined — to foundations you didn't choose. The work isn't about finding more willpower. It's about seeing what you're currently aligned to, and choosing what you align to next.",
      ],
      principles: [
        {
          name: "Non-linear transformation",
          description: "Change doesn't follow a neat sequence. Deconstruction and reconstruction happen simultaneously.",
        },
        {
          name: "You are disciplined to your foundations",
          description: "What looks like a lack of discipline is actually precise alignment to foundations you didn't consciously choose.",
        },
        {
          name: "Progress is bidirectional",
          description: "Some days you see what was built. Other days you catch yourself building something new. Both are forward movement.",
        },
        {
          name: "Awareness precedes choice",
          description: "You can't choose what you align to until you can see what you're currently aligned to.",
        },
      ],
    },
    {
      title: "The Antifragile Mindset",
      subtitle: "Built through adversity, not despite it",
      content: [
        "This concept came directly from standing on start lines not knowing if I had what it took to finish. Spartan races, ultra-endurance events, and their variations became the testing ground — not just for physical capacity, but for how I spoke to myself when everything was falling apart.",
        "I discovered that resilience has a ceiling: it bounces you back to baseline. Antifragility is different — it's a system that actually gains from disorder. The model works through a loop: before the moment (preparation, principle-embedding), during the moment (pressure reveals what's actually holding), and after the moment (meaning-making, feedback, refinement). Each cycle expands what you can prepare for next.",
        "In the highest-pressure moments, complex frameworks collapse. What holds is language — a single phrase, practiced and embedded, that reconnects you with the system you've been building.",
      ],
      principles: [
        {
          name: "Gains from disorder",
          description: "Unlike resilience (which returns to baseline), antifragility means the system actually strengthens through exposure to stress.",
        },
        {
          name: "The preparation-pressure-reflection loop",
          description: "Before the moment: embed principles. During the moment: pressure reveals what holds. After the moment: extract meaning and refine.",
        },
        {
          name: "Language is the last thing standing",
          description: "When frameworks collapse under pressure, what remains is a single phrase, practiced and embedded. Language precision correlates directly with resilience.",
        },
        {
          name: "Controlled exposure",
          description: "You don't become antifragile by accident. It requires deliberately seeking the edge and building feedback loops around the experience.",
        },
      ],
    },
    {
      title: "Edge of Chaos",
      subtitle: "The uncomfortable space where transformation actually happens",
      content: [
        "If you've ever done the work of genuinely examining your own patterns, you know this place. Old certainties have been loosened. New structures haven't solidified yet. You can feel something shifting but can't articulate what's forming.",
        "In systems theory, this is the edge of chaos — the zone between order and disorder where existing structures are breaking down and new ones are beginning to emerge. I've lived in this space on course, mid-race, when the plan has dissolved and all that's left is what you've trained into yourself.",
        "It's the most generative zone in any system. The natural impulse is to retreat to the familiar. But the discomfort isn't evidence that something is going wrong — it's evidence that something is changing.",
      ],
      principles: [
        {
          name: "The zone between order and disorder",
          description: "Too much order and nothing changes. Too much disorder and nothing holds. Transformation lives in the space between.",
        },
        {
          name: "Old structures must loosen before new ones form",
          description: "The discomfort of not knowing what's emerging is a sign the process is working, not failing.",
        },
        {
          name: "The natural impulse is retreat",
          description: "Your system will try to pull you back to the familiar. Recognising this impulse is the first step to staying in the generative zone.",
        },
        {
          name: "Emergence requires staying",
          description: "New patterns can only form if you remain in the uncomfortable space long enough for them to crystallise.",
        },
      ],
    },
    {
      title: "Value-Guided Actions",
      subtitle: "Goals expire. Values don't.",
      content: [
        "Goal-oriented living ties identity to a future point — and often collapses when the goal is reached. I experienced this after finishing events I'd spent months preparing for. The machinery was built for approach, not arrival.",
        "Value-oriented living distributes meaning differently. Identity is grounded in who you are, not in what you haven't yet accomplished. The shift that mattered most: instead of asking \"what do I need to achieve?\", I started asking \"what do I value?\" and \"am I acting in alignment with that?\" Those two questions, applied consistently, became the compass for everything that followed.",
      ],
      principles: [
        {
          name: "Goals expire, values persist",
          description: "Goal-oriented identity collapses on arrival. Value-oriented identity distributes meaning across every moment.",
        },
        {
          name: "Alignment over achievement",
          description: "The question shifts from \"what do I need to achieve?\" to \"am I acting in alignment with what I value?\"",
        },
        {
          name: "Identity grounded in being, not becoming",
          description: "You are not the distance between where you are and where you want to be. You are who you are right now.",
        },
        {
          name: "Values as compass",
          description: "Values don't tell you where to go. They tell you how to navigate whatever you encounter.",
        },
      ],
    },
  ],
};

export default researchInsights;
