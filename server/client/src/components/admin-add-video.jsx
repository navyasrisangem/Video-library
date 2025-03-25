import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import "../styles/admin-edit-add-video.css";


export function AdminAddVideo() {

    const [categories, setCategories] = useState([{ CategoryId: 0, CategoryName: '' }]);

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            VideoId: 0,
            Title: '',
            Url: '',
            Description: '',
            CategoryId: 0,
        },

        onSubmit: (video) => {
            axios.post("https://video-library-z8t4.onrender.com/add-video", video)
                .then(() => {
                    alert(`Video added succesfully`);
                })
            navigate('/admin-dash');
        }
    })

    useEffect(() => {
        axios.get("https://video-library-z8t4.onrender.com/get-categories")
            .then(response => {
                response.data.unshift({
                    CategoryId: 0,
                    CategoryName: 'Select Category'
                })
                setCategories(response.data);
            })
    })

    return (
        <div className="add-video-container">
            <h3 className="text-center">Add new video</h3>
            <form onSubmit={formik.handleSubmit} className="add-video-form">
                <dl>
                    <dt>Video Id</dt>
                    <dd><input type="number" className="form-control" name="VideoId" onChange={formik.handleChange} /></dd>
                    <dt>Title</dt>
                    <dd><input type="text" className="form-control" name="Title" onChange={formik.handleChange} /></dd>
                    <dt>Url</dt>
                    <dd><input type="text" className="form-control" name="Url" onChange={formik.handleChange} /></dd>
                    <dt>Description</dt>
                    <dd><textarea rows="2" cols="40" className="form-control" name="Description" onChange={formik.handleChange} /></dd>
                    <dt>Category</dt>
                    <dd>
                        <select className="form-select" name="CategoryId" onChange={formik.handleChange}>{
                            categories.map(category =>  //we will show category name but we will submit category id through value.
                                <option key={category.CategoryId} value={category.CategoryId}>{category.CategoryName}</option>
                            )
                        }
                        </select>
                    </dd>
                </dl>
                <div className="btn-group">
                    <button className="btn btn-success">Add video</button>
                    <Link to="/admin-dash" className="btn btn-danger ms-2">Cancel</Link>
                </div>
            </form>
        </div>
    )
}