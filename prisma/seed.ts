import { prisma } from "../lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SeedCollegeInput = {
  name: string;
  state: string;
  city: string;
  address: string;
  description: string;
  establishedYear: number;
  type: string;
  approval: string;
  logo: string | null;
  bannerImage: string | null;
};

type SeedCourseInput = {
  name: string;
  duration: 2 | 3;
  category: string;
  fees: number;
  eligibility: string;
  modules: string[];
};

const BANNER_IMAGES = [
  "/colleges/du-650_060114055506_0.jpeg",
  "/colleges/1.1-Top-10-Best-Colleges-in-India_-A-Comprehensive-Guide-to-Premier-Educational-Institutions-Source-home.iitd_.ac_.in_.jpg",
  "/colleges/b5af6ee0-ed4d-11eb-a043-f8aaa01a1d1e_1627242083337_1627556687642.webp",
];

const CITY_STATE: Array<{ city: string; state: string }> = [
  { city: "New Delhi", state: "Delhi" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Kochi", state: "Kerala" },
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Guwahati", state: "Assam" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Surat", state: "Gujarat" },
  { city: "Vadodara", state: "Gujarat" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Faridabad", state: "Haryana" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Dehradun", state: "Uttarakhand" },
];

const INSTITUTE_WORDS = [
  "Institute of Technology",
  "College of Engineering",
  "School of Management",
  "College of Arts & Science",
  "School of Computer Applications",
  "Institute of Applied Sciences",
  "School of Business",
  "Institute of Innovation",
];

const APPROVALS = ["AICTE", "UGC", "NAAC A", "NAAC A+", "NBA"];
const TYPES = ["Private", "Government", "Deemed"];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function buildCollege(i: number): SeedCollegeInput {
  const loc = pick(CITY_STATE, i);
  const word = pick(INSTITUTE_WORDS, i);
  const name = `${loc.city} ${word}`;

  const establishedYear = 1985 + (i % 35);
  const type = pick(TYPES, i);
  const approval = pick(APPROVALS, i);
  const bannerImage = pick(BANNER_IMAGES, i);

  return {
    name,
    state: loc.state,
    city: loc.city,
    address: `${pick(["Sector 1", "MG Road", "Civil Lines", "Whitefield", "Andheri West", "Salt Lake"], i)}, ${loc.city}`,
    description:
      "Student-first campus with career-focused programs, modern infrastructure, and strong industry engagement.",
    establishedYear,
    type,
    approval,
    logo: null,
    bannerImage,
  };
}

function buildCourses(collegeName: string, i: number): SeedCourseInput[] {
  const twoYear = pick<SeedCourseInput>(
    [
      {
        name: "MBA (2 Years)",
        duration: 2,
        category: "Management",
        fees: 220000,
        eligibility: "Graduation with minimum 50%",
        modules: [
          "Management Foundations",
          "Marketing & Sales",
          "Financial Management",
          "Operations & Supply Chain",
          "Business Analytics",
          "Capstone Project",
        ],
      },
      {
        name: "MCA (2 Years)",
        duration: 2,
        category: "Computer Applications",
        fees: 200000,
        eligibility: "BCA/BSc (CS/IT) or equivalent",
        modules: [
          "Programming Fundamentals",
          "Data Structures & Algorithms",
          "Database Systems",
          "Web Development",
          "Software Engineering",
          "Final Project",
        ],
      },
      {
        name: "M.Tech (2 Years)",
        duration: 2,
        category: "Engineering",
        fees: 280000,
        eligibility: "B.E/B.Tech with minimum 50%",
        modules: [
          "Advanced Engineering Mathematics",
          "Research Methodology",
          "Core Specialization",
          "Electives",
          "Seminar",
          "Thesis/Dissertation",
        ],
      },
    ],
    i
  );

  const threeYear = pick<SeedCourseInput>(
    [
      {
        name: "BBA (3 Years)",
        duration: 3,
        category: "Management",
        fees: 150000,
        eligibility: "12th (any stream)",
        modules: [
          "Business Communication",
          "Principles of Management",
          "Accounting Basics",
          "Marketing Fundamentals",
          "Human Resource Management",
          "Internship / Project",
        ],
      },
      {
        name: "BCA (3 Years)",
        duration: 3,
        category: "Computer Applications",
        fees: 165000,
        eligibility: "12th with Mathematics preferred",
        modules: [
          "Programming in C/C++",
          "Object-Oriented Programming",
          "DBMS",
          "Operating Systems",
          "Web Technologies",
          "Major Project",
        ],
      },
      {
        name: "B.Sc Computer Science (3 Years)",
        duration: 3,
        category: "Science",
        fees: 140000,
        eligibility: "12th with Science",
        modules: [
          "Discrete Mathematics",
          "Computer Organization",
          "DSA",
          "Networking Basics",
          "Python / Data Science Basics",
          "Final Project",
        ],
      },
    ],
    i
  );

  // Slightly vary fees so filters feel realistic.
  const feeBump = (i % 7) * 5000;

  return [
    {
      ...twoYear,
      name: twoYear.name,
      fees: twoYear.fees + feeBump,
    },
    {
      ...threeYear,
      name: threeYear.name,
      fees: threeYear.fees + Math.floor(feeBump * 0.8),
    },
  ].map((c) => ({ ...c, name: c.name.replace(/\s+/g, " ").trim() }));
}

