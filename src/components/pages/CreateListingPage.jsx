import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import categoryService from "@/services/api/categoryService";
import productService from "@/services/api/productService";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      const data = await categoryService.getAll();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const conditions = ["Like New", "Used", "Refurbished"];

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
    }

    if (currentStep === 2) {
      if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
      if (!formData.condition) newErrors.condition = "Condition is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      setSubmitting(true);
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: "1"
      };
      await productService.create(newProduct);
      toast.success("Listing created successfully!");
      navigate("/my-listings");
    } catch (err) {
      toast.error("Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-2">
          Create New Listing
        </h1>
        <p className="text-gray-600">
          List your item in just a few simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                num === step
                  ? "bg-primary text-white shadow-lg scale-110"
                  : num < step
                  ? "bg-success text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {num < step ? <ApperIcon name="Check" size={20} /> : num}
            </div>
            {num < 3 && (
              <div
                className={`w-16 h-1 mx-2 transition-colors ${
                  num < step ? "bg-success" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-surface rounded-lg shadow-card p-6 md:p-8 space-y-6"
      >
        {step === 1 && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., iPhone 13 Pro Max 256GB"
                error={errors.title}
              />
              {errors.title && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your item in detail..."
                rows={5}
                className={`w-full px-4 py-2.5 bg-white border-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400 ${
                  errors.description ? "border-error" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.category ? "border-error" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.Id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.category}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                  error={errors.price}
                />
              </div>
              {errors.price && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {conditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => updateField("condition", condition)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.condition === condition
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
              {errors.condition && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.condition}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <Input
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
                error={errors.location}
              />
              {errors.location && (
                <p className="text-error text-sm flex items-center gap-1">
                  <ApperIcon name="AlertCircle" size={14} />
                  {errors.location}
                </p>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ApperIcon name="Eye" size={40} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                Review Your Listing
              </h3>
              <p className="text-gray-600">
                Make sure everything looks good before publishing
              </p>
            </div>

            <div className="space-y-4 p-6 bg-background rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-semibold text-gray-900">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-gray-900">
                  {categories.find(c => c.id === formData.category)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-display font-bold text-2xl text-primary">
                  ${parseFloat(formData.price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-semibold text-gray-900">{formData.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-900">{formData.location}</span>
              </div>
            </div>

            <div className="p-4 bg-info/10 border-2 border-info/20 rounded-lg">
              <div className="flex gap-3">
                <ApperIcon name="Info" size={20} className="text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Before you publish:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Double-check all information is accurate</li>
                    <li>Ensure your price is competitive</li>
                    <li>Your listing will be visible to all users</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={submitting}
            >
              <ApperIcon name="ChevronLeft" size={18} className="mr-2" />
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ApperIcon name="ChevronRight" size={18} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="ml-auto"
            >
              {submitting ? (
                <>
                  <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <ApperIcon name="Check" size={18} className="mr-2" />
                  Publish Listing
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListingPage;