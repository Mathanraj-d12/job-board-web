// // src/components/Navbar.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   AppBar, Toolbar, Typography, Button, IconButton,
//   Box, Menu, MenuItem, useTheme, useMediaQuery
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import logo from '../assets/logo.png';
// import UserAvatar from './UserAvatar';

// const Navbar = ({ user, setUser }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [elevated, setElevated] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setElevated(window.scrollY > 0);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleMenu = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleSignOut = (e) => {
//     e.stopPropagation(); // Stop menu close
//     localStorage.removeItem("user");
//     setUser(null);
//     handleClose();
//     navigate("/");
//   };

//   const NavItems = () => {
//     if (isMobile) {
//       return (
//         <Box sx={{ width: '250px', py: 1 }}>
//           <MenuItem component={Link} to="/" onClick={handleClose} sx={{ py: 1.5 }}>Home</MenuItem>
//           <MenuItem component={Link} to="/categories" onClick={handleClose} sx={{ py: 1.5 }}>Categories</MenuItem>
//           <MenuItem
//             component={Link}
//             to="/jobs"
//             onClick={handleClose}
//             sx={{
//               py: 1.5,
//               background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
//               color: 'white',
//               my: 1,
//               '&:hover': { background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)' }
//             }}
//           >
//             Jobs
//           </MenuItem>
//           <MenuItem component={Link} to="/personality-quiz" onClick={handleClose} sx={{ py: 1.5 }}>Find Your Job</MenuItem>
//           <MenuItem component={Link} to="/about" onClick={handleClose} sx={{ py: 1.5 }}>About Us</MenuItem>

//           <Box sx={{ height: 1, bgcolor: 'rgba(0,0,0,0.1)', my: 1.5 }} />

//           {user ? (
//             <>
//               <MenuItem component={Link} to="/profile" onClick={handleClose} sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <UserAvatar user={user} width={24} height={24} />
//                 <Typography>Profile</Typography>
//               </MenuItem>
//               <MenuItem component={Link} to="/job-post" onClick={handleClose} sx={{ py: 1.5, color: '#10B981' }}>
//                 Post a Job
//               </MenuItem>
//               {/* FIXED: Use Button inside MenuItem */}
//               <MenuItem onClick={(e) => e.stopPropagation()}>
//                 <Button
//                   fullWidth
//                   onClick={handleSignOut}
//                   sx={{
//                     py: 1.5,
//                     color: '#ef4444',
//                     fontWeight: 500,
//                     justifyContent: 'flex-start'
//                   }}
//                 >
//                   Sign Out
//                 </Button>
//               </MenuItem>
//             </>
//           ) : (
//             <>
//               <MenuItem component={Link} to="/signin" onClick={handleClose} sx={{ py: 1.5, fontWeight: 500 }}>Sign In</MenuItem>
//               <MenuItem component={Link} to="/signup" onClick={handleClose} sx={{ py: 1.5, fontWeight: 500 }}>Sign Up</MenuItem>
//             </>
//           )}
//         </Box>
//       );
//     }

