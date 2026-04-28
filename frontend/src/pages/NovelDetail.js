import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../redux/authSlice';
import '../styles/novel-detail.css';

function NovelDetail() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const response = await axiosInstance.get(`/novels/${id}`);
        setNovel(response.data.novel);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!novel) return <div>Novel not found</div>;

  return (
    <div className="novel-detail">
      <div className="novel-header">
        <img src={novel.cover} alt={novel.title} className="cover" />
        <div className="info">
          <h1>{novel.title}</h1>
          <p className="author">Tác giả: {novel.author}</p>
          <p className="status">{novel.status}</p>
          <div className="stats">
            <span>👁️ {novel.views} lượt xem</span>
            <span>❤️ {novel.likes} yêu thích</span>
            <span>⭐ {novel.rating.toFixed(1)}/5</span>
          </div>
          <button className="btn-read">Đọc ngay</button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Mô tả
        </button>
        <button
          className={`tab ${activeTab === 'chapters' ? 'active' : ''}`}
          onClick={() => setActiveTab('chapters')}
        >
          Danh sách chương
        </button>
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Bình luận
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <p>{novel.description}</p>
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="chapters-tab">
            <ul>
              {novel.chapters && novel.chapters.map(chapter => (
                <li key={chapter._id}>
                  <Link to={`/reader/${id}/${chapter._id}`}>
                    {chapter.title}
                  </Link>
                  <span className="date">{new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <p>Phần bình luận sẽ được thêm sau</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovelDetail;
