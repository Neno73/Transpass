import React from "react";
import NavItem from "./NavItem";

const Header = () => {
  const navItems = [
    { label: "How it works", hasDropdown: true },
    { label: "Our solutions", hasDropdown: true },
    { label: "Why should you use Transpass", hasDropdown: true },
    { label: "Contact", hasDropdown: true },
  ];

  return (
    <header className="flex z-0 flex-wrap items-start w-full text-lg text-indigo-200 max-md:max-w-full">
      {/* Logo */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8feebd2bc180065abb370169b6e24bb9d7441c28b5b0519cfeb05beff948278?placeholderIfAbsent=true&apiKey=fcd905b1f3504ca5a0609931dddb1d64"
        alt="Transpass Logo"
        className="object-contain shrink-0 aspect-[5.85] min-w-60 w-[439px]"
      />

      {/* Navigation menu */}
      <nav className="flex flex-wrap items-center p-5 min-w-60 max-md:max-w-full">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            label={item.label}
            hasDropdown={item.hasDropdown}
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;