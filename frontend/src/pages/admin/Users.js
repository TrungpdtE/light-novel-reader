import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../redux/authSlice';
import '../../styles/admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBan = async (id) => {
    const reason = prompt('Lý do ban:');
    if (reason) {
      try {
        await axiosInstance.post(`/users/${id}/ban`, { reason });
        setUsers(users.map(u => u._id === id ? { ...u, isBanned: true, bannedReason: reason } : u));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUnban = async (id) => {
    try {
      await axiosInstance.post(`/users/${id}/unban`);
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: false, bannedReason: null } : u));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-users">
      <h1>Quản lý người dùng</h1>
      
      <table className="users-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roles?.map(r => r.name).join(', ') || 'User'}</td>
              <td>{user.isBanned ? 'Bị ban' : 'Hoạt động'}</td>
              <td>
                {user.isBanned ? (
                  <button className="btn-unban" onClick={() => handleUnban(user._id)}>Gỡ ban</button>
                ) : (
                  <button className="btn-ban" onClick={() => handleBan(user._id)}>Ban</button>
                )}
                <button className="btn-delete">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
