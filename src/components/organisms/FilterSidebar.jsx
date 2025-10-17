import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const FilterSidebar = ({ filters, onFilterChange, categories }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || ""
  });

  const conditions = ["Like New", "Used", "Refurbished"];

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    onFilterChange({
      ...filters,
      minPrice: newRange.min ? parseInt(newRange.min) : undefined,
      maxPrice: newRange.max ? parseInt(newRange.max) : undefined
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== "").length;

  return (
    <div className="bg-surface rounded-lg shadow-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-gray-900 flex items-center gap-2">
          <ApperIcon name="Filter" size={20} className="text-primary" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary">{activeFilterCount}</Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-display font-semibold text-sm text-gray-700">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={(e) => onFilterChange({ 
                  ...filters, 
                  category: e.target.checked ? category.id : undefined 
                })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <ApperIcon name={category.icon} size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 flex-1">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-display font-semibold text-sm text-gray-700">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none"
          />
          <span className="flex items-center text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <h4 className="font-display font-semibold text-sm text-gray-700">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label
              key={condition}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="condition"
                checked={filters.condition === condition}
                onChange={(e) => onFilterChange({ 
                  ...filters, 
                  condition: e.target.checked ? condition : undefined 
                })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;