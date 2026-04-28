import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../redux/authSlice';
import '../styles/home.css';

function Home() {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home">
      <header className="header">
        <h1>Light Novel Reader</h1>
        <nav>
          <a href="#">Truyện dịch</a>
          <a href="#">AI dịch</a>
          <a href="#">Sáng tác</a>
          <a href="#">Top</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="novels-grid">
          <h2>Các truyện mới nh���t</h2>
          <div className="grid">
            {novels.map(novel => (
              <Link key={novel._id} to={`/novel/${novel._id}`} className="novel-card">
                <img src={novel.cover} alt={novel.title} />
                <h3>{novel.title}</h3>
                <p>{novel.author}</p>
                <span className="status">{novel.status}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
