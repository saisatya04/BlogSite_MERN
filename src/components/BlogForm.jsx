import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags.join(", "));
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content, tags: tags.split(",") };

    if (id) {
      await axios.put(`http://localhost:5000/posts/${id}`, postData);
    } else {
      await axios.post("http://localhost:5000/posts", postData);
    }

    navigate("/");
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          className="input"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <input
          className="input"
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default BlogForm;
