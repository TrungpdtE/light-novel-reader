import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../redux/authSlice';
import '../../styles/admin.css';
import '../../styles/admin-modal.css';

const STATUS_OPTIONS = ['Đang tiếp hành', 'Đã hoàn thành', 'Tạm dừng'];

const EMPTY_FORM = {
  title: '',
  description: '',
  author: '',
  illustrator: '',
  genres: [],
  status: 'Đang tiếp hành',
  cover: null,      // File object
  banner: null,     // File object
  coverUrl: '',     // Existing URL (edit mode)
  bannerUrl: '',    // Existing URL (edit mode)
};

function NovelModal({ editNovel, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [genreInput, setGenreInput] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const coverRef = useRef();
  const bannerRef = useRef();
  const coverObjectUrl = useRef(null);
  const bannerObjectUrl = useRef(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverObjectUrl.current) URL.revokeObjectURL(coverObjectUrl.current);
      if (bannerObjectUrl.current) URL.revokeObjectURL(bannerObjectUrl.current);
    };
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (editNovel) {
      setForm({
        title: editNovel.title || '',
        description: editNovel.description || '',
        author: editNovel.author || '',
        illustrator: editNovel.illustrator || '',
        genres: editNovel.genres || [],
        status: editNovel.status || 'Đang tiếp hành',
        cover: null,
        banner: null,
        coverUrl: editNovel.cover || '',
        bannerUrl: editNovel.banner || '',
      });
      setCoverPreview(editNovel.cover || '');
      setBannerPreview(editNovel.banner || '');
    }
  }, [editNovel]);

  const handleImageChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (field === 'cover') {
      if (coverObjectUrl.current) URL.revokeObjectURL(coverObjectUrl.current);
      coverObjectUrl.current = previewUrl;
      setForm(f => ({ ...f, cover: file, coverUrl: '' }));
      setCoverPreview(previewUrl);
    } else {
      if (bannerObjectUrl.current) URL.revokeObjectURL(bannerObjectUrl.current);
      bannerObjectUrl.current = previewUrl;
      setForm(f => ({ ...f, banner: file, bannerUrl: '' }));
      setBannerPreview(previewUrl);
    }
    setError('');
  };

  const removeImage = (field) => {
    if (field === 'cover') {
      if (coverObjectUrl.current) {
        URL.revokeObjectURL(coverObjectUrl.current);
        coverObjectUrl.current = null;
      }
      setForm(f => ({ ...f, cover: null, coverUrl: '' }));
      setCoverPreview('');
      if (coverRef.current) coverRef.current.value = '';
    } else {
      if (bannerObjectUrl.current) {
        URL.revokeObjectURL(bannerObjectUrl.current);
        bannerObjectUrl.current = null;
      }
      setForm(f => ({ ...f, banner: null, bannerUrl: '' }));
      setBannerPreview('');
      if (bannerRef.current) bannerRef.current.value = '';
    }
  };

  const addGenre = (value) => {
    const trimmed = value.trim();
    if (trimmed && !form.genres.includes(trimmed)) {
      setForm(f => ({ ...f, genres: [...f.genres, trimmed] }));
    }
    setGenreInput('');
  };

  const removeGenre = (genre) => {
    setForm(f => ({ ...f, genres: f.genres.filter(g => g !== genre) }));
  };

  const handleGenreKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addGenre(genreInput);
    } else if (e.key === 'Backspace' && !genreInput && form.genres.length > 0) {
      removeGenre(form.genres[form.genres.length - 1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Tiêu đề là bắt buộc');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('description', form.description.trim());
      data.append('author', form.author.trim());
      data.append('illustrator', form.illustrator.trim());
      data.append('genres', form.genres.join(','));
      data.append('status', form.status);

      if (form.cover) {
        data.append('cover', form.cover);
      } else if (form.coverUrl) {
        data.append('cover', form.coverUrl);
      }

      if (form.banner) {
        data.append('banner', form.banner);
      } else if (form.bannerUrl) {
        data.append('banner', form.bannerUrl);
      }

      let response;
      if (editNovel) {
        response = await axiosInstance.put(`/novels/${editNovel._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axiosInstance.post('/novels', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSaved(response.data.novel, !!editNovel);
    } catch (err) {
      setError(err.response?.data?.error || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editNovel ? 'Chỉnh sửa truyện' : 'Thêm truyện mới'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="notification error" style={{ position: 'static', marginBottom: 16 }}>{error}</div>}

            <div className="form-group">
              <label>Tiêu đề <span style={{ color: '#e74c3c' }}>*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Nhập tiêu đề truyện"
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Nhập mô tả / tóm tắt nội dung"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tác giả</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                  placeholder="Tên tác giả"
                />
              </div>
              <div className="form-group">
                <label>Họa sĩ</label>
                <input
                  type="text"
                  value={form.illustrator}
                  onChange={e => setForm(f => ({ ...f, illustrator: e.target.value }))}
                  placeholder="Tên họa sĩ"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Thể loại</label>
              <div
                className="genres-input-wrapper"
                onClick={() => document.getElementById('genre-text-input').focus()}
              >
                {form.genres.map(g => (
                  <span key={g} className="genre-tag">
                    {g}
                    <button type="button" className="genre-tag-remove" onClick={() => removeGenre(g)}>&times;</button>
                  </span>
                ))}
                <input
                  id="genre-text-input"
                  className="genres-text-input"
                  value={genreInput}
                  onChange={e => setGenreInput(e.target.value)}
                  onKeyDown={handleGenreKeyDown}
                  onBlur={() => genreInput.trim() && addGenre(genreInput)}
                  placeholder={form.genres.length === 0 ? 'Nhập thể loại, nhấn Enter để thêm' : ''}
                />
              </div>
              <div className="genres-hint">Nhấn Enter hoặc dấu phẩy để thêm thể loại</div>
            </div>

            <div className="form-group">
              <label>Tình trạng</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ảnh bìa (cover)</label>
              <div className="image-upload-area">
                {coverPreview ? (
                  <div className="image-preview">
                    <img src={coverPreview} alt="Cover preview" />
                    <button type="button" className="image-remove-btn" onClick={() => removeImage('cover')}>&times;</button>
                  </div>
                ) : (
                  <label className="image-upload-label">
                    <span>📁 Chọn ảnh bìa</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      ref={coverRef}
                      onChange={e => handleImageChange('cover', e)}
                    />
                  </label>
                )}
                <div className="image-hint">JPG, PNG, GIF, WEBP – tối đa 5MB</div>
              </div>
            </div>

            <div className="form-group">
              <label>Ảnh banner (tuỳ chọn)</label>
              <div className="image-upload-area">
                {bannerPreview ? (
                  <div className="image-preview">
                    <img src={bannerPreview} alt="Banner preview" />
                    <button type="button" className="image-remove-btn" onClick={() => removeImage('banner')}>&times;</button>
                  </div>
                ) : (
                  <label className="image-upload-label">
                    <span>📁 Chọn ảnh banner</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      ref={bannerRef}
                      onChange={e => handleImageChange('banner', e)}
                    />
                  </label>
                )}
                <div className="image-hint">JPG, PNG, GIF, WEBP – tối đa 5MB</div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Huỷ</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : editNovel ? 'Lưu thay đổi' : 'Thêm truyện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNovel, setEditNovel] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

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

  useEffect(() => {
    fetchNovels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa truyện này?')) {
      try {
        await axiosInstance.delete(`/novels/${id}`);
        setNovels(novels.filter(n => n._id !== id));
        showNotification('Đã xóa truyện thành công');
      } catch (err) {
        showNotification(err.response?.data?.error || 'Xóa truyện thất bại', 'error');
      }
    }
  };

  const openAdd = () => {
    setEditNovel(null);
    setShowModal(true);
  };

  const openEdit = (novel) => {
    setEditNovel(novel);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditNovel(null);
  };

  const handleSaved = (novel, isEdit) => {
    if (isEdit) {
      setNovels(novels.map(n => n._id === novel._id ? novel : n));
      showNotification('Cập nhật truyện thành công!');
    } else {
      setNovels([novel, ...novels]);
      showNotification('Thêm truyện thành công!');
    }
    closeModal();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-novels">
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      <h1>Quản lý truyện</h1>
      <button className="btn-add" onClick={openAdd}>+ Thêm truyện mới</button>

      <table className="novels-table">
        <thead>
          <tr>
            <th>Ảnh bìa</th>
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
              <td>
                {novel.cover ? (
                  <img className="cover-thumb" src={novel.cover} alt={novel.title} />
                ) : (
                  <div className="cover-placeholder">📖</div>
                )}
              </td>
              <td>{novel.title}</td>
              <td>{novel.author}</td>
              <td>{novel.status}</td>
              <td>{novel.chapters?.length || 0}</td>
              <td>
                <button className="btn-edit" onClick={() => openEdit(novel)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(novel._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <NovelModal
          editNovel={editNovel}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default AdminNovels;
