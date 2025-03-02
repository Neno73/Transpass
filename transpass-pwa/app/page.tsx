import { LandingPage } from "../components/landing/LandingPage";

export default function Home() {
  // Added version marker to verify deployment
  console.log("TransPass Home Page - Deployment Version v1");
  return <LandingPage />;
}
