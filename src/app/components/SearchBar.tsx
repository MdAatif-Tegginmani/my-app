import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  availableColumns: Column[];
  onColumnSelect: (column: Column) => void;
  existingColumns: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  availableColumns,
  onColumnSelect,
  existingColumns
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredColumns, setFilteredColumns] = useState<Column[]>(availableColumns);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredColumns(availableColumns);
      return;
    }

    const filtered = availableColumns.filter(column =>
      column.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColumns(filtered);
  }, [searchTerm, availableColumns]);

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search columns..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md pl-8"
        />
        <span className="absolute right-2 top-2.5 text-gray-400">
          <Search size={20} />
        </span>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filteredColumns.map((column) => (
          <button
            key={column.id}
            onClick={() => onColumnSelect(column)}
            className={`
              flex items-center gap-2 p-2 rounded-md w-full text-left
              ${existingColumns.includes(column.label) 
                ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                : 'hover:bg-gray-100 cursor-pointer'}
            `}
            disabled={existingColumns.includes(column.label)}
          >
            {column.icon}
            <span className="text-sm">{column.label}</span>
          </button>
        ))}
        {filteredColumns.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 py-2">
            No columns found
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 