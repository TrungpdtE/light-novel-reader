import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../redux/authSlice';
import '../../styles/admin.css';

function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#808080',
    permissions: []
  });

  const permissions = [
    'upload_novel',
    'edit_novel',
    'delete_novel',
    'delete_comment',
    'manage_users',
    'manage_roles',
    'view_analytics',
    'ban_user',
    'edit_user',
    'create_announcement',
    'moderate_comments'
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
        setRoles(response.data.roles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/roles', formData);
      setRoles([...roles, response.data.role]);
      setFormData({ name: '', description: '', color: '#808080', permissions: [] });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa role này?')) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        setRoles(roles.filter(r => r._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-roles">
      <h1>Quản lý Role</h1>
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>+ Tạo role mới</button>

      {showForm && (
        <form className="role-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên role"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <div className="permissions-list">
            {permissions.map(perm => (
              <label key={perm}>
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, permissions: [...formData.permissions, perm] });
                    } else {
                      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== perm) });
                    }
                  }}
                />
                {perm}
              </label>
            ))}
          </div>
          <button type="submit">Tạo role</button>
        </form>
      )}

      <div className="roles-grid">
        {roles.map(role => (
          <div key={role._id} className="role-card" style={{ borderLeftColor: role.color }}>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
            <div className="permissions">
              {role.permissions.map(perm => (
                <span key={perm} className="permission-badge">{perm}</span>
              ))}
            </div>
            <button className="btn-delete" onClick={() => handleDelete(role._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRoles;
