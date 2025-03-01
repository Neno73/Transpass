import React, { useState, useRef } from 'react';
import { Button } from "./ui/Button";

export default function ProductCreationStep1() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-primary mb-6">Create product</h1>
        
        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="h-1.5 w-24 rounded-full bg-primary"></div>
          <div className="h-1.5 w-24 rounded-full bg-primary-light"></div>
          <div className="h-1.5 w-24 rounded-full bg-[#D1D9FF]"></div>
        </div>
      </div>
      
      {/* Form */}
      <form className="space-y-8">
        {/* Product Name */}
        <div className="space-y-2">
          <label htmlFor="productName" className="text-base font-medium">
            Product name <span className="text-red-500">*</span>
          </label>
          <input 
            id="productName" 
            placeholder="Enter product name" 
            className="w-full h-12 rounded-lg border-gray-300"
            required
          />
        </div>
        
        {/* Product Image */}
        <div className="space-y-2">
          <label htmlFor="productImage" className="text-base font-medium">
            Product image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input 
              type="file"
              id="productImage"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button 
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={handleButtonClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              Choose image
            </Button>
            <span className="ml-4 text-gray-500 text-sm">{fileName}</span>
          </div>
          <p className="text-xs text-gray-500">Recommended size is 400x400 px</p>
          {selectedFile && (
            <div className="mt-2">
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Product preview" 
                className="h-24 w-24 object-cover rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>
        
        {/* Product Description */}
        <div className="space-y-2">
          <label htmlFor="productDescription" className="text-base font-medium">
            Describe the product <span className="text-red-500">*</span>
          </label>
          <textarea 
            id="productDescription"
            className="min-h-[150px] rounded-lg border-gray-300 w-full" 
            required
          />
          <p className="text-xs text-gray-500">Max 320 characters</p>
        </div>
        
        {/* Product Color */}
        <div className="space-y-2">
          <label htmlFor="productColor" className="text-base font-medium">
            Product color <span className="text-red-500">*</span>
          </label>
          <div>
            <Button 
              variant="outline"
              className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50"
              style={{
                background: "linear-gradient(to bottom right, red, orange, yellow, green, blue, indigo, violet)"
              }}
            >
              <span className="text-black font-bold">+</span>
            </Button>
          </div>
        </div>
        
        {/* Product Sizes */}
        <div className="space-y-2">
          <label className="text-base font-medium">
            Product sizes <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'].map((size) => (
              <button
                key={size}
                type="button"
                className="rounded-full py-2 px-4 border border-gray-300 text-center hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Next Button */}
        <div className="pt-6">
          <Button className="w-full">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}