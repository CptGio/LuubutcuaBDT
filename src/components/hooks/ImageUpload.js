// file: ImageUpload.js

import React, { useRef } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Collapse,
  Button,
} from "@mui/material";
import dc from "../lib/DataConfig";

const ImageUpload = ({ setData, data, available }) => {
  // Sử dụng useRef để tham chiếu đến input ẩn
  const inputFileRef = useRef(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Lưu ảnh dưới dạng base64 string vào state
        setData({ ...data, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Giả lập click vào input khi nhấn nút
  const handleUploadClick = () => {
    inputFileRef.current.click();
  };

  return (
    // Điều kiện hiện component: available và đã nhập memories
    <Collapse in={available && data.memories.length >= 5}>
      <div className="imageUpload-container">
        <Card variant="outlined" sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6">{dc.image.title}</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ pb: 2 }}>
              {dc.image.subtitle}
            </Typography>
            
            {/* Input file được ẩn đi */}
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            {/* Nút để kích hoạt input file */}
            <Button variant="contained" onClick={handleUploadClick}>
              Chọn ảnh kỷ niệm
            </Button>

            {/* Hiển thị ảnh xem trước nếu đã có */}
            {data.image && (
              <Box mt={2} sx={{ maxWidth: '300px', border: '1px solid #ddd', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  Ảnh xem trước:
                </Typography>
                <img 
                  src={data.image} 
                  alt="Preview" 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </div>
    </Collapse>
  );
};

export default ImageUpload;