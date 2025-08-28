'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchControlsProps {
  searchType: 'conversations' | 'users';
  searchQuery: string;
  userSearchQuery: string;
  onSearchTypeChange: (type: 'conversations' | 'users') => void;
  onSearchQueryChange: (query: string) => void;
  onUserSearchQueryChange: (query: string) => void;
}

export function SearchControls({
  searchType,
  searchQuery,
  userSearchQuery,
  onSearchTypeChange,
  onSearchQueryChange,
  onUserSearchQueryChange
}: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-8">
      <div className="flex items-center space-x-4">
        {/* Search Type Toggle */}
        <div className="flex rounded-lg border border-white/20 overflow-hidden">
          <button
            onClick={() => onSearchTypeChange('conversations')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              searchType === 'conversations'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => onSearchTypeChange('users')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              searchType === 'users'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Users
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={searchType === 'conversations' ? "Search conversations..." : "Search users..."}
            value={searchType === 'conversations' ? searchQuery : userSearchQuery}
            onChange={(e) => {
              if (searchType === 'conversations') {
                onSearchQueryChange(e.target.value);
              } else {
                onUserSearchQueryChange(e.target.value);
              }
            }}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 w-64"
          />
        </div>
      </div>
    </div>
  );
}
