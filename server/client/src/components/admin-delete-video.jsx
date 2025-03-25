import { useFormik } from "formik";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin-delete-video.css";


export function AdminDeleteVideo() {

    const [videos, setVideos] = useState([{ VideoId: 0, Title: '', Url: '', Description: '', CategoryId: 0 }]);

    let params = useParams();  //route parameters can be accessed through this(video id coming from dashboard can be accessed here using params.)
    let navigate = useNavigate();

    function handleDeleteVideo() {
        axios.delete(`http://127.0.0.1:5050/delete-video/${params.id}`)
            .then(() => {
                alert("Video deleted succesfully!");
            })
        navigate('/admin-dash');
    }

    useEffect(() => {
        axios.get(`http://127.0.0.1:5050/get-video/${params.id}`)
            .then(response => {
                setVideos(response.data);
                // console.log(response.data);
            })
        // .catch(err => console.error("Error loading video data:", err));
    }, [])

    return (
        <div className="delete-video-container">
            <h5>Are you sure, you want to delete video?</h5>
            <dl>
                <dt>Title</dt>
                <dd>{videos[0].Title}</dd>
                <dt>Description</dt>
                <dd>{videos[0].Description}</dd>
            </dl>
            <div className="btn-group">
                <button onClick={handleDeleteVideo} className="btn btn-danger">Yes</button>
                <Link to="/admin-dash" className="btn btn-warning">No</Link>
            </div>
        </div>
    )
}