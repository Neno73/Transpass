import React from "react";
import { Button } from "./ui/Button";

export default function ProductComponentSection() {
  return (
    <div className="min-h-screen bg-white p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-primary mb-6">
          Create product
        </h1>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="h-1.5 w-24 rounded-full bg-primary"></div>
          <div className="h-1.5 w-24 rounded-full bg-primary"></div>
          <div className="h-1.5 w-24 rounded-full bg-[#D1D9FF]"></div>
        </div>
      </div>

      {/* Component Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-primary mb-4">Component</h2>

          {/* Component Type */}
          <div className="space-y-2 mb-4">
            <label htmlFor="componentType" className="text-base font-medium">
              Component type <span className="text-red-500">*</span>
            </label>
            <input
              id="componentType"
              placeholder="Enter component type"
              className="w-full h-12 rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-4">
            <label htmlFor="description" className="text-base font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className="min-h-[80px] rounded-lg border-gray-300 w-full"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2 mb-4">
            <label htmlFor="location" className="text-base font-medium">
              Location
            </label>
            <input
              id="location"
              placeholder="Enter location"
              className="w-full h-12 rounded-lg border-gray-300"
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2 mb-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Upload document
            </Button>
            <p className="text-xs text-gray-500">Recommended size is 5MB</p>
          </div>

          {/* Certifications */}
          <div className="space-y-2 mb-4">
            <label className="text-base font-medium">
              Select certifications that apply to this component
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Recycled
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Organic{" "}
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Vegan
              </Button>

              <Button
                variant="secondary"
                className="rounded-full px-4 py-2 flex items-center gap-2 border-none"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="white"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Fair Trade
              </Button>

              <Button
                variant="secondary"
                className="rounded-full px-4 py-2 flex items-center gap-2 border-none"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="white"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ethical
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Durable
              </Button>


                <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Small Business
              </Button>
                <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Slow Fashion
              </Button>
                <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Craftsmanship
              </Button>
                <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Minority Owned
              </Button>
                <Button
                variant="outline"
                className="rounded-full px-4 py-2 border border-gray-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#3D4EAD"
                    strokeWidth="2"
                  />
                </svg>
                Other
              </Button>
            </div>
          </div>
        </div>

        {/* Add Component Button */}
        <Button
          variant="outline"
          className="w-full border border-primary text-primary bg-white hover:bg-gray-50 font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="#3D4EAD"
              strokeWidth="2"
            />
            <path
              d="M12 8V16"
              stroke="#3D4EAD"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 12H16"
              stroke="#3D4EAD"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Component
        </Button>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="ghost"
            className="px-8 py-3 bg-white text-primary border-none hover:bg-gray-50 font-medium rounded-full"
          >
            Back
          </Button>

          <Button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
