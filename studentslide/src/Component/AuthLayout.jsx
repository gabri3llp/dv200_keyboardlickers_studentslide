import logo from "../assets/StudentSlide_Logo_Full.png";

// Shared shell for every sign in / sign up screen: logo + glass card.
export default function AuthLayout({ title = "Student Slide", subtitle = "Welcome to", children }) {
  return (
    <div className="ss-page ss-auth">
      <img src={logo} alt="Student Slide" className="ss-auth-logo" />

      <div className="ss-card ss-auth-card">
        <div className="ss-auth-head">
          <p>{subtitle}</p>
          <h1>
            {title}
            <span>!</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
