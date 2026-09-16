export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string[];
  specialties: string[];
  socialLinks: { platform: string; url: string }[];
  articlesWritten: number;
  yearsAtPaper: number;
}

const AVATAR = (seed: string) => `https://i.pravatar.cc/400?img=${seed}`;

export const staff: StaffMember[] = [
  {
    id: "naledi-mokoena",
    name: "Naledi Mokoena",
    role: "Editor-in-Chief",
    department: "News",
    email: "n.mokoena@africanhighschooljournal.org",
    phone: "+27 21 555 0123",
    avatar: AVATAR("32"),
    bio: [
      "Naledi is a final-year student at the University of Cape Town who serves as our Editor-in-Chief, mentoring aspiring journalists across the continent.",
      "She previously led the student newspaper at Westerford High School and is passionate about elevating African youth voices in global media.",
      "Her vision is to create a unified platform where high schoolers from Cairo to Cape Town can share their local stories and perspectives."
    ],
    specialties: ["Editorial Leadership", "Media Ethics", "Pan-African Affairs"],
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" }
    ],
    articlesWritten: 124,
    yearsAtPaper: 4,
  },
  {
    id: "kwame-asante",
    name: "Kwame Asante",
    role: "Student News Editor",
    department: "News",
    email: "k.asante@africanhighschooljournal.org",
    phone: "+233 24 555 6789",
    avatar: AVATAR("12"),
    bio: [
      "Kwame is a senior at Achimota School in Accra and serves as our Student News Editor, focusing on regional policy and its impact on education.",
      "He won the 2023 Ghana Young Reporter Award for his investigation into digital literacy programs in rural schools.",
      "Kwame believes that accurate, locally-sourced news is the cornerstone of a vibrant and informed pan-African student community."
    ],
    specialties: ["Education Reporting", "Investigative Journalism", "Policy Analysis"],
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" }
    ],
    articlesWritten: 86,
    yearsAtPaper: 3,
  },
  {
    id: "zainab-diallo",
    name: "Zainab Diallo",
    role: "Sports Editor",
    department: "Sport",
    email: "z.diallo@africanhighschooljournal.org",
    phone: "+221 33 555 4321",
    avatar: AVATAR("26"),
    bio: [
      "Zainab is an avid footballer and sports journalist based in Dakar, where she attends Lycée Seydina Limamou Laye.",
      "As our Sports Editor, she covers everything from local inter-school championships to the rise of African talent in international leagues.",
      "She is deeply committed to highlighting the achievements of female athletes across West Africa and promoting sports as a tool for development."
    ],
    specialties: ["Athletic Profiles", "Inter-school Sports", "Women in Sport"],
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "Instagram", url: "#" }
    ],
    articlesWritten: 92,
    yearsAtPaper: 3,
  },
  {
    id: "thandiwe-nkomo",
    name: "Thandiwe Nkomo",
    role: "Arts & Culture Editor",
    department: "Culture",
    email: "t.nkomo@africanhighschooljournal.org",
    phone: "+263 9 555 9876",
    avatar: AVATAR("45"),
    bio: [
      "Based in Bulawayo, Thandiwe is a creative powerhouse who curates our Arts & Culture section.",
      "She is currently a student at Arundel School and spends her time documenting the evolving music and fashion scenes in Southern Africa.",
      "Thandiwe believes that African culture is the continent's greatest export and seeks to tell stories that honor both tradition and modern innovation."
    ],
    specialties: ["Cultural Criticism", "Music Journalism", "Fashion History"],
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" }
    ],
    articlesWritten: 74,
    yearsAtPaper: 2,
  },
  {
    id: "chidi-okafor",
    name: "Chidi Okafor",
    role: "Science Correspondent",
    department: "Science",
    email: "c.okafor@africanhighschooljournal.org",
    phone: "+234 80 555 2468",
    avatar: AVATAR("54"),
    bio: [
      "Chidi is a science enthusiast from Lagos, attending King's College, where he leads the school's robotics and coding club.",
      "As our Science Correspondent, he writes about sustainable energy solutions and tech innovations emerging from African tech hubs.",
      "He hopes to inspire more students to pursue STEM careers by showcasing homegrown success stories in science and technology."
    ],
    specialties: ["Tech Innovation", "Sustainable Energy", "STEM Education"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" }
    ],
    articlesWritten: 58,
    yearsAtPaper: 2,
  },
  {
    id: "wanjiru-kamau",
    name: "Wanjiru Kamau",
    role: "Opinion & Debate Editor",
    department: "Opinion",
    email: "w.kamau@africanhighschooljournal.org",
    phone: "+254 20 555 1357",
    avatar: AVATAR("41"),
    bio: [
      "Wanjiru is a fierce debater and student leader at Alliance Girls' High School in Nairobi.",
      "As the Opinion & Debate Editor, she fosters critical thinking and civil discourse on topics ranging from climate change to pan-African unity.",
      "She believes that the youth have a unique perspective that is often missing from major policy discussions on the continent."
    ],
    specialties: ["Debate Moderation", "Political Commentary", "Youth Advocacy"],
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "Medium", url: "#" }
    ],
    articlesWritten: 65,
    yearsAtPaper: 3,
  },
  {
    id: "tesfaye-bekele",
    name: "Tesfaye Bekele",
    role: "Photography Lead",
    department: "Arts",
    email: "t.bekele@africanhighschooljournal.org",
    phone: "+251 11 555 8642",
    avatar: AVATAR("61"),
    bio: [
      "Tesfaye is a self-taught photographer from Addis Ababa who captures the vibrant street life and diverse landscapes of Ethiopia.",
      "As our Photography Lead, he mentors student photographers on visual storytelling and the technical aspects of digital photography.",
      "His work has been featured in several regional exhibitions, highlighting the beauty and complexity of everyday life in East Africa."
    ],
    specialties: ["Photojournalism", "Visual Storytelling", "Street Photography"],
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Portfolio", url: "#" }
    ],
    articlesWritten: 42,
    yearsAtPaper: 2,
  },
  {
    id: "aisha-bello",
    name: "Aisha Bello",
    role: "Campus Life Reporter",
    department: "Campus Life",
    email: "a.bello@africanhighschooljournal.org",
    phone: "+234 70 555 3579",
    avatar: AVATAR("28"),
    bio: [
      "Aisha is a reporter based in Kano, Nigeria, who focuses on the daily experiences and traditions of students across the Sahel region.",
      "As our Campus Life Reporter, she tells stories about school rituals, student activism, and the unique challenges of modern education.",
      "She is passionate about using journalism to bridge the gap between different cultures and languages within Nigeria and beyond."
    ],
    specialties: ["Student Activism", "Cultural Exchange", "Campus Traditions"],
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "Facebook", url: "#" }
    ],
    articlesWritten: 79,
    yearsAtPaper: 2,
  },
  {
    id: "kofi-mensah",
    name: "Kofi Mensah",
    role: "Essays Editor",
    department: "Essays",
    email: "k.mensah@africanhighschooljournal.org",
    phone: "+233 32 555 2468",
    avatar: AVATAR("65"),
    bio: [
      "Kofi is a prolific writer and literature student in Kumasi, Ghana, who manages our Essays section with a keen eye for narrative.",
      "He encourages students to explore deep philosophical questions and personal histories through long-form writing and creative non-fiction.",
      "Kofi believes that this platform is a vital space for the next generation of African intellectuals to find and refine their voices."
    ],
    specialties: ["Literary Criticism", "Creative Non-fiction", "Historical Essays"],
    socialLinks: [
      { platform: "Medium", url: "#" },
      { platform: "LinkedIn", url: "#" }
    ],
    articlesWritten: 51,
    yearsAtPaper: 3,
  },
  {
    id: "nia-ochieng",
    name: "Nia Ochieng",
    role: "Outreach & Partnerships",
    department: "Campus Life",
    email: "n.ochieng@africanhighschooljournal.org",
    phone: "+256 41 555 7531",
    avatar: AVATAR("47"),
    bio: [
      "Nia is based in Kampala, Uganda, and handles our Outreach & Partnerships, connecting our journal with schools and organizations across East Africa.",
      "She is a natural networker who believes in the power of collaboration to amplify the voices of the youth on a global scale.",
      "Nia often reports on community-led initiatives in Kigali and Kampala that empower young people through education and the arts."
    ],
    specialties: ["Community Engagement", "Public Relations", "Project Management"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" }
    ],
    articlesWritten: 34,
    yearsAtPaper: 2,
  },
];

export const getStaffById = (id: string) => staff.find((s) => s.id === id);

export const getStaffByDepartment = (dept: string) =>
  staff.filter((s) => s.department.toLowerCase() === dept.toLowerCase());
