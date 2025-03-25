import React from "react";
import Image from "next/image";

export const WhyUseSection = () => {
  const benefits = [
    {
      title: "EU Regulations",
      description:
        "The DPP (Digital Product Passport) will soon become mandatory for the textile industry. Brands need it to ensure transparency, enhance sustainability, and comply with EU regulations.",
      icon: "/eu-icon.svg",
    },
    {
      title: "Sustainability",
      description:
        "Gain more insight into your ecological footprint with each product you buy so that you can make environmental improvements",
      icon: "/sustainability-icon.svg",
    },
    {
      title: "Digital records",
      description:
        "Transpass provides a digital record of a product's lifecycle, including materials, production processes, and recycling information",
      icon: "/cloud-icon.svg",
    },
  ];

  return (
    <section id="why-use-transpass" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl md:text-4xl font-bold text-background-dark text-center mb-20 mt-10">
          Why should you use Transpass?
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="w-full md:w-1/3 px-6 mb-12 md:mb-0">
              <div className="flex justify-center mb-6">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="text-3xl font-bold text-accent-blue text-center mb-4">
                {benefit.title}
              </h3>
              <p className=" text-background-dark opacity-50 text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
