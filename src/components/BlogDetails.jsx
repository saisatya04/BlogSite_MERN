import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const BlogDetails = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/posts/${id}`).then(({ data }) => {
      setPost(data);
    });
  }, [id]);

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/posts/${id}`);
    navigate("/");
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Tags: {post.tags.join(", ")}</p>
      <Link to={`/edit/${id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default BlogDetails;
