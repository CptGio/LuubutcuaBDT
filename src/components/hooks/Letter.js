import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Collapse,
  Typography,
  Box, // <-- Import Box để dễ dàng tạo kiểu
} from "@mui/material";

const Letter = ({ show, data, showLetter }) => {
  return (
    <Collapse in={!show && showLetter}>
      <div className="letter-container">
        <Card
          variant="outlined"
          sx={{
            width: "100%",
          }}
        >
          <CardContent sx={{ pt: 3, pb: 3 }}>
            <Typography variant="body1" sx={{ pl: 1, pr: 1, mb: 5, lineHeight: 1.7 }}>
              <i>
                Ngày {data.date?.day} tháng {data.date?.month} năm {data.date?.year}
                <br />
                {data.date?.hour} giờ {data.date?.minute} phút.
              </i>
              <br />
              <br />
              Gửi<strong> Thịnh</strong>
              <br />
              <br />
              Sau 1 thời gian được tiếp xúc, được hoạt động, làm việc với nhau, tớ chấm cậu được {data.handsome} điểm đóoo. Để tớ nói cảm nhận của tớ về cậu nhe:
              <br />
              <br />
              <i>{data.about}</i>
              <br />
              <br />
              Nói ra mấy cái lời kia cũng ngại ngại ghê. Sau cùng thì tớ thấy cậu của 4 năm đại học này đi đâu cũng thấy có mặt. Đây, tớ tìm được kỷ niệm này giữa chúng mình nè:
              <br />
              <br />

              {/* --- PHẦN THÊM MỚI ĐỂ HIỂN THỊ ẢNH --- */}
              {data.image && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    my: 3 // Thêm khoảng cách trên và dưới cho ảnh
                  }}
                >
                  <CardMedia
                    component="img"
                    image={data.image} // Lấy ảnh từ state 'data'
                    alt="Ảnh kỷ niệm"
                    sx={{
                      maxWidth: { xs: '90%', md: '500px' }, // Chiều rộng tối đa, responsive
                      height: 'auto',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
              )}
              {/* --- KẾT THÚC PHẦN THÊM MỚI --- */}

              <i>{data.memories}</i>
              <br />
              <br />
              Oaaa, trông hoài niệm quá trời nhờ. Vậy nên là mấy hôm nữa cậu phải bảo người của cậu chụp ảnh còn đẹp hơn bức kia để còn lưu làm kỷ niệm đấy. Cuối cùng tớ có đôi lời muốn gửi đến cậu:
              <br />
              <br />
              <i>{data.message}</i>
              <br />
              <br />
              Ựa, hông bít viết thêm gì nữa. Dù sao thì chúc mừng tân cán bộ Vietcombank Thái Bình nhé. Chúc cậu sớm thành công lái 4 bánh đưa tớ đi chơi ở rì sọt và sớm rước được bé xinh xinh nào đóoooo về dinh nha. Cố lên đó, tớ tin cậu!!!
              <br />
              Kí tên
              <br />
              <strong>{data.name}</strong>.
            </Typography>
          </CardContent>
          <CardActionArea>
            <CardMedia
              component="img"
              height="400"
              image="/images/thank-you.jpg"
              alt="Cảm ơn bạn"
            />
          </CardActionArea>
        </Card>
      </div>
    </Collapse>
  );
};

export default Letter;