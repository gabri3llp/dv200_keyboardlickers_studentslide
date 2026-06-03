import Navbar from "../Component/navbar";
import Footer from "../Component/footer";
import meImg from '../assets/Me.jpeg';
import larImg from '../assets/lar.jpeg';
import gedionImg from '../assets/Gedion.jpeg';
import nkaniImg from '../assets/Nkani.jpeg';
import "../App.css";

const teamMembers = [
  {
    name: "Gabriel",
    role: "Developer",
    about: "Hey, I'm Gabriel. I'm passionate about design, music, and MMA. Whether I'm creating digital experiences, discovering new music, or training and following combat sports, I'm always drawn to things that blend creativity, skill, and dedication. I love building projects that look great, feel intuitive, and leave a lasting impression.",
    initials: "G",
    image: meImg,
    accentColor: "#a78bfa",
    gradientStart: "#c084fc",
    gradientEnd: "#7c3aed",
    bgTint: "#1e1728",
  },
  {
    name: "Larissa",
    role: "Developer",
    about: "Hi there! I'm Larissa, a co-creator of this website and someone who loves turning ideas into reality. This project began as a shared vision to create something engaging, informative, and valuable for our audience. Through creativity, collaboration, and plenty of problem-solving, I helped shape the site into what it is today. When I'm not working on projects like this, you can usually find me doing cheerleading.",
    initials: "L",
    image: larImg,
    accentColor: "#ec4899",
    gradientStart: "#f9a8d4",
    gradientEnd: "#db2777",
    bgTint: "#1f1320",
  },
  {
    name: "Gideon",
    role: "Developer",
    about: "Your about meGedeon Kazadi is a developer, designer, and aspiring cloud engineer passionate about building practical digital solutions. With experience in front-end development, UI/UX design, embedded systems, and growing backend skills, he enjoys creating systems that support meaningful user experiences. On the Student Slide project, he contributed to full-stack integration, listing CRUD functionality, role-based admin access, database-connected marketplace features, and merge planning.",
    initials: "G",
    image: gedionImg,
    accentColor: "#34d399",
    gradientStart: "#6ee7b7",
    gradientEnd: "#059669",
    bgTint: "#0f1f1a",
  },
  {
    name: "Nkanyiso",
    role: "Developer",
    about: "Hi, I'm Nkanyiso Nkosi — an Interactive Development student and co-creator of StudentSlide. I've always been drawn to the intersection of technology and everyday life, and this project gave me the opportunity to build something that sits right at that crossroads. StudentSlide is more than just a student marketplace — it's a platform designed to make life a little easier and a little more affordable for students who are navigating the very real financial pressures that come with studying.",
    initials: "N",
    image: nkaniImg,
    accentColor: "#fbbf24",
    gradientStart: "#fcd34d",
    gradientEnd: "#d97706",
    bgTint: "#1f1a0d",
  },
];

export default function AboutUs() {
  return (
    <div className="aboutPage">
      <Navbar />

      {/* Hero */}
      <section className="aboutHero">
        <p className="aboutEyebrow">WHO WE ARE</p>
        <h1 className="aboutHeroHeading">
          Built by students,<br />
          <span className="aboutHeroAccent">for students.</span>
        </h1>
        <p className="aboutHeroSubtext">
          StudentSlide was created to make campus life easier — a place where
          students can buy, sell, and trade everything from textbooks to bicycles.
        </p>
        <a href="/marketplace" className="aboutButton">
          Explore Marketplace
        </a>
      </section>

      {/* About StudentSlide */}
      <section className="aboutSection">
        <div className="aboutCard">
          <div className="aboutCardLeft">
            <p className="aboutCardEyebrow">THE PLATFORM</p>
            <h2 className="aboutCardHeading">What is StudentSlide?</h2>
          </div>
          <div className="aboutCardRight">
            <p className="aboutCardText">
              StudentSlide is a student-to-student marketplace designed to make
              campus life more affordable and connected. Whether you need a
              second-hand textbook, want to sell your old laptop, or trade your
              bicycle — StudentSlide is your campus hub.
            </p>
            <p className="aboutCardText">
              With built-in messaging, category filtering, and a trusted
              community of verified students, we make peer-to-peer trading
              simple, safe, and social.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="aboutTeamSection">
        <p className="aboutEyebrow">THE TEAM</p>
        <h2 className="aboutTeamHeading">Meet the people behind it</h2>

        <div className="aboutTeamGrid">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="aboutTeamCard"
              style={{ borderTopColor: member.accentColor }}
            >
              {/* Photo area */}
              <div
                className="aboutTeamPhotoWrap"
                style={{ background: member.bgTint }}
              >
                <div className="aboutTeamAvatar" style={{
                   background: member.image ? 'none' : `radial-gradient(circle at 40% 40%, ${member.gradientStart}, ${member.gradientEnd})`,
                }}>
                  {member.image
                    ? <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : member.initials
                  }
              </div>
              </div>

              {/* Info */}
              <div className="aboutTeamInfo">
                <h3
                  className="aboutTeamName"
                  style={{ color: "#fbbf24" }}
                >
                  {member.name}
                </h3>
                <p className="aboutTeamRole">{member.role}</p>
                <p className="aboutTeamAbout">{member.about}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}