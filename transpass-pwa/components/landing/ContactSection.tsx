import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from '@headlessui/react'
import bg from '../../public/Vector.svg'

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
    const [agreed, setAgreed] = useState(false)
 // State to track if the form is submitted
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    companyName: "",
  });
  // const contactMethods = [
  //   {
  //     title: "Call us",
  //     details: "+12 34 56 78 90",
  //     icon: "/phone-icon.svg",
  //   },
  //   {
  //     title: "Address",
  //     details: "Lorem ipsum see on the map",
  //     icon: "/location-icon.svg",
  //   },
  //   {
  //     title: "Email",
  //     details: "contact@transpass.com",
  //     icon: "/email-icon.svg",
  //   },
  // ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sendFormMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          lastName: "",
          email: "",
          companyName: "",
        });
      } else {
        setError("Failed to send email. Please try again");
      }
    } catch (error) {
      setError("An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
    }
  }, [submitted]);
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg}
          width={400}
          height={400}
          alt="Background Pattern"
          className="object-cover opacity-5"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-2xl sm:text-2xl md:text-[36px] font-bold text-center text-background-dark mb-10">
          Contact
        </h2>

        <div className="flex  justify-center mx-auto">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <div className="mr-6">
                  <Image
                    src={method.icon}
                    alt={method.title}
                    width={70}
                    height={70}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-1">
                    {method.title}
                  </h3>
                  <p className="text-background-dark opacity-50">
                    {method.details}
                  </p>
                </div>
              </div>
            ))}
          </div> */}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[470px] bg-white p-16 shadow-xl rounded-2xl"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-base font-normal text-[#1A1A1A] leading-5 pb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block pl-3 w-full rounded-lg border-[#dddddd] py-[14px] border-2 shadow-sm !focus:border-[#309BAB] focus:border-1 focus:ring-2 !focus:ring-[#309BAB] !caret-[#309BAB] text-[#1A1A1A] sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-base font-normal text-[#1A1A1A] leading-5 pb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block pl-3 w-full rounded-lg border-[#dddddd] py-[14px] border-2 shadow-sm !focus:border-[#309BAB] focus:border-1 focus:ring-2 !focus:ring-[#309BAB] !caret-[#309BAB] text-[#1A1A1A] sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-base font-normal text-[#1A1A1A] leading-5 pb-2"
              >
            E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block pl-3 w-full rounded-lg border-[#dddddd] py-[14px] border-2 shadow-sm !focus:border-[#309BAB] focus:border-1 focus:ring-2 !focus:ring-[#309BAB] !caret-[#309BAB] text-[#1A1A1A] sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-base font-normal text-[#1A1A1A] leading-5 pb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-1 block pl-3 w-full rounded-lg border-[#dddddd] py-[14px] border-2 shadow-sm !focus:border-[#309BAB] focus:border-1 focus:ring-2 !focus:ring-[#309BAB] !caret-[#309BAB] text-[#1A1A1A] sm:text-sm"
              />
            </div>

            <div className="flex flex-row">
  <Switch
      checked={agreed}
      onChange={setAgreed}
      className={`${agreed ? 'bg-[#B4C7F2]' : 'bg-gray-300'}
        relative inline-flex h-6 w-16 items-center rounded-full transition`}
    >
      <span
        className={`${
          agreed ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
    <span className=" text-[10px] pl-4 pb-2 ">By submitting this form you agree to receive marketing communications from Transpass</span>
           
           </div>
            <div className="text-right my-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full max-w-[330px] justify-center py-3  px-20 border border-transparent shadow-sm text-sm font-medium rounded-[30px] text-center text-white bg-[#30429E] hover:bg-[#30429E] focus:outline-none"
              >
                {loading ? "Sending..." : "Request a demo"}
              </button>
            </div>

            {submitted && (
              <p className="text-[#30429E] text-center mt-4">
                Your message has been sent successfully!
              </p>
            )}

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          
          </form>
        </div>
      </div>
    </section>
  );
};
