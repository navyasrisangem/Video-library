import { useFormik } from "formik";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin-edit-add-video.css";


export function AdminEditVideo() {   //the process is we are getting the video by the videoid through params & storing it in the videos
    //and then assigning it to the initial values
    const [categories, setCategories] = useState([]);
    const [videos, setVideos] = useState([{ VideoId: 0, Title: '', Url: '', Description: '', CategoryId: 0 }]);

    let params = useParams();  //route parameters can be accessed through this(video id coming from dashboard can be accessed here using params.)
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {       // we are attatching the initial video values values to this.
            VideoId: videos[0].VideoId,
            Title: videos[0].Title,
            Url: videos[0].Url,
            Description: videos[0].Description,
            CategoryId: videos[0].CategoryId
        },
        onSubmit: (values) => {
            axios.put(`http://127.0.0.1:5050/edit-video/${params.id}`, values) //values is collecting videos from form.
                .then(() => {
                    alert("Video edited successfully!");
                })
            navigate('/admin-dash');
        },
        enableReinitialize: true
    });

    function LoadCategories() {
        axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(response => {
                response.data.unshift({ CategoryId: -1, CategoryName: 'Select a category' });
                setCategories(response.data);
            })
        // .catch(err => console.error("Error loading categories:", err));
    }

    useEffect(() => {
        LoadCategories();
        axios.get(`http://127.0.0.1:5050/get-video/${params.id}`)
            .then(response => {
                setVideos(response.data);
                // console.log(response.data);
            })
        // .catch(err => console.error("Error loading video data:", err));
    }, [])


    return (
        <div className="edit-video-container">
            <h3 className="text-center">Edit Video</h3>
            <form onSubmit={formik.handleSubmit} className="edit-video-form">
                <dl>
                    <dt>Video Id</dt>
                    <dd><input type="number" value={formik.values.VideoId} className="form-control" name="VideoId" onChange={formik.handleChange} /></dd>
                    <dt>Title</dt>
                    <dd><input type="text" value={formik.values.Title} className="form-control" name="Title" onChange={formik.handleChange} /></dd>
                    <dt>Url</dt>
                    <dd><input type="text" value={formik.values.Url} className="form-control" name="Url" onChange={formik.handleChange} /></dd>
                    <dt>Description</dt>
                    <dd><textarea rows="2" value={formik.values.Description} cols="40" className="form-control" name="Description" onChange={formik.handleChange} /></dd>
                    <dt>Category</dt>
                    <dd>
                        <select className="form-select" value={formik.values.CategoryId} name="CategoryId" onChange={formik.handleChange}>{
                            categories.map(category =>  //we will show category name but we will submit category id through value.
                                <option key={category.CategoryId} value={category.CategoryId}>{category.CategoryName}</option>
                            )
                        }
                        </select>
                    </dd>
                </dl>
                <div className="btn-group">
                    <button className="btn btn-success">Save video</button>
                    <Link to="/admin-dash" className="btn btn-danger ms-2">Cancel</Link>
                </div>
            </form>
        </div>
    )
}