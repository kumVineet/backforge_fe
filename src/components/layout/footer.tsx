import { Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Code className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                BackForge
              </span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              A modern platform built with Next.js, TypeScript, and ShadCN UI.
              Streamline your development workflow with powerful tools and
              beautiful components.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Community
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 BackForge. Built with ❤️ using Next.js and ShadCN UI.
          </p>
        </div>
      </div>
    </footer>
  );
}
