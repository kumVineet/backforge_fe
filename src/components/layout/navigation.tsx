"use client";

import { Button } from "@/components/ui/button";
import { Code, Menu, X } from "lucide-react";
import { useState, useCallback } from "react";
import { AuthModal } from "@/components/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavigationCustomization {
  backgroundColor?: string;
  content?: React.ReactNode;
  showLogo?: boolean;
  logoText?: string;
}

interface NavigationProps {
  customization?: NavigationCustomization;
}

export function Navigation({ customization }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const hasCustomization = !!customization;

  const handleGetStarted = useCallback(() => {
    setAuthModalOpen(true);
    setMobileMenuOpen(false); // Close mobile menu if open
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Determine background color based on customization or default
  const getBackgroundColor = () => {
    if (customization?.backgroundColor) {
      return customization.backgroundColor;
    }
    return isHomePage ? "bg-black/20" : "bg-purple-900/50";
  };

  return (
    <>
      <nav
        className={`relative border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 ${getBackgroundColor()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Code className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {customization?.logoText || (isHomePage ? "BackForge" : "BF")}
              </span>
            </Link>

            {/* Custom Navigation Content */}
            {hasCustomization && customization?.content && (
              <div className="flex-1 flex justify-center">
                {customization.content}
              </div>
            )}

            {/* Default Navigation - Only show on home page when no customization */}
            {isHomePage && !hasCustomization && (
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#components"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  Features
                </a>
                <a
                  href="#api"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  API
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  About
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleMobileMenu}
                className="text-gray-300 hover:text-cyan-400"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Default CTA Button - Only show on home page when no customization */}
            {isHomePage && !hasCustomization && (
              <div className="hidden md:block">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Menu - Only show on home page when no customization */}
          {mobileMenuOpen && isHomePage && !hasCustomization && (
            <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#components"
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  Features
                </a>
                <a
                  href="#api"
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  API
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  About
                </a>
                <div className="pt-2">
                  <Button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
}
