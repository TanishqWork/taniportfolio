export const siteConfig = {
  name: "Tanishq",
  logo: "TANISHQ",
  tagline: "Crafting playful, considered software.",
  // Both GitHub accounts are live and both belong to Tanishq. Listing each one
  // feeds them into the Person JSON-LD `sameAs`, which is how Google and
  // answer engines resolve identity  two verified profiles strengthen the
  // entity, whereas omitting one leaves a handle that appears on the resume
  // unconnected to the site.
  socials: [
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/tanishq-bhosale",
    },
    {
      label: "GitHub @TanishqWork",
      href: "https://github.com/TanishqWork",
    },
    {
      label: "GitHub @TanishqBhosale",
      href: "https://github.com/TanishqBhosale",
    },
  ],
  nav: [
    { label: "Home", href: "/" },
    // The projects carousel renders as id="directors"  "/#work" pointed at a
    // section that doesn't exist, so the link did nothing.
    { label: "Work", href: "/#directors" },
    { label: "About", href: "/#about" },
    { label: "Blog", href: "/blog" },
    { label: "Let's talk", href: "/#contact" },
  ],
  hero: {
    wordmark: "TANISHQ",
    background: "#FF5A52",
    wordmarkColor: "#FFC9C5",
    accentColor: "#E4FE52",
  },
  crafty: {
    background: "#FF5A52",
    textColor: "#FFC9C5",
    headline: ["A crafty bunch", "of creative", "problem solvers."],
    bgVideo: {
      poster:
        "https://cdn.prod.website-files.com/699637b29cf8a85d12ebac48/69aaa9d802173759e72876ed_hero_logo_loop-good_poster.0000000.jpg",
      mp4: "https://cdn.prod.website-files.com/699637b29cf8a85d12ebac48/69aaa9d802173759e72876ed_hero_logo_loop-good_mp4.mp4",
      webm: "https://cdn.prod.website-files.com/699637b29cf8a85d12ebac48/69aaa9d802173759e72876ed_hero_logo_loop-good_webm.webm",
    },
    stickerColors: {
      face: "#E4FE52",
      side: "#A8C220",
      text: "#FF3B33",
    },
    stickers: [
      { label: "ANIMATION", position: "top", rotate: -10 },
      { label: "LIVE ACTION", position: "middle", rotate: 8 },
      { label: "WIZARDRY", position: "bottom", rotate: -7 },
    ],
  },
  about: {
    background: "#2D00F7",
    textColor: "#E0C8BB",
    accent: "#FFE6D6",
    eyebrow: "About",
    name: "Tanishq Bhosale.",
    role: "Full Stack + AI Engineer · Bangalore",
    intro:
      "Two-plus years shipping production LLM and agentic AI systems - LangGraph state machines, FastAPI streams, React Native interfaces. I care about the moment where a complex system feels obvious to use, even when the plumbing underneath isn't.",
    sub: "Currently SDE1 at Tap Academy. Previously SDE1 at Quanta and a software developer intern at Visionet Systems. B.Tech in Computer Science (Data Science), Presidency University, 2020–2024.",
    skills: [
      {
        title: "AI / ML",
        items: [
          "LangGraph",
          "LangChain",
          "LLM Integration",
          "RAG",
          "pgvector",
          "Agentic Workflows",
          "Prompt Engineering",
          "Mem0",
        ],
      },
      {
        title: "Languages",
        items: ["Python", "JavaScript", "TypeScript"],
      },
      {
        title: "Frontend",
        items: [
          "React",
          "React Native",
          "Expo",
          "Redux",
          "Zustand",
          "Tailwind CSS",
        ],
      },
      {
        title: "Backend",
        items: ["FastAPI", "Node.js", "Express", "Flask", "Prisma"],
      },
      {
        title: "Databases",
        items: ["PostgreSQL", "MongoDB", "MySQL", "pgvector"],
      },
      {
        title: "Cloud",
        items: ["AWS", "Firebase", "Supabase"],
      },
      {
        title: "Other",
        items: [
          "RESTful APIs",
          "SSE Streaming",
          "Async Architecture",
          "Modular Architecture",
          "SQL Optimization",
        ],
      },
    ],
    marquee: [
      "Full Stack",
      "AI Engineer",
      "LangGraph",
      "FastAPI",
      "React Native",
      "pgvector",
      "Agentic AI",
      "Streaming",
      "✦",
    ],
  },
  education: {
    background: "#0E2A1E",
    cardStock: "#F4ECD6",
    inkColor: "#0E2A1E",
    bodyColor: "#D6E8C5",
    accent: "#E4FE52",
    red: "#FF3B33",
    eyebrow: "Education",
    classOf: "2024",
    duration: "Class of",
    card: {
      university: "Presidency University",
      shortName: "PU · BANGALORE",
      name: "Tanishq Bhosale",
      degree: "B.Tech · CSE (Data Science)",
      batch: "2020 - 2024",
      idNumber: "PU-19BCE-7421",
      issued: "AUG 2020",
      cgpa: "7.95",
      address: "Itgalpur, Rajanakunte, Yelahanka, Bangalore - 560064",
      validThrough: "2024",
    },
    courses: [
      { code: "CSE-101", title: "Foundations of Computer Science" },
      { code: "CSE-201", title: "Data Structures & Algorithms" },
      { code: "CSE-305", title: "Database Management Systems" },
      { code: "ML-401", title: "Machine Learning" },
      { code: "DS-402", title: "Big Data Systems" },
      { code: "DS-501", title: "Final-Year Capstone" },
    ],
    stats: [
      "4 years",
      "8 semesters",
      "47 papers",
      "CGPA 7.95",
      "Bangalore, IN",
      "Graduated ✓",
    ],
    closer: "Where the foundations got laid.",
  },
  writing: {
    background: "#0A0A0A",
    textColor: "#FFFFFF",
    muted: "#9A9A9A",
    accent: "#E4FE52",
    eyebrow: "Writing",
    headline: ["Build logs,", "not thought", "leadership."],
    intro:
      "Build notes on the parts of shipping software that matter  from grounding an AI system to making a small Android app that helps interrupt an endless scroll.",
    cta: "Read the write-up",
  },
  faq: {
    background: "#E4FE52",
    ink: "#0E2A1E",
    body: "#1C3A2A",
    accent: "#FF3B33",
    eyebrow: "FAQ",
    headline: ["Frequently", "asked."],
    items: [
      {
        q: "Who is Tanishq Bhosale?",
        a: "Tanishq Bhosale is a Full Stack & AI Engineer based in Bangalore, India, with 2+ years of experience building production LLM and agentic AI systems.",
      },
      {
        q: "What does Tanishq Bhosale build?",
        a: "Tanishq builds production LLM and agentic AI systems  LangGraph state machines, RAG pipelines on pgvector, FastAPI streaming backends, and React / React Native interfaces.",
      },
      {
        q: "What is Tanishq's tech stack?",
        a: "His core stack is Python and TypeScript with LangGraph, LangChain, FastAPI, React, and React Native, backed by PostgreSQL/pgvector, Node.js, MongoDB, and AWS.",
      },
      {
        q: "Where is Tanishq Bhosale based?",
        a: "Tanishq is based in Bangalore, India (Asia/Kolkata timezone), and is open to on-site, hybrid, or remote work.",
      },
      {
        q: "Is Tanishq Bhosale available for hire?",
        a: "Yes  Tanishq is available for GenAI / AI Engineer roles. Reach him at bhosaletanishq4@gmail.com or on LinkedIn at /in/tanishq-bhosale.",
      },
      {
        q: "What experience does Tanishq have?",
        a: "He is a Software Development Engineer 1 at Tap Academy (Mar 2025 – present). Before that he was an SDE1 at Quanta (Jul 2024 – Feb 2025) and a software developer intern at Visionet Systems. He holds a B.Tech in CSE (Data Science) from Presidency University.",
      },
    ],
  },
  contact: {
    background: "#0A0A0A",
    textColor: "#FFFFFF",
    muted: "#9A9A9A",
    accent: "#E4FE52",
    red: "#FF3B33",
    eyebrow: "Contact",
    statusLabel: "Transmission Open",
    headline: ["Let's", "talk."],
    intro:
      "Got a system to design, an LLM to wrangle, a feature to ship - or just want to say hi. Pick a frequency, I'm listening.",
    available: {
      label: "Available now",
      location: "Bangalore",
      timezone: "Asia/Kolkata",
      timezoneShort: "IST",
    },
    primary: {
      label: "Drop me a line",
      email: "bhosaletanishq4@gmail.com",
      mailto:
        "https://mail.google.com/mail/?view=cm&fs=1&to=bhosaletanishq4@gmail.com&su=Let%27s%20build%20something",
    },
    channels: [
      {
        id: "phone",
        label: "Phone",
        value: "+91 6362157894",
        href: "tel:+916362157894",
        glyph: "tel",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        value: "@tanishq-bhosale",
        href: "https://linkedin.com/in/tanishq-bhosale",
        glyph: "in",
      },
      {
        id: "github",
        label: "GitHub",
        value: "@TanishqWork",
        href: "https://github.com/TanishqWork",
        glyph: "gh",
      },
      {
        id: "github-alt",
        label: "GitHub",
        value: "@TanishqBhosale",
        href: "https://github.com/TanishqBhosale",
        glyph: "gh",
      },
    ],
    resume: {
      label: "Download Resume",
      sub: "PDF · 1 page",
      href: "/Tanishq_Bhosale.pdf",
      fileName: "Tanishq_Bhosale.pdf",
    },
    closer: "TX // signing off - your move.",
  },
  experience: {
    background: "#F4ECD6",
    ticketBg: "#FFFAF0",
    textColor: "#2A1810",
    accent: "#FF3B33",
    eyebrow: "Experience",
    status: "Available for GenAI / AI Engineer roles · Bangalore",
    jobs: [
      {
        serial: "T-001",
        company: "Tap Academy",
        role: "Software Development Engineer 1",
        location: "Bangalore",
        dates: "Mar 2025 - Present",
        current: true,
        stampSub: "2026",
        stars: 5,
        bullets: [
          "Built production LLM-powered AI code assistance feature using OpenAI APIs with optimized prompt engineering and token management, serving real-time suggestions to students on the learning platform.",
          "Developed scalable full-stack applications with React + FastAPI/Node.js, implementing Redux state management and React Router for a responsive learning experience.",
          "Optimized PostgreSQL and MongoDB queries through indexing and query restructuring, reducing average API response time by ~35%.",
          "Integrated streaming LLM responses via Server-Sent Events for instant feedback on code submissions, improving perceived responsiveness.",
        ],
        stack: [
          "React",
          "FastAPI",
          "Node.js",
          "PostgreSQL",
          "MongoDB",
          "Redux",
          "SSE",
          "OpenAI",
        ],
        rotate: -1.5,
      },
      {
        serial: "T-002",
        company: "Quanta",
        role: "Software Development Engineer 1",
        location: "Bangalore",
        dates: "Jul 2024 - Feb 2025",
        // Ended Feb 2025. `current` drives the JSON-LD `worksFor` list in
        // lib/seo.ts, so leaving this true claimed two concurrent employers.
        current: false,
        stampSub: "Feb 25",
        stars: 4,
        bullets: [
          "Designed high-performance FastAPI and Flask APIs for real-time synchronization and collaboration features, handling concurrent user sessions with low-latency updates.",
          "Built scalable MySQL schemas and integrated third-party APIs for production workloads, reducing data inconsistency issues.",
          "Contributed to modular backend architecture with reusable service layers, cutting new feature development time for adjacent modules.",
        ],
        stack: ["FastAPI", "Flask", "MySQL", "Async", "REST"],
        rotate: 1.2,
      },
      {
        serial: "T-003",
        company: "Visionet Systems",
        role: "Software Developer Intern",
        location: "Bangalore",
        dates: "Feb 2024 - Jul 2024",
        current: false,
        stampSub: "Jul 24",
        stars: 3,
        bullets: [
          "Built reusable AWS cloud components and modular Python solutions with optimized SQL queries, improving scalability and data integrity.",
        ],
        stack: ["AWS", "Python", "SQL"],
        rotate: -0.8,
      },
    ],
  },
  directors: {
    background: "#E0C8BB",
    textColor: "#2A1810",
    accentColor: "#FF3B33",
    items: [
      {
        name: "Tempt",
        image: "/projects/TemptApp.svg",
        alt: "Tempt Android app, a boundary around Reels and Shorts",
        href: "/blog/tempt#download",
      },
      {
        name: "MindSnack Quiz Builder",
        image: "/projects/MindSnackQuizBuilder.webp",
        alt: "MindSnack Quiz Builder - AI-powered quiz generation app by Tanishq Bhosale",
        href: "",
      },
      {
        name: "Ethereum Price Prediction",
        image: "/projects/EthereumFuturePricePrediction.webp",
        alt: "Ethereum price prediction machine learning project by Tanishq Bhosale",
        href: "",
      },
      {
        name: "Financial Fraud Prediction",
        image: "/projects/FinancialFraudPrediction.webp",
        alt: "Financial fraud detection ML model by Tanishq Bhosale",
        href: "",
      },
      {
        name: "Food Delivery Data Analysis",
        image: "/projects/FoodDeliveryDataAnalysis.webp",
        alt: "Food delivery data analysis project by Tanishq Bhosale",
        href: "",
      },
      {
        name: "Website Auto Nxtgen",
        image: "/projects/WebsiteAutoNxtgen.webp",
        alt: "Website Auto Nxtgen - automated website builder by Tanishq Bhosale",
        href: "",
      },
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
