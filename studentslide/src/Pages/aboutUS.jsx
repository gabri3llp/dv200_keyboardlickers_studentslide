import { Link } from "react-router-dom";
import Navbar from "../Component/navbar";
import Footer from "../Component/footer";
import meImg from '../assets/Me.jpeg';
import larImg from '../assets/lar.jpeg';
import gedionImg from '../assets/Gedion.jpeg';
import nkaniImg from '../assets/Nkani.jpeg';

// Accent colours come from the shared palette (purple / teal / cream / lavender)
const teamMembers = [
  {
    name: "Gabriel",
    role: "Developer",
    about: "Backend and database contributor supporting the core StudentSlide data flow.",
    image: meImg,
    accent: "#7c5cbf",
  },
  {
    name: "Larissa",
    role: "Developer",
    about: "Authentication and user-flow contributor focused on the creative login experience.",
    image: larImg,
    accent: "#4ecdc4",
  },
  {
    name: "Gedeon",
    role: "Developer",
    about: "Full-stack integration contributor for listings, admin moderation, marketplace, and merge planning.",
    image: gedionImg,
    accent: "#f5deb3",
  },
  {
    name: "Nkanyiso",
    role: "Developer",
    about: "Marketplace and cart contributor helping shape the buyer-side experience.",
    image: nkaniImg,
    accent: "#a78bfa",
  },
];

export default function AboutUs({ user, onLogout }) {
  return (
    <div className="ss-page">
      <Navbar isLoggedIn={Boolean(user)} user={user} onLogout={onLogout} />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section className="ss-hero">
          <p className="ss-eyebrow">Who we are</p>
          <h1>
            Built by students,<br />
            <span className="ss-gradient-text">for students.</span>
          </h1>
          <p className="lead">
            StudentSlide was created to make campus life easier - a place where
            students can buy, sell, and trade everything from textbooks to bicycles.
          </p>
          <Link to="/marketplace" className="ss-btn ss-btn--primary">
            Explore Marketplace
          </Link>
        </section>

        {/* About StudentSlide */}
        <section className="ss-section">
          <div className="ss-card ss-split">
            <div className="ss-split-left">
              <p className="ss-eyebrow">The platform</p>
              <h2>What is StudentSlide?</h2>
            </div>
            <div className="ss-split-right">
              <p>
                StudentSlide is a student-to-student marketplace designed to make
                campus life more affordable and connected. Whether you need a
                second-hand textbook, want to sell your old laptop, or trade your
                bicycle - StudentSlide is your campus hub.
              </p>
              <p>
                With built-in messaging, category filtering, and a trusted
                community of verified students, we make peer-to-peer trading
                simple, safe, and social.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="ss-team">
          <p className="ss-eyebrow">The team</p>
          <h2>Meet the people behind it</h2>

          <div className="ss-team-grid">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="ss-card ss-card--hover ss-member"
                style={{ "--member": member.accent }}
              >
                <div className="ss-member-photo">
                  <div className="ss-member-avatar">
                    <img src={member.image} alt={member.name} />
                  </div>
                </div>
                <div className="ss-member-info">
                  <h3>{member.name}</h3>
                  <p className="ss-member-role">{member.role}</p>
                  <p className="ss-member-about">{member.about}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
