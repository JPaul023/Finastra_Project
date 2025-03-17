import React from "react";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      className="form-control w-50"
      placeholder="Search orders..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      style={{ height: "3rem" }}
    />
  );
};

export default SearchBar;
