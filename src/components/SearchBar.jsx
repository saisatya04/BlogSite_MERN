import "../styles.css";

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <>
      <label htmlFor="search-bar">Search</label>
      <input
        className="search-bar"
        type="text"
        placeholder="Search by title or tag"
        onChange={handleInputChange}
      />
    </>
  );
};

export default SearchBar;
