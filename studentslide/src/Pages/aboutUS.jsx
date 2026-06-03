import Navbar from '../Component/navbar';
import Footer from '../Component/footer';

const AboutUs = ({ user, onLogout }) => {
  return (
    <div className="about-page">
      <Navbar isLoggedIn={Boolean(user)} user={user} onLogout={onLogout} />

      <main>
        <section className="about-hero">
          <div className="about-hero__copy">
            <p className="about-kicker">StudentSlide</p>
            <h1>Pass useful things on, keep student life moving.</h1>
            <p>
              StudentSlide is a campus marketplace for students to sell, discover, and request
              everyday items from one another, from textbooks and electronics to dorm essentials.
            </p>
          </div>
          <div className="about-hero__panel">
            <span>Moderated listings</span>
            <strong>Pending to live</strong>
            <p>Products are reviewed before they appear publicly on the marketplace.</p>
          </div>
        </section>

        <section className="about-section">
          <div>
            <p className="about-kicker">Why it exists</p>
            <h2>Built around student trust</h2>
          </div>
          <p>
            The app keeps the buying flow simple while giving admins and moderators a way to
            approve listings, reduce clutter, and make the marketplace safer for class demos.
          </p>
        </section>

        <section className="about-values">
          <article>
            <span>01</span>
            <h3>List</h3>
            <p>Sellers add products with title, category, price, description, and image.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Review</h3>
            <p>Admins or moderators approve pending posts before buyers can see them.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Trade</h3>
            <p>Buyers browse live listings, save products, comment, and add items to cart.</p>
          </article>
        </section>

        <section className="about-section about-team">
          <div>
            <p className="about-kicker">Keyboard Lickers</p>
            <h2>Group project contribution</h2>
          </div>
          <p>
            The current build focuses on a MERN workflow: authentication, role-based access,
            listing CRUD, marketplace display, product details, and a frontend cart path.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
