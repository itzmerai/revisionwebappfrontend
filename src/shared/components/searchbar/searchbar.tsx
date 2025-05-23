import React from "react";
import "./searchbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  onFilter?: (filterValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search", 
  onSearch,
  filterOptions,
  onFilter 
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter?.(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </div>
      {filterOptions && (
        <div className="filter">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <select onChange={handleFilterChange} defaultValue="all">
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 