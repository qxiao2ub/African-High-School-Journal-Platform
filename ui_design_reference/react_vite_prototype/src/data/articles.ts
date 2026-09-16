import heroClassroom from "../assets/hero-classroom.jpg";
import storyDebate from "../assets/story-debate.jpg";
import storyRobotics from "../assets/story-robotics.jpg";
import storyFootball from "../assets/story-football.jpg";
import storyCulture from "../assets/story-culture.jpg";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string[];
  author: string;
  date: string;
  image: string;
  likes?: number;
}

// Use picsum with unique seed per article for reliable, high-quality images
const IMG = (seed: string) => `https://picsum.photos/seed/${seed}/1600/1000`;

const bodyContent: Record<string, string[]> = {
  "1": [
    "In a display of intellectual prowess, students from Nairobi's Alliance High School and Lagos's King's College faced off in the Pan-African Inter-School Debate Championships. The virtual event, which drew thousands of viewers across social media, focused on the implementation of the African Continental Free Trade Area (AfCFTA) from a youth perspective.",
    "The debate was characterized by sharp rebuttals and deep research, with Alliance High arguing for a unified digital currency, while King\u2019s College emphasized the need for infrastructure development first. Both teams demonstrated a sophisticated understanding of macroeconomics that impressed the panel of international judges.",
    "\u2018It wasn\u2019t just about winning,\u2019 said Amara Njoroge, the lead speaker for Alliance. \u2018It was about connecting with our peers across the continent and realizing that we face the same challenges and share the same dreams for Africa.\u2019",
    "The championship concluded with a narrow victory for King's College, but organizers noted that the real winner was the spirit of pan-African collaboration. Plans are already underway for an in-person tournament to be held in Kigali next year."
],
  "2": [
    "The final year of high school is often defined by a single set of exams that can determine a student's entire future. In Kenya, the KCSE looms large, while in Nigeria and Ghana, the WAEC remains the ultimate hurdle. This year, a growing movement of students is calling for a shift in how these high-stakes assessments are perceived.",
    "\u2018The pressure is sometimes unbearable,\u2019 says Kwesi Appiah, a final-year student in Accra. \u2018We spend years preparing for a few weeks of testing, and the fear of failure can be paralyzing. We need more focus on continuous assessment rather than just one final exam.\u2019",
    "Schools across the continent are beginning to respond by introducing mental health workshops and counseling sessions during exam periods. Educators acknowledge that while academic rigor is important, the well-being of the student must remain the priority.",
    "As the 2026 exam cycle begins, the conversation is shifting from just 'passing' to 'flourishing,' with students advocating for a more holistic approach to African secondary education."
],
  "3": [
    "In a small workshop filled with wires and solar panels, a team of Ethiopian high school students has developed a prototype for a solar-powered drone designed to help small-scale farmers. The drone uses AI to detect soil moisture levels and optimize irrigation schedules.",
    "The project started as a simple school club activity but quickly grew into a sophisticated engineering challenge. The team, led by 17-year-old Selamawit Tadesse, used recycled components and locally sourced electronics to keep costs low.",
    "\u2018We wanted to solve a problem that actually affects our community,\u2019 Selamawit explained. \u2018Many farmers here struggle with water management, and we believe technology can provide an affordable solution.\u2019",
    "The team recently won first prize at the National STEM Fair and is now seeking partnerships to produce their drones for pilot testing in rural Oromia. Their success is inspiring other students to take up coding and robotics."
],
  "4": [
    "Education is often touted as the 'great equalizer,' but for many families across the continent, the rising cost of school fees is becoming an insurmountable barrier. From Cape Town to Cairo, students are witnessing their peers drop out due to financial constraints.",
    "In a recent town hall meeting, student representatives argued that government subsidies are failing to keep up with inflation. They called for greater transparency in how school boards manage funds and a cap on non-essential levies.",
    "\u2018It is heartbreaking to see brilliant students leave school because they can\u2019t afford the bus fare or the uniform fees,\u2019 said Tendai Moyo, a student leader from Zimbabwe. \u2018We are losing the potential of an entire generation.\u2019",
    "While some private schools offer scholarships, the consensus among student activists is that systemic change is needed to ensure that every child, regardless of their economic background, has access to the classroom."
],
  "5": [
    "In English and Literature classes across Africa, the works of Chinua Achebe, Ng\u0169g\u0129 wa Thiong'o, and Buchi Emecheta remain staples of the curriculum. But far from being 'old classics,' these texts are finding new resonance with a generation navigating the complexities of a globalized world.",
    "Students are increasingly using these works to explore themes of decolonization, identity, and the tension between tradition and modernity. Achebe's 'Things Fall Apart' is being reread through the lens of leadership, while wa Thiong'o's 'Decolonising the Mind' sparks debates about the role of indigenous languages in schools.",
    "\u2018These authors gave us a voice before we knew we needed one,\u2019 says Chimamanda Okoro, an aspiring writer. \u2018Reading them is like having a conversation with our ancestors about our future.\u2019",
    "The enduring popularity of these texts suggests that the questions they raised decades ago are still central to the African experience. As students write their own stories, they stand on the shoulders of these literary giants."
],
  "6": [
    "The atmosphere was electric as Maseno School hosted St. Mary\u2019s for the annual regional rugby finals. Thousands of students, alumni, and fans gathered to witness what many consider the most intense rivalry in high school sports.",
    "The game was a tactical battle from the start, with both teams showing exceptional defensive discipline. St. Mary's took an early lead, but Maseno fought back in the second half, buoyed by the deafening cheers of their home crowd.",
    "In the final three minutes, Maseno's fly-half broke through a gap in the defense to score a spectacular try, ending the game 15-12. The celebration that followed was a testament to the passion that school sports ignite in the hearts of students.",
    "Beyond the scoreline, the match was a display of sportsmanship and mutual respect. Both captains emphasized that the rivalry drives them to be better athletes and better leaders."
],
  "7": [
    "At Chinsapo Secondary School, the 'Green Thumb' club is transforming a dusty plot of land into a thriving model of sustainable agriculture. The students are growing a variety of indigenous crops using organic fertilizers and a drip irrigation system they built themselves.",
    "The project aims to teach students the business of farming while providing fresh produce for the school canteen and local families in need. They have also started experimenting with vertical gardening to maximize space.",
    "\u2018Agriculture is the backbone of our economy, but many young people see it as a last resort,\u2019 says Kondwani Banda, the club president. \u2018We want to show that farming can be innovative, profitable, and essential for our survival.\u2019",
    "The success of the garden has attracted interest from local NGOs, who are now looking to replicate the model in other schools across the district. The students are already planning to add a small-scale poultry unit next term."
],
  "8": [
    "The energy inside the Accra Digital Centre was palpable as high school students from across Ghana gathered for the 'Code4Africa' hackathon. The challenge was simple: build a digital solution for a problem in health, education, or the environment in just two days.",
    "From apps that track local water quality to platforms that connect student tutors with younger learners, the creativity on display was remarkable. Many participants had only started coding a year ago through school-based clubs.",
    "\u2018I didn't think I could build something functional in such a short time,\u2019 said Abena Mansa, whose team developed an emergency response app. \u2018But the mentors and the collaborative environment made it possible.\u2019",
    "The event highlighted the growing tech talent among African youth and the importance of providing early access to digital tools. The winning teams received seed funding and mentorship to help bring their apps to market."
],
  "9": [
    "Despite progress in recent years, millions of girls across Africa still face significant obstacles in completing their secondary education. From early marriage to domestic responsibilities, the path to a diploma is often fraught with challenges.",
    "Investing in girls' education is not just a matter of justice; it is a fundamental economic necessity. Studies consistently show that educated women are more likely to invest in their families' health and education, creating a virtuous cycle of development.",
    "\u2018When you educate a girl, you educate a nation,\u2019 says Fatima Yusuf, a student activist from Northern Nigeria. \u2018We need to move beyond slogans and start addressing the specific barriers that keep girls out of school, like lack of sanitation facilities and safety concerns.\u2019",
    "The future of the continent depends on the full participation of all its citizens. Ensuring that every girl has the opportunity to learn and lead is the most effective way to build a resilient and prosperous Africa."
],
  "10": [
    "The debate over the language of instruction in African schools is as old as the education systems themselves. While English, French, and Portuguese are the languages of global commerce, many argue that teaching children in a foreign tongue hinders their cognitive development.",
    "In a recent school forum, students debated whether subjects like Science and Math should be taught in local languages like Swahili, Yoruba, or Wolof. Proponents argued that students grasp complex concepts better when explained in their mother tongue.",
    "\u2018I think in my home language, but I have to express myself in English,\u2019 said Moussa Diop, a student from Senegal. \u2018Sometimes things get lost in translation, and it makes learning much harder than it needs to be.\u2019",
    "On the other side, many fear that moving away from international languages will disadvantage African students in the global job market. The solution may lie in bilingual education models that value both local heritage and global connectivity."
],
  "11": [
    "Across the continent, the pressure to secure a spot at a top-tier university has reached a fever pitch. With hundreds of thousands of applicants for only a few thousand places, the entrance exams have become a source of immense stress for high school seniors.",
    "This 'ranking culture' is forcing students to specialize too early and focus solely on what will appear on the exam. Educators worry that this approach stifles creativity and critical thinking, skills that are essential in the modern world.",
    "\u2018We are becoming exam-passing machines,\u2019 says Lindiwe Dlamini, a student from Eswatini. \u2018I want to learn how to solve problems, not just how to memorize formulas that I\u2019ll forget the day after the test.\u2019",
    "There is a growing call for universities to adopt more holistic admissions processes that consider a student's extracurricular activities, leadership potential, and community service alongside their academic performance."
],
  "12": [
    "The grounds of the National Museum were transformed into a kaleidoscope of colors and sounds as students celebrated the Pan-African Cultural Festival. Each school represented a different ethnic group, showcasing the rich diversity of the continent's heritage.",
    "From the rhythmic beats of the djembe to the intricate patterns of Kente cloth, the festival was a feast for the senses. Students spent months researching their assigned cultures to ensure their performances were authentic and respectful.",
    "\u2018It\u2019s important for us to know where we come from so we can know where we are going,\u2019 said Kofi Mensah, a participant. \u2018Seeing so many different cultures celebrated in one place makes me proud to be African.\u2019",
    "The festival also included food stalls serving traditional dishes from across the continent, allowing students to taste the flavors of their neighbors. The event concluded with a grand parade that symbolized the unity of African youth."
],
  "13": [
    "In the arid regions of the Sahel, climate change is not a distant threat but a daily reality. A group of student journalists has taken it upon themselves to document how the encroaching desert is affecting their schools and families.",
    "Using their smartphones to record interviews and take photos, these 'Sahel Sentinels' are sharing stories of dried-up wells and failed harvests. Their reports are being published in local newspapers and shared on international platforms.",
    "\u2018We are the ones who will live with the consequences of climate change,\u2019 says A\u00efcha Kon\u00e9, a student reporter from Mali. \u2018Our stories need to be heard because they are stories of survival and resilience.\u2019",
    "Their work is highlighting the need for reforestation projects and sustainable water management. The students hope that their reporting will inspire world leaders to take more ambitious action to protect vulnerable communities."
],
  "14": [
    "For most students in Nairobi, the matatu is more than just a bus; it\u2019s a moving art gallery and a cultural icon. Known for their elaborate graffiti, high-tech sound systems, and flashy lights, matatus are a central part of the city\u2019s identity.",
    "In a new photo essay, student photographer Juma Bakari explores the craftsmanship behind these vehicles. He interviewed the artists who spend weeks painting intricate designs and the drivers who take pride in their 'rides.'",
    "\u2018There is so much creativity in the matatu industry that often goes unrecognized,\u2019 Juma says. \u2018Every matatu tells a story about the neighborhood it serves and the music the youth are listening to.\u2019",
    "While some criticize the matatu culture for being too loud or chaotic, Juma\u2019s work highlights it as a form of urban expression that reflects the dynamism and ingenuity of Nairobi\u2019s youth."
],
  "15": [
    "School uniforms have been a staple of African education for decades, intended to promote equality and discipline. However, a growing number of students are arguing that these policies are outdated and suppress their creativity.",
    "In an opinion piece that has sparked debate on campus, one student argues that uniforms don't actually hide social differences, as wealthier students still find ways to show off through their shoes and bags. They suggest a more flexible dress code instead.",
    "\u2018We are told to be creative and independent, but we are forced to look like everyone else for eight hours a day,\u2019 says Zinhle Mkhize. \u2018Letting us choose our clothes would be a small but significant step towards respecting our autonomy.\u2019",
    "Opponents of the change argue that uniforms provide a sense of belonging and reduce the pressure to keep up with expensive fashion trends. The debate continues to divide students, parents, and school administrators."
],
  "16": [
    "Mental health has long been a taboo subject in many African communities, but high school students are determined to change that. The 'Speak Up' initiative is a student-led campaign aimed at raising awareness about depression, anxiety, and stress.",
    "The group organizes weekly 'safe space' meetings where students can talk about their feelings without fear of judgment. They also provide resources and information on where to seek professional help.",
    "\u2018We realized that many of us were struggling in silence,\u2019 says Sarah Tembo, one of the founders. \u2018By talking about it, we are breaking the stigma and showing our peers that it\u2019s okay to not be okay.\u2019",
    "The initiative has received support from school counselors and parents, who are beginning to recognize the importance of emotional well-being for academic success. The group hopes to expand their program to other schools in the region."
],
  "17": [
    "While most school music programs focus on Western classical music or modern pop, a group of students is pushing for a revival of traditional African sounds. They want to see instruments like the kora, mbira, and balafon given the same respect as the piano or violin.",
    "The students have started their own ensemble, performing traditional songs from different regions of the continent. They are also working with local musicians to learn the techniques and history behind these instruments.",
    "\u2018Our traditional music is incredibly complex and beautiful, but we aren't taught it in school,\u2019 says Tunde Adeyemi. \u2018We want to preserve this heritage and share it with our peers.\u2019",
    "The initiative has led to the introduction of a new elective course on African music theory and performance. The students hope that this will inspire a new generation of musicians who are rooted in their own culture."
],
  "18": [
    "In the age of social media, being able to distinguish between fact and fiction is a crucial skill. A group of students has started a digital literacy program to help their peers navigate the complexities of the online world.",
    "The workshops cover topics like identifying deepfakes, checking sources, and understanding how algorithms shape what we see. They also discuss the importance of online privacy and the impact of cyberbullying.",
    "\u2018We spend so much time online, but we aren't always taught how to use it safely and responsibly,\u2019 says Amina Bello. \u2018We want to empower our peers to be critical consumers of information.\u2019",
    "The program has been so successful that the school is considering making it a mandatory part of the curriculum. The students are also developing an online guide that will be available to all students in the district."
],
  "19": [
    "The school grounds are covered in posters and the air is filled with campaign slogans as the race for Student Council President enters its final week. The candidates are debating everything from the quality of school meals to the introduction of new extracurricular activities.",
    "This year's election has seen record levels of engagement, with students organizing their own town hall meetings and social media campaigns. The issues at the heart of the race are a reflection of the challenges facing students today.",
    "\u2018I want to be a voice for those who feel unheard,\u2019 says one of the candidates. \u2018My goal is to make our school a more inclusive and supportive environment for everyone.\u2019",
    "The election will be held on Friday, and the results are expected to be close. Regardless of the outcome, the campaign has shown that students are passionate about their school and eager to participate in the democratic process."
],
  "20": [
    "The school auditorium was packed for the first-ever inter-school poetry slam, an event that showcased the incredible talent and raw emotion of young poets. The participants performed original works that touched on a wide range of themes.",
    "From powerful indictments of inequality to lyrical explorations of identity, the poems were a testament to the power of language. The audience was captivated by the performers' passion and the honesty of their words.",
    "\u2018Poetry gives me a way to process my thoughts and feelings,\u2019 says one of the participants. \u2018Being able to share my work with others and see their reaction is an incredibly powerful experience.\u2019",
    "The event has inspired a new wave of interest in creative writing and spoken word, with several schools starting their own poetry clubs. A regional championship is already being planned for next year."
],
  "21": [
    "The 'Young Entrepreneurs' club is more than just a school activity; it\u2019s a launchpad for the next generation of African business leaders. The members meet weekly to discuss business plans, marketing strategies, and financial management.",
    "Many of the students have already launched their own small businesses, ranging from handmade jewelry to mobile phone repair services. They are also learning about the importance of social entrepreneurship and how to build a business that benefits the community.",
    "\u2018We want to show that you don\u2019t have to wait until you graduate to start a business,\u2019 says one of the members. \u2018The skills we are learning here are things we can use for the rest of our lives.\u2019",
    "The club has partnered with local business leaders who provide mentorship and advice to the students. Several members have already secured funding for their ventures and are planning to expand their operations after graduation."
],
  "22": [
    "Africa is home to some of the world's most iconic wildlife, but many species are facing extinction due to poaching and habitat loss. The 'Wildlife Guardians' club is a student-led initiative dedicated to protecting these animals and their environments.",
    "The group organizes educational trips to national parks, where they learn about the challenges facing conservationists and the importance of biodiversity. They also run awareness campaigns in their school and local community.",
    "\u2018We have a responsibility to protect our natural heritage for future generations,\u2019 says one of the members. \u2018By educating ourselves and others, we can make a real difference in the fight to save our wildlife.\u2019",
    "The initiative has received praise from conservation organizations, who are heartened by the passion and commitment of the students. The group is now working on a project to plant trees and create wildlife habitats in their local area."
],
  "23": [
    "The basketball court is buzzing with activity as teams from across the region arrive for the annual championships. The tournament is a showcase for some of the best young talent in the game, with scouts from universities and professional teams in attendance.",
    "The competition is expected to be fierce, with several teams vying for the top spot. The players have been training for months, honing their skills and building their team spirit in preparation for the big event.",
    "\u2018We\u2019ve worked hard all season, and we\u2019re ready to give it our all,\u2019 says one of the team captains. \u2018This tournament is a great opportunity for us to show what we can do and represent our school.\u2019",
    "The championships will be held over the weekend, with the final game scheduled for Sunday afternoon. The event is a highlight of the school sports calendar and is sure to draw a large and enthusiastic crowd."
],
  "24": [
    "The quality of school meals is a hot topic among students, with many calling for a move away from processed and unhealthy options. The 'Healthy Eating' initiative is a student-led campaign aimed at improving the nutritional value of the food served in school canteens.",
    "The group has been working with the school's catering staff to introduce more fresh fruits, vegetables, and whole grains into the menu. They are also advocating for a wider variety of options to cater to different dietary needs and preferences.",
    "\u2018We want to show that healthy food can be delicious and affordable,\u2019 says one of the organizers. \u2018By improving the food we eat at school, we can improve our health and our ability to learn.\u2019",
    "The campaign has been well-received by students and staff, and the school has already begun to implement some of the suggested changes. The group is now planning to run cooking workshops to teach their peers how to prepare healthy meals at home."
],
  "25": [
    "The school's drama department is preparing for its most ambitious production yet: a performance of a classic African play. The students have been rehearsing for months, working on their acting, singing, and dancing to bring the story to life.",
    "The play explores themes of love, loss, and the challenges of modern life, and is sure to resonate with audiences of all ages. The students have also been involved in the production's design, creating the sets, costumes, and lighting.",
    "\u2018It\u2019s been a lot of work, but it\u2019s also been a lot of fun,\u2019 says one of the lead actors. \u2018We\u2019re all really excited to show our parents and friends what we\u2019ve been working on.\u2019",
    "The play will be performed over three nights next week, and tickets are already selling fast. The production is a testament to the talent and dedication of the school's drama students and is sure to be a highlight of the school year."
],
  "26": [
    "The history of our communities is often richer and more complex than what is found in our textbooks. The 'Heritage Explorers' club is a student-led initiative dedicated to uncovering and sharing these forgotten stories.",
    "The group has been conducting interviews with local elders, researching old documents, and visiting historical sites to learn more about their community's past. They are also working to create an online archive of their findings to share with their peers and the wider community.",
    "\u2018We want to show that history is not just about names and dates; it\u2019s about the people and events that shaped our lives,\u2019 says one of the members. \u2018By learning about our past, we can better understand our present and build a better future.\u2019",
    "The initiative has been praised by local historians and community leaders, who are heartened by the students' interest in their heritage. The group is now planning to create a museum exhibit to showcase their findings."
],
  "27": [
    "Technology has the power to transform lives, and high school students are leading the way. The 'Tech for Good' initiative is a student-led program aimed at developing digital solutions for local problems, from health and education to the environment.",
    "The students have been working on a range of projects, including an app that connects local farmers with markets and a platform that providing educational resources to students in remote areas. They are also learning about the importance of ethical technology and how to build a better digital world.",
    "\u2018We want to show that technology can be a force for good in our communities,\u2019 says one of the organizers. \u2018By using our skills to solve real-world problems, we can make a positive impact on the world around us.\u2019",
    "The initiative has received support from local tech companies, who are providing mentorship and advice to the students. Several of the projects have already been successfully piloted and are now being rolled out on a larger scale."
],
  "28": [
    "High school students are no longer content to wait for change; they are demanding it. From climate change and gender equality to education reform and political accountability, students are taking to the streets to make their voices heard.",
    "The 'Youth for Change' movement is a student-led initiative aimed at empowering young people to become active citizens and advocate for the issues they care about. The group organizes protests, rallies, and awareness campaigns to raise awareness about social and political issues.",
    "\u2018We are the future of our continent, and we have a right to be heard,\u2019 says one of the organizers. \u2018By standing up for what we believe in, we can make a real difference in the world.\u2019",
    "The movement has received support from a wide range of organizations, who are heartened by the passion and commitment of the students. The group is now planning to expand their activities and work with other student groups across the continent."
],
  "29": [
    "For many students, boarding school is a second home, a place where they build lifelong friendships and learn valuable life skills. But it can also be a challenging experience, with students having to adapt to a new environment and be away from their families.",
    "In this article, we explore the unique experiences of boarding school life, from the late-night study sessions and shared meals to the sense of community and belonging that it provides. We also hear from students about the challenges they face and how they overcome them.",
    "\u2018Boarding school has taught me so much about myself and others,\u2019 says one of the students. \u2018It\u2019s not always easy, but it\u2019s an experience I wouldn\u2019t trade for anything.\u2019",
    "The article highlights the importance of support systems in boarding schools, from dedicated staff and counselors to the strong bonds of friendship between students. It also explores the ways in which boarding schools are evolving to meet the needs of modern students."
],
  "30": [
    "The 'One Africa' youth summit was a historic event, bringing together students from every corner of the continent to discuss the challenges and opportunities facing African youth. The summit featured keynote speeches, workshops, and networking events aimed at fostering unity and collaboration.",
    "The students discussed a wide range of issues, from education and employment to climate change and political participation. They also worked together to develop a set of recommendations for African leaders on how to better support and empower young people.",
    "\u2018This summit has shown me that we have so much in common, regardless of where we come from,\u2019 says one of the participants. \u2018By working together, we can build a brighter future for ourselves and for our continent.\u2019",
    "The summit concluded with a grand celebration of African culture, featuring performances by students from across the continent. The event has inspired a new wave of pan-African collaboration among youth and is sure to be the first of many such gatherings."
],
};