function brandColleges(): Array<{ college: SeedCollegeInput; courses: SeedCourseInput[] }> {
  const makeCollege = (
    i: number,
    name: string,
    fullName: string,
    city: string,
    state: string,
    categoryHint: string
  ) => {
    const bannerImage = pick(BANNER_IMAGES, i);
    const type = "Private";
    const approval = pick(APPROVALS, i);

    const college: SeedCollegeInput = {
      name,
      city,
      state,
      address: `Main Campus, ${city}`,
      description: `${fullName}. Industry-aligned programs and practical learning in ${categoryHint}.`,
      establishedYear: 2015 + (i % 8),
      type,
      approval,
      logo: null,
      bannerImage,
    };

    return college;
  };

  return [
    {
      college: makeCollege(
        0,
        "IIDAD",
        "Indian Institute of Designing and Development (IIDAD)",
        "New Delhi",
        "Delhi",
        "Design"
      ),
      courses: [
        {
          name: "M.Des (Product Design) (2 Years)",
          duration: 2,
          category: "Design",
          fees: 260000,
          eligibility: "Graduation in any discipline (portfolio preferred)",
          modules: [
            "Design Thinking",
            "User Research",
            "Prototyping",
            "Product Strategy",
            "Portfolio Studio",
            "Capstone Project",
          ],
        },
        {
          name: "PG Diploma in UI/UX Design (2 Years)",
          duration: 2,
          category: "Design",
          fees: 210000,
          eligibility: "Graduation in any discipline",
          modules: [
            "UX Fundamentals",
            "Information Architecture",
            "Wireframing & Prototyping",
            "Visual Design",
            "Usability Testing",
            "Portfolio Project",
          ],
        },
        {
          name: "B.Des (UI/UX Design) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 240000,
          eligibility: "12th (any stream)",
          modules: [
            "Design Basics",
            "Typography & Color",
            "UX Process",
            "Interaction Design",
            "Design Systems",
            "Major Project",
          ],
        },
        {
          name: "B.Des (Graphic Design) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 230000,
          eligibility: "12th (any stream)",
          modules: [
            "Design Fundamentals",
            "Branding",
            "Layout & Composition",
            "Illustration",
            "Print & Digital",
            "Portfolio Project",
          ],
        },
      ],
    },
    {
      college: makeCollege(
        1,
        "NIHACS",
        "National Institute of Hacking and Cyber Security (NIHACS)",
        "Hyderabad",
        "Telangana",
        "Cyber Security"
      ),
      courses: [
        {
          name: "M.Sc Cyber Security (2 Years)",
          duration: 2,
          category: "Cyber Security",
          fees: 280000,
          eligibility: "Graduation (CS/IT preferred)",
          modules: [
            "Networking & OS Security",
            "Cryptography",
            "Web App Security",
            "Incident Response",
            "Security Operations (SOC)",
            "Capstone Project",
          ],
        },
        {
          name: "PG Program in Ethical Hacking (2 Years)",
          duration: 2,
          category: "Cyber Security",
          fees: 250000,
          eligibility: "Graduation (any discipline)",
          modules: [
            "Linux Essentials",
            "Recon & Enumeration",
            "Vulnerability Assessment",
            "Exploitation Basics",
            "Post-Exploitation",
            "Hands-on Labs",
          ],
        },
        {
          name: "B.Sc Cyber Security (3 Years)",
          duration: 3,
          category: "Cyber Security",
          fees: 210000,
          eligibility: "12th with Science/Math (preferred)",
          modules: [
            "Programming Basics",
            "Computer Networks",
            "Security Fundamentals",
            "Digital Forensics Basics",
            "Cloud Security Intro",
            "Final Project",
          ],
        },
        {
          name: "BCA (Cyber Security) (3 Years)",
          duration: 3,
          category: "Computer Applications",
          fees: 195000,
          eligibility: "12th (any stream)",
          modules: [
            "Programming",
            "DBMS",
            "Networking",
            "Web Security",
            "Threats & Mitigation",
            "Major Project",
          ],
        },
      ],
    },
    {
      college: makeCollege(
        2,
        "NIDADS",
        "National Institute of Design and Applied Digital Skills (NIDADS)",
        "Mumbai",
        "Maharashtra",
        "Design"
      ),
      courses: [
        {
          name: "M.Des (Communication Design) (2 Years)",
          duration: 2,
          category: "Design",
          fees: 275000,
          eligibility: "Graduation in any discipline (portfolio preferred)",
          modules: [
            "Visual Communication",
            "Typography",
            "Brand Systems",
            "Design Research",
            "Studio Practice",
            "Capstone Project",
          ],
        },
        {
          name: "PG Diploma in Motion Graphics (2 Years)",
          duration: 2,
          category: "Design",
          fees: 220000,
          eligibility: "Graduation in any discipline",
          modules: [
            "Storyboarding",
            "2D Motion",
            "3D Basics",
            "Compositing",
            "Sound & Timing",
            "Showreel Project",
          ],
        },
        {
          name: "B.Des (Animation) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 240000,
          eligibility: "12th (any stream)",
          modules: [
            "Drawing & Observation",
            "2D Animation",
            "3D Animation Basics",
            "Character Design",
            "VFX Intro",
            "Final Project",
          ],
        },
        {
          name: "B.Des (Interior Design) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 245000,
          eligibility: "12th (any stream)",
          modules: [
            "Space Planning",
            "Materials & Lighting",
            "CAD Basics",
            "Furniture Design",
            "Site Visits",
            "Studio Project",
          ],
        },
      ],
    },
    {
      college: makeCollege(
        3,
        "NIGAPE",
        "National Institute of Game Arts and Production Education (NIGAPE)",
        "Bengaluru",
        "Karnataka",
        "Game Design"
      ),
      courses: [
        {
          name: "M.Sc Game Development (2 Years)",
          duration: 2,
          category: "Game Development",
          fees: 290000,
          eligibility: "Graduation (CS/IT preferred)",
          modules: [
            "Game Engines",
            "Gameplay Programming",
            "3D Math & Physics",
            "Multiplayer Basics",
            "Optimization",
            "Capstone Game Project",
          ],
        },
        {
          name: "PG Program in 3D Animation (2 Years)",
          duration: 2,
          category: "Design",
          fees: 240000,
          eligibility: "Graduation in any discipline",
          modules: [
            "3D Modeling",
            "Texturing & Shading",
            "Rigging",
            "Animation",
            "Lighting & Rendering",
            "Showreel",
          ],
        },
        {
          name: "B.Sc Game Design (3 Years)",
          duration: 3,
          category: "Game Development",
          fees: 225000,
          eligibility: "12th (any stream)",
          modules: [
            "Game Design Basics",
            "Level Design",
            "Game Art Basics",
            "Scripting",
            "Prototyping",
            "Major Project",
          ],
        },
        {
          name: "BCA (Game Development) (3 Years)",
          duration: 3,
          category: "Computer Applications",
          fees: 205000,
          eligibility: "12th (any stream)",
          modules: [
            "Programming",
            "Data Structures",
            "Game Engine Intro",
            "Graphics Basics",
            "Game AI Basics",
            "Final Project",
          ],
        },
      ],
    },
    {
      college: makeCollege(
        4,
        "DIZITALADDANIFASE",
        "Dizital Adda Ni Fase (Digital Skills Brand)",
        "Ahmedabad",
        "Gujarat",
        "Digital Marketing"
      ),
      courses: [
        {
          name: "PG Program in Digital Marketing (2 Years)",
          duration: 2,
          category: "Digital Marketing",
          fees: 190000,
          eligibility: "Graduation in any discipline",
          modules: [
            "Marketing Fundamentals",
            "SEO",
            "Social Media Marketing",
            "Performance Ads",
            "Analytics",
            "Campaign Project",
          ],
        },
        {
          name: "PG Diploma in Performance Marketing (2 Years)",
          duration: 2,
          category: "Digital Marketing",
          fees: 175000,
          eligibility: "Graduation in any discipline",
          modules: [
            "Ad Platforms Basics",
            "Funnel Strategy",
            "Copy & Creatives",
            "Landing Pages",
            "Optimization",
            "Case Studies",
          ],
        },
        {
          name: "BBA (Digital Business) (3 Years)",
          duration: 3,
          category: "Management",
          fees: 160000,
          eligibility: "12th (any stream)",
          modules: [
            "Business Basics",
            "E-commerce",
            "Digital Strategy",
            "Customer Acquisition",
            "Data Basics",
            "Project",
          ],
        },
        {
          name: "B.Com (Digital Commerce) (3 Years)",
          duration: 3,
          category: "Commerce",
          fees: 145000,
          eligibility: "12th (any stream)",
          modules: [
            "Accounting",
            "Taxation Basics",
            "E-commerce Operations",
            "Digital Payments",
            "Compliance Basics",
            "Project",
          ],
        },
      ],
    },
    {
      college: makeCollege(
        5,
        "DESIGNING VIDYA",
        "Designing Vidya (Design & Creative Institute)",
        "Jaipur",
        "Rajasthan",
        "Design"
      ),
      courses: [
        {
          name: "M.Des (Fashion Design) (2 Years)",
          duration: 2,
          category: "Design",
          fees: 255000,
          eligibility: "Graduation in any discipline (portfolio preferred)",
          modules: [
            "Fashion Illustration",
            "Textiles",
            "Pattern Making",
            "Collection Design",
            "Portfolio Studio",
            "Capstone",
          ],
        },
        {
          name: "PG Diploma in Visual Communication (2 Years)",
          duration: 2,
          category: "Design",
          fees: 205000,
          eligibility: "Graduation in any discipline",
          modules: [
            "Design Fundamentals",
            "Typography",
            "Branding",
            "Digital Design",
            "Portfolio",
            "Project",
          ],
        },
        {
          name: "B.Des (Fashion Design) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 235000,
          eligibility: "12th (any stream)",
          modules: [
            "Drawing",
            "Textiles",
            "Garment Construction",
            "Design Studio",
            "Fashion Marketing",
            "Final Collection",
          ],
        },
        {
          name: "B.Des (Visual Communication) (3 Years)",
          duration: 3,
          category: "Design",
          fees: 225000,
          eligibility: "12th (any stream)",
          modules: [
            "Visual Basics",
            "Typography",
            "Brand Communication",
            "Motion Basics",
            "Digital Design",
            "Major Project",
          ],
        },
      ],
    },
  ];
}

