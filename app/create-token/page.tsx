"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  BeakerIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

export default function CreateTokenPage() {
  const { connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    decimals: "8",
    totalSupply: "",
    logoUrl: "",
    websiteUrl: "",
    socialLinks: {
      twitter: "",
      telegram: "",
      discord: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("socialLinks.")) {
      const child = field.slice("socialLinks.".length);
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleCreateToken = async () => {
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement token creation logic with Aptos SDK
      console.log("Creating token with data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      alert("Token created successfully!");
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.symbol && formData.totalSupply;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <BeakerIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Create Your Token</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Launch your own fungible token on the Aptos blockchain using DYN tokens
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-semibold mb-6">Token Details</h2>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="token-name" className="block text-sm font-medium mb-2">
                      Token Name *
                    </label>
                    <input
                      id="token-name"
                      type="text"
                      placeholder="e.g., My Awesome Token"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full input-glow"
                    />
                  </div>

                  <div>
                    <label htmlFor="token-symbol" className="block text-sm font-medium mb-2">
                      Symbol *
                    </label>
                    <input
                      id="token-symbol"
                      type="text"
                      placeholder="e.g., MAT"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
                      className="w-full input-glow"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="token-description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="token-description"
                    placeholder="Describe your token and its use case..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full input-glow h-24 resize-none"
                  />
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="token-decimals" className="block text-sm font-medium mb-2">
                      Decimals
                    </label>
                    <select
                      id="token-decimals"
                      value={formData.decimals}
                      onChange={(e) => handleInputChange("decimals", e.target.value)}
                      className="w-full input-glow"
                    >
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="18">18</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="token-supply" className="block text-sm font-medium mb-2">
                      Total Supply *
                    </label>
                    <input
                      id="token-supply"
                      type="number"
                      placeholder="1000000"
                      value={formData.totalSupply}
                      onChange={(e) => handleInputChange("totalSupply", e.target.value)}
                      className="w-full input-glow"
                    />
                  </div>
                </div>

                {/* Media */}
                <div>
                  <label htmlFor="token-logo" className="block text-sm font-medium mb-2">
                    <PhotoIcon className="inline w-4 h-4 mr-2" />
                    Logo URL
                  </label>
                  <input
                    id="token-logo"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                    className="w-full input-glow"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="token-website" className="block text-sm font-medium mb-2">
                    <GlobeAltIcon className="inline w-4 h-4 mr-2" />
                    Website URL
                  </label>
                  <input
                    id="token-website"
                    type="url"
                    placeholder="https://yourproject.com"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                    className="w-full input-glow"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Twitter username (without @)"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
                      className="w-full input-glow"
                    />
                    <input
                      type="text"
                      placeholder="Telegram channel/group"
                      value={formData.socialLinks.telegram}
                      onChange={(e) => handleInputChange("socialLinks.telegram", e.target.value)}
                      className="w-full input-glow"
                    />
                    <input
                      type="text"
                      placeholder="Discord server invite"
                      value={formData.socialLinks.discord}
                      onChange={(e) => handleInputChange("socialLinks.discord", e.target.value)}
                      className="w-full input-glow"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Token Creation</span>
                  <span className="font-medium">100 DYN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Metadata Storage</span>
                  <span className="font-medium">50 DYN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Gas Fee</span>
                  <span className="font-medium">~5 APT</span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="gradient-text">150 DYN + ~5 APT</span>
                </div>
              </div>
            </Card>

            {/* Requirements */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                Requirements
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      connected ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  Wallet Connected
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                  150 DYN Balance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                  5+ APT for Gas
                </li>
              </ul>
            </Card>

            {/* Create Button */}
            <Button
              onClick={handleCreateToken}
              disabled={!connected || !isFormValid || loading}
              // loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Creating Token..." : "Create Token"}
            </Button>

            {!connected && (
              <p className="text-sm text-center text-gray-500">
                Connect your wallet to create tokens
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
