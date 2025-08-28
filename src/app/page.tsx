"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Database,
  Zap,
  Shield,
  Users,
  Rocket,
  Code,
  User,
  LogOut,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { AuthModal } from "@/components/auth/auth-modal";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
                BackForge
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              A modern, scalable platform built with cutting-edge technologies.
              <span className="text-cyan-400 font-medium">
                {" "}
                Streamline your development workflow
              </span>{" "}
              with powerful tools and beautiful UI components.
            </p>

            {/* Conditional Content Based on Auth Status */}
            {!isAuthenticated ? (
              // Unauthenticated User - Show Sign In Button
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button
                  size="lg"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 py-4 text-xl font-semibold shadow-2xl shadow-cyan-500/25 border-0 transition-all duration-300 transform hover:scale-105"
                >
                  <Rocket className="mr-3 w-6 h-6" />
                  Sign In
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-4 text-xl font-semibold border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-sm transition-all duration-300"
                >
                  View Documentation
                </Button>
              </div>
            ) : (
              // Authenticated User - Show Welcome Message and Actions
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                  <Avatar className="w-16 h-16 border-2 border-cyan-500/30">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white">
                      Welcome back, {user?.name}!
                    </h3>
                    <p className="text-cyan-200">
                      Ready to continue building amazing things?
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/chat")}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold shadow-2xl shadow-cyan-500/25 border-0 transition-all duration-300 transform hover:scale-105"
                  >
                    <User className="mr-2 w-5 h-5" />
                    Go to Chat
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/weather")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 text-lg font-semibold shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300 transform hover:scale-105"
                  >
                    <Zap className="mr-2 w-5 h-5" />
                    Check Weather
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/gallery")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 text-lg font-semibold shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="mr-2 w-5 h-5" />
                    Gallery
                  </Button>
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                <span className="font-semibold text-cyan-300">Next.js 15</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="font-semibold text-blue-300">TypeScript</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <div className="w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"></div>
                <span className="font-semibold text-indigo-300">
                  Tailwind CSS
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                <span className="font-semibold text-purple-300">ShadCN UI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 bg-gradient-to-b from-transparent to-black/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                BackForge
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Built with modern technologies and best practices to deliver
              exceptional performance and developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 border border-cyan-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Lightning Fast
                </CardTitle>
                <CardDescription className="text-cyan-200 text-base leading-relaxed">
                  Built with Next.js 15 and Turbopack for blazing fast
                  development and production performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-blue-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Type Safe
                </CardTitle>
                <CardDescription className="text-blue-200 text-base leading-relaxed">
                  Full TypeScript support with comprehensive type checking and
                  IntelliSense for better development experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-105 border border-indigo-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Beautiful UI
                </CardTitle>
                <CardDescription className="text-indigo-200 text-base leading-relaxed">
                  Stunning components with ShadCN UI and Tailwind CSS for
                  consistent, accessible, and modern design.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section
        id="components"
        className="relative py-24 bg-gradient-to-b from-black/20 to-slate-900/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Feature Library
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive collection of beautifully designed,
              accessible UI components.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Feature */}
            <Card className="border bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 border border-cyan-500/20 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="text-xl">Real-time Chat</span>
                </CardTitle>
                <CardDescription className="text-cyan-200 text-base text-center">
                  Connect with users through instant messaging with real-time
                  updates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg border border-cyan-500/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div className="w-full h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/chat")}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300"
                  >
                    Start Chatting
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Feature */}
            <Card className="border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-blue-500/20 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <span className="text-xl">Weather Dashboard</span>
                </CardTitle>
                <CardDescription className="text-blue-200 text-base text-center">
                  Get real-time weather information and forecasts for any
                  location
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="w-full h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-lg border border-indigo-500/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/weather")}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    Check Weather
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Feature */}
            <Card className="border bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 border border-purple-500/20 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xl">Online Gallery</span>
                </CardTitle>
                <CardDescription className="text-purple-200 text-base text-center">
                  Store and organize your photos and videos in a beautiful
                  online gallery
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="w-full h-16 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-lg border border-pink-500/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/gallery")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300"
                  >
                    Explore Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Architecture Section */}
      <section
        id="api"
        className="relative py-24 bg-gradient-to-b from-slate-900/50 to-black/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              API Architecture
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Modern API integration with Axios, React Query, and custom hooks
              for seamless backend communication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 border border-green-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Axios Client
                </CardTitle>
                <CardDescription className="text-green-200 text-base leading-relaxed">
                  Robust HTTP client with interceptors, automatic token
                  handling, and comprehensive error management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 border border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  React Query
                </CardTitle>
                <CardDescription className="text-purple-200 text-base leading-relaxed">
                  Powerful server state management with caching, background
                  updates, and optimistic mutations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105 border border-orange-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Custom Hooks
                </CardTitle>
                <CardDescription className="text-orange-200 text-base leading-relaxed">
                  Reusable hooks for authentication, CRUD operations, and common
                  API patterns.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Card className="border bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white mb-4">
                  Ready to Connect
                </CardTitle>
                <CardDescription className="text-cyan-200 text-lg">
                  Your backend is running on localhost:3001. The frontend is
                  configured to connect automatically. Check the documentation
                  for implementation details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
                    View API Docs
                  </Button>
                  <Button
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    Explore Hooks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
