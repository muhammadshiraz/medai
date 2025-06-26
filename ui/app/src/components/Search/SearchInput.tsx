// src/components/Search/SearchInput.tsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search patients...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:border-medical-primary transition-all bg-white dark:bg-gray-900 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-400 placeholder-gray-400"
        value={value}
        onChange={onChange}
        aria-label="Search"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;