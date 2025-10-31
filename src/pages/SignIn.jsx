// src/pages/SignIn.jsx
import { useState } from "react";
import { Box, TextField, Button, Typography, Container, Alert, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignIn({ setUser }) {  // ADD setUser PROP
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email (e.g., name@domain.com)";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be 6+ characters";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least 1 number";
    }

    setError(Object.values(newErrors).join(" "));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // DUMMY LOGIN: Accept any valid email + strong password
    const dummyUser = {
      email,
      displayName: email.split("@")[0],
      uid: "dummy-" + Date.now(),
    };

    localStorage.setItem("user", JSON.stringify(dummyUser));
    setUser(dummyUser);  // UPDATE NAVBAR

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 800);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' }}>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ p: 4, pb: 3, background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)', color: 'white', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Welcome Back</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>Sign in to continue</Typography>
          </Box>

          {/* Form */}
          <Box sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  mt: 1,
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>

              <Typography textAlign="center" variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button onClick={() => navigate("/signup")} color="primary" sx={{ fontWeight: 600, textTransform: 'none' }}>
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}