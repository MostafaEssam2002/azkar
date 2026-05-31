const SearchBar = ({ value, onChange }) => (
  <div className="radio-app__search-wrap">
    <input
      value={value}
      onChange={onChange}
      placeholder="ابحث عن قارئ..."
      className="radio-app__search-input"
    />
    <span className="radio-app__search-icon">🔍</span>
  </div>
);

export default SearchBar;
