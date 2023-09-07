import Features from "../Components/Features";
import Hero from "../Components/Hero";
import FAQ from "../Components/FAQ";
import Footer from "../Components/Footer";
import LandDash from "../Components/LandDash";
import Testimonials from "../Components/Testimonials";
import GetStarted from "../Components/GetStarted";
const Landing = () => {
  return (
    <>
      <Hero />
      <LandDash />
      <Features />
      <GetStarted />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
};
export default Landing;
