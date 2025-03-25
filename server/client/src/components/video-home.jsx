import { Link } from "react-router-dom";

export function VideoHome() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Link className="btn" to="/admin-login" style={{ backgroundColor: " #00246B", color: "#CADCFC", minWidth: '117px' }}>Admin Login</Link>
            <Link className="btn" to="/user-login" style={{ backgroundColor: " #00246B", color: "#CADCFC", minWidth: '117px' }}>User Login</Link>
        </div>
    )
}