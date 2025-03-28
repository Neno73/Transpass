"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/Button";
import { createProduct } from "../../../../lib/products";
import { useAuth } from "../../../../lib/AuthContext";
import AuthProtection from "../../../../components/AuthProtection";
import { BottomNav } from "../../../../components/ui/Navigation";
import { ArrowLeft, Upload, Check, X, Plus } from "lucide-react";
import Image from "next/image";

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentComponent, setCurrentComponent] = useState({
    name: "",
    description: "",
    material: "",
    weight: 0,
    recyclable: false,
    manufacturer: "",
    countryOfOrigin: "",
    location: "",
    certifications: [] as string[],
  });
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    collection: "",
    SKU: "",
    colors: [] as { name: string; hex: string }[],
    selectedColor: "",
    colorPickerVisible: false,
    sizes: [] as string[],
    madeIn: "",
    producedBy: "",
    importedBy: "",
    soldAt: "",
    manufacturer: "",
    model: "",
    category: "",
    tags: [] as string[],
    care: {
      washing: "",
      drying: "",
      ironing: "",
      bleaching: "",
    },
    components: [] as {
      name: string;
      description: string;
      material: string;
      weight: number;
      recyclable: boolean;
      manufacturer?: string;
      countryOfOrigin?: string;
      location?: string;
      certifications?: string[];
    }[],
  });

  // Cleanup function for handling image preview URLs
  useEffect(() => {
    // Cleanup function that runs when component unmounts or imagePreviewUrl changes
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent as keyof typeof productData],
          [child]: value,
        },
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSizeToggle = (size: string) => {
    if (productData.sizes.includes(size)) {
      setProductData({
        ...productData,
        sizes: productData.sizes.filter((s) => s !== size),
      });
    } else {
      setProductData({
        ...productData,
        sizes: [...productData.sizes, size],
      });
    }
  };

  // Function to clone another product (for product template functionality)
  const handleCloneProduct = async (templateId: string) => {
    try {
      setSubmitting(true);
      // Here we would normally fetch the template product
      // For demonstration, let's create some sample template data
      const templateColors = [
        { name: "Navy Blue", hex: "#003366" },
        { name: "Light Gray", hex: "#CCCCCC" },
      ];

      const templateSizes = ["S", "M", "L", "XL"];

      // Set the product data with template values
      setProductData({
        ...productData,
        name: "New Product from Template",
        description:
          "This product was created from a template. Update with your specific details.",
        colors: templateColors,
        sizes: templateSizes,
        collection: "Summer 2023",
        madeIn: "Italy",
        producedBy: "Quality Textile Co.",
        care: {
          washing: "Machine wash cold",
          drying: "Tumble dry low",
          ironing: "Iron on medium heat",
          bleaching: "Do not bleach",
        },
      });

      // Navigate to step 2 automatically
      setStep(2);
    } catch (error) {
      console.error("Error cloning product:", error);
      setError("Failed to load product template");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(
        "File selected:",
        files[0].name,
        "size:",
        files[0].size,
        "type:",
        files[0].type
      );

      // Revoke any previous object URL to avoid memory leaks
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      // Create a new object URL for preview
      const objectUrl = URL.createObjectURL(files[0]);

      // Update the state with the new file and preview URL
      setImageFile(files[0]);
      setImagePreviewUrl(objectUrl);
    }
  };

  // Handler to add or update a component to the product
  const handleAddComponent = () => {
    // Validate component data
    if (
      !currentComponent.name ||
      !currentComponent.description ||
      !currentComponent.material
    ) {
      setError("Component name, description, and material are required.");
      return;
    }

    // Add component to the product data
    setProductData({
      ...productData,
      components: [...productData.components, { ...currentComponent }],
    });

    // Reset the component form
    setCurrentComponent({
      name: "",
      description: "",
      material: "",
      weight: 0,
      recyclable: false,
      manufacturer: "",
      countryOfOrigin: "",
      location: "",
      certifications: [],
    });

    // Close the component form
    setIsAddingComponent(false);
  };

  // Handler to remove a component
  const handleRemoveComponent = (index: number) => {
    const updatedComponents = [...productData.components];
    updatedComponents.splice(index, 1);
    setProductData({
      ...productData,
      components: updatedComponents,
    });
  };

  // Handler to toggle a certification for the current component
  const handleToggleCertification = (cert: string) => {
    if (currentComponent.certifications.includes(cert)) {
      setCurrentComponent({
        ...currentComponent,
        certifications: currentComponent.certifications.filter(
          (c) => c !== cert
        ),
      });
    } else {
      setCurrentComponent({
        ...currentComponent,
        certifications: [...currentComponent.certifications, cert],
      });
    }
  };

  // Handler to edit component input fields
  const handleComponentChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setCurrentComponent({
        ...currentComponent,
        [name]: isChecked,
      });
    } else if (type === "number") {
      setCurrentComponent({
        ...currentComponent,
        [name]: Number(value),
      });
    } else {
      setCurrentComponent({
        ...currentComponent,
        [name]: value,
      });
    }
  };

  const handleCreateProduct = async () => {
    // Enhanced validation
    const validationErrors = [];

    if (!productData.name) {
      validationErrors.push("Product name is required");
    }

    if (!imageFile) {
      validationErrors.push("Product image is required");
    } else {
      // Validate image file
      const maxSize = 5 * 1024 * 1024; // 5MB max size
      if (imageFile.size > maxSize) {
        validationErrors.push("Image file size must be less than 5MB");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(imageFile.type)) {
        validationErrors.push("Image must be a JPEG, PNG, or GIF file");
      }
    }

    if (productData.description.length > 320) {
      validationErrors.push("Description must be 320 characters or less");
    }

    if (productData.colors.length === 0) {
      validationErrors.push("At least one product color is required");
    }

    if (productData.sizes.length === 0) {
      validationErrors.push("At least one product size is required");
    }

    if (!productData.madeIn) {
      validationErrors.push("Country of origin is required");
    }

    if (!productData.producedBy) {
      validationErrors.push("Manufacturer information is required");
    }

    if (!productData.SKU) {
      validationErrors.push("SKU is required");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Use components from product data, or create a default one if none added
      const components =
        productData.components.length > 0
          ? productData.components
          : [
              {
                name: "Main Component",
                description: "Primary material of the product",
                material: "Mixed",
                weight: 100,
                recyclable: true,
                manufacturer: productData.producedBy,
                countryOfOrigin: productData.madeIn,
                location: "Main body",
              },
            ];

      // Create the final product data
      const finalProductData = {
        name: productData.name,
        description: productData.description,
        manufacturer: productData.producedBy || productData.manufacturer,
        model: productData.SKU || productData.model,
        category: productData.collection || productData.category,
        tags: productData.sizes, // Convert sizes to tags for now
        colors: productData.colors,
        madeIn: productData.madeIn,
        importedBy: productData.importedBy,
        soldAt: productData.soldAt,
        care: productData.care,
        components: components,
        warrantyInfo: "", // We can add this later
        createdBy: user?.uid || "anonymous",
        companyId: user?.uid || undefined, // We're using the user ID as company ID for now
        createdAt: new Date().toISOString(),
      };

      console.log(
        "Creating product with image:",
        imageFile?.name,
        "size:",
        imageFile?.size
      );

      if (!imageFile) {
        throw new Error("Image file is required but not provided");
      }

      // Simpler approach: Convert the file to a simple blob
      const blobData = await imageFile.arrayBuffer();

      // Log file details for debugging
      console.log(
        "Image data prepared for upload:",
        "name:",
        imageFile.name,
        "size:",
        blobData.byteLength,
        "type:",
        imageFile.type
      );

      // Create the product in the database passing both the original file and the blob data
      const result = await createProduct(finalProductData, imageFile, blobData);

      if (result && result.id) {
        console.log("Product created successfully with ID:", result.id);
        // Redirect to success page with product ID and name
        router.push(
          `/company/products/success?id=${result.id}&name=${encodeURIComponent(
            productData.name
          )}`
        );
      } else {
        throw new Error("Product creation failed with no ID returned");
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-white pb-20 p-4 max-w-xl mx-auto">
        <Image
          src="/background-grey-logo.svg"
          alt="Background pattern"
          width={1000}
          height={1000}
          className="absolute top-0 right-0 z-0"
        />
        <main className="max-w-2xl mx-auto px-4 py-6 z-10 relative">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/company/dashboard")}
              className="flex items-center text-gray-dark hover:text-primary"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Step indicator */}
          <div className="mb-20 mt-12">
            <div className="text-3xl mb-8 text-primary text-center text-bold">
              Create Product
            </div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-primary font-medium"></div>
            </div>

            {/* Individual step lines */}
            <div className="flex gap-2 items-center justify-center">
              <div
                className={`h-2 rounded-full w-full max-w-24 ${
                  step >= 1 ? "bg-primary" : "bg-primary-light"
                }`}
              ></div>
              <div
                className={`h-2 rounded-full w-full max-w-24 ${
                  step >= 2 ? "bg-primary" : "bg-primary-light"
                }`}
              ></div>
              <div
                className={`h-2 rounded-full w-full max-w-24 ${
                  step >= 3 ? "bg-primary" : "bg-primary-light"
                }`}
              ></div>
            </div>
          </div>

          {/* Form content - directly in the main container without white background */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Product name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="productName"
                  value={productData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="productImage"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Product image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        className="hidden"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          console.log("Choose image button clicked");
                          // Use the React ref to access the file input
                          if (fileInputRef.current) {
                            console.log("Clicking file input via ref...");
                            fileInputRef.current.click();
                          } else {
                            console.error("File input ref is null!");
                            // Fallback to DOM ID
                            const fileInput = document.getElementById(
                              "product-image"
                            ) as HTMLInputElement;
                            if (fileInput) {
                              console.log("Clicking file input via DOM...");
                              fileInput.click();
                            } else {
                              console.error("File input not found in DOM!");
                              alert(
                                "Could not open file selector. Please try again or use a different browser."
                              );
                            }
                          }
                        }}
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
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                          <line x1="16" y1="5" x2="22" y2="5"></line>
                          <line x1="19" y1="2" x2="19" y2="8"></line>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                        Choose image
                      </Button>
                    </div>
                    <span className="ml-4 text-gray-500 text-sm">
                      {imageFile ? imageFile.name : "No file chosen"}
                    </span>
                  </div>

                  {/* Image preview section - separated from the button */}
                  {imagePreviewUrl && (
                    <div className="mt-4">
                      <div className="relative">
                        <img
                          src={imagePreviewUrl}
                          alt="Product preview"
                          className="h-32 w-32 object-cover rounded border border-gray-300"
                          onLoad={(e) => {
                            // This ensures the URL is properly loaded before rendering
                            console.log("Image preview loaded successfully");
                          }}
                          onError={(e) => {
                            console.error("Error loading image preview");
                          }}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1  border border-gray-300"
                          onClick={() => {
                            console.log("Remove image button clicked");

                            // Clear the file input using the ref
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                            // Revoke the object URL to avoid memory leaks
                            if (imagePreviewUrl) {
                              URL.revokeObjectURL(imagePreviewUrl);
                            }

                            // Clear the state
                            setImageFile(null);
                            setImagePreviewUrl(null);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended size is 400x400 px
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Describe the product <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={productData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <p className="mt-1 text-xs text-gray-500">Max 320 characters</p>
              </div>

              <div>
                <label
                  htmlFor="productColor"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Product color <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {productData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white rounded-full px-3 py-1 border border-gray-300"
                      >
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <span className="text-sm">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedColors = [...productData.colors];
                            updatedColors.splice(index, 1);
                            setProductData({
                              ...productData,
                              colors: updatedColors,
                            });
                          }}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {productData.colorPickerVisible ? (
                    <div className="bg-white p-3 border border-gray-300 rounded-lg">
                      <div className="grid grid-cols-6 gap-2 mb-2">
                        {[
                          "#FF0000",
                          "#FF9900",
                          "#FFCC00",
                          "#33CC33",
                          "#3366FF",
                          "#9933FF",
                          "#FF3399",
                          "#FF6666",
                          "#FFCC99",
                          "#CCFF99",
                          "#99CCFF",
                          "#CC99FF",
                          "#000000",
                          "#666666",
                          "#999999",
                          "#CCCCCC",
                          "#FFFFFF",
                          "#FFDDDD",
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border ${
                              productData.selectedColor === color
                                ? "border-black ring-2 ring-offset-2 ring-primary"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              setProductData({
                                ...productData,
                                selectedColor: color,
                              })
                            }
                          ></button>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Color name"
                          className="flex-grow rounded border border-gray-300 p-2 text-sm"
                          value={
                            productData.selectedColor
                              ? productData.colors.find(
                                  (c) => c.hex === productData.selectedColor
                                )?.name || ""
                              : ""
                          }
                          onChange={(e) => {
                            if (productData.selectedColor) {
                              // If this color is already in the array, update its name
                              const colorExists = productData.colors.find(
                                (c) => c.hex === productData.selectedColor
                              );
                              if (colorExists) {
                                const updated = productData.colors.map((c) =>
                                  c.hex === productData.selectedColor
                                    ? { ...c, name: e.target.value }
                                    : c
                                );
                                setProductData({
                                  ...productData,
                                  colors: updated,
                                });
                              } else {
                                // Otherwise, prepare to add it when the Add button is clicked
                                setProductData({
                                  ...productData,
                                  tempColorName: e.target.value,
                                });
                              }
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (productData.selectedColor) {
                                // Check if this color is already in the array
                                const colorExists = productData.colors.find(
                                  (c) => c.hex === productData.selectedColor
                                );
                                if (!colorExists) {
                                  // Add new color
                                  const colorName =
                                    productData.tempColorName ||
                                    // Generate a name if none provided
                                    {
                                      "#FF0000": "Red",
                                      "#FF9900": "Orange",
                                      "#FFCC00": "Yellow",
                                      "#33CC33": "Green",
                                      "#3366FF": "Blue",
                                      "#9933FF": "Purple",
                                      "#FF3399": "Pink",
                                      "#000000": "Black",
                                      "#FFFFFF": "White",
                                      "#666666": "Dark Gray",
                                      "#CCCCCC": "Light Gray",
                                    }[productData.selectedColor] ||
                                    "Custom";

                                  setProductData({
                                    ...productData,
                                    colors: [
                                      ...productData.colors,
                                      {
                                        name: colorName,
                                        hex: productData.selectedColor,
                                      },
                                    ],
                                    tempColorName: "",
                                    colorPickerVisible: false,
                                    selectedColor: "",
                                  });
                                } else {
                                  // Color already exists, just close the picker
                                  setProductData({
                                    ...productData,
                                    colorPickerVisible: false,
                                    selectedColor: "",
                                  });
                                }
                              }
                            }}
                          >
                            Add
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setProductData({
                                ...productData,
                                colorPickerVisible: false,
                                selectedColor: "",
                              })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setProductData({
                          ...productData,
                          colorPickerVisible: true,
                        })
                      }
                      className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50"
                    >
                      <span className="text-black font-bold">+</span>
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark">
                  Product sizes <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 grid grid-cols-4 gap-3">
                  {[
                    "XXS",
                    "XS",
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                    "3XL",
                    "4XL",
                    "5XL",
                    "6XL",
                  ].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`rounded-full py-2 px-4 border ${
                        productData.sizes.includes(size)
                          ? "bg-primary-light text-white"
                          : "border-gray-300 text-gray-dark hover:bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-primary mb-4">
                Product Information
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="collection"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Collection
                  </label>
                  <input
                    type="text"
                    name="collection"
                    id="collection"
                    value={productData.collection}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="SKU"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SKU"
                    id="SKU"
                    value={productData.SKU}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="madeIn"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Made in <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="madeIn"
                    id="madeIn"
                    value={productData.madeIn}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="producedBy"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Produced by <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="producedBy"
                    id="producedBy"
                    value={productData.producedBy}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="importedBy"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Imported by
                  </label>
                  <input
                    type="text"
                    name="importedBy"
                    id="importedBy"
                    value={productData.importedBy}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="soldAt"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Sold at
                  </label>
                  <input
                    type="text"
                    name="soldAt"
                    id="soldAt"
                    value={productData.soldAt}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-5 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-primary mb-4">
                Components
              </h2>

              {/* List of existing components */}
              {productData.components.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-dark mb-3">
                    Added Components
                  </h3>
                  <div className="space-y-4">
                    {productData.components.map((component, index) => (
                      <div key={index} className="bg-white rounded-lg ">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-primary">
                              {component.name}
                            </h4>
                            <p className="text-sm text-gray mt-1">
                              {component.description}
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-dark">
                                  Material:
                                </span>{" "}
                                {component.material}
                              </div>
                              <div>
                                <span className="font-medium text-gray-dark">
                                  Weight:
                                </span>{" "}
                                {component.weight}g
                              </div>
                              <div>
                                <span className="font-medium text-gray-dark">
                                  Recyclable:
                                </span>{" "}
                                {component.recyclable ? "Yes" : "No"}
                              </div>
                              {component.location && (
                                <div>
                                  <span className="font-medium text-gray-dark">
                                    Location:
                                  </span>{" "}
                                  {component.location}
                                </div>
                              )}
                            </div>

                            {component.certifications &&
                              component.certifications.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-gray-dark">
                                    Certifications:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {component.certifications.map((cert, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-lightest text-primary"
                                      >
                                        {cert}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveComponent(index)}
                            className="text-red-600 hover:text-red-800"
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
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Component form */}
              {isAddingComponent ? (
                <div className="bg-white rounded-lg">
                  <h3 className="text-sm font-medium text-gray-dark mb-4">
                    Add New Component
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="componentName"
                        className="block text-sm font-medium text-gray-dark"
                      >
                        Component Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="componentName"
                        value={currentComponent.name}
                        onChange={handleComponentChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., Main Fabric, Button, Zipper"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="componentDescription"
                        className="block text-sm font-medium text-gray-dark"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="componentDescription"
                        name="description"
                        rows={2}
                        value={currentComponent.description}
                        onChange={handleComponentChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Describe this component"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="componentMaterial"
                          className="block text-sm font-medium text-gray-dark"
                        >
                          Material <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="material"
                          id="componentMaterial"
                          value={currentComponent.material}
                          onChange={handleComponentChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-lg  py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="e.g., Cotton, Metal, Plastic"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="componentWeight"
                          className="block text-sm font-medium text-gray-dark"
                        >
                          Weight (grams)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          id="componentWeight"
                          value={currentComponent.weight}
                          onChange={handleComponentChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="componentLocation"
                        className="block text-sm font-medium text-gray-dark"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="componentLocation"
                        value={currentComponent.location}
                        onChange={handleComponentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., Sleeve, Front, Inside"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="recyclable"
                        id="componentRecyclable"
                        checked={currentComponent.recyclable}
                        onChange={handleComponentChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="componentRecyclable"
                        className="ml-2 block text-sm text-gray-dark"
                      >
                        Recyclable
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Certifications
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Craftsmanship",
                          "Small business",
                          "Ethical labor",
                          "Slow fashion",
                          "Vegan",
                          "Organic",
                          "Recycled",
                          "Fair Trade",
                          "GOTS",
                        ].map((cert) => (
                          <button
                            key={cert}
                            type="button"
                            onClick={() => handleToggleCertification(cert)}
                            className={`rounded-full px-3 py-1 flex items-center gap-1 text-sm ${
                              currentComponent.certifications.includes(cert)
                                ? "bg-primary-light text-primary border-none"
                                : "border border-gray-300 text-gray-dark hover:border-primary hover:text-primary"
                            }`}
                          >
                            {currentComponent.certifications.includes(cert) ? (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M8 12L11 15L16 9"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                            {cert}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsAddingComponent(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddComponent}>
                        Add Component
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingComponent(true)}
                  className="w-full justify-center py-3"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Component
                </Button>
              )}

              <div className="pt-5 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button onClick={nextStep} disabled={submitting}>
                  Next
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error.split("\n").map((err, i) => (
                    <div key={i} className="mb-1">
                      • {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-primary mb-4">
                Care Instructions
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="care.washing"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Washing instructions
                  </label>
                  <input
                    type="text"
                    name="care.washing"
                    id="care.washing"
                    value={productData.care.washing}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Machine wash cold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="care.drying"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Drying instructions
                  </label>
                  <input
                    type="text"
                    name="care.drying"
                    id="care.drying"
                    value={productData.care.drying}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Tumble dry low"
                  />
                </div>

                <div>
                  <label
                    htmlFor="care.ironing"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Ironing instructions
                  </label>
                  <input
                    type="text"
                    name="care.ironing"
                    id="care.ironing"
                    value={productData.care.ironing}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Iron on medium heat"
                  />
                </div>

                <div>
                  <label
                    htmlFor="care.bleaching"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Bleaching instructions
                  </label>
                  <input
                    type="text"
                    name="care.bleaching"
                    id="care.bleaching"
                    value={productData.care.bleaching}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Do not bleach"
                  />
                </div>
              </div>

              <div className="pt-5 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button onClick={handleCreateProduct} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Product"}
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error.split("\n").map((err, i) => (
                    <div key={i} className="mb-1">
                      • {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
