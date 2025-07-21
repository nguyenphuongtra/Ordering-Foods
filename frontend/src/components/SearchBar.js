import React from 'react';
import {Search} from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="input-group mb-3">
    <span className="input-group-text"><Search size={16}/></span>
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={e=>onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;