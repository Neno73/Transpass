# TransPass PWA Components Guide

This document provides examples and usage guidelines for the TransPass PWA components based on the design specifications.

## Form Components

### Input Field

Used for single-line text input in forms.

```tsx
import { FormField, Input } from '@/components/ui';

// Basic Input
<FormField label="Product Name" htmlFor="productName">
  <Input id="productName" placeholder="Enter product name" />
</FormField>

// Required Input
<FormField label="Product Name" htmlFor="productName" required>
  <Input id="productName" placeholder="Enter product name" required />
</FormField>

// Input with Error
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
```

### Textarea

Used for multi-line text input.

```tsx
import { FormField, Textarea } from '@/components/ui';

// Basic Textarea
<FormField label="Description" htmlFor="description">
  <Textarea id="description" placeholder="Enter product description" />
</FormField>

// Textarea with character limit
<FormField label="Description" htmlFor="description">
  <Textarea 
    id="description" 
    placeholder="Enter product description" 
    maxLength={500} 
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</FormField>

// Textarea with Error
<FormField 
  label="Description" 
  htmlFor="description" 
  error="Description is required"
>
  <Textarea 
    id="description" 
    placeholder="Enter product description" 
    error="Description is required"
  />
</FormField>
```

### Selection Pills

Used for selecting one or multiple options from a set of choices.

```tsx
import { SelectionPillGroup } from '@/components/ui';

// Single selection mode
const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

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

// Multi-selection mode
const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

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
```

## Button Components

### Primary Button

Used for primary actions.

```tsx
import { PrimaryButton } from '@/components/ui';

// Basic Primary Button
<PrimaryButton 
  label="Create Product" 
  onClick={handleCreateProduct} 
/>

// Full Width Primary Button
<PrimaryButton 
  label="Save Changes" 
  fullWidth 
  onClick={handleSaveChanges} 
/>

// Primary Button with Icon
<PrimaryButton 
  label="Add Component" 
  icon={<PlusIcon />} 
  onClick={handleAddComponent} 
/>

// Disabled Primary Button
<PrimaryButton 
  label="Submit" 
  disabled={!isFormValid} 
  onClick={handleSubmit} 
/>
```

### Secondary Button

Used for secondary actions.

```tsx
import { SecondaryButton } from '@/components/ui';

// Outline Secondary Button
<SecondaryButton 
  label="Cancel" 
  onClick={handleCancel} 
/>

// Text Secondary Button
<SecondaryButton 
  label="View Details" 
  variant="text" 
  onClick={handleViewDetails} 
/>

// Secondary Button with Icon
<SecondaryButton 
  label="Download" 
  icon={<DownloadIcon />} 
  onClick={handleDownload} 
/>

// Full Width Secondary Button
<SecondaryButton 
  label="Back" 
  fullWidth 
  onClick={handleGoBack} 
/>
```

### Icon Button

Used for actions that can be represented by an icon.

```tsx
import { IconButton } from '@/components/ui';

// Default Icon Button
<IconButton 
  icon={<EditIcon />} 
  ariaLabel="Edit product" 
  onClick={handleEdit} 
/>

// Primary Icon Button
<IconButton 
  icon={<PlusIcon />} 
  ariaLabel="Add item" 
  variant="primary" 
  onClick={handleAdd} 
/>

// Transparent Icon Button
<IconButton 
  icon={<CloseIcon />} 
  ariaLabel="Close modal" 
  variant="transparent" 
  onClick={handleClose} 
/>
```

## Progress Indicator

Used to show progress in multi-step flows.

```tsx
import { ProgressIndicator } from '@/components/ui';

// Basic Progress Indicator
<ProgressIndicator 
  currentStep={2} 
  totalSteps={4} 
/>

// Progress Indicator with Step Information
<StepIndicator
  steps={[
    { label: 'Basic Information', description: 'Enter product details' },
    { label: 'Components', description: 'Add product components' },
    { label: 'Images', description: 'Upload product images' },
    { label: 'Review', description: 'Review and submit' }
  ]}
  currentStep={2}
/>
```

## Card and Accordion Components

### Card

Used to display content in a contained, styled container.

```tsx
import { Card } from '@/components/ui';

// Basic Card
<Card>
  <h2 className="text-xl font-semibold mb-4">Product Details</h2>
  <p>This is the content of the card.</p>
</Card>

// Card with Header, Content, and Footer
<Card>
  <CardHeader>
    <h2 className="text-xl font-semibold">Product Details</h2>
  </CardHeader>
  <CardContent>
    <p>This is the content of the card.</p>
  </CardContent>
  <CardFooter>
    <div className="flex justify-end">
      <SecondaryButton label="Cancel" onClick={handleCancel} />
      <PrimaryButton label="Save" onClick={handleSave} className="ml-2" />
    </div>
  </CardFooter>
</Card>
```

### Accordion

Used to display collapsible content sections.

```tsx
import { Accordion, AccordionGroup } from '@/components/ui';

// Single Accordion
<Accordion title="Product Specifications">
  <p>This is the content of the accordion.</p>
</Accordion>

// Accordion Group
<AccordionGroup
  items={[
    {
      id: '1',
      title: 'Product Specifications',
      content: <ProductSpecificationsContent />,
      initiallyOpen: true
    },
    {
      id: '2',
      title: 'Packaging Details',
      content: <PackagingDetailsContent />
    },
    {
      id: '3',
      title: 'Sustainability Information',
      content: <SustainabilityContent />
    }
  ]}
/>
```

## Legacy Component Usage

Some older parts of the application might still use the legacy `Button` component. Here's how to use it:

```tsx
import { Button } from '@/components/ui';

// Primary Button
<Button 
  variant="primary" 
  label="Create Product" 
  onClick={handleCreateProduct} 
/>

// Secondary Button
<Button 
  variant="secondary" 
  label="Cancel" 
  onClick={handleCancel} 
/>

// Text Button
<Button 
  variant="text" 
  label="View Details" 
  onClick={handleViewDetails} 
/>

// Icon Button
<Button 
  variant="icon" 
  icon={<EditIcon />} 
  ariaLabel="Edit product" 
  onClick={handleEdit} 
/>

// You can also use children instead of label
<Button variant="primary" onClick={handleCreateProduct}>
  Create Product
</Button>
```