//     // Desktop
//     return (
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 500 }}>Home</Button>
//           <Button color="inherit" component={Link} to="/categories" sx={{ fontWeight: 500 }}>Categories</Button>
//           <Button
//             color="inherit"
//             component={Link}
//             to="/jobs"
//             sx={{
//               fontWeight: 500,
//               background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
//               color: 'white',
//               px: 2,
//               '&:hover': { background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)' }
//             }}
//           >
//             Jobs
//           </Button>
//           <Button color="inherit" component={Link} to="/personality-quiz" sx={{ fontWeight: 500 }}>Find Your Job</Button>
//           <Button color="inherit" component={Link} to="/about" sx={{ fontWeight: 500 }}>About Us</Button>
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           {user ? (
//             <>
//               <MenuItem
//                 component={Link}
//                 to="/profile"
//                 sx={{
//                   py: 1.5,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 2,
//                   maxWidth: 200,
//                   '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' }
//                 }}
//                 title={user.displayName || 'Profile'}
//               >
//                 <UserAvatar user={user} width={32} height={32} />
//                 <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                   {user.displayName || 'Profile'}
//                 </Typography>
//               </MenuItem>
//               <Button
//                 onClick={handleSignOut}
//                 variant="contained"
//                 color="error"
//                 sx={{
//                   py: 1.5, px: 3, fontWeight: 600, borderRadius: 2,
//                   backgroundColor: '#ef4444',
//                   '&:hover': { backgroundColor: '#dc2626', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(220,38,38,0.2)' }
//                 }}
//               >
//                 Sign Out
//               </Button>
//               <Button
//                 component={Link}
//                 to="/job-post"
//                 variant="contained"
//                 sx={{
//                   py: 1.5, px: 3, fontWeight: 600, borderRadius: 2,
//                   backgroundColor: '#10B981',
//                   '&:hover': { backgroundColor: '#059669', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }
//                 }}
//               >
//                 Post a Job
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button
//                 color="inherit"
//                 component={Link}
//                 to="/signin"
//                 variant="outlined"
//                 sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 500, '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
//               >
//                 Sign In
//               </Button>
//               <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: 500 }}>Sign Up</Button>
//             </>
//           )}
//         </Box>
//       </Box>
//     );
//   };

//   return (
//     <AppBar position="sticky" sx={{ bgcolor: '#60a5fa', top: 0, zIndex: 1100, transition: 'box-shadow 0.3s ease-in-out', boxShadow: elevated ? 3 : 0 }}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
//           <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
//           <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>Job Board</Typography>
//         </Box>

//         {isMobile ? (
//           <>
//             <IconButton
//               size="large"
//               edge="end"
//               color="inherit"
//               aria-label="menu"
//               onClick={handleMenu}
//               sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//               PaperProps={{ elevation: 3, sx: { mt: 1.5, borderRadius: 2, maxHeight: '80vh', overflowY: 'auto' } }}
//             >
//               <NavItems />
//             </Menu>
//           </>
//         ) : (
//           <NavItems />
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // ✅ Load user from localStorage (if logged in)
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleClose(); // close menu first
    navigate(path); // then navigate
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("user");
    setUser(null);
    handleClose();
    navigate("/");
  };

  const NavItems = () => (
    <>
      <MenuItem onClick={() => handleNavigate("/")}>Home</MenuItem>
      <MenuItem onClick={() => handleNavigate("/categories")}>Categories</MenuItem>
      <MenuItem onClick={() => handleNavigate("/jobs")}>Jobs</MenuItem>
      <MenuItem onClick={() => handleNavigate("/about")}>About</MenuItem>

      {user ? (
        <>
          <MenuItem onClick={() => handleNavigate("/profile")}>Profile</MenuItem>
          <MenuItem onClick={() => handleNavigate("/post-job")}>Post a Job</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => handleNavigate("/login")}>Login</MenuItem>
          <MenuItem onClick={() => handleNavigate("/signup")}>Sign Up</MenuItem>
        </>
      )}
    </>
  );

  return (
    <AppBar position="sticky" color="primary" sx={{ backgroundColor: "#1a237e" }}>
      <Toolbar>
        {/* ✅ Logo / Title */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bold" }}
        >
          JobBoard
        </Typography>

        {/* ✅ Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" onClick={() => handleNavigate("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/categories")}>
            Categories
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/jobs")}>
            Jobs
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/about")}>
            About
          </Button>

          {user ? (
            <>
              <Button color="inherit" onClick={() => handleNavigate("/profile")}>
                Profile
              </Button>
              <Button color="inherit" onClick={() => handleNavigate("/post-job")}>
                Post a Job
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleNavigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => handleNavigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* ✅ Mobile Menu Icon */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* ✅ Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          keepMounted={false}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1.5, borderRadius: 2, maxHeight: "80vh", overflowY: "auto" },
          }}
        >
          <NavItems />
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
