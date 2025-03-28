"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { updateCompanyProfile, updateUserProfile } from "../../../lib/auth";
import { BottomNav } from "../../../components/ui/Navigation";
import { ArrowLeft, Check, X } from "lucide-react";

// Available certification options
const CERTIFICATION_OPTIONS = [
  "Small Business",
  "Slow Fashion",
  "Craftsmanship",
  "Organic",
  "Vegan",
  "Fair Trade",
  "Sustainable",
  "Eco-Friendly",
  "Handmade",
  "Local Production",
  "Recycled Materials",
  "Carbon Neutral",
  "B Corp Certified",
  "Women-Owned",
  "Minority-Owned",
];

export default function CompanyProfile() {
  const { user, userData, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    displayName: "",
    email: "",
    website: "",
    description: "",
    phone: "",
    address: "",
    certifications: [] as string[],
    image: "",
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (userData) {
      setFormData({
        companyName: userData.companyName || "",
        displayName: userData.displayName || "",
        email: userData.email || "",
        website: userData.website || "",
        description: userData.description || "",
        phone: userData.phone || "",
        address: userData.address || "",
        certifications: userData.certifications || [],
        image: userData.image || "",
      });
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificationToggle = (certification: string) => {
    setFormData((prev) => {
      const certifications = [...prev.certifications];
      if (certifications.includes(certification)) {
        return {
          ...prev,
          certifications: certifications.filter((c) => c !== certification),
        };
      } else {
        return {
          ...prev,
          certifications: [...certifications, certification],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user, {
        companyName: formData.companyName,
        displayName: formData.displayName,
        website: formData.website,
        description: formData.description,
        phone: formData.phone,
        address: formData.address,
      });

      await updateCompanyProfile(user, {
        companyName: formData.companyName,
        displayName: formData.displayName,
        website: formData.website,
        description: formData.description,
        phone: formData.phone,
        image: formData.image || "",
        address: formData.address,
        certifications: formData.certifications || [],
      });

      // Refresh user data to reflect changes
      await refreshUserData();
      setFormSubmitted(true);

      // Reset form submission status after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-primary-lightest pb-20 mx-auto max-w-2xl">
        {/* Header */}
        <header>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center justify-center">
              <div className="bg-white p-4 px-6 rounded-full mr-4">
                <h1 className="text-background-dark font-medium truncate">
                  Company Profile
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-4xl mx-auto w-full">
          {/* Success message */}
          {formSubmitted && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Check size={18} className="text-green-600" />
              </div>
              <p className="text-green-800 font-medium">
                Profile updated successfully
              </p>
            </div>
          )}

          {/* Profile form */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="p-6 flex items-center border-b border-gray-100">
              <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mr-4">
                <span className="text-primary text-2xl font-bold">
                  {userData?.companyName?.charAt(0) || "C"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-dark">
                  {userData?.companyName || "Your Company"}
                </h2>
                <p className="text-gray text-sm mt-1">
                  {userData?.email || "company@example.com"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray focus:outline-none"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Company Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Describe your company, products, and services"
                  ></textarea>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Certifications & Values
                  </label>

                  {/* Selected certifications */}
                  {formData.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.certifications.map((cert) => (
                        <div
                          key={cert}
                          className="bg-primary text-white rounded-full px-3 py-1 text-sm flex items-center"
                        >
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleCertificationToggle(cert)}
                            className="ml-1.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            <X size={12} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certification options */}
                  <div className="flex flex-wrap gap-2">
                    {CERTIFICATION_OPTIONS.filter(
                      (cert) => !formData.certifications.includes(cert)
                    ).map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => handleCertificationToggle(cert)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm transition-colors"
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray">
                    Click to add or remove certifications and values that apply
                    to your company
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
