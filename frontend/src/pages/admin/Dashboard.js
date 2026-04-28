import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../redux/authSlice';
import '../../styles/admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    novels: 0,
    users: 0,
    chapters: 0,
    comments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const novelRes = await axiosInstance.get('/novels');
        const userRes = await axiosInstance.get('/users');
        
        setStats({
          novels: novelRes.data.novels.length,
          users: userRes.data.users.length,
          chapters: novelRes.data.novels.reduce((sum, n) => sum + (n.chapters?.length || 0), 0),
          comments: 0
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Truyện</h3>
          <p className="stat-number">{stats.novels}</p>
        </div>
        <div className="stat-card">
          <h3>Người dùng</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Chương</h3>
          <p className="stat-number">{stats.chapters}</p>
        </div>
        <div className="stat-card">
          <h3>Bình luận</h3>
          <p className="stat-number">{stats.comments}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
