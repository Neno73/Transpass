import React from "react";
import Image from "next/image";

export const ContactSection = () => {
  const contactMethods = [
    {
      title: "Call us",
      details: "+12 34 56 78 90",
      icon: "/phone-icon.svg",
    },
    {
      title: "Address",
      details: "Lorem ipsum see on the map",
      icon: "/location-icon.svg",
    },
    {
      title: "Email",
      details: "contact@transpass.com",
      icon: "/email-icon.svg",
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-lightest to-transparent opacity-30"></div>
        <Image
          src="/background-logo.svg"
          alt="Background Pattern"
          fill
          className="object-cover opacity-5"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-2xl sm:text-5xl md:text-5xl font-bold text-center text-background-dark mb-10">
          Contact
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
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
          </div>
        </div>
      </div>
    </section>
  );
};
