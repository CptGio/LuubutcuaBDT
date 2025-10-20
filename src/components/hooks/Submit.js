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

  // ☁️ Upload ảnh gốc lên ImgBB (KHÔNG NÉN)
  const uploadImageToCloud = async (base64Image) => {
    try {
      console.log("☁️ Uploading ORIGINAL image to ImgBB...");
      
      // Lấy thông tin ảnh gốc
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = base64Image;
      });
      
      const originalSizeKB = Math.round(base64Image.length / 1024);
      console.log(`📊 Original image: ${img.width}x${img.height} (${originalSizeKB}KB)`);
      
      // Upload ảnh gốc KHÔNG NÉN
      const base64Data = base64Image.split(',')[1];
      
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('key', '797c1f5d0e930286efefb2d15498a813');
      formData.append('name', `feedback_original_${Date.now()}`);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Original image uploaded successfully to ImgBB!");
        console.log("🔗 Image URL:", result.data.url);
        
        return {
          success: true,
          url: result.data.url,
          display_url: result.data.display_url,
          delete_url: result.data.delete_url,
          size: result.data.size,
          width: result.data.width,
          height: result.data.height,
          originalSizeKB: originalSizeKB
        };
      } else {
        console.error("❌ ImgBB upload failed:", result);
        throw new Error(result.error?.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error("💥 Image upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  // 📧 Gửi email với format đơn giản
  const sendWithWeb3Forms = async (formData, imageData) => {
    const currentOrigin = window.location.origin;
    const isDevTunnel = currentOrigin.includes('devtunnels.ms');
    const isLocalhost = window.location.hostname === 'localhost';
    
    console.log("📧 Web3Forms sending...");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '9e60d439-1539-47d8-a7db-ef00b2e4686a',
          from_name: formData.name,
          subject: `💌 Phản hồi từ ${formData.name}`,
          
          // 📝 Plain text version
          message: `
🎉 PHẢN HỒI MỚI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ ${dc.nameInput.title}
💬 ${formData.name}

❓ ${dc.aboutMe.title}
💬 ${formData.about}

❓ ${dc.handsome.title}
💬 ${formData.handsome}/100 điểm

❓ ${dc.memories.title}
💬 ${formData.memories}

❓ ${dc.image.title}
${imageData ? `🔗 ${imageData.url}` : '❌ Không có ảnh'}

❓ ${dc.message.title}
💬 ${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${formData.date.day}/${formData.date.month}/${formData.date.year} lúc ${formData.date.hour}:${formData.date.minute}
🌐 ${currentOrigin}
          `,

          // 🎨 HTML version
          _html: `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phản hồi từ ${formData.name}</title>
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
        .question { 
            color: #667eea; 
            font-size: 16px; 
            margin-bottom: 10px; 
            font-weight: 600; 
        }
        .answer { 
            font-size: 15px; 
            line-height: 1.7; 
            color: #444; 
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
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
            <h1>🎉 PHẢN HỒI MỚI</h1>
            <p>📅 ${formData.date.day}/${formData.date.month}/${formData.date.year} lúc ${formData.date.hour}:${formData.date.minute}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="question">❓ ${dc.nameInput.title}</div>
                <div class="answer">${formData.name}</div>
            </div>
            
            <div class="section">
                <div class="question">❓ ${dc.aboutMe.title}</div>
                <div class="answer">${formData.about}</div>
            </div>
            
            <div class="section">
                <div class="question">❓ ${dc.handsome.title}</div>
                <div class="answer">
                    <span class="rating">${formData.handsome}/100 điểm</span>
                </div>
            </div>
            
            <div class="section">
                <div class="question">❓ ${dc.memories.title}</div>
                <div class="answer">${formData.memories}</div>
            </div>
            
            <div class="section">
                <div class="question">❓ ${dc.image.title}</div>
                
                ${imageData ? `
                <div class="image-container">
                    <img src="${imageData.url}" alt="Hình ảnh kỷ niệm từ ${formData.name}" />
                    
                    <div class="image-info">
                        <strong>📊 Thông tin ảnh gốc:</strong><br>
                        • Kích thước: ${imageData.width}x${imageData.height}<br>
                        • Dung lượng: ${imageData.originalSizeKB}KB<br>
                        • Chất lượng: Gốc (100%) ⭐
                    </div>
                    
                    <a href="${imageData.url}" target="_blank" class="cloud-link">
                        🔗 Xem ảnh full size
                    </a>
                </div>
                ` : `
                <div class="answer">❌ Không có ảnh kỷ niệm</div>
                `}
            </div>
            
            <div class="section">
                <div class="question">❓ ${dc.message.title}</div>
                <div class="answer">${formData.message}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>🌐 Gửi từ: ${currentOrigin}</p>
            <p>💖 Powered by Web3Forms</p>
            <p>☁️ Images hosted on ImgBB (Original Quality)</p>
        </div>
    </div>
</body>
</html>
          `,
          
          // Email settings
          email: 'buiducthinh22112003@gmail.com',
          _replyto: `noreply@${window.location.hostname}`,
          
          // Custom fields
          _form_name: 'Feedback Form',
          _form_origin: currentOrigin,
          _user_name: formData.name,
          _user_rating: formData.handsome,
          _submission_time: `${formData.date.day}/${formData.date.month}/${formData.date.year} ${formData.date.hour}:${formData.date.minute}`,
          _image_url: imageData?.url || '',
          _image_size_kb: imageData?.originalSizeKB || 0,
          
          // Disable captcha
          _captcha: false,
          
          // Custom subject
          _subject: `Phản hồi từ ${formData.name}`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Web3Forms SUCCESS!");
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
    console.log("🚀 Starting form submission...");
    
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
        // 🔄 Step 1: Upload ảnh gốc lên cloud
        let imageData = null;
        if (updatedData.image) {
          console.log("☁️ Uploading original image to cloud...");
          showMessage('Đang upload ảnh gốc...', 'info');
          imageData = await uploadImageToCloud(updatedData.image);
          console.log("✅ Original image uploaded:", imageData);
        }
        
        // 🔄 Step 2: Gửi email
        console.log("📤 Sending email...");
        showMessage('Đang gửi email...', 'info');
        const result = await sendWithWeb3Forms(updatedData, imageData);
        console.log("✅ Email sent successfully:", result);
        
        // Xóa cache sau khi gửi thành công
        localStorage.removeItem("data");
        console.log("🗑️ Cache cleared");
        
      } catch (error) {
        console.error("❌ Submit failed:", error);
        
        // Giữ data để retry
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
