import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToViewLater, removeFromViewLater, setWatchLater, clearWatchLater } from "../slicers/video-slicer";
import store from "../store/store";
import '../styles/user-dashboard.css';

export function UserDashboard() {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


  const watchLater = useSelector(state => state.store?.Videos || []);
  const videosCount = useSelector(state => state.store?.VideosCount || 0);



  useEffect(() => {
    if (!cookies.username) {
      navigate('/user-login', { replace: true });  // Redirect and prevent going back
    }

    loadWatchLater();

    fetchCategories();
    fetchVideos();
  }, [cookies, navigate]);

  const loadWatchLater = () => {
    const storedVideos = localStorage.getItem(`watchLater_${cookies.username}`);
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      dispatch(setWatchLater(parsedVideos));
    } else {
      dispatch(setWatchLater([]));  // Empty list for new users
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5050/get-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchVideos = async (categoryId = "") => {
    try {
      const url = categoryId
        ? `http://127.0.0.1:5050/filter-videos/${categoryId}`
        : `http://127.0.0.1:5050/get-videos`;

      const response = await axios.get(url);
      setVideos(response.data);
      setFilteredVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchVideos(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setFilteredVideos(videos);  // Reset to all videos if search term is empty
      alert("Please enter a search term!");
      return;
    }

    const filtered = videos.filter(video =>
      video.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      if (selectedCategory) {
        alert("No videos related to this topic in the selected category!");
      } else {
        alert("No videos found! Please search for a valid topic.");
      }
    }

    setFilteredVideos(filtered);
    setSearchTerm("");
  };

  function handleSignoutClick() {
    alert("Signed out successfully!");

    // Clear Redux but keep localStorage intact
    dispatch(clearWatchLater());

    removeCookie('username');
    navigate('/user-login', { replace: true });   // Redirect & prevent going back
  }

  function handleSaveClick(video) {
    const storedVideos = localStorage.getItem(`watchLater_${cookies.username}`);
    const watchLaterList = storedVideos ? JSON.parse(storedVideos) : [];

    const isDuplicate = watchLaterList.some((v) => v.VideoId === video.VideoId);

    if (isDuplicate) {
      alert("Video is already saved in Watch Later!");
      return;
    }

    alert("Video saved successfully!");

    const updatedList = [...watchLaterList, video];

    // Save to both Redux and localStorage
    dispatch(addToViewLater(video));
    localStorage.setItem(`watchLater_${cookies.username}`, JSON.stringify(updatedList));
  }



  const handleRemoveClick = (videoId) => {
    dispatch(removeFromViewLater(videoId));

    const updatedList = watchLater.filter(video => video.VideoId !== videoId);
    localStorage.setItem(`watchLater_${cookies.username}`, JSON.stringify(updatedList));
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };


  return (
    <div className="dashboard-container">
      <h2>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span>User Dashboard</span>
          </div>
          <div>
            <button
              className="btn me-2"
              style={{ backgroundColor: '#00246B', color: '#CADCFC' }}
              onClick={() => setModalOpen(true)}
            >
              {videosCount}
            </button>
            <button onClick={handleSignoutClick} className="btn" style={{ backgroundColor: '#00246B', color: '#CADCFC' }}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </h2>

      <div className="row">
        <div className="col-12 col-md-3">
          <div>
            <label className="form-label fw-bold">Search Videos</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search here"
              />
              <button
                className="bi bi-search btn"
                style={{ backgroundColor: '#00246B', color: '#CADCFC' }}
                onClick={handleSearchClick}
              >
              </button>
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Select Categories</label>
            <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.CategoryId}>
                  {cat.CategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-md-9">
          <section className="video-container">
            <div className="d-flex flex-wrap">
              {filteredVideos.length > 0 ? (
                filteredVideos.map(video => (
                  <div key={video.VideoId} className="card m-2 p-2 video-card">
                    <div className="card-title">
                      <h5 className="m-0">{video.Title}</h5>
                    </div>
                    <div className="card-body">
                      {video.Url ? (
                        <iframe
                          src={video.Url}
                          className="w-100 video-iframe"
                          height="200"
                          title={video.Title}
                        ></iframe>
                      ) : (
                        <p>No video URL available</p>
                      )}
                    </div>
                    <div className="card-footer text-center">
                      <button onClick={() => handleSaveClick(video)} className="bi bi-download btn">
                        Watch later
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No videos found!</p>
              )}
            </div>
          </section>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {watchLater.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr style={{ color: '#00246B' }}>
                    <th>Title</th>
                    <th>Preview</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchLater.map((video) => (
                    <tr key={video.VideoId}>
                      <td>{video.Title}</td>
                      <td>
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.Url)}`}
                          className="preview-iframe"
                          title={video.Title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveClick(video.VideoId)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-cart-container">
                <p>No items in cart.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
