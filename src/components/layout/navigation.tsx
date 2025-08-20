"use client";

import { Button } from "@/components/ui/button";
import { Code, Menu, X, User, LogOut, LogIn } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { AuthModal } from "@/components/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-auth";

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
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { logout: logoutUser } = useLogout();

  const isHomePage = pathname === "/";
  const hasCustomization = !!customization;

  const handleOpenSignIn = useCallback(() => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  }, []);

  const handleOpenSignUp = useCallback(() => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setMobileMenuOpen(false);
    }
  }, [logoutUser]);

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

            {/* User Avatar and Authentication */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback className={`text-white font-semibold ${
                        isAuthenticated
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-base'
                          : 'bg-gray-600'
                      }`}>
                        {isAuthenticated && user?.name
                          ? user.name.charAt(0).toUpperCase()
                          : <User className="w-5 h-5" />
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 rounded-xl" align="end" forceMount>
                  {isAuthenticated ? (
                    <>
                      {/* User Info Section */}
                      <div className="flex items-center gap-3 p-3 mb-3 mt-3 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 rounded-lg border border-cyan-100/30">
                        <Avatar className="h-12 w-12 border-2 border-cyan-200/50">
                          <AvatarImage src={user?.profileImage} alt={user?.name} />
                          <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold text-lg">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                      {/* Navigation Items */}
                      <div className="space-y-1">
                        <DropdownMenuItem asChild className="group">
                          <Link href="/profile" className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-200 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:from-cyan-200 group-hover:to-blue-200 transition-all duration-200">
                              <User className="w-4 h-4 text-cyan-600" />
                            </div>
                            <span className="font-medium">Profile</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="group">
                          <Link href="/settings" className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="font-medium">Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                      {/* Logout Section */}
                      <DropdownMenuItem
                        className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-center justify-center mr-3 hover:from-red-200 hover:to-pink-200 transition-all duration-200">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">Log out</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      {/* Sign In Section */}
                      <div className="space-y-1">
                        <DropdownMenuItem
                          className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-200 cursor-pointer"
                          onClick={handleOpenSignIn}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mr-3 hover:from-cyan-200 hover:to-blue-200 transition-all duration-200">
                            <LogIn className="w-4 h-4 text-cyan-600" />
                          </div>
                          <span className="font-medium">Sign In</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                          onClick={handleOpenSignUp}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </div>
                          <span className="font-medium">Create Account</span>
                        </DropdownMenuItem>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImage} alt={user?.name} />
                          <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleOpenSignIn}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={handleCloseAuthModal} initialMode={authMode} />
    </>
  );
}
