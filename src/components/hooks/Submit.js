import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardMedia, 
  CardActions, 
  CardActionArea, 
  Button, 
  Typography, 
  Collapse,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";
import dc from "../lib/DataConfig";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Submit = ({
  setShowLetter,
  onDevelopmentEnv,
  setShow,
  setData,
  data,
  setAvailable,
  available,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showMessage = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const validateForm = () => {
    const errors = [];
    if (data.name.length < 2) errors.push("Tên phải có ít nhất 2 ký tự");
    if (data.about.length < 5) errors.push("Đánh giá phải có ít nhất 5 ký tự");
    if (data.memories.length < 5) errors.push("Kỷ niệm phải có ít nhất 5 ký tự");
    if (!data.image) errors.push("Bạn chưa chọn ảnh kỷ niệm");
    if (data.message.length < 5) errors.push("Lời nhắn phải có ít nhất 5 ký tự");
    return errors;
  };

  // 🗜️ Image compression function
  const compressBase64Image = (base64, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions maintaining aspect ratio
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            const newWidth = Math.floor(img.width * ratio);
            const newHeight = Math.floor(img.height * ratio);
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // Use better image rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw compressed image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // Convert to base64 with compression
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            
            const originalSizeKB = Math.round(base64.length / 1024);
            const compressedSizeKB = Math.round(compressedBase64.length / 1024);
            
            console.log(`🗜️ Image compression results:`);
            console.log(`- Original: ${img.width}x${img.height} (${originalSizeKB}KB)`);
            console.log(`- Compressed: ${newWidth}x${newHeight} (${compressedSizeKB}KB)`);
            console.log(`- Compression ratio: ${Math.round((1 - compressedSizeKB/originalSizeKB) * 100)}%`);
            
            resolve({
              base64: compressedBase64,
              width: newWidth,
              height: newHeight,
              sizeKB: compressedSizeKB,
              originalSizeKB: originalSizeKB
            });
          } catch (error) {
            console.error("❌ Canvas processing error:", error);
            reject(error);
          }
        };
        
        img.onerror = (error) => {
          console.error("❌ Image loading error:", error);
          reject(new Error('Failed to load image for compression'));
        };
        
        img.src = base64;
        
      } catch (error) {
        console.error("❌ Compression setup error:", error);
        reject(error);
      }
    });
  };

  // ☁️ Upload image to ImgBB cloud service
  const uploadImageToCloud = async (base64Image) => {
    try {
      console.log("☁️ Uploading image to ImgBB...");
      
      // Compress image first
      const compressed = await compressBase64Image(base64Image, 800, 0.8);
      
      // Remove data:image/jpeg;base64, prefix
      const base64Data = compressed.base64.split(',')[1];
      
      // Create form data
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('key', '797c1f5d0e930286efefb2d15498a813'); // ImgBB API key
      formData.append('name', `feedback_${Date.now()}`);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Image uploaded successfully to ImgBB!");
        console.log("🔗 Image URL:", result.data.url);
        
        return {
          success: true,
          url: result.data.url,
          display_url: result.data.display_url,
          delete_url: result.data.delete_url,
          size: result.data.size,
          width: result.data.width,
          height: result.data.height,
          originalSizeKB: compressed.originalSizeKB,
          compressedSizeKB: compressed.sizeKB
        };
      } else {
        console.error("❌ ImgBB upload failed:", result);
        throw new Error(result.error?.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error("💥 Image upload error:", error);
      
      // Fallback to other services
      try {
        console.log("🔄 Trying fallback upload service...");
        return await uploadToFallbackService(base64Image);
      } catch (fallbackError) {
        console.error("❌ All upload services failed");
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
  };

  // 🔄 Fallback upload service
  const uploadToFallbackService = async (base64Image) => {
    try {
      // Compress image
      const compressed = await compressBase64Image(base64Image, 800, 0.8);
      
      // Try freeimage.host as fallback
      const base64Data = compressed.base64.split(',')[1];
      
      const formData = new FormData();
      formData.append('source', base64Data);
      formData.append('type', 'base64');
      formData.append('action', 'upload');
      
      const response = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'X-API-Key': 'your-api-key-here' // Replace with actual key if needed
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Fallback upload successful!");
        return {
          success: true,
          url: result.image.url,
          display_url: result.image.display_url,
          size: result.image.size,
          width: result.image.width,
          height: result.image.height,
          originalSizeKB: compressed.originalSizeKB,
          compressedSizeKB: compressed.sizeKB
        };
      } else {
        throw new Error('Fallback upload failed');
      }
      
    } catch (error) {
      console.error("❌ Fallback upload failed:", error);
      throw error;
    }
  };

  // 📧 Send email with cloud image URL
  const sendWithWeb3Forms = async (formData, imageData) => {
    const currentOrigin = window.location.origin;
    const isDevTunnel = currentOrigin.includes('devtunnels.ms');
    const isLocalhost = window.location.hostname === 'localhost';
    
    console.log("📧 Web3Forms sending with cloud image URL...");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '9e60d439-1539-47d8-a7db-ef00b2e4686a',
          from_name: formData.name,
          subject: `💌 Feedback từ ${formData.name} - ${formData.date.day}/${formData.date.month}/${formData.date.year}`,
          
          // 📝 Plain text version (fallback)
          message: `
🎉 FEEDBACK MỚI TỪ WEBSITE!

👤 Thông tin người gửi:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tên: ${formData.name}
• Thời gian: ${formData.date.day}/${formData.date.month}/${formData.date.year} lúc ${formData.date.hour}:${formData.date.minute}

⭐ Đánh giá về bạn:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.about}

💭 Kỷ niệm đáng nhớ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.memories}

📸 Hình ảnh kỷ niệm:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${imageData ? `✅ Xem ảnh tại: ${imageData.url}

📊 Thông tin ảnh:
• Kích thước: ${imageData.width}x${imageData.height}
• Dung lượng gốc: ${imageData.originalSizeKB}KB
• Sau nén: ${imageData.compressedSizeKB}KB
• Cloud URL: ${imageData.url}
` : '❌ Không có ảnh'}

💌 Lời nhắn gửi tới bạn:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

🏆 Điểm đẹp trai: ${formData.handsome}/100

🌐 Thông tin kỹ thuật:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Origin: ${currentOrigin}
• DevTunnel: ${isDevTunnel ? 'Yes' : 'No'}
• Localhost: ${isLocalhost ? 'Yes' : 'No'}
• Online: ${navigator.onLine ? 'Yes' : 'No'}
• User Agent: ${navigator.userAgent.slice(0, 80)}...
• Timestamp: ${new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💖 Gửi từ: ${currentOrigin}
☁️ Image Cloud Upload Enabled
          `,

          // 🎨 HTML version (main content)
          _html: `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback từ ${formData.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 24px; 
            margin-bottom: 10px; 
            font-weight: 700; 
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9; 
        }
        .content { 
            padding: 0; 
        }
        .section { 
            padding: 25px; 
            border-bottom: 1px solid #f0f0f0; 
        }
        .section:last-child { 
            border-bottom: none; 
        }
        .section h3 { 
            color: #667eea; 
            font-size: 18px; 
            margin-bottom: 15px; 
            font-weight: 600; 
        }
        .section p { 
            font-size: 15px; 
            line-height: 1.7; 
            color: #444; 
        }
        .image-container { 
            text-align: center; 
            margin: 20px 0; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 10px; 
        }
        .image-container img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 10px; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
            transition: transform 0.3s ease; 
        }
        .image-container img:hover { 
            transform: scale(1.02); 
        }
        .image-info { 
            background: #e3f2fd; 
            padding: 15px; 
            border-radius: 8px; 
            margin-top: 15px; 
            font-size: 14px; 
            color: #1976d2; 
        }
        .cloud-link { 
            background: #28a745; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 25px; 
            text-decoration: none; 
            display: inline-block; 
            margin: 10px 0; 
            font-weight: bold; 
            transition: all 0.3s ease; 
        }
        .cloud-link:hover { 
            background: #218838; 
            transform: translateY(-2px); 
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); 
        }
        .rating { 
            background: linear-gradient(135deg, #28a745, #20c997); 
            color: white; 
            display: inline-block; 
            padding: 12px 20px; 
            border-radius: 25px; 
            font-weight: bold; 
            font-size: 16px; 
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); 
        }
        .footer { 
            background: #343a40; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        .footer p { 
            margin: 5px 0; 
            opacity: 0.8; 
        }
        .tech-info { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            font-size: 13px; 
            color: #666; 
            margin-top: 15px; 
        }
        .tech-info strong { 
            color: #333; 
        }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 10px; }
            .section { padding: 20px 15px; }
            .header { padding: 25px 15px; }
            .header h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 FEEDBACK MỚI TỪ WEBSITE!</h1>
            <p>📅 ${formData.date.day}/${formData.date.month}/${formData.date.year} lúc ${formData.date.hour}:${formData.date.minute}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>👤 Thông tin người gửi</h3>
                <p><strong>Tên:</strong> ${formData.name}</p>
            </div>
            
            <div class="section">
                <h3>⭐ Đánh giá về bạn</h3>
                <p>${formData.about}</p>
            </div>
            
            <div class="section">
                <h3>💭 Kỷ niệm đáng nhớ</h3>
                <p>${formData.memories}</p>
            </div>
            
            <div class="section">
                <h3>📸 Hình ảnh kỷ niệm</h3>
                
                ${imageData ? `
                <div class="image-container">
                    <img src="${imageData.url}" alt="Kỷ niệm đáng nhớ từ ${formData.name}" />
                    
                    <div class="image-info">
                        <strong>📊 Thông tin ảnh:</strong><br>
                        • Kích thước: ${imageData.width}x${imageData.height}<br>
                        • Dung lượng gốc: ${imageData.originalSizeKB}KB<br>
                        • Sau nén: ${imageData.compressedSizeKB}KB<br>
                        • Lưu trữ: Cloud Storage ☁️
                    </div>
                    
                    <a href="${imageData.url}" target="_blank" class="cloud-link">
                        🔗 Xem ảnh full size
                    </a>
                </div>
                ` : `
                <div class="image-info">
                    ❌ Không có ảnh kỷ niệm
                </div>
                `}
            </div>
            
            <div class="section">
                <h3>💌 Lời nhắn gửi tới bạn</h3>
                <p>${formData.message}</p>
            </div>
            
            <div class="section">
                <h3>🏆 Điểm đẹp trai</h3>
                <p><span class="rating">${formData.handsome}/100 điểm</span></p>
            </div>
            
            <div class="section">
                <h3>🌐 Thông tin kỹ thuật</h3>
                <div class="tech-info">
                    <p><strong>Origin:</strong> ${currentOrigin}</p>
                    <p><strong>DevTunnel:</strong> ${isDevTunnel ? 'Yes' : 'No'}</p>
                    <p><strong>Localhost:</strong> ${isLocalhost ? 'Yes' : 'No'}</p>
                    <p><strong>Online:</strong> ${navigator.onLine ? 'Yes' : 'No'}</p>
                    <p><strong>User Agent:</strong> ${navigator.userAgent.slice(0, 80)}...</p>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    <p><strong>Image URL:</strong> ${imageData ? imageData.url : 'No image'}</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🌐 Gửi từ: ${currentOrigin}</p>
            <p>💖 Powered by Web3Forms API</p>
            <p>☁️ Images hosted on Cloud Storage</p>
        </div>
    </div>
</body>
</html>
          `,
          
          // Email settings
          email: 'buiducthinh22112003@gmail.com',
          _replyto: `noreply@${window.location.hostname}`,
          
          // Custom fields
          _form_name: 'Feedback Form with Cloud Image',
          _form_origin: currentOrigin,
          _user_name: formData.name,
          _user_rating: formData.handsome,
          _submission_time: `${formData.date.day}/${formData.date.month}/${formData.date.year} ${formData.date.hour}:${formData.date.minute}`,
          _image_url: imageData?.url || '',
          _image_size_kb: imageData?.compressedSizeKB || 0,
          
          // Disable captcha
          _captcha: false,
          
          // Custom subject
          _subject: `Website Feedback from ${formData.name} [cloud_image]`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Web3Forms SUCCESS with cloud image!");
        return result;
      } else {
        console.error("❌ Web3Forms FAILED:", result);
        throw new Error(result.message || 'Web3Forms submission failed');
      }
    } catch (error) {
      console.error("💥 Web3Forms ERROR:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showMessage(errors.join(', '), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm();
      setSubmitSuccess(true);
      showMessage('Gửi thành công! Cảm ơn bạn đã chia sẻ 💖', 'success');
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = getErrorMessage(error);
      showMessage(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (error) => {
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorMessage.includes('fetch')) {
      return '🌐 Lỗi kết nối mạng. Kiểm tra internet và thử lại!';
    }
    
    if (errorMessage.includes('timeout')) {
      return '⏱️ Timeout - Mạng chậm. Vui lòng thử lại!';
    }
    
    if (errorMessage.includes('Upload failed')) {
      return '☁️ Lỗi upload ảnh lên cloud. Vui lòng thử lại!';
    }
    
    if (error?.status === 429) {
      return '⏳ Gửi quá nhanh - Vui lòng đợi ít phút rồi thử lại!';
    }
    
    if (error?.status === 400) {
      return '📝 Dữ liệu không hợp lệ - Kiểm tra lại thông tin!';
    }
    
    return `❌ Có lỗi xảy ra: ${errorMessage}. Vui lòng thử lại!`;
  };

  const submitForm = async () => {
    console.log("🚀 Starting form submission with cloud image upload...");
    
    setShow(false);
    setShowLetter(true);
    setAvailable(false);
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    const date = new Date();
    const time = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours(),
      minute: String(date.getMinutes()).padStart(2, "0"),
    };

    const updatedData = { ...data, date: time };
    setData(updatedData); 
    
    if (!onDevelopmentEnv) {
      try {
        // 🔄 Step 1: Upload image to cloud
        let imageData = null;
        if (updatedData.image) {
          console.log("☁️ Uploading image to cloud...");
          showMessage('Đang upload ảnh lên cloud...', 'info');
          imageData = await uploadImageToCloud(updatedData.image);
          console.log("✅ Image uploaded successfully:", imageData);
        }
        
        // 🔄 Step 2: Send email with cloud image URL
        console.log("📤 Sending email with cloud image URL...");
        showMessage('Đang gửi email...', 'info');
        const result = await sendWithWeb3Forms(updatedData, imageData);
        console.log("✅ Email sent successfully:", result);
        
        // Clear cache only after successful send
        localStorage.removeItem("data");
        console.log("🗑️ Cache cleared");
        
      } catch (error) {
        console.error("❌ Submit failed:", error);
        
        // Keep data for retry
        localStorage.setItem("data", JSON.stringify(updatedData));
        console.log("💾 Data saved for retry");
        
        throw error;
      }
    } else {
      console.log("⏭️ Development mode - Skipping upload & email");
      localStorage.removeItem("data");
    }
  };
  
  return (
    <>
      <Collapse in={available && data.message.length >= 5}>
        <div className="submit-container">
          <Card variant="outlined" className="card-hover">
            {isSubmitting && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1,
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#667eea' }
                }}
              />
            )}
            <CardHeader
              title={dc.submit.title}
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              sx={{ pl: 3, pr: 3, pt: 3 }}
              subheader={dc.submit.subheader}
              subheaderTypographyProps={{ variant: "subtitle2" }}
            />
            <CardActionArea>
              <CardMedia
                component="img" height="400" image={dc.submit.image} alt="Klee"
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
            </CardActionArea>
            <CardContent sx={{ borderBottom: 1, borderColor: "divider", pt: 3, pb: 3 }}>
              <Typography variant="body1" sx={{ pl: 1, pr: 1, mb: 3, lineHeight: 1.6 }}>
                {dc.submit.content} <br /> <br /> {dc.submit.content2}
              </Typography>
            </CardContent>
            <CardActions sx={{ pl: 3, pr: 3, pb: 3, pt: 3, gap: 1 }}>
              <Button 
                className="enhanced-button"
                endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : 
                         submitSuccess ? <CheckCircleIcon /> : <SendRoundedIcon />}
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || submitSuccess}
                sx={{
                  background: submitSuccess 
                    ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: '#ffffff', fontWeight: 600, borderRadius: '12px', textTransform: 'none',
                  padding: '12px 24px', minWidth: '140px',
                  boxShadow: submitSuccess 
                    ? '0 4px 15px rgba(76, 175, 80, 0.4)'
                    : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                    background: submitSuccess ? 'linear-gradient(45deg, #8bc34a 30%, #4caf50 90%)' : 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: submitSuccess ? '0 6px 20px rgba(76, 175, 80, 0.6)' : '0 6px 20px rgba(102, 126, 234, 0.6)',
                  },
                  '&:disabled': {
                    background: submitSuccess ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)' : '#e0e0e0',
                    color: submitSuccess ? '#ffffff' : '#9e9e9e',
                    cursor: 'not-allowed',
                  }
                }}
              >
                {isSubmitting ? 'Đang gửi...' : 
                 submitSuccess ? 'Đã gửi!' : dc.submit.button}
              </Button>
              <Button 
                variant="text" 
                onClick={() => { window.scrollTo({ top: 750, behavior: "smooth" }); }}
                disabled={isSubmitting}
                sx={{
                  fontWeight: 500, borderRadius: '12px', textTransform: 'none', padding: '12px 16px',
                }}
              >
                Xem lại
              </Button>
            </CardActions>
          </Card>
        </div>
      </Collapse>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: '12px', '& .MuiAlert-icon': { fontSize: '1.2rem' } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Submit;

