type Job = {
  title: string;
  timeline: string;
  description: string;
  remark?: string;
  activities?: string[];
  techs?: string | string[];
  links?: any;
};

const work: Record<string, Job[]> = {
  Career: [
    {
      title: "Tennis Coaching",
      timeline: "Feb 2009 - 2015",
      description: "A great way to start off a career with a sport you enjoy",
      remark: "First work 3 months out of High School, going in with 12 years of playing tennis, I coached kids from as young as 5 up to 15 years old. Having played since I was 7 years old this was a great first job to land in. ",
      activities: [
        "Planned each lesson each week",
        "Identified kids with strong capabilities to offer private coaching",
        "Continually attended training workshops. Even had workshops with Rafael Nadals old coach, Jofre Porta.",
        "Build team numbers back up to full strength for the Wednesday Night Superleague comp. From 5 teams back up to 12 for over 2 seasons."
      ]
    },
    {
      title: "Save on Computers",
      timeline: "July 2012 - Dec 2012",
      description: "A small computer store to kickstart my Technology Career.",
      remark:
        "This popped up during my time studying at Uni. I had done odd-jobs helping people with their computers over the years, however this became my first paid IT gig.",
      activities: [
        "Storefront product setup/unpack at the start and end of each day",
        "Diagnosing computers/laptops for technical issues",
        "Quoting, invoicing and processing payments",
        "Recording job actions for history and other technicians",
        "Data Recovery, system failure recovery, performance issues, virus repairs etc."
      ],
    },
    {
      title: "YesIT",
      timeline: "Sept 2012 - July 2023",
      description: "The platform ",
      remark:
        "",
      activities: [
        "Develop software utilities to support internal users",
        "Engage in a robust, long-standing system",
        "Tools used: WebSphere, ClearCase",
      ],
      techs: "HTML, Bootstrap, JS, Java, JSP, XML, DB2 JDBC",
    },
    {
      title: "VALD",
      timeline: "September 2024 - March 2025",
      description: "A world leader in musculoskeletal assessment and rehabilitation technologies",
      remark:
        "I had a chance offering to work casually inside of VALD's manufacturing team while building out my other ventures. I honestly loved working there, for the few months I had. Great people, great conversations while building and learning about innovative technologies that produce insights to things I'm interested in. It had a great culture overall that came with an in-house barisata and chef. Brekkie and Lunch included.",
      activities: [
        "Develop software utilities to support internal users",
        "Engage in a robust, long-standing system",
        "Tools used: WebSphere, ClearCase",
      ],
      techs: "HTML, Bootstrap, JS, Java, JSP, XML, DB2 JDBC",
    },
    {
      title: "Fractal Labs",
      timeline: "Sept 2012 - Present",
      description: "A Research and Education Project helping people live and operate at their natural best.",
      remark: "Fractal Labs is an ongoing project focused on mindset research and applied education.",
      activities: [
        "Research into Mindset Architecture and Construction",
        "Develop models to represent how beliefs, values and principles are formed",
        "Design prototype tools to help individuals understand and reshape their mindset structures",
        "Apply constructivist learning principles to support personal and professional growth"
      ],
      techs: "Fractal Linguistics, $1, $2, $3",
      links: {
        $1: ["Systems Thinking", "https://www.youtube.com/watch?v=Su8r4YKX_ls&pp=ygUQc3lzdGVtcyB0aGlua2luZw%3D%3D"],
        $2: ["Mental Models", "https://www.youtube.com/watch?v=ocMH2l2ptpc&t=383s&pp=ygUNbWVudGFsIG1vZGVscw%3D%3D"],
        $3: ["Constructivist Learning", "https://www.youtube.com/watch?v=WduUwOHZES0&t=163s&pp=ygUXY29uc3RydWN0aXZpc3QgbGVhcm5pbmc%3D"],
      },
    },
    {
      title: "Minnio",
      timeline: "July 2025 - Present",
      description: "A Technology Solution Partner company",
      remark:
        "Building on-top of our 14 years in the Tech Industry and previous experiencing running YesIT as a Managed Service Provider, we've built out a new approach working with businesses regarding their technology. Minnio is designed to work closely with organisations as a strategic partner, moving beyond our previous role as an “outsourced helpdesk” that was primarily focused on keeping systems online. Helping align technology with business goals, streamline operations and build solutions that scale with their growth.",
      activities: [
        "Consulting",
        "Technology Integration",
        "Operational efficiency",
        "Offering those same \"Outsouced Helpdesk\" services",
      ],
      //techs: "AI, Bootstrap, JS, Java, JSP, XML, DB2 JDBC",
    }
  ],
  "Side Projects": [
    {
      title: "Matt's Wild Adventures",
      timeline: "2024 - Present",
      description:
        "Bringing my love for outdoor adventure experiences to friends and other adventurers.",
      remark:
        "I've loved simple adventure weekends, hikes, camping trips, 4x4 activites, months of backpacking and everything in-between. Through all these experiences I loved and I want to continue to do with friends for the rest of my life. This is my way to bring people along to new experiences they may not have originally thought of.",
      activities: [
        "Plan and organise weekend adventure trips",
        "Winging the heck out of these experiences, letting moments unfold rather than planned.",
        "Building out a simple platform with tools as I need",
        "See places around Australia and eventually international.",
      ],
    },
    {
      title: "Knowledge Engine",
      timeline: "2025 - present",
      description: "A platform that captures and connects personal and team knowledge into a living system that expands in context with every day interactions.",
      remark:
        "This is the biggest side project that I have started to learn AI tools as well as integration with new AI systems. At first, the original request  it was simply made for me to apply things I have learned, something I would have fun building, but apparently it has some unforeseen potential, as it is surprisingly well-received and gets a lot of positive feedback and encouragement to advance it further. Visit its $1.",
      activities: [
        "Developed MCP + API Gateway to let any client system plug in seamlessly",
        "WIP: Designing Personal and Company Graphs to capture private learnings and shared insights",
        "Integrated a Vector Store for lightning-fast semantic search",
        "Created a Portal for users and companies to manage their knowledge growth",
        "Added bridging protocols to allow federated, secure collaboration across multiple engines",
        "Future Aims: Built a Knowledge Engine that connects tacit learning (what people do) with explicit knowledge (documents, SOPs, manuals)",
      ],
    },
    {
      title: "Mentavia",
      timeline: "2025 – present",
      description: "A mental-toolkit platform that helps you learn how to think so you can make better decisions, solve complex problems and grow with confidence.",
      remark: "This project came after reflection learning about the skills developed while at YesIT which allowed me to understand the power of Mental Models much more. Having a simple name for patterns of thought was a huge eye-opener for the gaps in my own skills. This was built to provide access to those same tools that'll help to develop a powerful toolkit for others.",
      activities: [
        "Defined the core promise: Work smarter, not harder.",
        "Built Personalized Pathways tailored to goals and cognitive preferences.",
        "Developed Pattern Recognition to reveal thinking habits with actionable insights.",
        "Created Practice Tools & Frameworks to apply mental models to real problems.",
        "Implemented Progress Tracking with milestones, streaks and achievements.",
        "Designed the 4A Pathway: Awareness → Articulation → Action → Achievement.",
        "Shipped a Mental Toolkit Platform Dashboard to manage tools and view outcomes.",
        "Ongoing: expanding the model library, outcomes views and adaptive guidance."
      ],
    },
    {
      title: "Braindump",
      timeline: "2025",
      description: "A simple tool I've built ",
      remark:
        "This has been a simple tool I've built for myself to allow me to take audio recordings of thoughts and allow me to do something with them at a later stage.",
      techs: "HTML, Bootstrap, ReactJS, React-i18n",
      links: {
        $1: ["here", "https://quayso.com.vn/"],
      },
    },
  ],
};

export default work;
