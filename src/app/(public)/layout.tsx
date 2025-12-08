// import './globals.css'; // Import global styles


const Navbar = () => <nav className="navbar-placeholder">Navbar Component</nav>;
const Footer = () => <footer className="footer-placeholder">Footer Component</footer>;
const ChatWidget = () => <div className="chat-placeholder">Chat Widget</div>;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <ChatWidget />
      <Footer />
    </>
  );
}
