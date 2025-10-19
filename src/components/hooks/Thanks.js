import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CardActionArea,
  Button,
  Collapse,
  Typography, 
  Dialog,
} from "@mui/material";

const Thanks = ({ show, data, available }) => {
  const [openImage, setOpenImage] = useState(false);

  const handleImageClick = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleReadLetter = () => {
    // Handle read letter action
  };

  return (
    <>
      <Collapse 
        in={!show && !available}
        timeout={800}
      >
        <div className="thanks-container">
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent
              sx={{ pt: 3, pb: 3, borderBottom: 1, borderColor: "divider" }}
            >
              <Typography variant="body1" sx={{ pl: 1, pr: 1, fontStyle: "italic" }}>
                Cảm ơn {data.name} đã gửi thư cho tớ, toàn bộ bức thư của cậu ở phía dưới đó, nhớ lướt xuống để xem full nhe. Tớ thực sự rất trân trọng những gì cậu đã gửi cho tớ nên là...nhất định hôm tới phải có mặt để chụp ảnh với nhau đấy nhé <br /> Và cuối cùng xin gửi ngàn yêu thương💓 tới bé quân sư thiết kế đặc biệt "V03" đã giúp anh thiết kế thiệp mời và 2 đồng chí cố vấn công nghệ Kantfallinlove và Nguyễn Hiếu đã giúp bạn clone và upgrade con web xinh xinh này. <br /> Thiệp deluxe edition: https://sorts.one/dDe
              </Typography >
            </CardContent>
            <CardActionArea onClick={handleImageClick}>
              <CardMedia
                component="img"
                height="400"
                image="/images/thank-you.jpg"
                alt="Tớ ngồi code sml"
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </CardActionArea>
            <CardActions sx={{ pl: 2, pr: 2, pt: 2, pb: 2 }}>
              <Button size="small" color="primary" onClick={handleReadLetter}>
                Đọc lại thư
              </Button>
              <Button size="small" color="primary" onClick={() => { window.open("https://www.facebook.com/LtGhost21", "_blank") }}>
                Direct của tớ
              </Button>
              <Button size="small" color="primary" onClick={() => { window.open("https://open.spotify.com/playlist/03yaoPWq0vjky64z7Acegj", "_blank") }}>
                Playlist của tớ nè
              </Button>
            </CardActions>
          </Card>
        </div>
      </Collapse>

      <Dialog
        open={openImage}
        onClose={handleCloseImage}
        maxWidth="xl"
        fullWidth
      >
        <img
          src="/images/thank-you.jpg"
          alt="Tớ ngồi code sml"
          style={{ width: '100%', height: 'auto' }}
        />
      </Dialog>
    </>
  );
};

export default Thanks;
