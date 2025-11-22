// ---- EXPERIENCE SEED ----
export const experienceSeed = [
  {
    role: "Frontend Engineer",
    company: {
      name: "Repairfind",
      jobLocation: "Ontario, Canada",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Admin Platform",
        description:
          "Industry-standard admin to manage and monitor product operations; continuous improvements and feature delivery.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
        features: [
          "role-based access",
          "dashboards",
          "case/work order management",
          "secure auth",
        ],
      },
      {
        title: "Customer Subscription Web",
        description:
          "Subscription website for premium customers; parity with mobile app and ongoing web app build.",
        technologies: ["Next.js", "TypeScript", "REST APIs"],
        features: ["plans & billing", "account management", "responsive UI"],
      },
      {
        title: "Contractor & Customer Mobile Apps",
        description:
          "React Native apps with consistent UX and feature parity across personas.",
        technologies: ["React Native", "Expo", "TypeScript"],
        features: ["auth", "jobs/requests", "notifications"],
      },
    ],
    startDate: "2023-08-01",
    endDate: undefined,
    isCurrent: true,
  },

  {
    role: "Frontend Engineer",
    company: {
      name: "Genesys Tech Hub",
      jobLocation: "Enugu, Nigeria",
      jobType: "HYBRID",
    },
    projects: [
      {
        title: "Internal & External Product Interfaces",
        description:
          "Contributed to scalable UI components and app screens used across multiple initiatives.",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        features: ["component library", "state management", "testing"],
      },
    ],
    startDate: "2022-02-01",
    endDate: "2023-10-31",
    isCurrent: false,
  },

  {
    role: "Frontend Engineer (Contract)",
    company: {
      name: "Rise of the Meme",
      jobLocation: "USA",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Marketing Site & NFT→Token Swap",
        description:
          "Web for a meme coin project plus an NFT-to-token swap on Stacks.",
        technologies: ["React", "Stacks", "Web3"],
        features: ["landing site", "swap UI integration"],
      },
    ],
    startDate: "2024-11-01",
    endDate: "2025-01-31",
    isCurrent: false,
  },

  {
    role: "Mobile App Engineer (Contract)",
    company: {
      name: "Pineapp Tech (Pine Business Grow)",
      jobLocation: "Enugu, Nigeria",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Logistics Admin & Driver Apps",
        description:
          "Android/iOS apps with real-time shipment tracking and delivery status.",
        technologies: ["React Native", "Expo"],
        features: ["driver workflow", "live tracking", "push notifications"],
      },
    ],
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    isCurrent: false,
  },

  {
    role: "Mobile App Engineer (Contract)",
    company: {
      name: "Famr",
      jobLocation: "Lagos, Nigeria",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Famr Mobile App",
        description:
          "Users register farms, hire workers, onboard investors; in-app real-time chat.",
        technologies: ["React Native", "Expo", "Realtime Chat"],
        features: ["profiles", "marketplace", "chat"],
      },
    ],
    startDate: "2025-05-01",
    endDate: "2025-07-31",
    isCurrent: false,
  },

  {
    role: "Mobile App Engineer (Contract)",
    company: {
      name: "Seamflex Inc.",
      jobLocation: "Calgary, Canada",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Enviryde Mobile App v1",
        description: "Led development and launch of v1 mobile app.",
        technologies: ["React Native", "Expo"],
        features: ["auth", "booking flow", "maps/integrations"],
      },
      {
        title: "Cross-platform contributions",
        description: "Additional contributions across web and mobile projects.",
        technologies: ["React", "Next.js", "React Native"],
        features: ["shared components", "design systems"],
      },
    ],
    startDate: "2025-08-01",
    endDate: "2025-10-31",
    isCurrent: false,
  },
];

// ---- PROJECTS SEED ----
export const projectSeed = [
  {
    title: "Kanban Task Management App",
    description:
      "Full-stack kanban boards with auth and drag-and-drop task workflow.",
    technologies: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript"],
    features: ["auth", "boards/columns/cards", "drag & drop", "activity log"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763654272/portfolio/yjbckwtttqjgun9m0cw3.webp",
    liveUrl: "https://toyan-kanban.vercel.app/",
    githubUrl: "https://github.com/theMystic1/kanban-task-management-app",
  },

  // {
  //   title: "Subscription Tracker",
  //   description:
  //     "Track recurring subscriptions, next billing cycles, and spend insights.",
  //   technologies: ["Express.js", "MongoDB", "Node.js", "TypeScript"],
  //   features: ["CRUD", "reminders", "analytics"],
  //   coverImage:
  //     "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  // },
  // {
  //   title: "Finance Management App",
  //   description:
  //     "Personal finance dashboards with budgets, categories, and reports.",
  //   technologies: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript"],
  //   features: ["budgets", "transactions", "charts"],
  //   coverImage:
  //     "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  // },
  {
    title: "Personal Link Manager",
    description:
      "Save, tag, and search personal links; quick share and organization.",
    technologies: ["Next.js", "Express.js", "Javascript"],
    features: ["tags", "search", "collections"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763654873/portfolio/kyoajbe3j8wh1jfu2kac.webp",
  },
  {
    title: "Rise of the Meme – Site & Swap",
    description:
      "Marketing site for the meme coin + NFT-to-token swap built on Stacks.",
    technologies: ["React", "Stacks", "Web3"],
    features: ["landing", "swap UI"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
  {
    title: "Enviryde Mobile App v1",
    description:
      "Ride experience app—onboarding, trip booking, and core flows for v1.",
    technologies: ["React Native", "Expo"],
    features: ["auth", "trip booking", "notifications"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
  {
    title: "Logistics Admin & Driver Apps",
    description:
      "Admin controls + driver workflow with real-time tracking for logistics.",
    technologies: ["React Native", "Expo"],
    features: ["live tracking", "driver jobs", "status updates"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
  {
    title: "Famr Mobile App",
    description:
      "Register farms, hire workers, onboard investors; real-time chat inside.",
    technologies: ["React Native", "Expo"],
    features: ["profiles", "marketplace", "chat"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
  {
    title: "Repairfind Admin Platform",
    description:
      "Admin portal to manage operations, customers, and platform essentials.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    features: ["RBAC", "dashboards", "work order/case tools"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
  {
    title: "Customer Subscription Web (Repairfind)",
    description:
      "Web experience for premium customers—plans, payments, and account.",
    technologies: ["Next.js", "TypeScript", "REST APIs"],
    features: ["plans", "billing", "account"],
    coverImage:
      "https://res.cloudinary.com/dd6vokauv/image/upload/v1763645095/portfolio/mio7vtyf9efwls9c81dk.jpg",
  },
];
