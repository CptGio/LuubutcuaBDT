import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Modal,
  IconButton,
  Fade,
  Collapse,
  CardActionArea
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  QueueMusic
} from '@mui/icons-material';
import audioFile from './nhac.mp3';
import styled from '@mui/material/styles/styled';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.palette.mode === 'dark' 
    ? 'none' 
    : '0 2px 4px rgba(0,0,0,0.1)',
}));

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem('musicLiked') === 'true';
  });
  const [showLyrics, setShowLyrics] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  const audioRef = useRef(null);
  const slideIntervalRef = useRef(null);

  // Danh sách các ảnh cho slideshow
  const images = [
    '/images/slide-1.jpg',
    '/images/slide-2.jpg',
    '/images/slide-3.jpg',
    '/images/slide-4.png',
    '/images/slide-5.jpg',
    '/images/slide-6.jpg',
    '/images/slide-7.jpg',
    '/images/slide-8.jpg',
    '/images/slide-9.jpg',
    '/images/slide-10.jpg',
    '/images/slide-11.jpg',
    '/images/slide-12.jpg',
    '/images/slide-13.jpg',
    '/images/slide-14.jpg',
  ];

  const lyrics = [
    { time: 20, text: "Bàn chân kia lâu nay" },
    { time: 22, text: "Chưa một lần rong chơi tung bay" },
    { time: 24, text: "Chưa một lần thấy cơn gió mát đến vậy" },
    { time: 28, text: "Thấy nơi nơi là nhiều thứ mới là một thế giới, chưa từng nghĩ tới" },
    { time: 33, text: "Phải chăng đã lâu rồi ta chẳng nghỉ ngơi" },
    { time: 37, text: "Bàn chân kia hôm nay" },
    { time: 39, text: "Ra ngoài rong chơi bay tung bay" },
    { time: 41, text: "Đi và phiêu theo những câu hát đêm ngày" },
    { time: 44, text: "Trái tim như nhẹ nhàng mở ra giữa bầu trời bao la" },
    { time: 49, text: "Giữa biển khơi và hoa lá" },
    { time: 55, text: "Những chặng đường mình đi qua" },
    { time: 57, text: "Những con người ở nơi xa" },
    { time: 59, text: "Tôi sẽ ghi hết cất hết giữ hết để mãi sau này khi mở ra" },
    { time: 64, text: "Thấy rằng hôm qua mình đã sống thật thà" },
    { time: 68, text: "Đã chẳng hoang phí ngày thanh xuân của chính ta" },
    { time: 71, text: "Sẽ nhớ mãi hành trình nơi đây" },
    { time: 74, text: "Nhớ phút giây nhớ mỗi ngày" },
    { time: 76, text: "Nhớ những khung trời mà mình đã có ở đó với gió và mây" },
    { time: 81, text: "Đời là những chuyến đi" },
    { time: 82, text: "Chuyến đi nào thì cũng đáng nhớ" },
    { time: 85, text: "Và rồi một ngày nào tôi sẽ nhớ" },
    { time: 88, text: "NHỚ MÃI CHUYẾN ĐI NÀY" },
    { time: 90, text: "🎵🎵🎵🎵🎵" },
    { time: 106, text: "Đã bao nhiêu lâu" },
    { time: 108, text: "Bao lâu kể từ lần đầu tôi đi" },
    { time: 110, text: "Đi qua bao nơi xa xôi" },
    { time: 113, text: "Thấy được, có được những gì?" },
    { time: 115, text: "Vẫn còn ngây thơ" },
    { time: 116, text: "Vẫn còn mộng mơ?" },
    { time: 119, text: "Hay trưởng thành hơn từng giờ?" },
    { time: 123, text: "Đã bao nhiêu lâu" },
    { time: 125, text: "Bao lâu chưa trao một lời yêu thương? " },
    { time: 128, text: "Đi qua bao nơi xa xôi" },
    { time: 129, text: "Hóa ra để tôi thấy được" },
    { time: 132, text: "Mình còn ngô nghê" },
    { time: 133, text: "Mình còn say mê" },
    { time: 135, text: "Thì ra mình yêu đời như thế" },
    { time: 140, text: "Những chặng đường mình đi qua" },
    { time: 143, text: "Những con người ở nơi xa" },
    { time: 145, text: "Tôi sẽ ghi hết cất hết giữ hết để mãi sau này khi mở ra" },
    { time: 150, text: "Thấy rằng hôm qua mình đã sống thật thà" },
    { time: 154, text: "Đã chẳng hoang phí ngày thanh xuân của chính ta" },
    { time: 157, text: "Sẽ nhớ mãi hành trình nơi đây" },
    { time: 159, text: "Nhớ phút giây nhớ mỗi ngày" },
    { time: 162, text: "Nhớ những khung trời mà mình đã có ở đó với gió và mây" },
    { time: 167, text: "Đời là những chuyến đi" },
    { time: 169, text: "Chuyến đi nào thì cũng đáng nhớ" },
    { time: 171, text: "Và rồi một ngày nào tôi sẽ nhớ" },
    { time: 174, text: "NHỚ MÃI CHUYẾN ĐI NÀY" },
    { time: 178, text: "🎵🎵🎵🎵🎵" },
    { time: 191, text: "~Những chặng đường mình đi qua~" },
    { time: 193, text: "~Những con người ở nơi xa~" },
    { time: 195, text: "~Tôi sẽ ghi hết cất hết giữ hết để mãi sau này khi mở ra~" },
    { time: 200, text: "~Thấy rằng hôm qua mình đã sống thật thà~" },
    { time: 205, text: "~Đã chẳng hoang phí ngày thanh xuân của chính ta~" },
    { time: 207, text: "~Sẽ nhớ mãi hành trình nơi đây~" },
    { time: 209, text: "~Nhớ phút giây nhớ mỗi ngày~" },
    { time: 212, text: "~Nhớ những khung trời mà mình đã có ở đó với gió và mây~" },
    { time: 217, text: "~Đời là những chuyến đi~" },
    { time: 218, text: "~Chuyến đi nào thì cũng đáng nhớ~" },
    { time: 221, text: "~Và rồi một ngày nào tôi sẽ nhớ~" },
    { time: 224, text: "~NHỚ MÃI CHUYẾN ĐI NÀY~" },
  ];

  // Effect để xử lý slideshow khi đang phát nhạc
  useEffect(() => {
    if (playing) {
      // Bắt đầu slideshow
      slideIntervalRef.current = setInterval(() => {
        setFadeIn(false);
        
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % images.length
          );
          setFadeIn(true);
        }, 500); // Thời gian fade out
        
      }, 5000); // Mỗi 5 giây chuyển ảnh
    } else {
      // Dừng slideshow và reset về ảnh đầu tiên
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
      setCurrentImageIndex(0);
      setFadeIn(true);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [playing, images.length]);

  useEffect(() => {
    localStorage.setItem('musicLiked', liked.toString());
  }, [liked]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      setProgress((currentTime / duration) * 100 || 0);
      setCurrentTime(currentTime);
      setDuration(duration);
      
      const currentLyric = lyrics.findIndex((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
      });
      
      if (currentLyric !== -1 && currentLyric !== currentLyricIndex) {
        setCurrentLyricIndex(currentLyric);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = 0.7;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setPlaying(!playing);
    }
  };

  return (
    <>
      <Card sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        mb: 2,
        alignItems: 'center'
      }}>
        <CardActionArea onClick={() => setOpenModal(true)}>
          {/* ✅ FIXED: Container với kích thước cố định */}
          <Box sx={{ 
            position: 'relative',
            width: { xs: '100%', md: 300 },
            height: { xs: 300, md: 300 }, // ✅ Chiều cao cố định cho cả mobile và desktop
            overflow: 'hidden',
            backgroundColor: '#000', // Background đen khi ảnh đang load
            borderRadius: '4px'
          }}>
            {/* ✅ FIXED: Tất cả ảnh đều dùng position absolute */}
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute', // ✅ TẤT CẢ đều dùng absolute
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: index === currentImageIndex ? (fadeIn ? 1 : 0) : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  zIndex: index === currentImageIndex ? 1 : 0,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // ✅ Cover để fill đầy khung
                    objectPosition: 'center', // ✅ Căn giữa ảnh
                  }}
                  image={image}
                  alt={`Music cover ${index + 1}`}
                  onError={(e) => {
                    console.error(`Error loading image: ${image}`);
                    // Fallback về ảnh đầu tiên nếu lỗi
                    e.target.src = images[0];
                  }}
                />
              </Box>
            ))}
            
            {/* Indicator dots - chỉ hiện khi đang phát nhạc */}
            {playing && (
              <Box sx={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)'
              }}>
                {images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s ease',
                      boxShadow: index === currentImageIndex ? '0 2px 8px rgba(255,255,255,0.6)' : 'none',
                      transform: index === currentImageIndex ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </CardActionArea>

        <StyledBox sx={{ flex: 1 }}>
          <CardContent sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="h5" component="div" sx={{
              fontWeight: 500,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center'
            }}>
              Một hành trình 4 năm đáng nhớ
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary">
              Bấm "Play" để xem thanh xuân BAV của tớ có gì
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              @CptGio11
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 2,
              width: '100%',
              justifyContent: 'center'
            }}>
              <IconButton onClick={() => {}} size="small">
                <SkipPrevious />
              </IconButton>
              <IconButton 
                onClick={handlePlayPause} 
                size="large"
                sx={{
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                {playing ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton onClick={() => {}} size="small">
                <SkipNext />
              </IconButton>
              <IconButton onClick={() => setLiked(!liked)} size="small">
                {liked ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <Box sx={{ 
              width: '100%', 
              mb: 2,
              px: 2 
            }}>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                style={{ 
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                <Typography variant="caption">{formatTime(duration)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setShowLyrics(!showLyrics)}
              >
                {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
              </Button>
              <Button 
                variant="outlined" 
                color="success" 
                size="small"
                startIcon={<QueueMusic />}
                onClick={() => window.open("https://open.spotify.com/playlist/03yaoPWq0vjky64z7Acegj", "_blank")}
              >
                Playlist
              </Button>
            </Box>

            <Collapse in={showLyrics}>
              <Box sx={{ 
                textAlign: 'center', 
                mb: 3,
                maxWidth: '100%',
                px: 3,
                py: 3,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 50%, rgba(255, 107, 107, 0.1) 100%)',
                borderRadius: '20px',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.6), transparent)',
                  animation: 'shimmer 2s infinite'
                },
                '@keyframes shimmer': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' }
                }
              }}>
                <Typography 
                  variant="h4" 
                  component="div"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: currentLyricIndex >= 0 ? '#667eea' : 'text.secondary',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    minHeight: '3em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: currentLyricIndex >= 0 ? 'scale(1.02)' : 'scale(1)',
                    textShadow: currentLyricIndex >= 0 ? '0 4px 8px rgba(102, 126, 234, 0.4), 0 0 20px rgba(102, 126, 234, 0.2)' : 'none',
                    animation: currentLyricIndex >= 0 ? 'lyricGlow 0.8s ease-in-out' : 'none',
                    background: currentLyricIndex >= 0 ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'none',
                    WebkitBackgroundClip: currentLyricIndex >= 0 ? 'text' : 'none',
                    WebkitTextFillColor: currentLyricIndex >= 0 ? 'transparent' : 'inherit',
                    backgroundClip: currentLyricIndex >= 0 ? 'text' : 'none',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
                    '@keyframes lyricGlow': {
                      '0%': { 
                        opacity: 0.6, 
                        transform: 'scale(0.98) translateY(5px)',
                        filter: 'blur(1px)'
                      },
                      '50%': { 
                        opacity: 1, 
                        transform: 'scale(1.02) translateY(0px)',
                        filter: 'blur(0px)'
                      },
                      '100%': { 
                        opacity: 1, 
                        transform: 'scale(1.02) translateY(0px)',
                        filter: 'blur(0px)'
                      }
                    }
                  }}
                >
                  {currentLyricIndex >= 0 ? lyrics[currentLyricIndex].text : "🎵 Nhớ mãi chuyến đi này 🎵"}
                </Typography>

                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{
                    color: 'text.disabled',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    mt: 2,
                    opacity: 0.7,
                    fontStyle: 'italic',
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    fontWeight: 500,
                    minHeight: '2em',
                    transition: 'all 0.4s ease',
                    letterSpacing: '0.3px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {currentLyricIndex >= 0 && currentLyricIndex < lyrics.length - 1 
                    ? `Tiếp theo: ${lyrics[currentLyricIndex + 1].text}` 
                    : ""}
                </Typography>

                <Box sx={{ 
                  width: '100%', 
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 1
                }}>
                  <Typography variant="caption" sx={{ 
                    minWidth: '45px', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#667eea',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    {formatTime(currentTime)}
                  </Typography>
                  <Box sx={{ 
                    flex: 1, 
                    height: '6px', 
                    bgcolor: 'rgba(102, 126, 234, 0.2)', 
                    borderRadius: '3px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${progress}%`,
                      borderRadius: '3px',
                      transition: 'width 0.2s ease',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%)',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: '-2px',
                        width: '4px',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)'
                      }
                    }} />
                  </Box>
                  <Typography variant="caption" sx={{ 
                    minWidth: '45px', 
                    fontSize: '0.8rem', 
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#667eea',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    {formatTime(duration)}
                  </Typography>
                </Box>

                <Box sx={{ 
                  mt: 3, 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  width: '100%',
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '15px',
                  p: 2,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2, #667eea)'
                    }
                  }
                }}>
                  {lyrics.map((lyric, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        py: 1,
                        px: 2,
                        mb: 0.5,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: index === currentLyricIndex ? 700 : 500,
                        color: index === currentLyricIndex ? '#ffffff' : 
                               index < currentLyricIndex ? 'text.disabled' : 'text.secondary',
                        bgcolor: index === currentLyricIndex ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                        opacity: index === currentLyricIndex ? 1 : 
                                index < currentLyricIndex ? 0.6 : 0.8,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        border: index === currentLyricIndex ? '2px solid rgba(102, 126, 234, 0.5)' : '1px solid transparent',
                        transform: index === currentLyricIndex ? 'scale(1.02)' : 'scale(1)',
                        textShadow: index === currentLyricIndex ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
                        boxShadow: index === currentLyricIndex ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.2)',
                          transform: 'scale(1.01)',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                        },
                        textAlign: 'left',
                        letterSpacing: '0.3px',
                        lineHeight: 1.6
                      }}
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = lyric.time;
                        }
                      }}
                    >
                      <span style={{ 
                        marginRight: '12px', 
                        fontSize: '0.8rem',
                        color: 'rgba(102, 126, 234, 0.7)',
                        fontWeight: 600
                      }}>
                        {formatTime(lyric.time)}
                      </span>
                      {lyric.text}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </StyledBox>
      </Card>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
      />

      {/* Modal for fullscreen image view */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              outline: 'none',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
            }}
          >
            <IconButton
              onClick={() => setOpenModal(false)}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              ✕
            </IconButton>
            
            {/* Fullscreen slideshow */}
            <Box sx={{ 
              position: 'relative',
              width: '90vw',
              height: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: index === currentImageIndex ? (fadeIn ? 1 : 0) : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    zIndex: index === currentImageIndex ? 1 : 0,
                  }}
                >
                  <img
                    src={image}
                    alt={`Music cover ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ))}
              
              {/* Navigation arrows */}
              <IconButton
                onClick={() => {
                  setFadeIn(false);
                  setTimeout(() => {
                    setCurrentImageIndex((prev) => 
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                    setFadeIn(true);
                  }, 300);
                }}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                ‹
              </IconButton>
              
              <IconButton
                onClick={() => {
                  setFadeIn(false);
                  setTimeout(() => {
                    setCurrentImageIndex((prev) => 
                      (prev + 1) % images.length
                    );
                    setFadeIn(true);
                  }, 300);
                }}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                ›
              </IconButton>

              {/* Image counter */}
              <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                zIndex: 10
              }}>
                {currentImageIndex + 1} / {images.length}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default MusicPlayer;

