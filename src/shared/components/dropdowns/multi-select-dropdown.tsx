// multi-select-dropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import "./multi-select-dropdown.scss";

interface MultiSelectDropdownProps {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleOptionClick = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {value.length === 0 ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          <div className="selected-values">
            {value.slice(0, 2).map((val, index) => (
              <span key={index} className="selected-value">
                {val}
                {index < value.length - 1 &&
                  index === 1 &&
                  value.length > 2 &&
                  ", ..."}
              </span>
            ))}
            {value.length > 2 && (
              <span className="more-count">+{value.length - 2} more</span>
            )}
          </div>
        )}
        <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-item ${
                value.includes(option) ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                readOnly
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
