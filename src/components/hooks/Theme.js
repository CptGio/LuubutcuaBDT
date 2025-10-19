import React from "react";
import {
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ThemeButton from "./ThemeButton";

const Theme = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [modeTheme, setMode] = React.useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved ? JSON.parse(saved) : prefersDarkMode;
  });
  
  React.useEffect(() => {
    localStorage.setItem('themeMode', JSON.stringify(modeTheme));
  }, [modeTheme]);
  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: modeTheme ? 'dark' : 'light',
          primary: {
            main: modeTheme ? '#667eea' : '#667eea',
            light: modeTheme ? '#8fa5f3' : '#8fa5f3',
            dark: modeTheme ? '#4a69d1' : '#4a69d1',
          },
          secondary: {
            main: modeTheme ? '#764ba2' : '#764ba2',
            light: modeTheme ? '#9a6fb5' : '#9a6fb5',
            dark: modeTheme ? '#5d3c82' : '#5d3c82',
          },
          background: {
            default: modeTheme ? '#0a0a0a' : '#fafafa',
            paper: modeTheme ? '#1e1e1e' : '#ffffff',
          }
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1920, // ✨ Extra large breakpoint
          }
        },
          typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h5: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
          },
          body1: {
            lineHeight: 1.6,
          },
          body2: {
            lineHeight: 1.5,
          }
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiContainer: {
            styleOverrides: {
              root: {
                maxWidth: '1400px !important', // ✨ Mở rộng từ 1200px → 1600px
                margin: '0 auto',
                padding: '0 24px',
                width: '100%',
                '@media (max-width: 600px)': {
                  padding: '0 16px',
                },
                '@media (min-width: 1200px)': {
                  padding: '0 32px',
                },
                '@media (min-width: 1920px)': {
                  maxWidth: '1400px !important', // ✨ Còn rộng hơn trên màn hình lớn
                  padding: '0 40px',
                }
              },
              maxWidthXs: {
                maxWidth: '100% !important',
              },
              maxWidthSm: {
                maxWidth: '100% !important',
              },
              maxWidthMd: {
                maxWidth: '1200px !important',
              },
              maxWidthLg: {
                maxWidth: '1400px !important', // ✨ Large containers
              },
              maxWidthXl: {
                maxWidth: '1600px !important', // ✨ Extra large containers
              }
            }
          },
            MuiCard: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${modeTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                width: '100%', // ✨ Cards full width
                maxWidth: 'none', // ✨ Remove max width restriction
              }
            }
          },
            MuiButton: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            }
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: modeTheme ? '#1e1e1e' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #764ba2, #667eea)',
                    }
                }
              }
            }
          }
          }
        }),
      [modeTheme],
    );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeButton setMode={setMode} modeTheme={modeTheme}/>
        <div 
        className="App"
        style={{
          maxWidth: '1200px', // ✨ Mở rộng app container
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
          minHeight: '100vh',
          
          // 📱 Responsive design
          '@media (max-width: 600px)': {
            padding: '0 16px',
          },
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
};

export default Theme;