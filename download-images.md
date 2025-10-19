# 🚀 Script tạo ảnh placeholder tự động

## Sử dụng Picsum (Placeholder images)

Chạy các lệnh sau trong terminal để tải ảnh placeholder:

```bash
# Tải ảnh chính (800x600)
curl "https://picsum.photos/800/600" -o "public/images/main-photo.png"

# Tải ảnh cảm ơn (600x400)  
curl "https://picsum.photos/600/400" -o "public/images/thank-you.jpg"

# Tải ảnh cover nhạc (300x300)
curl "https://picsum.photos/300/300" -o "public/images/slide-1.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-2.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-3.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-4.png"
curl "https://picsum.photos/300/300" -o "public/images/slide-5.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-6.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-7.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-9.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-10.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-11.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-12.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-13.jpg"
curl "https://picsum.photos/300/300" -o "public/images/slide-14.jpg"

# Tải avatar (200x200)
curl "https://picsum.photos/200/200" -o "public/images/avatar.jpg"
```

## Hoặc sử dụng PowerShell (Windows):

```powershell
# Tạo thư mục nếu chưa có
New-Item -ItemType Directory -Force -Path "public/images"

# Tải ảnh placeholder
Invoke-WebRequest "https://picsum.photos/800/600" -OutFile "public/images/main-photo.png"
Invoke-WebRequest "https://picsum.photos/600/400" -OutFile "public/images/thank-you.jpg"  
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-1.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-2.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-3.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-4.png"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-5.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-6.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-7.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-8.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-9.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-10.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-11.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-12.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-13.jpg"
Invoke-WebRequest "https://picsum.photos/300/300" -OutFile "public/images/slide-14.jpg"
Invoke-WebRequest "https://picsum.photos/200/200" -OutFile "public/images/avatar.jpg"
```

## Sử dụng Unsplash với chủ đề cụ thể:

```bash
# Ảnh chính - chủ đề graduation/school
curl "https://source.unsplash.com/800x600/?graduation,school" -o "public/images/main-photo.png"

# Ảnh cảm ơn - chủ đề thank you, happiness
curl "https://source.unsplash.com/600x400/?thankyou,happiness" -o "public/images/thank-you.jpg"

# Ảnh cover nhạc - chủ đề music
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-1.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-2.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-3.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-4.png"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-5.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-6.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-7.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-8.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-9.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-10.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-11.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-12.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-13.jpg"
curl "https://source.unsplash.com/300x300/?music,album" -o "public/images/slide-14.jpg"

# Avatar - chủ đề portrait
curl "https://source.unsplash.com/200x200/?portrait,person" -o "public/images/avatar.jpg"
```

## Tạo favicon từ avatar:
```bash
# Cần cài ImageMagick
convert "public/images/avatar.jpg" -resize 32x32 "public/images/favicon.ico"
```
