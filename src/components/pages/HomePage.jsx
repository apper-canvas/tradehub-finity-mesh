import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const HomePage = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState("");

const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Trusted Marketplace
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Buy and sell with confidence. Connect with verified sellers and discover amazing deals in a secure, community-driven platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/search")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg gap-2 shadow-lg"
            >
              <ApperIcon name="Search" size={24} />
              Start Browsing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/sell")}
              className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-6 text-lg gap-2"
            >
              <ApperIcon name="Plus" size={24} />
              Start Selling
            </Button>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "1",
                icon: "UserPlus",
                title: "Create Your Account",
                description: "Sign up in seconds and join our growing community of buyers and sellers."
              },
              {
                step: "2",
                icon: "Upload",
                title: "List Your Items",
                description: "Upload photos, add descriptions, and set your price. It's quick and easy."
              },
              {
                step: "3",
                icon: "ShoppingBag",
                title: "Buy or Sell Safely",
                description: "Complete transactions securely with our trusted payment system and verified users."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name={item.icon} size={32} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <ApperIcon name="ShieldCheck" size={48} className="text-primary" />
                </div>
                <div className="font-display font-bold text-5xl text-primary mb-2">
                  500+
                </div>
                <div className="text-lg text-gray-700 font-medium">
                  Verified Sellers
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  All sellers undergo verification to ensure authenticity and reliability
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <ApperIcon name="TrendingUp" size={48} className="text-accent" />
                </div>
                <div className="font-display font-bold text-5xl text-accent mb-2">
                  10,000+
                </div>
                <div className="text-lg text-gray-700 font-medium">
                  Successful Transactions
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Thousands of satisfied buyers and sellers completing deals daily
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from our community members
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Frequent Buyer",
                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                rating: 5,
                text: "I've been using TradeHub for 6 months and found amazing deals on electronics. The sellers are verified and responsive. Highly recommend!"
              },
              {
                name: "Michael Chen",
                role: "Active Seller",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                rating: 5,
                text: "As a seller, TradeHub has been fantastic. The platform is easy to use and I've connected with serious buyers. Great community!"
              },
              {
                name: "Emily Rodriguez",
                role: "Happy Customer",
                photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                rating: 5,
                text: "Safe, secure, and reliable. I've made multiple purchases without any issues. The verification process gives me peace of mind."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 space-y-4 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <ApperIcon key={i} name="Star" size={20} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
              Why Choose TradeHub
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a safe and seamless trading experience
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "Lock",
                title: "Secure Payments",
                description: "All transactions are protected with industry-standard encryption and secure payment processing."
              },
              {
                icon: "BadgeCheck",
                title: "Verified Sellers",
                description: "Every seller goes through our verification process to ensure authenticity and trustworthiness."
              },
              {
                icon: "Zap",
                title: "Easy Listing",
                description: "List your items in minutes with our intuitive interface. Upload photos and set your price easily."
              },
              {
                icon: "Users",
                title: "Community Support",
                description: "Join a thriving community of buyers and sellers. Get help and advice from experienced members."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
                  <ApperIcon name={benefit.icon} size={32} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 md:p-12 text-white text-center space-y-6 shadow-xl"
          >
            <ApperIcon name="Mail" size={48} className="mx-auto" />
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Stay Updated
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest deals, tips, and platform updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900 border-white"
                />
                <Button
                  type="submit"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p className="text-sm opacity-75">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;