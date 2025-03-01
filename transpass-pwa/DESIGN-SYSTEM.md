# TransPass PWA Design System

This document outlines the key UI elements, spacing, typography, color schemes, and component patterns for the TransPass Progressive Web Application based on the Figma design.

## Color Palette

### Primary Colors
- **Primary Blue**: `#3D4EAD` - Main brand color, buttons, headers
- **Light Blue**: `#A3B1F6` - Secondary elements, icons, accents
- **Lightest Blue**: `#F5F7FF` - Backgrounds, cards, sections

### Secondary Blues (from lighter to darker)
- **Light Blue 1**: `#B4C7F2`
- **Blue 2**: `#7790ED`
- **Dark Blue**: `#30429E`

### Neutrals
- **White**: `#FFFFFF` - Backgrounds, cards
- **Light Gray**: `#F5F7FF` - Backgrounds, lighter sections
- **Medium Gray**: `#B9C8CF` - Borders, dividers
- **Text Gray**: `#6B7280` - Secondary text
- **Dark Gray**: `#4F4E4C` - Text, icons
- **Dark Gray 2**: `#525149` - Text, icons
- **Darker Gray**: `#292621` - Primary text

### Semantic Colors
- **Error/Required**: `#FF0000` - Required fields indicator, error messages
- **Success**: `#3CB371` - Success states, confirmations

## Typography

### Font Families
- **Primary Font**: `Avenir Next LT Pro` - Used for headings and important UI elements
- **Secondary Font**: `Avenir LT Std` - Used for body text and secondary elements
- **Fallback**: `Avenir`, sans-serif - When the primary fonts are not available

### Font Sizes
- **H1 (Page Title)**: `24px`, font-weight: 600 - `text-2xl`
- **H2 (Section Title)**: `20px`, font-weight: 600 - `text-xl`
- **H3 (Subsection Title)**: `18px`, font-weight: 600 - `text-lg`
- **Body Text**: `16px`, font-weight: 400 - `text-md`
- **Small Text**: `14px`, font-weight: 400 - `text-base`
- **Label Text**: `12px`, font-weight: 500 - `text-sm`
- **Micro Text**: `10px`, font-weight: 400 - `text-xs`

### Line Heights
- **Default**: 1.5
- **Headings**: 1.2
- **Compact**: 1.25

## Spacing System

The spacing system follows an 8-point grid:

- **2xs**: `4px` - Minimal spacing between close elements
- **xs**: `8px` - Small spacing
- **sm**: `16px` - Default spacing between elements
- **md**: `24px` - Medium spacing between sections
- **lg**: `32px` - Large spacing
- **xl**: `48px` - Extra large spacing
- **2xl**: `64px` - Maximum spacing

## Border Radius

- **Default**: `8px` - Used for cards, buttons, input fields
- **Large**: `12px` - Used for modals, larger components
- **Pill**: `9999px` (full radius) - Used for pills, tags, action buttons

## Shadows

- **Card Shadow**: `0px 4px 6px rgba(0, 0, 0, 0.1)`
- **Modal Shadow**: `0px 10px 15px rgba(0, 0, 0, 0.1)`
- **Dropdown Shadow**: `0px 2px 4px rgba(0, 0, 0, 0.05)`

## Components

### Button Component

```tsx
import { Button } from '@/components/ui';

// Primary button (default)
<Button>Primary Button</Button>

// Secondary button
<Button variant="secondary">Secondary Button</Button>

// Text button
<Button variant="text">Text Button</Button>

// Icon button
<Button 
  variant="icon" 
  icon={<svg>...</svg>}
/>

// Disabled button
<Button disabled>Disabled Button</Button>

// Different sizes
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
```

### Form Fields

```tsx
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/ui';

// Text input with label
<FormField label="Name" htmlFor="name" required>
  <Input id="name" placeholder="Enter your name" />
</FormField>

// Text input with error
<FormField label="Email" htmlFor="email" error="Please enter a valid email">
  <Input id="email" type="email" />
</FormField>

// Textarea
<FormField label="Description" htmlFor="description">
  <Textarea id="description" placeholder="Enter description" />
</FormField>

// Select
<FormField label="Category" htmlFor="category">
  <Select 
    id="category"
    options={[
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' }
    ]} 
  />
</FormField>

// Checkbox
<Checkbox label="I agree to the terms" />
```

### Cards

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

// Standard card
<Card>
  <p>Card content goes here</p>
</Card>

// Panel card
<Card variant="panel">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Selection Pills

```tsx
import { SelectionPill, SelectionPillGroup } from '@/components/ui';

// Single selection pill
<SelectionPill label="Option 1" selected />
<SelectionPill label="Option 2" />

// Selection pill group (single selection)
<SelectionPillGroup
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  value="option1"
  onChange={(value) => console.log(value)}
/>

// Selection pill group (multiple selection)
<SelectionPillGroup
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  value={['option1', 'option3']}
  onChange={(values) => console.log(values)}
  multiple
/>
```

### Accordion

```tsx
import { Accordion, AccordionGroup } from '@/components/ui';

// Single accordion
<Accordion title="Section Title" defaultOpen>
  <p>Accordion content here</p>
</Accordion>

// Accordion group
<AccordionGroup
  items={[
    {
      id: '1',
      title: 'Section 1',
      content: <p>Content for section 1</p>
    },
    {
      id: '2',
      title: 'Section 2',
      content: <p>Content for section 2</p>
    }
  ]}
/>
```

### Navigation

```tsx
import { TopNav, BottomNav } from '@/components/ui';

// Top navigation with back button
<TopNav 
  title="Page Title" 
  showBackButton
  rightAction={<Button variant="icon" icon={<svg>...</svg>} />}
/>

// Bottom navigation
<BottomNav
  items={[
    {
      href: '/home',
      label: 'Home',
      icon: <svg>...</svg>
    },
    {
      href: '/scan',
      label: 'Scan',
      icon: <svg>...</svg>
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <svg>...</svg>
    }
  ]}
/>
```

### Tabs

```tsx
import { Tabs, TabsWithContent } from '@/components/ui';

// Basic tabs
<Tabs
  tabs={[
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' }
  ]}
  value="tab1"
  onChange={(value) => console.log(value)}
/>

// Tabs with content
<TabsWithContent
  tabs={[
    { 
      label: 'Tab 1', 
      value: 'tab1',
      content: <p>Content for tab 1</p>
    },
    { 
      label: 'Tab 2', 
      value: 'tab2',
      content: <p>Content for tab 2</p>
    }
  ]}
  defaultValue="tab1"
/>
```

### Alerts

```tsx
import { Alert } from '@/components/ui';

// Info alert (default)
<Alert message="This is an informational message" />

// Success alert
<Alert 
  type="success"
  title="Success"
  message="Operation completed successfully"
/>

// Error alert with close button
<Alert 
  type="error"
  title="Error"
  message="Something went wrong"
  onClose={() => console.log('Alert closed')}
/>
```

### Progress Indicators

```tsx
import { ProgressIndicator, StepIndicator } from '@/components/ui';

// Basic progress indicator
<ProgressIndicator steps={3} currentStep={2} />

// Step indicator with labels
<StepIndicator
  steps={[
    { label: 'Basic Info', description: 'Enter basic product information' },
    { label: 'Components', description: 'Add components to the product' },
    { label: 'Review', description: 'Review and submit' }
  ]}
  currentStep={2}
/>
```

## Layout Guidelines

### General Layout
- **Max Content Width**: `414px` (mobile-focused design)
- **Horizontal Padding**: `24px`
- **Vertical Spacing Between Sections**: `32px`
- **Form Field Spacing**: `24px`

```tsx
// Content container
<div className="content-container">
  {/* Page content */}
</div>

// Section spacing
<div className="section-spacing">
  {/* Section content */}
</div>

// Form field spacing
<div className="form-field-spacing">
  {/* Form field */}
</div>
```

## Accessibility Guidelines

- Minimum touch target size of `48px` × `48px`
- Text color should maintain a 4.5:1 contrast ratio with its background
- Required form fields are clearly marked with a red asterisk
- Interactive elements have visible focus states
- Sufficient color contrast for all text and UI elements