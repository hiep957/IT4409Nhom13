import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      {children} {/* Render children here */}
      <Footer />
    </div>
  );
};

export default Layout;

