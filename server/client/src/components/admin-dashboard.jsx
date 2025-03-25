import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import '../styles/admin-dashboard.css';

export function AdminDashboard() {

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['admin']);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (!cookies.admin) {
            navigate('/admin-login', { replace: true });  // Prevent going back
        }
        fetchVideos();
    }, [cookies, navigate]);

    // Fetch videos
    const fetchVideos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5050/get-videos");
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    // Handle signout
    const handleSignoutClick = () => {
        alert("Signed out successfully!");
        removeCookie('admin');
        navigate('/admin-login', { replace: true }); // Redirect & prevent going back
    };

    return (
        <div className="admin-container">

            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={handleSignoutClick} className="btn signout-btn m-0">
                    <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>

            <div className="add-video-section">
                <Link to="/add-video" className="btn">
                    <i className="bi bi-camera-video me-1"></i> Add Video
                </Link>
            </div>

            <div className="video-table-container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="title-col">Title</th>
                            <th className="preview-col">Preview</th>
                            <th className="actions-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <tr key={video.VideoId}>
                                    <td className="title-cell">{video.Title}</td>
                                    <td className="preview-cell">
                                        <iframe
                                            src={video.Url}
                                            title={video.Title}
                                            className="video-frame"
                                        ></iframe>
                                    </td>
                                    <td className="action-buttons">
                                        <Link to={`/edit-video/${video.VideoId}`} className="btn btn-warning m-1">
                                            <i className="bi bi-pen-fill"></i>
                                        </Link>
                                        <Link to={`/delete-video/${video.VideoId}`} className="btn btn-danger m-1">
                                            <i className="bi bi-trash-fill"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No videos available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
