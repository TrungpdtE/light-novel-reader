import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../redux/authSlice';
import '../styles/reader.css';

function Reader() {
  const { id, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axiosInstance.get(`/chapters/${chapterId}`);
        setChapter(response.data.chapter);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  if (loading) return <div>Loading...</div>;
  if (!chapter) return <div>Chapter not found</div>;

  return (
    <div className="reader">
      <header className="reader-header">
        <button onClick={() => navigate(`/novel/${id}`)}>← Quay lại</button>
        <h2>{chapter.title}</h2>
      </header>
      <div className="reader-content">
        <div dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}></div>
      </div>
    </div>
  );
}

export default Reader;