export const articles: Article[] = [
  {
    id: "1", title: "Continental Clash: Nairobi and Lagos Schools Face Off in Virtual Debate Finals",
    excerpt: "Students from Alliance High School and King\u2019s College Lagos went head-to-head in a historic debate exploring the future of African economic integration.",
    body: bodyContent["1"], category: ["Debate"], author: "Amara Njoroge, Alliance High School", date: "March 12, 2026",
    image: storyDebate,
  },
  {
    id: "2", title: "The KCSE and WAEC Marathon: Students Balance Mental Health and High Stakes",
    excerpt: "As national examination seasons approach across East and West Africa, students are speaking out about the immense pressure and the need for better support systems.",
    body: bodyContent["2"], category: ["News"], author: "Kwesi Appiah, Achimota School", date: "May 20, 2026",
    image: heroClassroom,
  },
  {
    id: "3", title: "Robotics Revolution: Addis Ababa Students Build Solar-Powered Irrigation Drones",
    excerpt: "A group of young innovators at Bole Secondary School is proving that the future of African agriculture lies in the hands of its student engineers.",
    body: bodyContent["3"], category: ["Science"], author: "Selamawit Tadesse, Bole Secondary School", date: "April 15, 2026",
    image: storyRobotics,
  },
  {
    id: "4", title: "The School Fees Crisis: Is Education Still a Right for Every African Child?",
    excerpt: "Rising tuition costs and hidden levies are sparking a heated debate among students and parents about the accessibility of quality education.",
    body: bodyContent["4"], category: ["Opinion"], author: "Tendai Moyo, Peterhouse Boys", date: "February 10, 2026",
    image: IMG("school-fees-debate"),
  },
  {
    id: "5", title: "Revisiting the Giants: Why Achebe and wa Thiong'o Still Matter Today",
    excerpt: "A deep dive into how classic African literature continues to shape the identity and aspirations of the modern high school student.",
    body: bodyContent["5"], category: ["Essays"], author: "Chimamanda Okoro, Queen’s College Lagos", date: "June 05, 2026",
    image: IMG("african-literature"),
  },
  {
    id: "6", title: "The Battle of the Titans: Maseno vs St. Mary\u2019s Rugby Thriller",
    excerpt: "The biggest school sports rivalry in the region lived up to the hype as a last-minute try sealed a historic victory on the pitch.",
    body: bodyContent["6"], category: ["Sport"], author: "Otieno Omolo, Maseno School", date: "July 18, 2026",
    image: storyFootball,
  },
  {
    id: "7", title: "Smart Farming: How Our School Garden is Feeding the Community",
    excerpt: "A student-led agriculture project in rural Malawi is combining traditional techniques with modern technology to combat food insecurity.",
    body: bodyContent["7"], category: ["Science"], author: "Kondwani Banda, Chinsapo Secondary", date: "August 22, 2026",
    image: IMG("school-agriculture"),
  },
  {
    id: "8", title: "Coding the Future: Inside the Accra Student Hackathon",
    excerpt: "Over 200 students gathered in Accra for a 48-hour coding marathon to build apps that solve local community problems.",
    body: bodyContent["8"], category: ["Campus Life"], author: "Abena Mansa, Wesley Girls’ High School", date: "September 14, 2026",
    image: IMG("coding-hackathon"),
  },
  {
    id: "9", title: "Beyond the Classroom: Why Girls' Education is the Key to African Prosperity",
    excerpt: "An impassioned plea for increased investment in female education and the removal of cultural barriers that hold girls back.",
    body: bodyContent["9"], category: ["Opinion"], author: "Fatima Yusuf, Government Girls College", date: "January 25, 2026",
    image: IMG("girls-education"),
  },
  {
    id: "10", title: "The Language Dilemma: Should We Teach in Indigenous Tongues or English?",
    excerpt: "Students and educators weigh the benefits of learning in local languages against the global advantages of English and French.",
    body: bodyContent["10"], category: ["Debate"], author: "Moussa Diop, Lycée Louis Grand", date: "April 02, 2026",
    image: IMG("language-debate"),
  },
  {
    id: "11", title: "The University Entrance Race: Are We Studying for Life or for a Score?",
    excerpt: "The intense competition for limited university spots is driving students to prioritize grades over actual learning, raising concerns about the future workforce.",
    body: bodyContent["11"], category: ["News"], author: "Lindiwe Dlamini, Waterford Kamhlaba", date: "August 08, 2026",
    image: IMG("university-pressure"),
  },
  {
    id: "12", title: "Celebrating Heritage: The Annual Pan-African Cultural Festival",
    excerpt: "Schools from across the region gathered to showcase their traditions through dance, music, and fashion in a vibrant display of unity.",
    body: bodyContent["12"], category: ["Culture"], author: "Kofi Mensah, Presbyterian Boys' Secondary School", date: "February 28, 2026",
    image: storyCulture,
  },
  {
    id: "13", title: "Sahel Sentinels: Student Journalists Reporting on the Frontlines of Climate Change",
    excerpt: "Young reporters in the Sahel region are documenting the impact of desertification on their communities and calling for global action.",
    body: bodyContent["13"], category: ["News"], author: "Aïcha Koné, Lycée Askia Mohamed", date: "June 12, 2026",
    image: IMG("sahel-climate"),
  },
  {
    id: "14", title: "Matatu Magic: Exploring the Art and Culture of Nairobi\u2019s Commuter Hubs",
    excerpt: "A student photographer captures the vibrant energy and unique aesthetic of the city\u2019s famous public transport system.",
    body: bodyContent["14"], category: ["Culture"], author: "Juma Bakari, Starehe Boys' Centre", date: "July 05, 2026",
    image: IMG("matatu-culture"),
  },
  {
    id: "15", title: "The Uniform Debate: Is It Time to Let Students Choose Their Own Clothes?",
    excerpt: "Many students are questioning the relevance of strict uniform policies in a world that values individuality and self-expression.",
    body: bodyContent["15"], category: ["Opinion"], author: "Zinhle Mkhize, Northbury Park Secondary", date: "March 22, 2026",
    image: IMG("school-uniforms"),
  },
  {
    id: "16", title: "Breaking the Silence: Addressing Mental Health in Our High Schools",
    excerpt: "A new student-led initiative is working to destigmatize mental health issues and provide a safe space for those who are struggling.",
    body: bodyContent["16"], category: ["Campus Life"], author: "Sarah Tembo, Hillcrest National School", date: "May 10, 2026",
    image: IMG("mental-health"),
  },
  {
    id: "17", title: "The Rhythm of the Roots: Bringing Traditional Music Back to the Music Room",
    excerpt: "Students are advocating for a curriculum that includes more traditional African instruments and musical styles alongside classical training.",
    body: bodyContent["17"], category: ["Arts"], author: "Tunde Adeyemi, Igbobi College", date: "February 15, 2026",
    image: IMG("traditional-music"),
  },
  {
    id: "18", title: "Digital Literacy: Navigating the World of Fake News and Social Media",
    excerpt: "A student-run workshop is teaching peers how to verify information and protect themselves in an increasingly digital world.",
    body: bodyContent["18"], category: ["Science"], author: "Amina Bello, Atlantic Hall", date: "September 01, 2026",
    image: IMG("digital-literacy"),
  },
  {
    id: "19", title: "Democracy in Action: The Race for Student Council President",
    excerpt: "An inside look at the high-stakes campaigns and the issues that are driving student voters this year.",
    body: bodyContent["19"], category: ["News"], author: "Bolanle Cole, Vivian Fowler Memorial", date: "January 18, 2026",
    image: IMG("school-elections"),
  },
  {
    id: "20", title: "Voices Unleashed: The Rise of the High School Poetry Slam",
    excerpt: "Students are using the power of spoken word to express their thoughts on everything from social justice to the pangs of first love.",
    body: bodyContent["20"], category: ["Arts"], author: "Ludo Mbeki, Maru-a-Pula School", date: "August 30, 2026",
    image: IMG("poetry-slam"),
  },
  {
    id: "21", title: "Future CEOs: Inside the Student Entrepreneurship Club",
    excerpt: "A new generation of business leaders is emerging as students launch their own ventures, from sustainable fashion brands to tech startups.",
    body: bodyContent["21"], category: ["Campus Life"], author: "Chidi Okeke, Christ the King College", date: "April 28, 2026",
    image: IMG("student-entrepreneurship"),
  },
  {
    id: "22", title: "Guardians of the Wild: The Student Conservationists Protecting Our Heritage",
    excerpt: "A group of students is working to raise awareness about the importance of wildlife conservation and the threats facing Africa\u2019s biodiversity.",
    body: bodyContent["22"], category: ["Science"], author: "Nneka Obi, Grange School", date: "May 15, 2026",
    image: IMG("wildlife-conservation"),
  },
  {
    id: "23", title: "Hoops and Dreams: The Final Countdown to the Basketball Championships",
    excerpt: "The excitement is building as the region\u2019s top high school basketball teams prepare to face off in the annual tournament.",
    body: bodyContent["23"], category: ["Sport"], author: "Kofi Boakye, Mfantsipim School", date: "September 10, 2026",
    image: IMG("basketball-finals"),
  },
  {
    id: "24", title: "Food for Thought: Rethinking Nutrition in Our School Canteens",
    excerpt: "A student-led campaign is calling for healthier and more varied food options in school canteens to support student health and well-being.",
    body: bodyContent["24"], category: ["Campus Life"], author: "Lerato Moloi, St. Mary's School, Waverley", date: "August 12, 2026",
    image: IMG("school-canteen"),
  },
  {
    id: "25", title: "Drama on Stage: The Annual School Play Takes the Spotlight",
    excerpt: "Students are putting the finishing touches on their production of a classic African play, promising a night of entertainment and reflection.",
    body: bodyContent["25"], category: ["Arts"], author: "Zanele Zulu, Roedean School (SA)", date: "June 25, 2026",
    image: IMG("school-theatre"),
  },
  {
    id: "26", title: "Uncovering the Past: The History Club\u2019s Journey Through Our Heritage",
    excerpt: "A student-led exploration of local history is revealing forgotten stories and helping students connect with their past.",
    body: bodyContent["26"], category: ["Essays"], author: "Elias Mulugeta, St. Joseph's School", date: "March 15, 2026",
    image: IMG("history-club"),
  },
  {
    id: "27", title: "Tech for Good: Student Innovators Developing Solutions for Local Problems",
    excerpt: "A new generation of tech-savvy students is using their skills to solve some of the most pressing challenges facing their communities.",
    body: bodyContent["27"], category: ["Science"], author: "Ifeoma Adebayo, Loyola Jesuit College", date: "July 30, 2026",
    image: IMG("tech-innovation"),
  },
  {
    id: "28", title: "The Power of Protest: Students Standing Up for What They Believe In",
    excerpt: "A growing number of students are taking to the streets to advocate for social and political change, raising their voices against injustice and inequality.",
    body: bodyContent["28"], category: ["Opinion"], author: "Kabo Molosi, Gaborone Secondary School", date: "February 20, 2026",
    image: IMG("student-activism"),
  },
  {
    id: "29", title: "Home Away from Home: The Joys and Challenges of Boarding School Life",
    excerpt: "An inside look at the unique experiences of students who live at school, from the bonds of friendship to the challenges of being away from home.",
    body: bodyContent["29"], category: ["Campus Life"], author: "Yusuf Kamara, Prince of Wales School", date: "September 05, 2026",
    image: IMG("boarding-school"),
  },
  {
    id: "30", title: "Connecting the Continent: The First Pan-African Youth Summit",
    excerpt: "Over 500 students from across Africa gathered in Kigali for a summit aimed at fostering unity and collaboration among the continent's youth.",
    body: bodyContent["30"], category: ["News"], author: "Fiona Mutoni, Green Hills Academy", date: "July 12, 2026",
    image: IMG("pan-african-summit"),
  },
];

export const getArticlesByCategory = (cat: string) =>
  articles.filter((a) => a.category.some((c) => c.toLowerCase() === cat.toLowerCase()));

export const getArticleById = (id: string) => articles.find((a) => a.id === id);
