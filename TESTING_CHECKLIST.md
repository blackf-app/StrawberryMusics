# Testing Checklist - iPhone 6 Compatibility

## ✅ Các thay đổi đã hoàn thành

### 1. Build Configuration
- [x] Cài đặt `@vitejs/plugin-legacy` và `terser`
- [x] Cấu hình Vite để hỗ trợ iOS >= 9
- [x] Thêm polyfills cho ES6+ features
- [x] Cấu hình build target cho Safari 11

### 2. CSS Compatibility
- [x] Thêm fallback cho `backdrop-filter`
- [x] Thêm flexbox fallback cho CSS Grid
- [x] Thêm explicit width cho sidebar
- [x] Thêm flex properties cho responsive layout

### 3. HTML Meta Tags
- [x] Thêm iOS-specific meta tags
- [x] Cấu hình viewport cho thiết bị cũ
- [x] Thêm apple-mobile-web-app tags

### 4. Build Output
- [x] Build thành công với legacy chunks
- [x] Tạo ra 2 bundles: modern + legacy
- [x] Legacy detection script được inject

## 🧪 Các bước test

### Bước 1: Test Local
```bash
# Build production
npm run build

# Preview locally
npm run preview
```

### Bước 2: Test trên Desktop Browser
1. Mở Chrome DevTools
2. Chọn Device Toolbar (Ctrl+Shift+M)
3. Chọn "iPhone 6/7/8" hoặc "iPhone SE"
4. Reload trang
5. Kiểm tra:
   - [ ] Không có màn hình đen
   - [ ] Layout hiển thị đúng
   - [ ] Music player hoạt động
   - [ ] Sidebar hiển thị đúng

### Bước 3: Test User Agent
1. Mở Chrome DevTools > Network conditions
2. Set User Agent: `Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`
3. Reload trang
4. Kiểm tra Console:
   - [ ] Không có lỗi JavaScript
   - [ ] Thấy message "vite: loading legacy chunks" (nếu có)
   - [ ] Legacy bundle được load

### Bước 4: Deploy lên Vercel
```bash
# Deploy to production
vercel --prod
```

### Bước 5: Test trên iPhone 6 thật
1. Mở Safari trên iPhone 6
2. Truy cập URL production
3. Kiểm tra:
   - [ ] Trang load thành công (không màn hình đen)
   - [ ] Layout responsive đúng
   - [ ] Music player hiển thị
   - [ ] Có thể play/pause nhạc
   - [ ] Sidebar hiển thị danh sách bài hát
   - [ ] Không có lỗi trong Safari Console

### Bước 6: Performance Check
1. Kiểm tra thời gian load trang
2. Kiểm tra smooth scrolling
3. Kiểm tra animation performance
4. Kiểm tra audio playback

## 🔍 Debugging

### Nếu vẫn thấy màn hình đen:

1. **Kiểm tra Console Errors**
   - Mở Safari Web Inspector trên iPhone
   - Xem có lỗi JavaScript không

2. **Kiểm tra Network**
   - Xem legacy bundle có được load không
   - Kiểm tra HTTP status codes

3. **Kiểm tra CSS**
   - Inspect elements
   - Xem CSS có được apply đúng không

4. **Kiểm tra JavaScript**
   - Thêm `console.log()` vào App.jsx
   - Xem component có render không

### Common Issues:

**Issue 1: Legacy bundle không load**
- Solution: Clear Safari cache và reload

**Issue 2: CSS không hiển thị**
- Solution: Kiểm tra CSS fallbacks trong DevTools

**Issue 3: JavaScript errors**
- Solution: Kiểm tra polyfills có được load không

**Issue 4: Audio không play**
- Solution: Kiểm tra autoplay policy của iOS

## 📊 Expected Results

### Modern Browsers (Chrome, Safari 14+)
- Load modern bundle (~206 KB)
- Không load polyfills
- Full CSS features (backdrop-filter, grid)

### Legacy Browsers (iPhone 6, Safari 9-10)
- Load legacy bundle (~227 KB)
- Load polyfills (~49 KB)
- Fallback CSS (solid background, flexbox)

## 📝 Notes

- iPhone 6 có thể chạy iOS 9.0 - 12.5.7
- Safari 9-10 không hỗ trợ nhiều CSS modern features
- Performance trên iPhone 6 sẽ chậm hơn thiết bị mới
- Nên test trên thiết bị thật để đảm bảo UX tốt nhất
