import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";


export function UserLogin() {

  const [users, setUsers] = useState([{ UserId: '', UserName: '', Password: '', Email: '', Mobile: '' }])

  let navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['username']);

  const formik = useFormik({
    initialValues: {
      UserId: '',
      Password: ''
    },
    onSubmit: async (userDetails) => {
      try {
        const response = await axios.get(`http://127.0.0.1:5050/get-users`);

        // Handle different response formats
        const userList = Array.isArray(response.data) 
          ? response.data 
          : response.data.users || [];

        const user = userList.find(item => userDetails.UserId === item.UserId);

        if (user) {
          if (userDetails.Password === user.Password) {
            setCookie('username', user.UserName);
            navigate("/user-dash");
          } else {
            alert("Invalid Password");
          }
        } else {
          alert("Invalid User Id");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch users");
      }
    }
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-3">
          <div className="p-4 rounded" style={{ backgroundColor: ' #00246B', color: '#CADCFC' }}>
            <h3 className="text-center">User Login</h3>
            <form onSubmit={formik.handleSubmit}>
              <dl>
                <dt>User Id</dt>
                <dd><input type="text" onChange={formik.handleChange} name="UserId" className="form-control" placeholder="sam_hyd" /></dd>
                <dt>Password</dt>
                <dd><input type="password" onChange={formik.handleChange} name="Password" className="form-control" placeholder="samson@12" /></dd>
              </dl>
              <div className="text-end">
                <button className="btn" style={{ backgroundColor: '#CADCFC', color: ' #00246B', width: 'auto' }}>Login</button>
              </div>
              <div className="my-2">
                <p style={{ color: '#CADCFC' }} className="text-center m-0">Don't have an account? <Link to="/user-register" className="mt-4">Register here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}