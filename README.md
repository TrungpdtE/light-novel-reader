# Light Novel Reader 📚

Một trang web đọc light novel đẹp mắt, tương tự docln.net, được xây dựng bằng HTML5, CSS3 và JavaScript vanilla.

## ✨ Tính năng

### 🎨 Tuỳ chỉnh giao diện
- **7 màu nền**: Trắng, xanh nhạt, xanh, kem, vàng, tím, đen (dark mode)
- **6 font**: Times New Roman, Merriweather, Lora, Roboto, Noto Sans, Nunito
- **Font size**: 12px - 24px (có nút +/-)
- **Bản lề (margin)**: 0px - 100px (có nút +/-)
- **Căn chỉnh text**: Left, Center, Right, Justify
- **Lưu cài đặt**: Tự động lưu vào localStorage

### 📖 Quản lý truyện
- Danh sách chương có thể click
- Navigation: Previous / Home / Next chapter
- Bookmark chương (sẽ được thêm)
- Lưu tiến độ đọc

### 📱 Responsive Design
- Desktop: Layout đầy đủ với 2 sidebar
- Tablet: Giao diện tối ưu
- Mobile: Navigation ở dưới, sidebars overlay

### ⌨️ Keyboard Shortcuts
- `Alt + N`: Chương tiếp theo
- `Alt + P`: Chương trước
- `Alt + H`: Trang chủ
- `Esc`: Đóng sidebars

## 📁 Cấu trúc thư mục

```
light-novel-reader/
├── index.html                 # Trang chính
├── css/
│   ├── style.css             # CSS chính
│   └── responsive.css        # Mobile responsive
├── js/
│   ├── app.js                # Settings management
│   └── reader.js             # Reading logic
├── data/
│   ├── chapters.json         # Danh sách chương
│   └── sample.json           # Dữ liệu mẫu
└── README.md
```

## 🚀 Cách sử dụng

### 1. Clone repository
```bash
git clone https://github.com/TrungpdtE/light-novel-reader.git
cd light-novel-reader
```

### 2. Mở trong browser
Đơn giản, chỉ cần mở `index.html` trong browser của bạn.

Hoặc dùng Live Server (VSCode):
- Cài đặt extension "Live Server"
- Click chuột phải → "Open with Live Server"

### 3. Thêm truyện mới

#### Bước 1: Tạo file JSON
Tạo file mới trong thư mục `data/` với format:

```json
{
  "id": "unique-id",
  "title": "Tên truyện",
  "cover": "URL ảnh bìa",
  "author": "Tác giả",
  "illustrator": "Họa sĩ",
  "description": "Mô tả truyện",
  "chapters": [
    {
      "id": 1,
      "title": "Chương 1: Tiêu đề",
      "content_html": "<p>Nội dung HTML...</p>",
      "content_text": "Nội dung text (tuỳ chọn)"
    },
    {
      "id": 2,
      "title": "Chương 2: Tiêu đề",
      "content_html": "<p>Nội dung HTML...</p>"
    }
  ]
}
```

#### Bước 2: Update `data/chapters.json`
```json
{
  "chapters": [
    {
      "title": "Tên truyện 1",
      "file": "novel1.json"
    },
    {
      "title": "Tên truyện 2",
      "file": "novel2.json"
    }
  ]
}
```

## 📊 Format dữ liệu

### Chapters List (`data/chapters.json`)
```json
{
  "chapters": [
    {
      "title": "Tên truyện",
      "file": "tên-file.json"
    }
  ]
}
```

### Novel Data (`data/*.json`)
```json
{
  "id": "unique-id",
  "title": "Tên truyện",
  "cover": "URL ảnh bìa",
  "author": "Tác giả",
  "illustrator": "Họa sĩ",
  "description": "Mô tả",
  "chapters": [
    {
      "id": số_chương,
      "title": "Tiêu đề chương",
      "content_html": "<p>HTML content...</p>"
    }
  ]
}
```

## 🎯 Tính năng sắp tới

- [ ] Bookmark/Lưu dấu trang
- [ ] Tìm kiếm trong nội dung
- [ ] Bình luận
- [ ] Rating truyện
- [ ] Danh sách truyện yêu thích
- [ ] Export PDF
- [ ] Tìm kiếm toàn cục

## 🛠️ Tuỳ chỉnh

### Thay đổi font mặc định
Chỉnh sửa trong `js/app.js`:
```javascript
defaults = {
    fontFamily: 'Lora', // Thay đổi font mặc định
    fontSize: 18,       // Font size mặc định (px)
    colorTheme: 4,      // Màu theme mặc định (0-6)
    // ...
}
```

### Thay đổi màu sắc
Chỉnh sửa trong `css/style.css`:
```css
.reading-page.style-0 { background-color: #fff; }
.reading-page.style-1 { background-color: #e6f0e6; }
/* ... */
```

## 💾 LocalStorage

Ứng dụng lưu trữ:
- **novelReaderSettings**: Tất cả cài đặt của người dùng
- **lastChapterIndex**: Chương cuối cùng đã đọc
- **lastNovelFile**: File truyện cuối cùng

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Ghi chú

- Tất cả cài đặt được lưu vào localStorage (không cần server)
- Hỗ trợ HTML5 semantic
- Tối ưu hóa cho mobile-first
- Accessibility-friendly

## 🤝 Đóng góp

Nếu bạn muốn cải thiện ứng dụng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - Bạn tự do sử dụng, sửa đổi và phân phối

## 👨‍💻 Tác giả

**TrungpdtE** - [GitHub](https://github.com/TrungpdtE)

## 📞 Liên hệ

Nếu có câu hỏi hoặc đề xuất, hãy tạo một Issue mới trên GitHub.

---

**Chúc bạn đọc sách vui vẻ! 📚✨**
