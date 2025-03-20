import React from "react";
import FeaturePill from "./FeaturePill";

const FeaturePills: React.FC = () => {
  const features = [
    "Track product's lifecycle",
    "Collect ESG data",
    "Easy and accessible",
    "Sustainable",
  ];

  return (
    <aside className="self-stretch my-auto text-2xl text-center text-gray-600 min-w-60 w-[322px]">
      {features.map((feature, index) => (
        <FeaturePill
          key={index}
          text={feature}
          className={index > 0 ? "mt-3.5" : ""}
        />
      ))}
    </aside>
  );
};

export default FeaturePills;