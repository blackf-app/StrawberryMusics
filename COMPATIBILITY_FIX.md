# Khắc phục vấn đề tương thích với iPhone 6 và các thiết bị cũ

## Vấn đề
Website hiển thị màn hình đen trống trên iPhone 6 và các thiết bị iOS cũ, trong khi hoạt động bình thường trên thiết bị mới.

## Nguyên nhân
1. **CSS Modern Features**: `backdrop-filter`, CSS Grid không được hỗ trợ đầy đủ trên iOS 9-10
2. **JavaScript ES6+**: Các tính năng JavaScript hiện đại không được hỗ trợ
3. **Thiếu Polyfills**: Không có polyfills cho các API hiện đại

## Giải pháp đã áp dụng

### 1. Vite Legacy Plugin
- Cài đặt `@vitejs/plugin-legacy` để tự động tạo polyfills
- Hỗ trợ iOS >= 9 (bao gồm iPhone 6)
- Tạo 2 bundles: modern và legacy
- Trình duyệt cũ sẽ tự động load legacy bundle

### 2. CSS Fallbacks
- **Backdrop Filter**: Thêm `background: rgba(30, 30, 34, 0.95)` làm fallback
- **CSS Grid**: Thêm flexbox làm fallback layout
- Trình duyệt cũ sẽ bỏ qua các thuộc tính không hỗ trợ và dùng fallback

### 3. Meta Tags cho iOS
- Thêm `apple-mobile-web-app-capable` để tối ưu cho iOS
- Cấu hình viewport phù hợp với thiết bị cũ

### 4. Build Configuration
```javascript
// vite.config.js
{
  targets: ['defaults', 'not IE 11', 'iOS >= 9'],
  polyfills: [
    'es.promise',
    'es.array.iterator',
    'es.object.assign',
    'es.string.includes',
  ]
}
```

## Cách test

### 1. Build production
```bash
npm run build
```

### 2. Preview locally
```bash
npm run preview
```

### 3. Deploy lên Vercel
```bash
vercel --prod
```

### 4. Test trên iPhone 6
- Mở Safari trên iPhone 6
- Truy cập URL của website
- Website sẽ tự động load legacy bundle với polyfills

## Các file đã thay đổi

1. **vite.config.js**: Thêm legacy plugin và build config
2. **index.html**: Thêm iOS meta tags
3. **src/App.css**: Thêm flexbox fallback và background fallback
4. **src/index.css**: Thêm background fallback cho glass-card
5. **package.json**: Thêm dependencies mới

## Kích thước bundle

- **Modern bundle**: ~206 KB (cho trình duyệt mới)
- **Legacy bundle**: ~227 KB (cho trình duyệt cũ)
- **Polyfills**: ~49 KB (chỉ load cho trình duyệt cũ)

Trình duyệt hiện đại sẽ chỉ load modern bundle, còn iPhone 6 sẽ load legacy bundle + polyfills.

## Lưu ý

- Legacy bundle có kích thước lớn hơn do bao gồm transpiled code
- Performance trên thiết bị cũ có thể chậm hơn do phải chạy polyfills
- Nên test kỹ trên thiết bị thật để đảm bảo trải nghiệm tốt nhất
