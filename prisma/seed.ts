import { prisma } from "../lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const BANNER_IMAGES = [
  "/colleges/du-650_060114055506_0.jpeg",
  "/colleges/1.1-Top-10-Best-Colleges-in-India_-A-Comprehensive-Guide-to-Premier-Educational-Institutions-Source-home.iitd_.ac_.in_.jpg",
  "/colleges/b5af6ee0-ed4d-11eb-a043-f8aaa01a1d1e_1627242083337_1627556687642.webp",
];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

const govtColleges = [
  { name: "IGNOU (Indira Gandhi National Open University)", city: "New Delhi", state: "Delhi", approval: "NAAC A++", type: "Open University", 
    ug: ["BA", "BCom", "BBA", "BCA", "BSc"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "DU SOL (Delhi University - School of Open Learning)", city: "North Delhi", state: "Delhi", approval: "NAAC A+", type: "Open University",
    ug: ["BA", "BCom", "BBA", "BCA"], pg: ["MA", "MCom"] },
  { name: "MDU (Maharshi Dayanand University, Rohtak)", city: "Rohtak", state: "Haryana", approval: "NAAC A+", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "VMOU (Vardhman Mahaveer Open University)", city: "Kota", state: "Rajasthan", approval: "NAAC B++", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc", "MEd"] },
  { name: "KSOU (Karnataka State Open University)", city: "Mysuru", state: "Karnataka", approval: "NAAC B+", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc", "MEd"] },
  { name: "NSOU (Netaji Subhas Open University)", city: "Kolkata", state: "West Bengal", approval: "NAAC B+", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "BRAOU (B.R. Ambedkar Open University)", city: "Hyderabad", state: "Telangana", approval: "NAAC B+", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "MJPRU (MJP Rohilkhand University - Distance)", city: "Bareilly", state: "Uttar Pradesh", approval: "NAAC B", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "CCS University (Ch. Charan Singh University - Distance)", city: "Meerut", state: "Uttar Pradesh", approval: "NAAC B+", type: "Open University",
    ug: ["BA", "BCom", "BCA", "BBA", "BSc", "BEd"], pg: ["MA", "MCom", "MBA", "MCA", "MSc"] },
  { name: "JAMIA MILLIA ISLAMIA (Distance & Open Learning)", city: "New Delhi", state: "Delhi", approval: "NAAC A", type: "Open University",
    ug: ["BA", "BCom", "BBA"], pg: ["MA", "MCom", "MBA"] }
];

const privateColleges = [
  { name: "Amity University", city: "Noida", state: "Uttar Pradesh", approval: "NAAC A+", type: "Private",
    ug: ["BCA", "BTech", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Sharda University", city: "Greater Noida", state: "Uttar Pradesh", approval: "NAAC A", type: "Private",
    ug: ["BCA", "BTech", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Galgotias University", city: "Greater Noida", state: "Uttar Pradesh", approval: "NAAC A+", type: "Private",
    ug: ["BCA", "BTech", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Bennett University", city: "Greater Noida", state: "Uttar Pradesh", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BA", "BCom"], pg: ["MBA", "MCA", "MTech", "MA"] },
  { name: "Manav Rachna University", city: "Faridabad", state: "Haryana", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Manav Rachna International Institute (MRIIRS)", city: "Faridabad", state: "Haryana", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MA", "MSc"] },
  { name: "GD Goenka University", city: "Gurugram", state: "Haryana", approval: "NAAC A+", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "K.R. Mangalam University", city: "Gurugram", state: "Haryana", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Lingaya's Vidyapeeth", city: "Faridabad", state: "Haryana", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MA", "MSc"] },
  { name: "SGT University", city: "Gurugram", state: "Haryana", approval: "NAAC A+", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "PDM University", city: "Bahadurgarh", state: "Haryana", approval: "NAAC B+", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Noida International University", city: "Greater Noida", state: "Uttar Pradesh", approval: "NAAC A+", type: "Private",
    ug: ["BTech", "BCA", "BBA", "BCom", "BA", "BSc"], pg: ["MBA", "MCA", "MTech", "MCom", "MA", "MSc"] },
  { name: "Shiv Nadar University", city: "Greater Noida", state: "Uttar Pradesh", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BA", "BSc"], pg: ["MTech", "MA", "MSc"] },
  { name: "Jaypee Institute of IT (JIIT)", city: "Noida", state: "Uttar Pradesh", approval: "NAAC A", type: "Private",
    ug: ["BTech", "BCA", "BBA"], pg: ["MTech", "MBA"] }
];

const allColleges = [...govtColleges, ...privateColleges];

function getCourseData(courseName: string) {
  const details: Record<string, any> = {
    "BA": { duration: 3, category: "Humanities", fees: 45000, eligibility: "12th (Any Stream)" },
    "BCom": { duration: 3, category: "Commerce", fees: 50000, eligibility: "12th (Commerce/Any Stream)" },
    "BBA": { duration: 3, category: "Management", fees: 80000, eligibility: "12th (Any Stream)" },
    "BCA": { duration: 3, category: "Computer Applications", fees: 85000, eligibility: "12th (Math Preferred)" },
    "BSc": { duration: 3, category: "Science", fees: 60000, eligibility: "12th (Science)" },
    "BEd": { duration: 2, category: "Education", fees: 55000, eligibility: "Graduation" },
    "BTech": { duration: 4, category: "Engineering", fees: 150000, eligibility: "12th (PCM)" },
    "MA": { duration: 2, category: "Humanities", fees: 40000, eligibility: "BA or equivalent Graduation" },
    "MCom": { duration: 2, category: "Commerce", fees: 45000, eligibility: "BCom or equivalent Graduation" },
    "MBA": { duration: 2, category: "Management", fees: 120000, eligibility: "Graduation (Min 50%)" },
    "MCA": { duration: 2, category: "Computer Applications", fees: 100000, eligibility: "BCA or BSc (CS/IT)" },
    "MSc": { duration: 2, category: "Science", fees: 65000, eligibility: "BSc or equivalent Graduation" },
    "MTech": { duration: 2, category: "Engineering", fees: 130000, eligibility: "BTech or MCA" }
  };
  return details[courseName] || { duration: 3, category: "General", fees: 50000, eligibility: "12th Pass / Graduation" };
}

async function main() {
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  for (let i = 0; i < allColleges.length; i++) {
    const c = allColleges[i];
    const slug = slugify(c.name);
    const establishedYear = c.type === "Open University" ? 1980 + (i % 20) : 1995 + (i % 25);
    
    // Format courses array
    const coursesToCreate: any[] = [];
    const allCourses = [...(c.ug || []), ...(c.pg || [])];
    
    for (const course of allCourses) {
      const d = getCourseData(course);
      const isUG = course.startsWith("B");
      const modules = isUG
        ? ["Core Subjects", "Electives", "Practical / Lab", "Minor Project", "Internship", "Major Project"]
        : ["Advanced Core Subjects", "Specializations", "Research Methodology", "Seminar", "Internship", "Dissertation"];
        
      coursesToCreate.push({
        name: `${course} (${d.duration} Years)`,
        slug: slugify(`${c.name}-${course}-${d.duration}`),
        duration: d.duration,
        category: d.category,
        fees: d.fees + (i * 2000), // Slight variation
        eligibility: d.eligibility,
        modules: modules
      });
    }

    await prisma.college.create({
      data: {
        name: c.name,
        slug,
        state: c.state,
        city: c.city,
        address: `Main Campus, ${c.city}`,
        description: "Premium institution offering excellent academic programs, modern infrastructure, and strong placement records. Accredited by top bodies.",
        establishedYear,
        type: c.type,
        approval: c.approval,
        logo: null,
        bannerImage: pick(BANNER_IMAGES, i),
        courses: {
          create: coursesToCreate
        }
      }
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
