import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import "../styles.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]); // Store the list of posts
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering posts

  // Fetch posts whenever the page or search query changes
  useEffect(() => {
    fetchPosts();
  }, [page, searchQuery]);

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/posts?page=${page}&search=${searchQuery}`
      );
      setPosts(data.posts); // Update the posts state
      setTotalPages(data.totalPages); // Update the total number of pages
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Handle the search query input
  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state
    setPage(1); // Reset to the first page when a new search query is entered
  };

  return (
    <div>
      <div className="container">
        <h1 className="title">
          <b style={{ color: "rgb(25, 160, 239)" }}>BLOG POINT</b>
        </h1>
        <div className="searcher">
          <SearchBar onSearch={handleSearch} /> {/* Search bar component */}
        </div>
        <ul>
          {posts.map((post) => (
            <li className="posts" key={post._id}>
              <h2>
                <Link to={`/post/${post._id}`}>{post.title}</Link>{" "}
                {/* Link to the detailed view */}
              </h2>
              {page === 1 ? (
                <p>
                  {post.content.substring(0, 100)}...{" "}
                  {/* Show the first 100 characters on the first page */}
                  <Link to={`/post/${post._id}`}>Read more</Link>
                </p>
              ) : (
                <p>{post.content}</p> // Show full content on other pages
              )}
              <p>Tags: {post.tags.join(", ")}</p>
            </li>
          ))}
        </ul>
        <Link to="/create">
          <b className="createpost">Create New Post</b>
        </Link>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
