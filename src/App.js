import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

// Define the API key and the base URL
const apiKey = '48a05cc1c4384dd68cc2c6f7d812b33a';
const baseUrl = 'https://newsapi.org/v2';

// Create an axios instance with the API key as a header
const newsApi = axios.create({
  headers: {
    'X-Api-Key': apiKey
  }
});

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the endpoint URL with the country parameter
        const endpoint = `${baseUrl}/top-headlines?country=in`;

        // Make a GET request to the endpoint and get the response data
        const response = await newsApi.get(endpoint);
        const data = response.data;

        // Check the status of the response and set the state accordingly
        if (data.status === 'ok') {
          if (data.articles.length === 0) {
            throw new Error("Results not found");
          }
          setPosts(data.articles);
          setLoading(false);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        // Handle any errors that may occur
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          // The request was made but no response was received
          setError("Error: Network issue. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (post) => {
    window.open(post.url, "_blank");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Top Headlines from India</h1>
      <div
        className="card-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {posts.map((post) => (
          <div className="card" key={post.url}>
            {post.urlToImage && (
              <img src={post.urlToImage} alt={post.title} />
            )}
            <div className="card-content">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              {post.url && (
                <a href={post.url} target="_blank" rel="noreferrer">
                  Read more
                </a>
              )}
              {post.author && (
                <p>By {post.author}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;