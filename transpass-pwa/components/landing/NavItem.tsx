import React from "react";

interface NavItemProps {
  label: string;
  hasDropdown?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, hasDropdown = false }) => {
  return (
    <div className="flex gap-5 items-end self-stretch py-2 pr-2 pl-2 my-auto min-w-fit">
      <span>{label}</span>
      {hasDropdown && <div className="flex shrink-0 h-[22px] w-[22px]" />}
    </div>
  );
};

export default NavItem;