"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../../components/ui/Button";
import { BottomNav } from "../../../../components/ui/Navigation";
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../../../lib/products";
import AuthProtection from "../../../../components/AuthProtection";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import ProductQRCode from "../../../../components/ui/ProductQRCode";

export default function ProductDetailPage(props: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [componentFilter, setComponentFilter] = useState("all");
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [editingComponentIndex, setEditingComponentIndex] = useState<
    number | null
  >(null);

  const params = React.use(props.params);

  // Fetch product data
  useEffect(() => {
    async function loadProduct() {
      try {
        const productData = await getProduct(params.id);
        if (productData) {
          setProduct(productData);
          setEditData({ ...productData });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateProduct(params.id, editData);
      setProduct(editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(params.id);
      router.push("/company/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  const handleEditComponent = (index: number) => {
    const comp = product.components[index];
    setEditingComponentIndex(index);
    setEditingComponent({ ...comp });
  };

  const handleDeleteComponent = (index: number) => {
    const updatedComponents = [...product.components];
    updatedComponents.splice(index, 1);

    const updatedProduct = { ...product, components: updatedComponents };
    setProduct(updatedProduct);
    setEditData(updatedProduct);

    // Save to database
    updateProduct(params.id, updatedProduct).catch((err) => {
      console.error("Error updating product components:", err);
      setError("Failed to delete component");
    });
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSaveEditedComponent = async () => {
    if (editingComponentIndex === null) return;

    const updatedComponents = [...product.components];
    updatedComponents[editingComponentIndex] = { ...editingComponent };

    const updatedProduct = {
      ...product,
      components: updatedComponents,
    };

    try {
      await updateProduct(product.id, updatedProduct);
      setProduct(updatedProduct);
      setEditData(updatedProduct); // update edit buffer
      setEditingComponentIndex(null);
      setEditingComponent(null);
    } catch (err) {
      console.error("Failed to save component:", err);
      setError("Failed to update component");
    }
  };

  const handleAddNewComponent = async () => {
  const updatedComponents = [...product.components, editingComponent];

  const updatedProduct = {
    ...product,
    components: updatedComponents,
  };

  try {
    await updateProduct(product.id, updatedProduct);
    setProduct(updatedProduct);
    setEditData(updatedProduct);
    setEditingComponent(null);
  } catch (err) {
    console.error("Failed to add component:", err);
    setError("Failed to add new component");
  }
};


  if (loading) {
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
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.svg"
                alt="TransPass Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
            </div>
          </main>
        </div>
      </AuthProtection>
    );
  }

  if (error) {
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
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.svg"
                alt="TransPass Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/company/products")}
              >
                Back to Products
              </Button>
            </div>
          </main>
        </div>
      </AuthProtection>
    );
  }

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
              onClick={() => router.push("/company/products")}
              className="flex items-center text-gray-dark hover:text-primary"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Products</span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="TransPass Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Product header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary text-center">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray text-center">
              Product ID: {product.id}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50 flex items-center"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>

          {/* Delete confirmation modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-dark mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => switchTab("details")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => switchTab("components")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "components"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
              >
                Components
              </button>
              <button
                onClick={() => switchTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === "details" && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-dark"
                    >
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={editData.description || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-dark">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="manufacturer"
                      className="block text-sm font-medium text-gray-dark"
                    >
                      Manufacturer
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="manufacturer"
                        id="manufacturer"
                        value={editData.manufacturer || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-dark">
                        {product.manufacturer}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-dark"
                    >
                      Category
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="category"
                        id="category"
                        value={editData.category || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-dark">
                        {product.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-dark">
                      QR Code
                    </h3>
                    {product.id && (
                      <div className="mt-2 bg-white p-4 rounded-lg shadow-sm">
                        <ProductQRCode
                          productId={product.id}
                          productName={product.name}
                        />
                        <p className="mt-2 text-xs text-gray text-center">
                          Scan to view product
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "components" && (
              <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-dark">
                    Components
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={componentFilter}
                      onChange={(e) => setComponentFilter(e.target.value)}
                      className="border border-gray-300 rounded-md text-sm py-2 px-3"
                    >
                      <option value="all">All Components</option>
                      <option value="recyclable">Recyclable Only</option>
                      <option value="non-recyclable">
                        Non-Recyclable Only
                      </option>
                    </select>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingComponentIndex(null);
                        setEditingComponent({
                          name: "",
                          description: "",
                          material: "",
                          weight: 0,
                          recyclable: false,
                        });
                      }}
                    >
                      Add Component
                    </Button>
                  </div>
                </div>

                {product.components && product.components.length > 0 ? (
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle px-6">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Material
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Recyclable
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {product.components
                            .filter((comp: any) => {
                              if (componentFilter === "all") return true;
                              if (componentFilter === "recyclable")
                                return comp.recyclable;
                              if (componentFilter === "non-recyclable")
                                return !comp.recyclable;
                              return true;
                            })
                            .map((component: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {component.name}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {component.material}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {component.recyclable ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditComponent(idx)}
                                    className="text-primary hover:text-primary-dark mr-3"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComponent(idx)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {editingComponent && (
                        <div className="mt-6 border-t pt-6">
                          <h4 className="text-md font-semibold text-gray-dark mb-4">
                            {editingComponentIndex !== null
                              ? "Edit Component"
                              : "Add Component"}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              name="name"
                              placeholder="Component Name"
                              value={editingComponent.name}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  name: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <input
                              type="text"
                              name="material"
                              placeholder="Material"
                              value={editingComponent.material}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  material: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <input
                              type="number"
                              name="weight"
                              placeholder="Weight"
                              value={editingComponent.weight}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  weight: parseFloat(e.target.value),
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="checkbox"
                                name="recyclable"
                                checked={editingComponent.recyclable}
                                onChange={(e) =>
                                  setEditingComponent({
                                    ...editingComponent,
                                    recyclable: e.target.checked,
                                  })
                                }
                              />
                              <label
                                htmlFor="recyclable"
                                className="text-sm text-gray-700"
                              >
                                Recyclable
                              </label>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              className="bg-primary text-white px-4 py-2 rounded"
                              onClick={() => {
                                if (editingComponentIndex !== null) {
                                  handleSaveEditedComponent();
                                } else {
                                  handleAddNewComponent();
                                }
                              }}
                            >
                              {editingComponentIndex !== null
                                ? "Save Changes"
                                : "Add Component"}
                            </button>
                            <button
                              className="text-gray-600 underline"
                              onClick={() => {
                                setEditingComponentIndex(null);
                                setEditingComponent(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {editingComponentIndex !== null && editingComponent && (
                        <div className="mt-6 border-t pt-6">
                          <h4 className="text-md font-semibold text-gray-dark mb-4">
                            Edit Component
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              name="name"
                              placeholder="Component Name"
                              value={editingComponent.name}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  name: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <input
                              type="text"
                              name="material"
                              placeholder="Material"
                              value={editingComponent.material}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  material: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <input
                              type="number"
                              name="weight"
                              placeholder="Weight"
                              value={editingComponent.weight}
                              onChange={(e) =>
                                setEditingComponent({
                                  ...editingComponent,
                                  weight: parseFloat(e.target.value),
                                })
                              }
                              className="border border-gray-300 rounded-md py-2 px-3"
                            />

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="recyclable"
                                checked={editingComponent.recyclable}
                                onChange={(e) =>
                                  setEditingComponent({
                                    ...editingComponent,
                                    recyclable: e.target.checked,
                                  })
                                }
                              />
                              <label
                                htmlFor="recyclable"
                                className="text-sm text-gray-700"
                              >
                                Recyclable
                              </label>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              className="bg-primary text-white px-4 py-2 rounded"
                              onClick={handleSaveEditedComponent}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-600 underline"
                              onClick={() => {
                                setEditingComponentIndex(null);
                                setEditingComponent(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray">No components added yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setEditingComponentIndex(null);
                        setEditingComponent({
                          name: "",
                          description: "",
                          material: "",
                          weight: 0,
                          recyclable: false,
                        });
                      }}
                    >
                      Add First Component
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-dark mb-4">
                  Product Analytics
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">
                          Total Scans
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                          243
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">
                          Last 7 Days
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                          37
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">
                          Unique Users
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                          126
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-dark mb-4">
                      Scan Activity
                    </h4>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray">
                        Chart placeholder - scan activity over time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
