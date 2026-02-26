type RoadmapItem = {
  title: string;
  timeline: string;
  description: string;
  remark?: string;
  milestones?: string[];
  objectives?: string | string[];
  links?: any;
};

// Roadmap Data Structure
// 
// This file contains all roadmap-related content in an easily editable format.
// You can add, modify, or remove roadmap items by editing the objects below.
// 
// Structure:
// - Each category contains an array of roadmap items
// - Each item has: title, timeline, description, remark, milestones, objectives, links
// - Links use placeholder variables ($1, $2, etc.) that are defined in the links object
//
const roadmap: Record<string, RoadmapItem[]> = {
  "Short-term (6 months)": [
    {
      title: "Technical Skills Enhancement",
      timeline: "Q1-Q2 2025",
      description: "Focus on deepening core technical competencies and emerging technologies",
      remark:
        "Building a strong foundation in modern development practices while staying current with industry trends. This phase emphasizes practical application and hands-on learning.",
      milestones: [
        "Complete advanced TypeScript certification",
        "Build 3 full-stack projects using modern frameworks",
        "Contribute to 2 open-source projects",
        "Establish consistent learning routine (10 hours/week)",
        "Create technical blog with 12 detailed posts",
      ],
      objectives: "Strengthen technical foundation, build portfolio, establish thought leadership",
      links: {
        $1: ["Learning Plan Template", "#"],
        $2: ["Project Portfolio", "#"],
      },
    },
    {
      title: "Professional Network Expansion",
      timeline: "Q1-Q2 2025",
      description: "Build meaningful connections within the tech community and industry",
      remark:
        "Focusing on quality over quantity in professional relationships. This involves active participation in tech communities, mentorship opportunities and industry events.",
      milestones: [
        "Attend 6 tech conferences or meetups",
        "Connect with 50 industry professionals",
        "Start mentoring 2 junior developers",
        "Join 3 professional tech communities",
        "Schedule monthly coffee chats with industry leaders",
      ],
      objectives: [
        "Build authentic professional relationships",
        "Learn from experienced professionals",
        "Give back to the community through mentorship",
        "Stay informed about industry trends",
      ],
      links: {
        $1: ["Networking Tracker", "#"],
        $2: ["Mentorship Guidelines", "#"],
      },
    },
  ],
  "Medium-term (1-2 years)": [
    {
      title: "Leadership Development",
      timeline: "2025-2026",
      description: "Develop technical leadership skills and team management capabilities",
      remark:
        "Transitioning from individual contributor to technical leader requires developing new skills in communication, strategic thinking and team dynamics. This roadmap focuses on practical leadership experience.",
      milestones: [
        "Lead cross-functional project team of 5+ people",
        "Complete leadership training program",
        "Mentor team of 3-5 junior developers",
        "Speak at 3 major tech conferences",
        "Establish technical vision for product area",
      ],
      objectives: "Develop leadership skills, gain management experience, build influence",
      links: {
        $1: ["Leadership Assessment Tool", "#"],
        $2: ["Team Management Framework", "#"],
      },
    },
    {
      title: "Product Strategy & Architecture",
      timeline: "2025-2027",
      description: "Build expertise in product strategy, system architecture and business alignment",
      remark:
        "Moving beyond just technical implementation to understanding business value, user needs and long-term strategic planning. This involves working closely with product managers and stakeholders.",
      milestones: [
        "Design and architect 2 major system components",
        "Lead product planning sessions",
        "Complete MBA or equivalent business training",
        "Develop expertise in user experience design",
        "Build data-driven decision making framework",
      ],
      objectives: [
        "Bridge technical and business domains",
        "Develop strategic thinking capabilities",
        "Understand customer and market needs",
        "Build scalable system architecture skills",
      ],
      links: {
        $1: ["Architecture Decision Records", "#"],
        $2: ["Product Strategy Canvas", "#"],
      },
    },
  ],
  "Long-term (3-5 years)": [
    {
      title: "Industry Impact & Innovation",
      timeline: "2027-2030",
      description: "Create meaningful impact in the tech industry through innovation and thought leadership",
      remark:
        "At this stage, the focus shifts to creating lasting impact beyond individual projects. This involves innovation, industry influence and potentially entrepreneurial ventures.",
      milestones: [
        "Launch innovative product or startup",
        "Publish research or whitepapers with industry impact",
        "Build team of 20+ engineers",
        "Establish thought leadership in emerging technology",
        "Create educational content reaching 10,000+ developers",
      ],
      objectives: "Drive industry innovation, build lasting impact, create value for society",
      links: {
        $1: ["Innovation Framework", "#"],
        $2: ["Impact Measurement Dashboard", "#"],
      },
    },
    {
      title: "Legacy & Knowledge Transfer",
      timeline: "2028-2030",
      description: "Build systems and knowledge that outlast individual contributions",
      remark:
        "The ultimate goal is to create systems, knowledge and opportunities that benefit others and continue to grow beyond personal involvement. This includes education, mentorship at scale and sustainable practices.",
      milestones: [
        "Establish tech education program or bootcamp",
        "Create open-source framework used by 1000+ companies",
        "Build sustainable development practices organization",
        "Author book on technical leadership",
        "Mentor 50+ successful tech professionals",
      ],
      objectives: [
        "Create lasting educational impact",
        "Build sustainable systems and practices",
        "Transfer knowledge to next generation",
        "Contribute to industry best practices",
      ],
      links: {
        $1: ["Legacy Planning Template", "#"],
        $2: ["Knowledge Transfer System", "#"],
      },
    },
    
  ],
};

export default roadmap;