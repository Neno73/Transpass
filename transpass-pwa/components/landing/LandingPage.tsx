import React from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { SolutionsSection } from "./SolutionsSection";
import { WhyUseSection } from "./WhyUseSection";
import { ContactSection } from "./ContactSection";
import { FooterSection } from "./FooterSection";
export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <SolutionsSection />
      <WhyUseSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};
