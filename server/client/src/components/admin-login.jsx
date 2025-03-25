import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export function AdminLogin() {

    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['admin']);

    const formik = useFormik({
        initialValues: {
            UserId: '',
            Password: ''
        },
        onSubmit: (admin) => {
            axios.get("http://127.0.0.1:5050/get-admin")
                .then(response => {
                    var user = response.data.find(item => admin.UserId === item.UserId);
                    if (user) {
                        if (admin.Password === user.Password) {
                            setCookie('admin', user.UserId);
                            navigate("/admin-dash");
                        } else {
                            alert(`Invalid Password`);
                        }
                    } else {
                        alert(`Invalid User Id`);
                    }
                })
        }
    })

    return (
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-3">
                    <div className="p-4 rounded" style={{ backgroundColor: ' #00246B', color: '#CADCFC' }}>
                        <h3 className="text-center">Admin Login</h3>
                        <form onSubmit={formik.handleSubmit}>
                            <dl>
                                <dt>Admin Id</dt>
                                <dd><input type="text" name="UserId" onChange={formik.handleChange} className="form-control" placeholder="Navyasri_28" /></dd>
                                <dt>Password</dt>
                                <dd><input type="password" name="Password" onChange={formik.handleChange} className="form-control" placeholder="Navyasri@28" /></dd>
                            </dl>
                            <div className="text-end">
                                <button className="btn" style={{ backgroundColor: '#CADCFC', color: ' #00246B', width: 'auto' }}>Login</button>
                            </div>
                            <Link to="/" className="mt-4">Back to Home</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}