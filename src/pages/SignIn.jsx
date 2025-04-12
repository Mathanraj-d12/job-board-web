import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Container, Alert, Divider, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { signInWithGoogle, auth, requestNotificationPermission, checkIfUserExists, createUserProfile, sendVerificationEmail } from "../firebase"; // Import the function
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.svg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, password: "" }));
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);

    if (!validateForm()) {
      setFormData(prev => ({ ...prev, password: "" }));
      setLoading(false);
      return;
    }

    try {
      // Trim the email to remove any accidental whitespace
      const trimmedEmail = formData.email.trim();

      // Try to sign in directly without checking if user exists first
      try {
        console.log("Attempting to sign in with:", { email: trimmedEmail, passwordLength: formData.password.length });
        console.log("Firebase auth instance:", auth);

        // Add a small delay to ensure console logs are visible
        await new Promise(resolve => setTimeout(resolve, 500));

        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, formData.password);
        console.log("Sign-in successful:", userCredential.user.uid);

        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          // Send another verification email if needed
          await sendVerificationEmail(userCredential.user);

          setSubmitError("Please verify your email address before signing in. A new verification email has been sent.");
          setFormData(prev => ({ ...prev, password: "" }));
          setLoading(false);
          return;
        }

        // Update the user profile in Firestore with last login time
        await createUserProfile(userCredential.user);

        await requestNotificationPermission(); // Request the FCM token
        setFormData(prev => ({ ...prev, password: "" }));
        setLoading(false); // Reset loading state
        navigate("/");
      } catch (signInError) {
        console.error("Sign-in error:", signInError.code, signInError.message);

        // Handle specific error codes directly instead of checking if user exists
        if (signInError.code === "auth/invalid-credential" || signInError.code === "auth/wrong-password") {
          // For invalid-credential, we'll assume the user exists but the password is wrong
          // This is more user-friendly than saying "account not found"
          setSubmitError("Incorrect email or password. Please try again or use the 'Forgot Password' link below.");
        } else if (signInError.code === "auth/user-not-found") {
          setSubmitError("No account found with this email. Please sign up first.");
        } else if (signInError.code === "auth/too-many-requests") {
          setSubmitError("Too many failed attempts. Please try again later or reset your password.");
        } else if (signInError.code === "auth/user-disabled") {
          setSubmitError("This account has been disabled. Please contact support.");
        } else if (signInError.code === "auth/invalid-email") {
          setSubmitError("The email address is not valid. Please check and try again.");
        } else if (signInError.code === "auth/network-request-failed") {
          setSubmitError("Network error. Please check your internet connection and try again.");
        } else {
          setSubmitError(`An error occurred during sign in. Please try again.`);
          console.log(`Unhandled sign-in error code: ${signInError.code}`);
        }

        setFormData(prev => ({ ...prev, password: "" }));
        setLoading(false);
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
      setFormData(prev => ({ ...prev, password: "" }));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setSubmitError("An error occurred during Google sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 4,
              pb: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
              }}
            />

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                position: 'relative',
                zIndex: 1
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                position: 'relative',
                zIndex: 1
              }}
            >
              Sign in to access your account and explore job opportunities
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            {submitError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
                }}
              >
                {submitError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5
              }}
            >
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="current-password"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none'
                  }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                    transform: 'translateY(-2px)'
                  },
                  mt: 1
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate("/signup")}
                    sx={{
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      verticalAlign: 'baseline'
                    }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  borderWidth: 1,
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <img src={googleLogo} alt="Google" style={{ width: 20, height: 20 }} />
              {loading ? <CircularProgress size={24} /> : "Continue with Google"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default SignIn;
