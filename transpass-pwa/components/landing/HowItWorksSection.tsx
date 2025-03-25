import React from "react";
import Image from "next/image";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "STEP 1",
      title: "Scan the QR code on the garment label",
      icon: "/scan-icon.svg",
    },
    {
      step: "STEP 2",
      title: "View all product details and story",
      icon: "/grid-icon.svg",
    },
    {
      step: "STEP 3",
      title: "Have your profile with your scanned garments",
      icon: "/tshirt-icon.svg",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl sm:text-5xl md:text-4xl font-bold text-center text-background-dark mb-20">
          How it works
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center relative mb-10">
          {steps.map((item, index) => (
            <React.Fragment key={index}>
              <div className="w-full md:w-1/3 px-4 mb-12 md:mb-0 flex flex-col items-center relative z-10">
                <div className="">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-sm font-semibold text-primary-lightBlue mt-4 mb-3">
                  {item.step}
                </h3>
                <p className="text-center text-background-dark font-medium text-base max-w-[200px]">
                  {item.title}
                </p>
              </div>

              {/* Horizontal line between steps (not after the last step) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block w-1/6 h-1 bg-primary-lightBlue absolute rounded-full"
                  style={{
                    left: `${(index + 1) * 33 - 5}%`,
                    top: "80px",
                    width: "10%",
                  }}
                ></div>
              )}
            </React.Fragment>
          ))}

          {/* Horizontal line for mobile view */}
          <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 z-0"></div>
        </div>
      </div>
    </section>
  );
};
