'use client';

import React, { useState } from 'react';
import { 
  PrimaryButton, 
  SecondaryButton, 
  IconButton,
  Card,
  FormField,
  Input,
  Textarea,
  SelectionPillGroup,
  ProgressIndicator,
  Accordion,
  AccordionGroup
} from '@/components/ui';

export default function DesignSystemPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  
  return (
    <div className="max-w-[414px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">TransPass Design System</h1>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Form Components</h2>
        
        <div className="space-y-6">
          <FormField label="Product Name" htmlFor="name" required>
            <Input 
              id="name" 
              placeholder="Enter product name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          
          <FormField label="Description" htmlFor="description">
            <Textarea 
              id="description" 
              placeholder="Enter product description" 
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          
          <FormField 
            label="Email" 
            htmlFor="email" 
            error="Please enter a valid email address"
          >
            <Input 
              id="email" 
              type="email" 
              placeholder="example@example.com" 
              error="Please enter a valid email address"
            />
          </FormField>
          
          <SelectionPillGroup
            label="Category"
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'furniture', label: 'Furniture' }
            ]}
            selectedOptions={selectedCategory}
            onChange={setSelectedCategory}
            multiSelect={false}
          />
          
          <SelectionPillGroup
            label="Materials"
            required
            options={[
              { value: 'plastic', label: 'Plastic' },
              { value: 'metal', label: 'Metal' },
              { value: 'wood', label: 'Wood' },
              { value: 'glass', label: 'Glass' },
              { value: 'fabric', label: 'Fabric' }
            ]}
            selectedOptions={selectedMaterials}
            onChange={setSelectedMaterials}
            multiSelect={true}
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Button Components</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Primary Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton 
              label="Primary" 
              onClick={() => alert('Primary button clicked')} 
            />
            <PrimaryButton 
              label="Disabled" 
              disabled
              onClick={() => {}} 
            />
            <PrimaryButton 
              label="With Icon" 
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              onClick={() => alert('Icon button clicked')} 
            />
          </div>
          
          <h3 className="text-lg font-semibold mt-4">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton 
              label="Outline" 
              onClick={() => alert('Outline button clicked')} 
            />
            <SecondaryButton 
              label="Text" 
              variant="text"
              onClick={() => alert('Text button clicked')} 
            />
            <SecondaryButton 
              label="Disabled" 
              disabled
              onClick={() => {}} 
            />
          </div>
          
          <h3 className="text-lg font-semibold mt-4">Icon Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <IconButton 
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 20H20M4 4H20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              ariaLabel="Menu"
              onClick={() => alert('Default icon button clicked')} 
            />
            <IconButton 
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              ariaLabel="Add"
              variant="primary"
              onClick={() => alert('Primary icon button clicked')} 
            />
            <IconButton 
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              ariaLabel="Close"
              variant="transparent"
              onClick={() => alert('Transparent icon button clicked')} 
            />
          </div>
          
          <div className="mt-4">
            <PrimaryButton 
              label="Full Width Button" 
              fullWidth
              onClick={() => alert('Full width button clicked')} 
            />
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Progress Indicator</h2>
        
        <ProgressIndicator 
          currentStep={2} 
          totalSteps={4} 
        />
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Card and Accordion</h2>
        
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Card Title</h3>
            <p className="text-gray-700">This is a basic card component used to display content in a contained format.</p>
          </Card>
          
          <Accordion title="Product Specifications">
            <p className="text-gray-700">
              This is the content inside an accordion. Accordions are useful for displaying 
              content that can be shown or hidden as needed.
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Weight: 500g</li>
              <li>Dimensions: 20cm x 15cm x 5cm</li>
              <li>Material: Aluminum</li>
            </ul>
          </Accordion>
          
          <AccordionGroup
            items={[
              {
                id: '1',
                title: 'Product Details',
                content: <p className="text-gray-700">Basic product information and specifications.</p>,
                initiallyOpen: true
              },
              {
                id: '2',
                title: 'Components',
                content: <p className="text-gray-700">List of components that make up the product.</p>
              },
              {
                id: '3',
                title: 'Sustainability',
                content: <p className="text-gray-700">Information about the product's environmental impact.</p>
              }
            ]}
          />
        </div>
      </section>
    </div>
  );
}