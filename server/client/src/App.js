import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { VideoHome } from './components/video-home';
import { AdminLogin } from './components/admin-login';
import { UserLogin } from './components/user-login';
import { AdminDashboard } from './components/admin-dashboard';
import { AdminAddVideo } from './components/admin-add-video';
import { AdminEditVideo } from './components/admin-edit-video';
import { AdminDeleteVideo } from './components/admin-delete-video';
import { UserRegister } from './components/user-register';
import { UserDashboard } from './components/user-dashboard';

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className='text-center p-3'>Video-library</h1>
      </div>
      {/* configuring routes */}
      <div className="app-main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VideoHome />} />
            <Route path="admin-login" element={<AdminLogin />} />
            <Route path="user-login" element={<UserLogin />} />
            <Route path="admin-dash" element={<AdminDashboard />} />
            <Route path="add-video" element={<AdminAddVideo />} />
            <Route path="edit-video/:id" element={<AdminEditVideo />} />
            <Route path="delete-video/:id" element={<AdminDeleteVideo />} />
            <Route path="user-register" element={<UserRegister />} />
            <Route path="user-dash" element={<UserDashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
