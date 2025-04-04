import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme } from '@mui/material';
import { Container, CssBaseline } from '@mui/material';
// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import JobList from './pages/JobList';

import EditJob from './pages/EditJob';
import JobPost from './pages/JobPost';
import Profile from './pages/Profile';
import About from './pages/AboutUs';
import Apply from './pages/Apply';
import PersonalityQuiz from './pages/PersonalityQuiz';
import Categories from './pages/Categories';


// Components
import Navbar from './components/Navbar';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: {
        xs: '2rem',
        sm: '2.5rem',
        md: '3rem'
      }
    },
    h2: {
      fontWeight: 600,
      fontSize: {
        xs: '1.75rem',
        sm: '2rem',
        md: '2.5rem'
      }
    },
    h3: {
      fontWeight: 600,
      fontSize: {
        xs: '1.5rem',
        sm: '1.75rem',
        md: '2rem'
      }
    },
    h4: {
      fontWeight: 600,
      fontSize: {
        xs: '1.25rem',
        sm: '1.5rem',
        md: '1.75rem'
      }
    },
    h5: {
      fontWeight: 600,
      fontSize: {
        xs: '1.1rem',
        sm: '1.25rem',
        md: '1.5rem'
      }
    },
    h6: {
      fontWeight: 600,
      fontSize: {
        xs: '1rem',
        sm: '1.1rem',
        md: '1.25rem'
      }
    },
    subtitle1: {
      fontSize: {
        xs: '1rem',
        sm: '1.1rem',
        md: '1.1rem'
      }
    },
    button: { fontWeight: 500 }
  },
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          fontSize: {
            xs: '0.875rem',
            sm: '0.9rem',
            md: '1rem'
          },
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
          },
          '@media (max-width: 600px)': {
            minWidth: 'auto',
            padding: '6px 12px'
          }
        },
        contained: {
          boxShadow: '0 1px 3px rgba(37, 99, 235, 0.1)'
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px'
          }
        },
        // Make buttons more touch-friendly on mobile
        sizeLarge: {
          '@media (max-width: 600px)': {
            padding: '10px 16px'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(37, 99, 235, 0.05)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
          boxShadow: '0 1px 3px rgba(37, 99, 235, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.08)'
          },
          '@media (max-width: 600px)': {
            borderRadius: '10px',
            '&:hover': {
              transform: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
            }
          }
        }
      }
    },
    // Add responsive grid spacing
    MuiGrid: {
      styleOverrides: {
        container: {
          '@media (max-width: 600px)': {
            marginTop: '8px',
            marginBottom: '8px'
          }
        },
        item: {
          '@media (max-width: 600px)': {
            paddingTop: '8px',
            paddingBottom: '8px'
          }
        }
      }
    },
    // Make form controls more touch-friendly
    MuiFormControl: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            marginBottom: '16px'
          }
        }
      }
    }
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar user={user} />
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signin"
              element={!user ? <SignIn /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUp /> : <Navigate to="/" />}
            />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/edit-job/:jobId" element={<EditJob />} />
            <Route
              path="/job-post"
              element={user ? <JobPost /> : <Navigate to="/signin" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/signin" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/apply/:jobId" element={<Apply />} />
            <Route path="/apply/application/:applicationId" element={<Apply />} />
            <Route path="/personality-quiz" element={<PersonalityQuiz />} />
            <Route path="/categories" element={<Categories />} />

          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
