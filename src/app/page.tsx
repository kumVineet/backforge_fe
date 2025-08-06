import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Code, Database, Zap, Shield, Users, Star, Sparkles, Rocket, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
      
      {/* Navigation */}
      <nav className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                BackForge
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Features</a>
              <a href="#components" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Components</a>
              <a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">About</a>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center relative z-10">
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Built with Next.js 15 & ShadCN UI
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
                BackForge
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              A modern, scalable backend platform built with cutting-edge technologies. 
              <span className="text-cyan-400 font-medium"> Streamline your development workflow</span> with powerful tools and beautiful UI components.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 py-4 text-xl font-semibold shadow-2xl shadow-cyan-500/25 border-0 transition-all duration-300 transform hover:scale-105">
                <Rocket className="mr-3 w-6 h-6" />
                Start Building
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button size="lg" variant="outline" className="px-10 py-4 text-xl font-semibold border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-sm transition-all duration-300">
                View Documentation
              </Button>
            </div>
            
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
                <span className="font-semibold text-indigo-300">Tailwind CSS</span>
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
      <section id="features" className="relative py-24 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BackForge</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Built with modern technologies and best practices to deliver exceptional performance and developer experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 border border-cyan-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">Lightning Fast</CardTitle>
                <CardDescription className="text-cyan-200 text-base leading-relaxed">
                  Built with Next.js 15 and Turbopack for blazing fast development and production performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-blue-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">Type Safe</CardTitle>
                <CardDescription className="text-blue-200 text-base leading-relaxed">
                  Full TypeScript support with comprehensive type checking and IntelliSense for better development experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-105 border border-indigo-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">Beautiful UI</CardTitle>
                <CardDescription className="text-indigo-200 text-base leading-relaxed">
                  Stunning components with ShadCN UI and Tailwind CSS for consistent, accessible, and modern design.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section id="components" className="relative py-24 bg-gradient-to-b from-black/20 to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Component Library</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive collection of beautifully designed, accessible UI components.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Interactive Components */}
            <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">Interactive Elements</span>
                </CardTitle>
                <CardDescription className="text-cyan-200 text-lg">Buttons, inputs, and form controls with multiple variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">Small</Button>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">Default</Button>
                    <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">Large</Button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">Secondary</Button>
                    <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">Outline</Button>
                    <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">Ghost</Button>
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25">Destructive</Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="demo-email" className="text-sm font-semibold text-cyan-300">Email Address</Label>
                    <Input id="demo-email" type="email" placeholder="Enter your email" className="w-full bg-white/5 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="demo-password" className="text-sm font-semibold text-cyan-300">Password</Label>
                    <Input id="demo-password" type="password" placeholder="Enter your password" className="w-full bg-white/5 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Components */}
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">Display Components</span>
                </CardTitle>
                <CardDescription className="text-blue-200 text-lg">Cards, avatars, badges, and data presentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold text-lg">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white text-lg">John Doe</p>
                    <p className="text-sm text-cyan-300">Software Engineer</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1">Active</Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border border-white/20 px-3 py-1">Beta</Badge>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 px-3 py-1">New</Badge>
                  <Badge variant="destructive" className="bg-red-500 text-white px-3 py-1">Error</Badge>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <p className="font-semibold text-cyan-300">Pro Tip</p>
                  </div>
                  <p className="text-sm text-cyan-200 leading-relaxed">
                    All components are fully accessible and customizable. Use the <code className="bg-cyan-500/20 px-2 py-1 rounded text-xs text-cyan-300">cn()</code> utility for easy styling.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-2xl text-cyan-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers building amazing applications with BackForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="px-10 py-4 text-xl font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm">
              View Documentation
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-xl font-semibold shadow-2xl shadow-black/25 transform hover:scale-105 transition-all duration-300">
              <Rocket className="mr-3 w-6 h-6" />
              Start Building
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BackForge</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                A modern backend platform built with Next.js, TypeScript, and ShadCN UI. 
                Streamline your development workflow with powerful tools and beautiful components.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">API Reference</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Examples</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Community</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">GitHub</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Discord</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 BackForge. Built with ❤️ using Next.js and ShadCN UI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
