import React from 'react';
import {
  Search,
  UserCircle,
  Filter,
  ArrowUpDown,
  Eye,
  LayoutGrid,
  MoreHorizontal,
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Main Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">☰</span>
          <span className="font-medium">Main Table</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        {/* New Task Button */}
        <div className="relative">
          <button className="bg-blue-500 text-white px-4 py-1.5 rounded-md flex items-center gap-2">
            New task
            <span className="text-xs">▼</span>
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Other Tools */}
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-1.5 rounded-md">
            <UserCircle className="w-4 h-4" />
            <span>Person</span>
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-1.5 rounded-md">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            <span className="text-xs">▼</span>
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-1.5 rounded-md">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-1.5 rounded-md">
            <Eye className="w-4 h-4" />
            <span>Hide</span>
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-1.5 rounded-md">
            <LayoutGrid className="w-4 h-4" />
            <span>Group by</span>
          </button>

          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 