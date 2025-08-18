'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { Rocket, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  // Custom navigation configuration for 404 page
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-slate-900/50 to-gray-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-gray-200">This feature is coming soon</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Link href="/">
            <Button className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white shadow-lg shadow-slate-500/25 px-8 py-3 text-lg">
              <Home className="w-6 h-6 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    ),
  };

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-500/30">
                <Rocket className="w-16 h-16 text-slate-400" />
              </div>
              <h1 className="text-6xl font-bold text-white mb-6">Coming Soon</h1>
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                This feature is currently under development and will be available soon.
                We're working hard to bring you something amazing!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white shadow-lg shadow-slate-500/25 px-8 py-4 text-xl font-semibold">
                    <Home className="w-6 h-6 mr-3" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="px-8 py-4 text-xl font-semibold border-2 border-slate-500/50 text-slate-400 hover:bg-slate-500/10 backdrop-blur-sm"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-6 h-6 mr-3" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Features Grid */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">What's Available Now</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              While you wait, explore our current features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gallery Feature */}
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 border border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-white mb-2">Online Gallery</CardTitle>
                <CardDescription className="text-purple-200 text-base leading-relaxed">
                  Store and organize your photos and videos in a beautiful online gallery
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/gallery">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
                    Explore Gallery
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Chat Feature */}
            <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 border border-cyan-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-white mb-2">Real-time Chat</CardTitle>
                <CardDescription className="text-cyan-200 text-base leading-relaxed">
                  Connect with users through instant messaging with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/chat">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25">
                    Start Chatting
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Weather Feature */}
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-blue-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-white mb-2">Weather Dashboard</CardTitle>
                <CardDescription className="text-blue-200 text-base leading-relaxed">
                  Get real-time weather information and forecasts for any location
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/weather">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                    Check Weather
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center mt-16">
            <Card className="border-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 backdrop-blur-xl shadow-2xl shadow-slate-500/10 border border-slate-500/20 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white mb-4">More Features Coming Soon</CardTitle>
                <CardDescription className="text-slate-200 text-lg">
                  We're constantly working on new features. Stay tuned for updates!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 shadow-lg shadow-slate-500/25">
                    Subscribe to Updates
                  </Button>
                  <Button variant="outline" className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                    View Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
