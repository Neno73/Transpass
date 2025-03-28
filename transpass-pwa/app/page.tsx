"use client";

import { LandingPage } from "../components/landing/LandingPage";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    if (user.isCompany) {
      router.push("/company/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  }

  return <LandingPage />;
}
