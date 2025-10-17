import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/hooks/useAuth";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                {currentUser.name}
              </h2>
              <p className="text-gray-500">{currentUser.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <ApperIcon name="Save" size={18} />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountSettingsPage;