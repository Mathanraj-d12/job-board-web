import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Container, Alert, Divider, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { signInWithGoogle, auth, requestNotificationPermission, checkIfUserExists, createUserProfile } from "../firebase"; // Import the function
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
      console.log("Attempting to sign in with email:", trimmedEmail);

      // Try to sign in directly without checking if user exists first
      // This is more reliable as the signInWithEmailAndPassword will handle
      // the case where the user doesn't exist

      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, formData.password);
      console.log("Sign in successful");

      // Update the user profile in Firestore with last login time
      await createUserProfile(userCredential.user);

      await requestNotificationPermission(); // Request the FCM token
      setFormData(prev => ({ ...prev, password: "" }));
      navigate("/");
    } catch (error) {
      console.error("Error during sign in:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      let errorMessage = "An error occurred during sign in. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please sign up first.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
      }
      
      setSubmitError(errorMessage);
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
    <Container className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Box>
        <Typography component="h1" variant="h4" className="font-bold text-blue-600 mb-4 text-center">
          Welcome Back
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-4 text-center">
          Sign in to access your account and explore job opportunities
        </Typography>
        {submitError && <Alert severity="error" className="mb-3">{submitError}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
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
            className="border rounded-md p-2"
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
            className="border rounded-md p-2"
            autoComplete="current-password"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition duration-300"
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Typography variant="body2" className="text-center mt-2">
            Don't have an account? <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/signup")}
              className="p-0 min-w-0"
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
        <Divider className="my-4">
          <Typography variant="body2" className="text-gray-500">OR</Typography>
        </Divider>
        <Button 
          fullWidth 
          variant="outlined" 
          color="primary" 
          size="large" 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="border-blue-600 text-blue-600 rounded-md py-2 hover:bg-blue-600 hover:text-white transition duration-300"
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={googleLogo} alt="Google" style={{ width: 24, height: 24 }} />
          {loading ? <CircularProgress size={24} /> : "Continue with Google"}
        </Button>
      </Box>
    </Container>
  );
}

export default SignIn;
