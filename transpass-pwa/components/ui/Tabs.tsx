import React, { useState } from 'react';

interface TabProps {
  label: string;
  value: string;
  active?: boolean;
  onClick?: (value: string) => void;
  className?: string;
}

export function Tab({
  label,
  value,
  active = false,
  onClick,
  className = ''
}: TabProps) {
  const baseStyles = "h-12 px-4 text-gray-500 cursor-pointer transition-colors";
  const activeStyles = active ? "border-b-2 border-primary text-primary" : "";
  
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };
  
  return (
    <div 
      className={`${baseStyles} ${activeStyles} ${className}`}
      onClick={handleClick}
    >
      <div className="h-full flex items-center justify-center">
        {label}
      </div>
    </div>
  );
}

interface TabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className = ''
}: TabsProps) {
  return (
    <div className={`flex ${className}`}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          active={tab.value === value}
          onClick={onChange}
        />
      ))}
    </div>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  tabValue: string;
  className?: string;
}

export function TabPanel({
  children,
  value,
  tabValue,
  className = ''
}: TabPanelProps) {
  if (value !== tabValue) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface TabsWithContentProps {
  tabs: Array<{
    label: string;
    value: string;
    content: React.ReactNode;
  }>;
  defaultValue?: string;
  className?: string;
  tabsClassName?: string;
  panelClassName?: string;
}

export function TabsWithContent({
  tabs,
  defaultValue,
  className = '',
  tabsClassName = '',
  panelClassName = ''
}: TabsWithContentProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || '');
  
  return (
    <div className={className}>
      <Tabs
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
        className={tabsClassName}
      />
      
      {tabs.map((tab) => (
        <TabPanel
          key={tab.value}
          value={activeTab}
          tabValue={tab.value}
          className={panelClassName}
        >
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
}