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
    about: "Your about me",
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
    about: "Your about me",
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
    about: "Your about me",
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
    about: "Your about me",
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