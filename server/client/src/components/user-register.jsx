import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";


export function UserRegister() {

  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      UserId: '',
      UserName: '',
      Password: '',
      Email: '',
      Mobile: ''
    },
    onSubmit: (user) => {
      axios.post("https://video-library-z8t4.onrender.com/register-user", user);
      alert("User registered succesfully!");
      navigate("/user-login");
    }
  })


  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-3">
          <div className="p-4 rounded" style={{ backgroundColor: ' #00246B', color: '#CADCFC' }}>
            <h3 className="text-center">Register User</h3>
            <form onSubmit={formik.handleSubmit}>
              <dl>
                <dt>User Id</dt>
                <dd><input type="text" onChange={formik.handleChange} name="UserId" className="form-control" /></dd>
                <dt>Username</dt>
                <dd><input type="text" onChange={formik.handleChange} name="UserName" className="form-control" /></dd>
                <dt>Password</dt>
                <dd><input type="password" onChange={formik.handleChange} name="Password" className="form-control" /></dd>
                <dt>Email</dt>
                <dd><input type="text" onChange={formik.handleChange} name="Email" className="form-control" /></dd>
                <dt>Mobile</dt>
                <dd><input type="text" onChange={formik.handleChange} name="Mobile" className="form-control" /></dd>
              </dl>
              <div className="d-flex justify-content-end">
                <button className="btn" style={{ backgroundColor: '#CADCFC', color: ' #00246B' }}>Register</button>
              </div>
              <div className="my-2">
                <Link to="/user-login" className="mt-4">Existing user login</Link>
              </div>
              <div className="mb-2">
                <Link to="/admin-login" className="mt-4">Admin login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}