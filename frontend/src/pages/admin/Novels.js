import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../redux/authSlice';
import '../../styles/admin.css';

function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await axiosInstance.get('/novels');
        setNovels(response.data.novels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa truyện này?')) {
      try {
        await axiosInstance.delete(`/novels/${id}`);
        setNovels(novels.filter(n => n._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-novels">
      <h1>Quản lý truyện</h1>
      <button className="btn-add">+ Thêm truyện mới</button>
      
      <table className="novels-table">
        <thead>
          <tr>
            <th>Tên truyện</th>
            <th>Tác giả</th>
            <th>Tình trạng</th>
            <th>Chương</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {novels.map(novel => (
            <tr key={novel._id}>
              <td>{novel.title}</td>
              <td>{novel.author}</td>
              <td>{novel.status}</td>
              <td>{novel.chapters?.length || 0}</td>
              <td>
                <button className="btn-edit">Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(novel._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminNovels;
