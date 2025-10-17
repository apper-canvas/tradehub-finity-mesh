import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ placeholder = "Search for anything...", size = "lg" }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pr-24 shadow-lg border-gray-200 focus:shadow-xl",
            sizeStyles[size]
          )}
        />
        <Button
          type="submit"
          size={size === "lg" ? "md" : "sm"}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <ApperIcon name="Search" size={18} />
        </Button>
      </div>
    </form>
  );
};

function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export default SearchBar;