type MindsetItem = {
  title: string;
  timeline: string;
  description: string;
  remark?: string;
  principles?: string[];
  practices?: string | string[];
  links?: any;
};

// Mindset Data Structure
// 
// This file contains all mindset-related content in an easily editable format.
// You can add, modify, or remove mindset items by editing the objects below.
// 
// Structure:
// - Each category contains an array of mindset items
// - Each item has: title, timeline, description, remark, principles, practices, links
// - Links use placeholder variables ($1, $2, etc.) that are defined in the links object
//
const mindset: Record<string, MindsetItem[]> = {
  "Core Philosophy": [
    {
      title: "Growth Mindset Foundation",
      timeline: "2020 - Present",
      description: "Fundamental beliefs about the ability to develop skills, intelligence and character through dedication and hard work",
      remark:
        "This foundation shapes how I approach challenges, setbacks and opportunities for learning. It's based on the understanding that abilities can be developed through effort, strategy and help from others.",
      principles: [
        "Embrace challenges as opportunities to grow",
        "View effort as the path to mastery, not a sign of inadequacy",
        "Learn from criticism and find lessons in failures",
        "Find inspiration in others' success rather than feeling threatened",
        "Persist in the face of obstacles and maintain resilience",
      ],
      practices: "Daily reflection, seeking feedback, continuous learning, celebrating progress over perfection",
      links: {
        $1: ["Growth Mindset Research", "#"],
        $2: ["Daily Reflection Template", "#"],
      },
    },
    {
      title: "Systems Thinking Approach",
      timeline: "2021 - Present",
      description: "Understanding how individual parts interconnect to create larger wholes and emergent properties",
      remark:
        "This approach helps me see beyond linear cause-and-effect relationships to understand complex interconnections, feedback loops and unintended consequences in both personal and professional contexts.",
      principles: [
        "Focus on relationships and patterns rather than isolated events",
        "Recognize that structure drives behavior in systems",
        "Look for leverage points where small changes create big impacts",
        "Understand that today's problems often come from yesterday's solutions",
        "Think in terms of processes rather than just outcomes",
      ],
      practices: [
        "Root cause analysis using systems mapping",
        "Identifying feedback loops in personal habits",
        "Regular systems reviews of goals and processes",
        "Collaborative problem-solving approaches",
      ],
      links: {
        $1: ["Systems Thinking Toolkit", "#"],
        $2: ["Personal Systems Map", "#"],
      },
    },
  ],
  "Mental Models": [
    {
      title: "First Principles Thinking",
      timeline: "2019 - Present",
      description: "Breaking down complex problems into fundamental truths and building up from there",
      remark:
        "Discovering First Principles and understanding the pattern of thought made me realise at times I was thinking similar to this however not anywhere need the capability of First Principles. Upon realising that First Principles is one of the most powerful ways to think I spend every chance I get to practice and apply.",
      principles: [
        "Question assumptions and identify what we truly know to be true",
        "Break complex problems down to their fundamental elements",
        "Build up solutions from these basic truths",
        "Avoid reasoning by analogy when dealing with novel situations",
        "Distinguish between what is true and what we assume to be true",
      ],
      practices: "Problem deconstruction exercises, assumption mapping, fundamental questions practice",
      links: {
        $1: ["First Principles Framework", "#"],
        $2: ["Problem Deconstruction Guide", "#"],
      },
    },
    {
      title: "Probabilistic Thinking",
      timeline: "2020 - Present",
      description: "Making decisions based on likelihood and expected outcomes rather than certainty",
      remark:
        "This model helps me navigate uncertainty more effectively by thinking in terms of probabilities, expected values and ranges of outcomes rather than binary right/wrong predictions.",
      principles: [
        "Assign probabilities to beliefs and predictions",
        "Update beliefs based on new evidence (Bayesian thinking)",
        "Consider base rates and avoid the conjunction fallacy",
        "Think in terms of expected value, not just best-case scenarios",
        "Embrace uncertainty as a fundamental aspect of decision-making",
      ],
      practices: [
        "Probability estimation exercises",
        "Decision journals with outcome tracking",
        "Pre-mortem analysis for important decisions",
        "Regular belief updating based on new information",
      ],
      links: {
        $1: ["Probability Calibration Tool", "#"],
        $2: ["Decision Journal Template", "#"],
      },
    },
  ],
  "Personal Development": [
    {
      title: "Antifragile Mindset",
      timeline: "2022 - Present",
      description: "Developing the ability to grow stronger from stressors, volatility and challenges",
      remark:
        "Beyond just being resilient (bouncing back), this mindset focuses on actually benefiting from difficulties and becoming stronger through exposure to controlled stressors and challenges.",
      principles: [
        "Seek controlled exposure to manageable stressors",
        "Build redundancy and optionality into life systems",
        "Embrace volatility as a source of growth opportunities",
        "Maintain skin in the game to ensure aligned incentives",
        "Focus on what you can control and benefit from what you cannot",
      ],
      practices: "Progressive overload in challenges, deliberate discomfort practice, stress testing personal systems",
      links: {
        $1: ["Antifragility Assessment", "#"],
        $2: ["Controlled Stress Protocols", "#"],
      },
    },
    {
      title: "Long-term Perspective",
      timeline: "2018 - Present",
      description: "Optimizing for long-term outcomes and compound effects over short-term gains",
      remark:
        "This perspective helps me make decisions that may be difficult in the short term but create exponential benefits over time through compounding effects in learning, relationships and personal development.",
      principles: [
        "Prioritize learning and skill development over immediate rewards",
        "Invest in relationships and reputation consistently over time",
        "Make decisions based on second and third-order consequences",
        "Focus on systems and processes that compound over time",
        "Delay gratification for exponentially better future outcomes",
      ],
      practices: [
        "Regular future self visualization exercises",
        "Long-term goal setting with intermediate milestones",
        "Investment in foundational skills and knowledge",
        "Relationship nurturing and network building",
      ],
      links: {
        $1: ["Long-term Planning Framework", "#"],
        $2: ["Compound Growth Calculator", "#"],
      },
    },
  ],
};

export default mindset;