async function main() {
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const brands = brandColleges();
  for (const b of brands) {
    const slug = slugify(b.college.name);
    await prisma.college.create({
      data: {
        ...b.college,
        slug,
        courses: {
          create: b.courses.map((c) => ({
            name: c.name,
            slug: slugify(`${b.college.name}-${c.name}-${c.duration}`),
            duration: c.duration,
            category: c.category,
            fees: c.fees,
            eligibility: c.eligibility,
            modules: c.modules,
          })),
        },
      },
    });
  }

  const totalColleges = 50;
  const remaining = Math.max(0, totalColleges - brands.length);
  for (let i = 0; i < remaining; i += 1) {
    const college = buildCollege(i + brands.length);
    const courses = buildCourses(college.name, i + brands.length);
    const slug = slugify(college.name);

    await prisma.college.create({
      data: {
        name: college.name,
        slug,
        state: college.state,
        city: college.city,
        address: college.address,
        description: college.description,
        establishedYear: college.establishedYear,
        type: college.type,
        approval: college.approval,
        logo: college.logo,
        bannerImage: college.bannerImage,
        courses: {
          create: courses.map((c) => ({
            name: c.name,
            slug: slugify(`${college.name}-${c.name}-${c.duration}`),
            duration: c.duration,
            category: c.category,
            fees: c.fees,
            eligibility: c.eligibility,
            modules: c.modules,
          })),
        },
      },
    });
  }

  const [collegeCount, courseCount] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
  ]);
  // eslint-disable-next-line no-console
  console.log(`Seed complete: ${collegeCount} colleges, ${courseCount} courses`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
